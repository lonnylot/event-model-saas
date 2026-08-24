import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("GitHub Actions CI", () => {
  const text = readFileSync(".github/workflows/ci.yml", "utf8");
  const lines = text.split("\n");

  it("GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request`", () => {
    expect(lines).toContain("  pull_request:");
    expect(lines.some((line) => line.includes("pull_request_target"))).toBe(
      false,
    );
  });

  it("GitHub Actions workflow `.github/workflows/ci.yml` runs on `push` to `main`", () => {
    expect(text).toMatch(/push:\n\s+branches:\s*\[main\]/);
  });

  it("GitHub Actions workflow `.github/workflows/ci.yml` has a step whose `run` is `npm test`", () => {
    expect(lines).toContain("      - run: npm test");
  });
});
