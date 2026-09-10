# Redo connection pair

Status: validated

## Problem

⇧⌘Z after undoing a Connection appends last Command → last Event. Mac redo restores that action's `fromID` / `toID`. After two Commands and two Events, redo can attach the wrong pair.

## Acceptance criteria

- [x] After clicking `Add Command` twice, clicking `Add Event` twice, dragging from the first `Command port` onto the first `Event Happened port`, pressing ⌘Z, pressing ⇧⌘Z, the remaining Connection `fromID` is the first Command `id` and `toID` is the first Event `id`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — Connection redo restores the undone pair
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Undo of Command → Event stays [canvas.md](./canvas.md). Redo of Add Command stays [undo-rest.md](./undo-rest.md). Redo of a first-of-two Command → Event pair is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Redo of Event → Read Model. Undo last-slice Add. Live Connection titles. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [undo-rest.md](./undo-rest.md) — Redo of Add Command / Add Event stays that file. Redo of a selected Connection pair is this slice.
- [canvas.md](./canvas.md) — Undo Command → Event stays that file. Redo of that pair's ids is this slice.
- [product.md](../product.md) — Connection redo restores the undone fromID and toID.
