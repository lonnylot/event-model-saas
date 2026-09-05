# Connection caption

Status: released

## Problem

Dragging `Command port` onto `Event Happened port` puts `Command → Event Happened` on `.board` as a later flex sibling of `.slice-col`. Dragging `Event Happened port` onto `Read Model port` puts `Event Happened → Read Model` the same way. That copy sits beside the Slice as a wrapped extra column, so a Connection is not readable as a caption on the canvas.

## Acceptance criteria

- [x] After dragging `Command port` onto `Event Happened port`, `Command → Event Happened` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Command` `getBoundingClientRect.bottom`
- [x] After dragging `Event Happened port` onto `Read Model port`, `Event Happened → Read Model` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Read Model` `getBoundingClientRect.bottom`
- [x] After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, `Command → Event Happened` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Command` `getBoundingClientRect.bottom`
- [x] After a member creates a model, opens it, clicks `Add Event`, clicks `Add Read Model`, drags `Event Happened port` onto `Read Model port`, and Saves, a reload of that page, `Event Happened → Read Model` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Read Model` `getBoundingClientRect.bottom`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person

## Seams

- `bindPointer` in `public/editor-pointer.js` — Connection copy placement
- `handleRequest` — model page HTML Connection copy
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `.board` still contains `Command → Event Happened` ([connection-on-board.md](./connection-on-board.md)). Sitting beside the Slice as an extra column is leftover unused; wrapping below the Slice column is this slice. Connection copy stays a later sibling of `.slice-col` so undo insertBefore on `.board-pan` still holds ([undo-rest.md](./undo-rest.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Drawing Connections as canvas lines between ports. Inspector leftover Type. Shortcut ports. Narrow viewport. Undo/⇧⌘Z redo Connection copy parent stays [undo-rest.md](./undo-rest.md). Landing. Mac window chrome. Copy changes.

## Restates

- [connection-on-board.md](./connection-on-board.md) — `.board` still contains `Command → Event Happened`. Sitting beside the Slice as an extra column is leftover unused; wrapping below the Slice is this slice.
- [connections.md](./connections.md) — Timeline still shows `Command → Event Happened`. Caption placement on `.board` is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Connection caption placement is this slice.
- [hydrate-connection-id.md](./hydrate-connection-id.md) — GET `Command → Event Happened` `data-id` stays that file. Connection caption sitting beside the Slice as an extra column is leftover unused; wrapping below the Slice is this slice.
- [inspect-switch.md](./inspect-switch.md) — Leftover Inspector Type after a Connection click stays that file. Connection copy sitting beside the Slice as an extra column is leftover unused; wrapping below the Slice is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindPointer` import stays that file. Connection caption placement is this slice.
- [editor-narrow.md](./editor-narrow.md) — Narrow viewport Slice inside Timeline stays that file. Connection caption placement is this slice.
- [editor-midwidth.md](./editor-midwidth.md) — 800-wide Slice inside Timeline stays that file. Connection caption placement is this slice.
