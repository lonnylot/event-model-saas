import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Actions CI", () => {
  it("GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request` and on `push` to `main` and has a step whose `run` is `npm test`", () => {
    const text = readFileSync(".github/workflows/ci.yml", "utf8");
    expect(text).toMatch(/^on:\n(?:  .*\n)*  pull_request:/m);
    expect(text).toMatch(/push:\n\s+branches:\s*\[main\]/);
    expect(text).toMatch(/^\s+- run: npm test$/m);
  });
});
