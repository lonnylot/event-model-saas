import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function specMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...specMarkdownFiles(path));
    else if (entry.name.endsWith(".md")) out.push(path);
  }
  return out;
}

describe("spec tree", () => {
  it("the repo has no docs/superpowers directory", () => {
    expect(existsSync("docs/superpowers")).toBe(false);
  });

  it("docs/specs/README.md does not contain a git conflict marker", () => {
    const text = readFileSync("docs/specs/README.md", "utf8");
    expect(text).not.toContain("<<<<<<<");
    expect(text).not.toContain(">>>>>>>");
  });

  it("feature spec relative markdown links exist", () => {
    for (const path of specMarkdownFiles("docs/specs/features")) {
      const text = readFileSync(path, "utf8");
      for (const match of text.matchAll(/\]\(([^)\s]+)\)/g)) {
        const href = match[1].split("#")[0];
        if (!href || /^(https?:|mailto:)/.test(href)) continue;
        if (!href.endsWith(".md")) continue;
        expect(existsSync(resolve(dirname(path), href)), `${path} -> ${href}`).toBe(
          true,
        );
      }
    }
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
    expect(outOfScope).not.toContain(
      "Changing which Slice the shortcut targets (JSON still uses selected Slice; shortcut DOM is last-column `lastLaneList`).",
    );
    expect(outOfScope).toContain(
      "Changing which Slice ⌥⌘1 / ⌥⌘3–5 target (JSON still uses selected Slice; those keys' DOM is last-column `lastLaneList`).",
    );
    expect(outOfScope).toContain(
      "[shortcut-target.md](./shortcut-target.md)",
    );
  });

  it("shortcut-target Out of scope does not park Inspector leftover Type or GET ports after reload as unowned later work", () => {
    const target = readFileSync(
      "docs/specs/features/shortcut-target.md",
      "utf8",
    );
    const out = (target.split("## Out of scope")[1] ?? "").split(
      "## Restates",
    )[0];
    expect(out).not.toContain("Inspector leftover Type.");
    expect(out).not.toContain("GET ports after reload.");
    expect(out).toContain("[inspect-switch.md](./inspect-switch.md)");
    expect(out).toContain("[hydrate-board.md](./hydrate-board.md)");
  });

  it("editor-bind-split Out of scope does not park Shortcut listitem column as later work", () => {
    const bind = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    );
    const out = (bind.split("## Out of scope")[1] ?? "").split(
      "## Restates",
    )[0];
    expect(out).not.toContain("Shortcut listitem column.");
    expect(out).toContain("[shortcut-target.md](./shortcut-target.md)");
    const target = readFileSync(
      "docs/specs/features/shortcut-target.md",
      "utf8",
    );
    expect(target).toContain("[editor-bind-split.md](./editor-bind-split.md)");
  });

  it("hydrate-kind-id Out of scope does not leave Shortcut listitems without data-kind", () => {
    const hydrate = readFileSync(
      "docs/specs/features/hydrate-kind-id.md",
      "utf8",
    );
    expect(hydrate).not.toContain("Shortcut listitems without `data-kind`");
    expect(hydrate).toContain("[shortcut-kind.md](./shortcut-kind.md)");
    const restates =
      readFileSync("docs/specs/features/shortcut-kind.md", "utf8").split(
        "## Restates",
      )[1] ?? "";
    expect(restates).toContain("[hydrate-kind-id.md](./hydrate-kind-id.md)");
  });

  it("hydrate-connection-id does not assign unqualified GET Connection data-id or Backspace", () => {
    const paths = [
      "docs/specs/features/hydrate-connection-id.md",
      "docs/specs/architecture.md",
      "docs/specs/features/hydrate-kind-id.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/delete-blocks.md",
      "docs/specs/features/connection-on-board.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toContain("GET Connection `data-id`");
      expect(text, path).not.toContain("GET Connection Backspace");
    }
    const inspect = readFileSync(
      "docs/specs/features/inspect-rest.md",
      "utf8",
    );
    expect(inspect).not.toMatch(
      /Event Happened → Read Model` still opens Inspector From\/To\. That node living in `\.board` is that slice\. GET `data-id` on that node/,
    );
    const board = readFileSync(
      "docs/specs/features/connection-on-board.md",
      "utf8",
    );
    expect(board).not.toMatch(
      /Event Happened → Read Model` \(\[inspect-rest\.md\]\(\.\/inspect-rest\.md\)\); that text living in `\.board` is this slice\. GET `data-id` on that node/,
    );
    const connections = readFileSync(
      "docs/specs/features/connections.md",
      "utf8",
    );
    expect(connections).not.toMatch(
      /Event Happened → Read Model` as a sibling of `\.board` is leftover unused; `\.board` contains it is that slice\. GET `data-id` on that node/,
    );
  });

  it("inspect-get-command Restates paths do not assign unqualified Command Description or Field after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Command Description after reload(?! of one Command)/,
      );
      expect(text, path).not.toMatch(
        /Command Field name after reload(?! of one Command)/,
      );
      expect(text, path).not.toMatch(
        /Command Field after reload(?! of one Command)/,
      );
    }
  });

  it("inspect-get-event Restates paths do not assign unqualified Event Description or Field after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Event Description after reload(?! of one Event)/,
      );
      expect(text, path).not.toMatch(
        /Event Field name after reload(?! of one Event)/,
      );
      expect(text, path).not.toMatch(
        /Event Field after reload(?! of one Event)/,
      );
    }
  });

  it("inspect-get-command-field-type Restates paths do not assign unqualified Command Field type after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Command Field type after reload(?! of one Command)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-event-field-type Restates paths do not assign unqualified Event Field type after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Event Field type after reload(?! of one Event)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type of the first of two Events once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-read-model-field-type Restates paths do not assign unqualified Read Model Field type after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Read Model Field type after reload(?! of one Read Model)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type of the first of two Read Models once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-automation-field-type Restates paths do not assign unqualified Automation Field type after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Automation Field type after reload(?! of one Automation)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type of the first of two Automations once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-command-optional Restates paths do not assign unqualified Command Optional after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-command-optional.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Command Optional after reload(?! of one Command)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Optional of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-command-example Restates paths do not assign unqualified Command Example after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-command-example.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/features/inspect-get-command-optional.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Command Example after reload(?! of one Command)/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Example of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-event-optional Restates paths do not park Optional after reload of one Event as Optional / Example after reload on Event", () => {
    const paths = [
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/features/inspect-get-command-optional.md",
      "docs/specs/features/inspect-get-command-example.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
      "docs/specs/features/hydrate-add-field.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Optional \/ Example after reload on Event \//,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Event Optional of one Event once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Event Optional of one Event is [inspect-get-event-optional.md](./inspect-get-event-optional.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-event-example Restates does not list inspect-blocks.md or inspect-fields.md", () => {
    const restates = readFileSync(
      "docs/specs/features/inspect-get-event-example.md",
      "utf8",
    ).split("## Restates")[1];
    expect(restates).not.toContain(
      "[inspect-blocks.md](./inspect-blocks.md)",
    );
    expect(restates).not.toContain(
      "[inspect-fields.md](./inspect-fields.md)",
    );
  });

  it("inspect-get-event-example Restates paths do not park Example after reload of one Event as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/features/inspect-get-command-optional.md",
      "docs/specs/features/inspect-get-command-example.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Example after reload of one Event stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Event Example of one Event once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Event Example of one Event is [inspect-get-event-example.md](./inspect-get-event-example.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-read-model-optional Restates paths do not park Optional after reload of one Read Model as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-read-model-optional.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Optional \/ Example after reload on Read Model \//,
      );
      expect(text, path).not.toMatch(
        /Optional after reload of one Read Model \/ Automation stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Read Model Optional of one Read Model once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Read Model Optional of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-read-model-example Restates paths do not park Example after reload of one Read Model as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-read-model-example.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Example after reload of one Read Model \/ Automation stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Read Model Example of one Read Model once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Read Model Example of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-automation-optional Restates paths do not park Optional after reload of one Automation as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-automation-optional.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/inspect-get-read-model-optional.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Optional after reload of one Automation stays later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Automation Optional of one Automation once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Automation Optional of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-automation-example Restates paths do not park Example after reload of one Automation as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-automation-example.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/inspect-get-read-model-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Example after reload of one Automation stays later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Automation Example of one Automation once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Automation Example of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-delete-field Restates paths do not park Delete Field after reload of one Command as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-delete-field.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/Delete Field stays later/);
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Command stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Command Delete Field of one Command once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Command Delete Field of one Command is [inspect-get-delete-field.md](./inspect-get-delete-field.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-delete-field-event Restates paths do not park Delete Field after reload of one Event as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-delete-field-event.md",
      "docs/specs/features/inspect-get-delete-field.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/Delete Field stays later/);
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Event stay later/,
      );
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Event \/ Read Model \/ Automation stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Event Delete Field of one Event once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Event Delete Field of one Event is [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-delete-field-read-model Restates paths do not park Delete Field after reload of one Read Model as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-delete-field-read-model.md",
      "docs/specs/features/inspect-get-delete-field.md",
      "docs/specs/features/inspect-get-delete-field-event.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/Delete Field stays later/);
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Read Model stay later/,
      );
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Read Model \/ Automation stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Inspector for Read Model Delete Field of one Read Model once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Read Model Delete Field of one Read Model is [inspect-get-delete-field-read-model.md](./inspect-get-delete-field-read-model.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-delete-field-automation Restates paths do not park Delete Field after reload of one Automation as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-delete-field-automation.md",
      "docs/specs/features/inspect-get-delete-field.md",
      "docs/specs/features/inspect-get-delete-field-event.md",
      "docs/specs/features/inspect-get-delete-field-read-model.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/Delete Field stays later/);
      expect(text, path).not.toMatch(
        /Delete Field after reload of one Automation stay later/,
      );
    }
  });

  it("inspect-get-second-field Restates paths do not park GET Inspector of the second Field as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-second-field.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/second Field stays later/);
      expect(text, path).not.toMatch(
        /GET Inspector of the second Field on one Command stay later/,
      );
    }
  });

  it("inspect-second-field-name-write Restates paths do not park GET second Field name write as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-second-field-name-write.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-get-second-field.md",
      "docs/specs/features/inspect-in-session-delete-field.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/Second Field name write stays later/);
      expect(text, path).not.toMatch(
        /GET second Field name write of two Fields on one Command stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET second Field name write of two Fields on one Command once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET second Field name write of two Fields on one Command is [inspect-second-field-name-write.md](./inspect-second-field-name-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-command-example-write Restates paths do not park GET Example write of the first of two Commands as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-command-example-write.md",
      "docs/specs/features/inspect-get-command-example.md",
      "docs/specs/features/inspect-command-optional-write.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Example write of the first of two Commands stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Example write of the first of two Commands stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Example write of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Example write of the first of two Commands is [inspect-command-example-write.md](./inspect-command-example-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-command-optional-write Restates paths do not park GET Optional write of the first of two Commands as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-command-optional-write.md",
      "docs/specs/features/inspect-get-command-optional.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Optional write of the first of two Commands stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Optional write of the first of two Commands stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Optional write of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Optional write of the first of two Commands is [inspect-command-optional-write.md](./inspect-command-optional-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-command-field-type-write Restates paths do not park GET Field type write of the first of two Commands as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-command-field-type-write.md",
      "docs/specs/features/inspect-get-command-field-type.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-get-event-optional.md",
      "docs/specs/features/inspect-get-event-example.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Field type write of the first of two Commands stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Field type write of the first of two Commands stay later/,
      );
    }
  });

  it("inspect-command-field-optional-first-slice Out of scope names later-slice parks without invented spec paths", () => {
    const text = readFileSync(
      "docs/specs/features/inspect-command-field-optional-first-slice.md",
      "utf8",
    );
    const out =
      text.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(out).not.toContain("inspect-command-field-example-first-slice.md");
    expect(out).not.toContain("inspect-command-second-field-optional.md");
    expect(out).toContain("First-Slice Command Example write");
    expect(out).toContain("Second Field Optional");
  });

  it("inspect-command-field-optional-first-slice Restates paths do not park GET Optional write of a Command on the first of two Slices as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-command-optional-write.md",
      "docs/specs/features/inspect-command-field-type-first-slice.md",
      "docs/specs/product.md",
      "docs/specs/architecture.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).toContain("inspect-command-field-optional-first-slice.md");
      expect(text, path).not.toMatch(
        /GET Optional write of a Command on the first of two Slices stay later/,
      );
    }
  });

  it("inspect-command-field-type-first-slice Restates paths do not park GET Field type write of a Command on the first of two Slices as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-get-command-field-type-write.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-command-field-name-first-slice.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).toContain("inspect-command-field-type-first-slice.md");
      expect(text, path).not.toMatch(
        /GET Field type write of a Command on the first of two Slices stay later/,
      );
    }
  });

  it("inspect-command-field-name-first-slice Restates paths do not park GET Field name write of a Command on the first of two Slices as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/inspect-add-field-first-slice.md",
      "docs/specs/features/inspect-second-field-name-write.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).toContain("inspect-command-field-name-first-slice.md");
      expect(text, path).not.toMatch(
        /GET Field name write of a Command on the first of two Slices stay later/,
      );
    }
  });

  it("inspect-add-field-first-slice Restates paths do not park Add Field on a Command in the first of two Slices as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).toContain("inspect-add-field-first-slice.md");
      expect(text, path).not.toMatch(
        /Add Field on a Command in the first of two Slices stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names Add Field on a Command in the first of two Slices once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "Add Field on a Command in the first of two Slices is [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("editor-bind-split Out of scope names GET Field type write of the first of two Commands once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type write of the first of two Commands is [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-event-field-type-write Restates paths do not park GET Field type write of the first of two Events as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-event-field-type-write.md",
      "docs/specs/features/inspect-get-event-field-type.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-command-example-write.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Field type write of the first of two Events stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Field type write of the first of two Events stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type write of the first of two Events once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type write of the first of two Events is [inspect-event-field-type-write.md](./inspect-event-field-type-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-read-model-field-type-write Restates paths do not park GET Field type write of the first of two Read Models as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-read-model-field-type-write.md",
      "docs/specs/features/inspect-get-read-model-field-type.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-event-field-type-write.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Field type write of the first of two Read Models stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Field type write of the first of two Read Models stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type write of the first of two Read Models once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type write of the first of two Read Models is [inspect-read-model-field-type-write.md](./inspect-read-model-field-type-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-automation-field-type-write Restates paths do not park GET Field type write of the first of two Automations as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-automation-field-type-write.md",
      "docs/specs/features/inspect-get-automation-field-type.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-read-model-field-type-write.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Field type write of the first of two Automations stay later/,
      );
      expect(text, path).not.toMatch(
        /GET Field type write of the first of two Automations stay later/,
      );
    }
  });

  it("editor-bind-split Out of scope names GET Field type write of the first of two Automations once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Field type write of the first of two Automations is [inspect-automation-field-type-write.md](./inspect-automation-field-type-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-delete-field-event-write Restates paths do not park Delete Field write of the first of two Events as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-delete-field-event-write.md",
      "docs/specs/features/inspect-get-delete-field-event.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-automation-field-type-write.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Delete Field write of the first of two Events stay later/,
      );
      expect(text, path).not.toMatch(
        /Delete Field write of the first of two Events stays later/,
      );
    }
  });

  it("inspect-in-session-delete-field-event Restates paths do not park in-session Event Delete Field after Actor unbind as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-in-session-delete-field-event.md",
      "docs/specs/features/inspect-in-session-delete-field.md",
      "docs/specs/features/inspect-delete-field-event-write.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /In-session Delete Field after re-click of an Event \/ Read Model \/ Automation that already has a Field stay later/,
      );
      expect(text, path).not.toMatch(
        /In-session Event Delete Field after Actor unbind stay later/,
      );
      expect(text, path).not.toMatch(
        /In-session Delete Field after re-click of an Event that already has a Field stay later/,
      );
    }
  });

  it("inspect-in-session-delete-field Restates paths do not park in-session Command re-click Delete Field as stay later", () => {
    const paths = [
      "docs/specs/features/inspect-in-session-delete-field.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/hydrate-add-field.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/architecture.md",
      "docs/specs/product.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/inspect-get-delete-field.md",
      "docs/specs/features/inspect-delete-field-event-write.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /In-session Delete Field after re-click of a Command that already has a Field stay later/,
      );
      expect(text, path).not.toMatch(
        /In-session Delete Field after re-click of a Command that already has a Field stays later/,
      );
    }
  });

  it("editor-bind-split Out of scope names in-session Command re-click Delete Field once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("editor-bind-split Out of scope names Delete Field write of the first of two Events once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "Delete Field write of the first of two Events is [inspect-delete-field-event-write.md](./inspect-delete-field-event-write.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("editor-bind-split Out of scope names GET Inspector of the second Field on one Command once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector of the second Field on one Command is [inspect-get-second-field.md](./inspect-get-second-field.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("editor-bind-split Out of scope names GET Inspector for Automation Delete Field of one Automation once", () => {
    const oos = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    )
      .split("## Out of scope")[1]
      .split("## Restates")[0];
    expect(
      oos.split(
        "GET Inspector for Automation Delete Field of one Automation is [inspect-get-delete-field-automation.md](./inspect-get-delete-field-automation.md).",
      ).length - 1,
    ).toBe(1);
  });

  it("inspect-get-automation-field Restates paths do not assign unqualified Automation Field after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-automation-field.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Automation Field name after reload(?! of one Automation)/,
      );
      expect(text, path).not.toMatch(
        /Automation Field after reload(?! of one Automation)/,
      );
    }
  });

  it("inspect-get-read-model-field Restates paths do not assign unqualified Read Model Field after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-read-model-field.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/inspect-fields-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/product.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Read Model Field name after reload(?! of one Read Model)/,
      );
      expect(text, path).not.toMatch(
        /Read Model Field after reload(?! of one Read Model)/,
      );
    }
  });

  it("inspect-get-automation does not rewrite model-defaults first-of-two Automation Description", () => {
    const defaults = readFileSync(
      "docs/specs/features/model-defaults.md",
      "utf8",
    );
    expect(defaults).not.toContain("inspect-get-automation.md");
  });

  it("inspect-get-automation Restates paths do not assign unqualified Automation Description after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-automation.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/features/hydrate-kind-id.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Automation Description after reload(?! of one Automation)/,
      );
    }
  });

  it("inspect-get-actor Restates paths do not assign unqualified Actor Description after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-actor.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
      "docs/specs/features/hydrate-kind-id.md",
      "docs/specs/features/model-defaults.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Actor Description after reload(?! of one Actor)/,
      );
    }
  });

  it("inspect-get-read-model Restates paths do not assign unqualified Read Model Description after reload to inspect-rest", () => {
    const paths = [
      "docs/specs/features/inspect-get-read-model.md",
      "docs/specs/features/inspect-after-reload.md",
      "docs/specs/features/inspect-rest.md",
      "docs/specs/features/name-binding-rest.md",
      "docs/specs/features/editor-bind-split.md",
      "docs/specs/features/inspect-get-event.md",
      "docs/specs/features/inspect-get-command.md",
      "docs/specs/features/inspect-get-slice-description.md",
      "docs/specs/features/inspect-get-slice-type.md",
      "docs/specs/architecture.md",
      "docs/specs/features/editor-shell.md",
      "docs/specs/features/add-on-lane.md",
      "docs/specs/features/blocks.md",
      "docs/specs/features/canvas.md",
      "docs/specs/features/chrome.md",
      "docs/specs/features/connection-feedback.md",
      "docs/specs/features/connections.md",
      "docs/specs/features/inspect-blocks.md",
      "docs/specs/features/inspect-connection.md",
      "docs/specs/features/inspect-description.md",
      "docs/specs/features/inspect-fields.md",
      "docs/specs/features/model-persistence.md",
      "docs/specs/features/slice-type.md",
    ];
    for (const path of paths) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(
        /Read Model Description after reload(?! of one Read Model)/,
      );
    }
  });

  it("editor-bind-split Out of scope does not park ⌘S Save as later work", () => {
    const bind = readFileSync(
      "docs/specs/features/editor-bind-split.md",
      "utf8",
    );
    const out = (bind.split("## Out of scope")[1] ?? "").split(
      "## Restates",
    )[0];
    expect(out).not.toContain("⌘S Save.");
    expect(out).toContain("[cmd-s-save.md](./cmd-s-save.md)");
    const cmd = readFileSync("docs/specs/features/cmd-s-save.md", "utf8");
    expect(cmd).toContain("[editor-bind-split.md](./editor-bind-split.md)");
  });

  it("inspect-delete-connection Restates paths do not assign Command → Event Delete Connection to delete-blocks", () => {
    for (const path of specMarkdownFiles("docs/specs")) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toContain("Command → Event Delete Connection");
    }
    const restates =
      readFileSync(
        "docs/specs/features/inspect-delete-connection.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    for (const slug of [
      "connections.md",
      "canvas.md",
      "add-on-lane.md",
      "connection-feedback.md",
      "inspect-description.md",
      "delete-event-read.md",
      "inspect-fields-rest.md",
      "undo-rest.md",
      "designed-surfaces.md",
    ]) {
      expect(restates, slug).toContain(`[${slug}]`);
      const text = readFileSync(`docs/specs/features/${slug}`, "utf8");
      expect(text, slug).toContain(
        "[inspect-delete-connection.md](./inspect-delete-connection.md)",
      );
    }
  });

  it("inspect-delete-connection Restates of product.md leftover-hide after Command listitem is on the Playwright path", () => {
    const restates =
      readFileSync(
        "docs/specs/features/inspect-delete-connection.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    expect(restates).toContain(
      "After that click then the Timeline `Command` listitem, Inspector does not show Delete Connection",
    );
    const product = readFileSync("docs/specs/product.md", "utf8");
    expect(product).toContain(
      "click the Timeline `Command` listitem, Inspector does not show Delete Connection",
    );
  });

  it("port-highlight-hovered-read-model Restates connection-refusals; that Out of scope and Restates name last of two Read Model ports on this slice", () => {
    const restates =
      readFileSync(
        "docs/specs/features/port-highlight-hovered-read-model.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    expect(restates).toContain(
      "[connection-refusals.md](./connection-refusals.md)",
    );
    const refusals = readFileSync(
      "docs/specs/features/connection-refusals.md",
      "utf8",
    );
    const out =
      refusals.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(out).toContain(
      "Event → Read Model of one Read Model (no existing edge) stays [connection-feedback.md](./connection-feedback.md)",
    );
    expect(out).toContain(
      "Last of two Read Model ports lit is [port-highlight-hovered-read-model.md](./port-highlight-hovered-read-model.md).",
    );
    const refusalsRestates = refusals.split("## Restates")[1] ?? "";
    const connectionFeedbackRestates =
      refusalsRestates.split("- [connections.md]")[0] ?? "";
    expect(connectionFeedbackRestates).toContain(
      "Event → Read Model highlight of one Read Model",
    );
    expect(connectionFeedbackRestates).toContain(
      "Last of two Read Model ports lit is [port-highlight-hovered-read-model.md](./port-highlight-hovered-read-model.md).",
    );
    const productRestates =
      refusalsRestates.split("- [product.md](../product.md)")[1] ?? "";
    expect(productRestates).toContain(
      "Event → Read Model highlight of one Read Model",
    );
    expect(productRestates).toContain(
      "Last of two Read Model ports lit is [port-highlight-hovered-read-model.md](./port-highlight-hovered-read-model.md).",
    );
  });

  it("redo-connection-pair Restates inspect-connection-live-titles and port-highlight-hovered-event; those Out of scope name redo-connection-pair", () => {
    const restates =
      readFileSync(
        "docs/specs/features/redo-connection-pair.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    expect(restates).toContain(
      "[inspect-connection-live-titles.md](./inspect-connection-live-titles.md)",
    );
    expect(restates).toContain(
      "[port-highlight-hovered-event.md](./port-highlight-hovered-event.md)",
    );
    const liveOut =
      readFileSync(
        "docs/specs/features/inspect-connection-live-titles.md",
        "utf8",
      )
        .split("## Out of scope")[1]
        ?.split("## Restates")[0] ?? "";
    expect(liveOut).toContain(
      "[redo-connection-pair.md](./redo-connection-pair.md)",
    );
    const portOut =
      readFileSync(
        "docs/specs/features/port-highlight-hovered-event.md",
        "utf8",
      )
        .split("## Out of scope")[1]
        ?.split("## Restates")[0] ?? "";
    expect(portOut).toContain(
      "[redo-connection-pair.md](./redo-connection-pair.md)",
    );
  });

  it("inspect-connection-event-read-titles Restates inspect-connection; inspect-connection does not park unqualified live titles on inspect-connection-live-titles", () => {
    const restates =
      readFileSync(
        "docs/specs/features/inspect-connection-event-read-titles.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    expect(restates).toContain(
      "[inspect-connection.md](./inspect-connection.md)",
    );
    const text = readFileSync(
      "docs/specs/features/inspect-connection.md",
      "utf8",
    );
    expect(text).not.toMatch(/(?:^|\. )Live titles after Name fill are/m);
    expect(text).toContain(
      "Command → Event live titles after Name fill are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md).",
    );
    expect(text).toContain(
      "Event → Read Model live titles after Name fill are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).",
    );
  });

  it("inspect-connection-live-titles Assumptions and Restates of inspect-connection do not park unqualified live titles as this slice", () => {
    const text = readFileSync(
      "docs/specs/features/inspect-connection-live-titles.md",
      "utf8",
    );
    expect(text).not.toMatch(/(?:^|\. )Live titles after Name fill are/m);
    const assumptions =
      text.split("## Assumptions")[1]?.split("## Out of scope")[0] ?? "";
    expect(assumptions).toContain(
      "Command → Event live titles after Name fill are this slice.",
    );
    expect(assumptions).toContain(
      "Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).",
    );
    const restates = text.split("## Restates")[1] ?? "";
    const inspectConnectionRestates =
      restates.split("- [inspect-connection.md]")[1]?.split("\n- [")[0] ?? "";
    expect(inspectConnectionRestates).toContain(
      "Command → Event live titles after Name fill are this slice.",
    );
    expect(inspectConnectionRestates).toContain(
      "Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).",
    );
  });

  it("inspect-connection-event-read-titles Restates of inspect-rest and inspect-rest Assumptions do not park unqualified live titles", () => {
    const restates =
      readFileSync(
        "docs/specs/features/inspect-connection-event-read-titles.md",
        "utf8",
      ).split("## Restates")[1] ?? "";
    const inspectRestRow =
      restates.split("- [inspect-rest.md]")[1]?.split("\n- [")[0] ?? "";
    expect(inspectRestRow).not.toMatch(/(?:^|\. )Live titles after Name fill are/m);
    expect(inspectRestRow).toContain(
      "Event → Read Model live titles after Name fill are this slice.",
    );
    const inspectRest = readFileSync(
      "docs/specs/features/inspect-rest.md",
      "utf8",
    );
    const assumptions =
      inspectRest.split("## Assumptions")[1]?.split("## Out of scope")[0] ??
      "";
    expect(assumptions).not.toMatch(/(?:^|\. )Live titles after Name fill are/m);
    expect(assumptions).toContain(
      "Event → Read Model live titles after Name fill are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).",
    );
  });

  it("undo-add-selected-slice Out of scope names redo of selected-Slice Add Command as undo-rest.md", () => {
    for (const path of specMarkdownFiles("docs/specs")) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toContain("redo-add-selected-slice.md");
    }
    const addSelected = readFileSync(
      "docs/specs/features/undo-add-selected-slice.md",
      "utf8",
    );
    const addOut =
      addSelected.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(addOut).toContain(
      "Redo of selected-Slice Add Command while that Slice stays selected is [undo-rest.md](./undo-rest.md).",
    );
    const restates = addSelected.split("## Restates")[1] ?? "";
    const undoRestRow =
      restates.split("- [undo-rest.md]")[1]?.split("\n- [")[0] ?? "";
    expect(undoRestRow).toContain(
      "Redo of selected-Slice Add Command while that Slice stays selected stays that file.",
    );
    const undoRest = readFileSync("docs/specs/features/undo-rest.md", "utf8");
    const undoRestOut =
      undoRest.split("## Out of scope")[1]?.split("## Restates")[0] ?? "";
    expect(undoRestOut).toContain(
      "Redo of selected-Slice Add Command while that Slice stays selected is this slice.",
    );
  });
});
