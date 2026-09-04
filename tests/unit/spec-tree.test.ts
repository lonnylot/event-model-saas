import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("spec tree", () => {
  it("the repo has no docs/superpowers directory", () => {
    expect(existsSync("docs/superpowers")).toBe(false);
  });

  it("CONTEXT.md **Term** headings are unique", () => {
    const text = readFileSync("CONTEXT.md", "utf8");
    const headings = [...text.matchAll(/^\*\*[^*]+\*\*:/gm)].map((m) => m[0]);
    expect(headings).toEqual([...new Set(headings)]);
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

  it("Restates paths do not leave Event → Read Model Connection after reload stays later", () => {
    const paths = [
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/blocks.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toContain(
        "Event → Read Model Connection after reload stays later",
      );
    }
  });

  it("does not leave Inspect after reload of a Connection stays later", () => {
    for (const path of [
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-fields-rest.md",
    ]) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toContain(
        "Inspect after reload of a Connection stays later",
      );
    }
  });

  it("inspect-rest Assumptions does not claim this slice owns in-session Add Field append", () => {
    const text = readFileSync("docs/specs/features/inspect-rest.md", "utf8");
    expect(text).not.toContain(
      "This slice owns that append and the Field name after reload inspect",
    );
  });

  it("product-visual Assumptions do not leave Landing main max-width 36rem or Display heading 36px", () => {
    const text = readFileSync(
      "docs/specs/features/product-visual.md",
      "utf8",
    );
    expect(text).not.toContain("Landing `main` `max-width` `36rem`");
    expect(text).not.toContain("Display heading `font-size` `36px`");
  });

  it("designed-surfaces Restates editor-shell GET Inspector chrome; editor-shell does not leave an empty named region", () => {
    const designed = readFileSync(
      "docs/specs/features/designed-surfaces.md",
      "utf8",
    );
    expect(designed).toContain("[editor-shell.md](./editor-shell.md)");
    const editor = readFileSync(
      "docs/specs/features/editor-shell.md",
      "utf8",
    );
    expect(editor).not.toContain("empty named region");
  });

  it("port-fit Restates does not list design-system.md", () => {
    const text = readFileSync("docs/specs/features/port-fit.md", "utf8");
    const restates = text.split("## Restates")[1] ?? "";
    expect(restates).not.toContain("design-system.md");
  });

  it("landing-fold Problem does not leave three bento cards as a current tell", () => {
    const text = readFileSync(
      "docs/specs/features/landing-fold.md",
      "utf8",
    );
    const problem = text.split("## Acceptance criteria")[0];
    expect(problem).not.toContain(
      "The three bento cards are unbalanced glossary",
    );
    expect(problem).toContain("leftover unused");
    expect(problem).toContain("landing-modern.md");
  });

  it("port-wrap Out of scope GET ports after reload points at hydrate-board.md", () => {
    const text = readFileSync("docs/specs/features/port-wrap.md", "utf8");
    const out = text.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(out).toContain(
      "GET ports after reload stay [hydrate-board.md](./hydrate-board.md)",
    );
  });

  it("port-wrap Restates port-fit and connections; those Out of scope name same-row as port-wrap", () => {
    const restates =
      readFileSync("docs/specs/features/port-wrap.md", "utf8").split(
        "## Restates",
      )[1] ?? "";
    expect(restates).toContain("[port-fit.md](./port-fit.md)");
    expect(restates).toContain("[connections.md](./connections.md)");
    expect(restates).not.toContain("leftover unused");
    const fitOut =
      readFileSync("docs/specs/features/port-fit.md", "utf8")
        .split("## Out of scope")[1]
        ?.split("## Restates")[0] ?? "";
    expect(fitOut).toContain("[port-wrap.md](./port-wrap.md)");
    const connectionsOut =
      readFileSync("docs/specs/features/connections.md", "utf8")
        .split("## Out of scope")[1]
        ?.split("## Restates")[0] ?? "";
    expect(connectionsOut).toContain("[port-wrap.md](./port-wrap.md)");
  });

  it("time-chrome-stay Restates hydrate-board; hydrate-board does not leave Pan and Zoom covering TIME chrome unowned", () => {
    const stay = readFileSync(
      "docs/specs/features/time-chrome-stay.md",
      "utf8",
    );
    const restates = stay.split("## Restates")[1] ?? "";
    expect(restates).toContain("[hydrate-board.md](./hydrate-board.md)");
    const hydrate = readFileSync(
      "docs/specs/features/hydrate-board.md",
      "utf8",
    );
    expect(hydrate).not.toContain("Pan and Zoom covering TIME chrome");
  });

  it("shortcut-kind Out of scope names last-column lastLaneList when changing which Slice the shortcut targets", () => {
    const text = readFileSync(
      "docs/specs/features/shortcut-kind.md",
      "utf8",
    );
    const outOfScope = text.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(outOfScope).not.toContain(
      "Changing which Slice the shortcut targets.",
    );
    expect(outOfScope).toContain(
      "Changing which Slice the shortcut targets (JSON still uses selected Slice; shortcut DOM is last-column `lastLaneList`).",
    );
  });
});
