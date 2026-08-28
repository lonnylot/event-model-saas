import { inflateSync } from "node:zlib";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const INK = { r: 15, g: 23, b: 42 };
const ACCENT = { r: 15, g: 118, b: 110 };
const CANVAS = { r: 255, g: 255, b: 255 };
const OCHRE = { r: 192, g: 120, b: 58 };
const TERRACOTTA = { r: 184, g: 92, b: 56 };

type Pixel = { r: number; g: number; b: number };

function paeth(a: number, b: number, c: number): number {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

function pngPixels(path: string): Pixel[] {
  const buf = readFileSync(path);
  let i = 8;
  const idats: Buffer[] = [];
  let width = 0;
  let height = 0;
  let colorType = 0;
  while (i < buf.length) {
    const len = buf.readUInt32BE(i);
    const type = buf.toString("ascii", i + 4, i + 8);
    const data = buf.subarray(i + 8, i + 8 + len);
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      colorType = data[9];
    }
    if (type === "IDAT") idats.push(data);
    if (type === "IEND") break;
    i += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (bpp === 0) {
    throw new Error(`${path} color type ${colorType} is not RGB or RGBA`);
  }
  const raw = inflateSync(Buffer.concat(idats));
  const stride = width * bpp;
  const out = Buffer.alloc(height * stride);
  let src = 0;
  for (let y = 0; y < height; y++) {
    const filter = raw[src++];
    const dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const left = x >= bpp ? out[dst + x - bpp] : 0;
      const up = y > 0 ? out[dst - stride + x] : 0;
      const upLeft = y > 0 && x >= bpp ? out[dst - stride + x - bpp] : 0;
      const sample = raw[src++];
      let recon = sample;
      if (filter === 1) recon = (sample + left) & 255;
      else if (filter === 2) recon = (sample + up) & 255;
      else if (filter === 3) recon = (sample + ((left + up) >> 1)) & 255;
      else if (filter === 4) recon = (sample + paeth(left, up, upLeft)) & 255;
      else if (filter !== 0) {
        throw new Error(`${path} row ${y} uses unknown PNG filter ${filter}`);
      }
      out[dst + x] = recon;
    }
  }
  const pixels: Pixel[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const o = y * stride + x * bpp;
      pixels.push({ r: out[o], g: out[o + 1], b: out[o + 2] });
    }
  }
  return pixels;
}

function hasColor(pixels: Pixel[], color: Pixel): boolean {
  return pixels.some(
    (p) => p.r === color.r && p.g === color.g && p.b === color.b,
  );
}

function expectMarkPixels(path: string) {
  const pixels = pngPixels(path);
  expect(hasColor(pixels, INK), `${path} ink`).toBe(true);
  expect(hasColor(pixels, ACCENT), `${path} accent`).toBe(true);
  expect(hasColor(pixels, CANVAS), `${path} canvas`).toBe(true);
  expect(hasColor(pixels, OCHRE), `${path} ochre`).toBe(false);
  expect(hasColor(pixels, TERRACOTTA), `${path} terracotta`).toBe(false);
}

describe("public mark", () => {
  it("`public/favicon.png` pixels include ink, accent, and canvas, and do not include ochre or terracotta", () => {
    expectMarkPixels("public/favicon.png");
  });

  it("`public/og.png` pixels include ink, accent, and canvas, and do not include ochre or terracotta", () => {
    expectMarkPixels("public/og.png");
  });
});
