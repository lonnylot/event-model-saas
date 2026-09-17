# Inspect after delete parent slice

Status: released

## Problem

Backspace of a selected Command clears Inspector to `Nothing Selected`. Mac `deleteSelection` sets `selection` to the parent Slice. A member who deletes a Command cannot immediately edit that Slice without clicking it again.

## Acceptance criteria

- [x] After clicking `Add Command`, clicking the Timeline `Command` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`

## Domain terms

Event Model, Slice, Command, Slice type, Team, Person

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — after Command Backspace, Inspector shows the parent Slice
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Command Backspace still deletes the Command ([delete-blocks.md](./delete-blocks.md)). TIME / empty `.board` click still shows `Nothing Selected` ([inspect-deselect.md](./inspect-deselect.md)). Inspector after that Backspace is this slice (parent Slice Type, not `Nothing Selected`).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

TIME / empty board deselect. After-delete parent Slice for Actor / Event / Read Model / Automation is [inspect-after-delete-parent-rest.md](./inspect-after-delete-parent-rest.md). TIME click empty Inspector as the empty path. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-after-delete.md](./inspect-after-delete.md) — Inspector empty `Nothing Selected` after Command Backspace and the leftover `test()` title that quotes those words are this slice (parent Slice Type instead). Does not show Add Field after that Backspace stays that file.
- [designed-surfaces.md](./designed-surfaces.md) — GET with no local edits still shows `Nothing Selected`. `Nothing Selected` after Command Backspace is this slice (parent Slice Type instead).
- [delete-blocks.md](./delete-blocks.md) — Command Backspace still deletes the Command.
- [inspect-deselect.md](./inspect-deselect.md) — TIME / empty `.board` `Nothing Selected` stays that file.
- [product.md](../product.md) — After Command Backspace, Inspector shows the parent Slice.
- [architecture.md](../architecture.md) — Inspector empty state after Command Backspace is this slice (parent Slice Type instead). Leftover Add Field after that Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).
- [leftover-connection-command.md](./leftover-connection-command.md) — Inspector empty after Command Backspace is this slice (parent Slice Type instead). Leftover Add Field after that Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).
- [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md) — Inspector empty after Command Backspace is this slice (parent Slice Type instead). Leftover Add Field after that Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).
- [editor-bind-split.md](./editor-bind-split.md) — Inspector empty after Command Backspace is this slice (parent Slice Type instead). Leftover Add Field after that Backspace stays [inspect-after-delete.md](./inspect-after-delete.md).
