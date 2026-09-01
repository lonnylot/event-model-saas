import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const designSystem = readFileSync("docs/specs/design-system.md", "utf8");

function token(name: string): string {
  const match = designSystem.match(
    new RegExp(`\\| \`${name}\` \\| \`(#[0-9A-Fa-f]{6})\` \\|`),
  );
  expect(match, `token ${name} in design-system.md`).not.toBeNull();
  return match![1];
}

function channel(hex: string, offset: number): number {
  return parseInt(hex.slice(offset, offset + 2), 16);
}

function srgb(channel8: number): number {
  const s = channel8 / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  return (
    0.2126 * srgb(channel(hex, 1)) +
    0.7152 * srgb(channel(hex, 3)) +
    0.0722 * srgb(channel(hex, 5))
  );
}

function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

describe("design-system token contrast", () => {
  it("contrastRatio of #888888 on #FFFFFF is below 4.5:1", () => {
    expect(contrastRatio("#888888", "#FFFFFF")).toBeLessThan(4.5);
  });

  it("Contrast of `ink` `#0F172A` on `canvas` `#FFFFFF` is at least 4.5:1", () => {
    expect(token("ink")).toBe("#0F172A");
    expect(token("canvas")).toBe("#FFFFFF");
    expect(contrastRatio(token("ink"), token("canvas"))).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it("Contrast of `on-accent` `#FFFFFF` on `accent` `#0F766E` is at least 4.5:1", () => {
    expect(token("on-accent")).toBe("#FFFFFF");
    expect(token("accent")).toBe("#0F766E");
    expect(
      contrastRatio(token("on-accent"), token("accent")),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it("Contrast of `canvas` `#FFFFFF` on `ink` `#0F172A` is at least 4.5:1", () => {
    expect(token("canvas")).toBe("#FFFFFF");
    expect(token("ink")).toBe("#0F172A");
    expect(contrastRatio(token("canvas"), token("ink"))).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});
