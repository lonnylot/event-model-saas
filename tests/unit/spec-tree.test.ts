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

  it("inspect-fields-rest does not leave GET-rendered inspect of Fields stays later", () => {
    const rest = readFileSync("docs/specs/features/inspect-rest.md", "utf8");
    const fieldsRest = readFileSync(
      "docs/specs/features/inspect-fields-rest.md",
      "utf8",
    );
    expect(rest).toContain("inspect-fields-rest.md");
    expect(fieldsRest).not.toContain(
      "GET-rendered inspect of Fields stays later",
    );
    expect(rest).not.toContain(
      "Out of scope no longer owns Field `type` picker after Add, Command `optional` / `example`, Add Field that appends on Event / Read Model / Automation, Field after reload",
    );
  });
});
