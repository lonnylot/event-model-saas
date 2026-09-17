# Undo connection event read

Status: validated

## Problem

In-session Event → Read Model does not push the undo stack. ⌘Z of a later Command → Event can `pop()` that Event → Read Model instead. Mac undo restores the snapshot. A member cannot undo a just-drawn Event → Read Model.

## Acceptance criteria

- [x] After dragging from `Event Happened port` onto `Read Model port`, pressing ⌘Z, the Timeline region does not show the text `Event Happened → Read Model`
- [ ] After dragging from `Command port` onto `Event Happened port`, then from `Event Happened port` onto `Read Model port`, pressing ⌘Z, the Timeline region still shows the text `Command → Event Happened`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person, Version

## Seams

- `bindPointer` in `public/editor-pointer.js` — undo stack records Event → Read Model
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- ⌘Z of Command → Event stays [canvas.md](./canvas.md). Connection redo of a Command → Event pair stays [redo-connection-pair.md](./redo-connection-pair.md). Undo of Event → Read Model is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Redo of Event → Read Model pair ids. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [canvas.md](./canvas.md) — Undo Command → Event stays that file. Undo Event → Read Model is this slice.
- [redo-connection-pair.md](./redo-connection-pair.md) — Command → Event redo ids stay that file. Redo of Event → Read Model stays that file's Out of scope.
- [connection-event-read-id.md](./connection-event-read-id.md) — In-session Event → Read Model `data-id` stays that file. Undo of Event → Read Model is this slice.
- [undo-rest.md](./undo-rest.md) — Undo of remaining Adds, move, delete, and redo stay that file. Undo Command → Event stays [canvas.md](./canvas.md). Undo of Event → Read Model is this slice.
- [canvas-rest.md](./canvas-rest.md) — Undo Add Command stays that file. Undo Command → Event stays [canvas.md](./canvas.md). Undo of Event → Read Model is this slice.
- [add-on-lane.md](./add-on-lane.md) — Lane Add and ⌥⌘2 stay that file. Undo Command → Event stays [canvas.md](./canvas.md). Undo of Event → Read Model is this slice.
- [connection-feedback.md](./connection-feedback.md) — Highlighting legal targets of one Event stays that file. Undo Command → Event stays [canvas.md](./canvas.md). Undo of Event → Read Model is this slice.
- [product.md](../product.md) — Undo of Event → Read Model is this slice.
- [architecture.md](../architecture.md) — Undo of Event → Read Model is this slice.
