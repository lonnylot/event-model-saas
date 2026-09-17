# Undo restore selected slice

Status: released

## Problem

`restoreCommand` JSON uses `sliceId`, then paints onto `lastLaneList`. Undo of a first-Slice Command Backspace shows the card on the last Slice. Mac undo restores the file; the card stays in its Slice.

## Acceptance criteria

- [x] After clicking `New Slice`, clicking the first `New Slice` listitem in the Slices region, clicking `Add Command`, clicking the first Slice Timeline `Command` listitem, pressing Backspace, pressing ⌘Z, the first Slice Timeline region shows a listitem whose accessible name is `Command`

## Domain terms

Event Model, Slice, Command, Team, Person, Version

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — undo of delete paints the restored Command on its Slice
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Undo of Command Backspace on the last Slice stays [undo-rest.md](./undo-rest.md). Undo restore paint on the selected first Slice is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Undo of selected-Slice Add is [undo-add-selected-slice.md](./undo-add-selected-slice.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [undo-rest.md](./undo-rest.md) — Undo of last-Slice Command Backspace stays that file. Undo restore paint on the first Slice is this slice.
- [product.md](../product.md) — Undo restore of a first-Slice Command paints that Slice.
- [architecture.md](../architecture.md) — Undo restore paint on the selected Slice is this slice.
