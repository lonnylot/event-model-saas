# Inspect deselect

Status: released

## Problem

Clicking TIME chrome after the Timeline `New Slice` listitem is selected leaves Inspector Name and Type. Clicking empty `.board` after the Timeline `Actor` listitem is selected leaves Inspector Name. `Nothing Selected` does not return, so a member cannot clear the Inspector without picking another block.

## Acceptance criteria

- [x] After clicking the Timeline `New Slice` listitem, then clicking `.time-chrome`, the Inspector region shows the text `Nothing Selected`
- [x] After clicking the Timeline `Actor` listitem, then clicking `.board` at a point that is not a listitem, the Inspector region shows the text `Nothing Selected`

## Domain terms

Event Model, Slice, Actor, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — Inspector empty state after TIME or empty board click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET with no local edits still shows `Nothing Selected` ([designed-surfaces.md](./designed-surfaces.md)). Clicking Timeline `New Slice` still shows Inspector Type ([slice-type.md](./slice-type.md)). Clicking Actor still shows Inspector Name ([chrome.md](./chrome.md)). Clearing that chrome after TIME or empty board click is this slice. Backspace after clicking the selected listitem stays [canvas.md](./canvas.md) / [delete-blocks.md](./delete-blocks.md) / [delete-rest.md](./delete-rest.md) / [hydrate-kind-id.md](./hydrate-kind-id.md) / [undo-rest.md](./undo-rest.md). GET `Command → Event Happened` Backspace after clicking the selected Connection text stays [hydrate-connection-id.md](./hydrate-connection-id.md). In-session Event → Read Model Backspace after clicking the selected Connection then the Timeline region is [delete-event-read.md](./delete-event-read.md). Selected-Slice ⌥⌘ stays [add-on-lane.md](./add-on-lane.md) / [add-on-lane-rest.md](./add-on-lane-rest.md). Parent Slice Type after Command Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). After-delete parent Slice for Actor / Event / Read Model / Automation is [inspect-after-delete-parent-rest.md](./inspect-after-delete-parent-rest.md). Leftover Add Field after Command Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).
- `.time-chrome` is the TIME label sibling of `.board` ([time-chrome-stay.md](./time-chrome-stay.md)). Empty `.board` click is a point inside `.board` that is not a listitem or Connection `p`.
- Create model still seeds a default Slice and one Actor named `Actor` ([model-defaults.md](./model-defaults.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Leftover Type after a Connection click. Leftover Delete Connection after TIME click and after empty `.board` click is [inspect-delete-connection.md](./inspect-delete-connection.md). GET last-of-kind Description. Shortcut ports. Narrow viewport. Landing. Mac window chrome. Copy changes. Backspace after clicking the selected listitem stays [canvas.md](./canvas.md) / [delete-blocks.md](./delete-blocks.md) / [delete-rest.md](./delete-rest.md) / [hydrate-kind-id.md](./hydrate-kind-id.md) / [undo-rest.md](./undo-rest.md). GET `Command → Event Happened` Backspace after clicking the selected Connection text stays [hydrate-connection-id.md](./hydrate-connection-id.md). In-session Event → Read Model Backspace after clicking the selected Connection then the Timeline region is [delete-event-read.md](./delete-event-read.md). Selected-Slice ⌥⌘ stays [add-on-lane.md](./add-on-lane.md) / [add-on-lane-rest.md](./add-on-lane-rest.md). Parent Slice Type after Command Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). After-delete parent Slice for Actor / Event / Read Model / Automation is [inspect-after-delete-parent-rest.md](./inspect-after-delete-parent-rest.md). Leftover Add Field after Command Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).

## Restates

- [designed-surfaces.md](./designed-surfaces.md) — GET with no local edits still shows `Nothing Selected`. Clearing Inspector after TIME or empty board click is this slice. Leftover Delete Connection after TIME click and after empty `.board` click is [inspect-delete-connection.md](./inspect-delete-connection.md).
- [slice-type.md](./slice-type.md) — Clicking Timeline `New Slice` still shows Type. Type after TIME click is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Inspector empty state after TIME or empty board click is this slice.
- [canvas.md](./canvas.md) — Slice Backspace after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting; TIME chrome / empty `.board` deselect is this slice.
- [delete-blocks.md](./delete-blocks.md) — Command / Command → Event Connection Backspace after clicking the selected listitem or Connection text stays that file. Event → Read Model Backspace after clicking the selected Connection then the Timeline region is [delete-event-read.md](./delete-event-read.md). Timeline click no longer blurs without deselecting.
- [delete-rest.md](./delete-rest.md) — Actor / Event / Read Model / Automation Backspace after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting.
- [hydrate-kind-id.md](./hydrate-kind-id.md) — GET Actor / Automation Backspace after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting.
- [undo-rest.md](./undo-rest.md) — Backspace then ⌘Z / ⇧⌘Z after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting.
- [add-on-lane.md](./add-on-lane.md) — Selected-Slice ⌥⌘2 after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting.
- [add-on-lane-rest.md](./add-on-lane-rest.md) — Selected-Slice ⌥⌘1 / ⌥⌘3–5 after clicking the selected listitem stays that file. Timeline click no longer blurs without deselecting.
- [hydrate-connection-id.md](./hydrate-connection-id.md) — GET `Command → Event Happened` `data-id` and Backspace after clicking the selected Connection text stay that file. Timeline click no longer blurs without deselecting.
