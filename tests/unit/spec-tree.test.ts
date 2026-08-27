import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("spec tree", () => {
  it("the repo has no docs/superpowers directory", () => {
    expect(existsSync("docs/superpowers")).toBe(false);
  });

  it("model-inspector Restates does not leave Inspect after reload of the heading stays later", () => {
    const text = readFileSync(
      "docs/specs/features/model-inspector.md",
      "utf8",
    );
    expect(text).not.toContain(
      "Inspect after reload of the heading stays later",
    );
  });

  it("model-inspector Restates of product.md does not park GET heading as D1 until later", () => {
    const text = readFileSync(
      "docs/specs/features/model-inspector.md",
      "utf8",
    );
    expect(text).not.toContain(
      "GET heading, team-list, and Export `{title}` stay the D1 create title until later",
    );
  });
});
