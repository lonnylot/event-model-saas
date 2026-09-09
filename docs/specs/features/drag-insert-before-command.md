# Drag insert before Command

Status: released

## Problem

Dragging a Command onto another Slice appends last on that Slice. Mac `moveElement(..., before: destinationID)` inserts before the drop target card. A member who drops onto an existing Command cannot place the moved Command above it.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking `Add Command` on the last Slice, clicking the first Slices `New Slice` listitem, clicking `Add Command`, filling the first Slice Timeline `Command` Inspector `Name` with `Place Order`, dragging the last Slice Timeline `Command` listitem onto the first Slice Timeline `Place Order` listitem sets the first Slice `commands[0].title` to `Command`

## Domain terms

Event Model, Slice, Command, Team, Person, Version

## Seams

- `moveCommandToSlice` in `public/move-command-to-slice.js` — insert before the drop Command
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Dragging a Command onto a Slices listitem still moves it to that Slice last ([canvas-rest.md](./canvas-rest.md)). Insert before a Command card is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Insert-before for Event / Read Model / Automation / Actor. Canvas-column drop that is not a Command listitem. Undo of move. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [canvas-rest.md](./canvas-rest.md) — Sidebar / Slices-listitem drop still appends last. Insert before a Command card is this slice.
- [drag-rest.md](./drag-rest.md) — Event / Read Model / Automation Slices-listitem drop stays that file.
- [canvas.md](./canvas.md) — Actor drag stays that file.
- [product.md](../product.md) — Command insert-before on drop is this slice.
