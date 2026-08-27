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

  it("inspect-after-reload does not leave Fields or Connection after reload as unowned later", () => {
    const text = readFileSync(
      "docs/specs/features/inspect-after-reload.md",
      "utf8",
    );
    expect(text).not.toContain("GET-rendered inspect of Fields stays later");
    expect(text).not.toContain("GET-rendered inspect of Fields stay later");
    expect(text).not.toContain(
      "Inspect after reload of a Connection stays later",
    );
    expect(text).not.toContain(
      "GET-rendered inspect of Description on Slice / Actor / Event / Read Model / Automation stays later",
    );
  });

  it("inspect-fields does not leave GET-rendered Fields stays later or hand in-session Field work to inspect-rest", () => {
    const text = readFileSync("docs/specs/features/inspect-fields.md", "utf8");
    expect(text).not.toContain("GET-rendered inspect of Fields stays later");
    expect(text).not.toContain(
      "Field `type` picker after Add, Command `optional` / `example`, Add Field that appends on Event / Read Model / Automation, Field after reload",
    );
    expect(text).not.toContain(
      "Field after reload, inspect after reload, and Add Field that appends",
    );
  });

  it("inspect-description does not leave GET-rendered inspect of Description stays later", () => {
    const text = readFileSync(
      "docs/specs/features/inspect-description.md",
      "utf8",
    );
    expect(text).not.toContain(
      "GET-rendered inspect of Description stays later",
    );
    expect(text).not.toContain(
      "GET-rendered inspect of Description on Slice / Actor / Event / Read Model / Automation stays later",
    );
  });

  it("model-inspector Out of scope does not leave heading reload or GET heading as D1 until later", () => {
    const text = readFileSync(
      "docs/specs/features/model-inspector.md",
      "utf8",
    );
    expect(text).not.toContain(
      "Inspect after reload of the heading, Actor Name Unsaved changes",
    );
    expect(text).not.toContain(
      "GET heading, team-list, and Export filename after JSON `title` change stay the D1 create title until later",
    );
  });
});
