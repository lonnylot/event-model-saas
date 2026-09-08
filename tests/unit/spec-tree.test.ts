import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("spec tree", () => {
  it("the repo has no docs/superpowers directory", () => {
    expect(existsSync("docs/superpowers")).toBe(false);
  });

  it("docs/specs/README.md does not contain a git conflict marker", () => {
    const text = readFileSync("docs/specs/README.md", "utf8");
    expect(text).not.toContain("<<<<<<<");
    expect(text).not.toContain(">>>>>>>");
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
});
