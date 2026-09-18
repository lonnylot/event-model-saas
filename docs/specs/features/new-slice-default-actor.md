# New Slice default Actor

Status: released

## Problem

POST Create model seeds one Slice with one Actor. Toolbar `New Slice` appended `{ actors: [] }`. Mac `Slice()` seeds `actors: [Actor()]`. A member who added a Slice could not start that column with an Actor already on the Timeline.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, the Timeline region shows 2 listitems whose accessible name is `Actor`

## Domain terms

Event Model, Slice, Actor, Team, Person

## Seams

- `appendSlice` in `public/append-slice.js` — New Slice seeds one Actor
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds one Slice with one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). Toolbar `New Slice` still appends a Slice titled `New Slice` of type `STATE_CHANGE` ([editor-shell.md](./editor-shell.md)). Seeding that Slice with one Actor named `Actor` is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

New Slice title `Slice N`. Toolbar Add Actor on the selected first of two Slices. TIME click empty Inspector. Landing. Mac window chrome. Copy changes. Insert after the selected Slice is [new-slice-insert-after.md](./new-slice-insert-after.md).

## Restates

- [editor-shell.md](./editor-shell.md) — Clicking `New Slice` still appends title `New Slice` and `sliceType` `STATE_CHANGE`. `actors: []` is this slice.
- [model-defaults.md](./model-defaults.md) — POST Create model still seeds one Slice with one Actor. Toolbar New Slice Actor is this slice. Leftover undo-rest Restates ⌘Z 1 listitem / redo 2, and leftover delete-rest Restates `Add Actor` twice, are leftover unused.
- [product.md](../product.md) — Toolbar New Slice seeds one Actor named `Actor`.
- [blocks.md](./blocks.md) — Toolbar New Slice Actor is this slice. Toolbar Add Actor still last Slice. After `New Slice` then `Add Actor`, Timeline shows 3 `Actor` listitems (Create + New Slice default + Add Actor). Count `2` is leftover unused.
- [canvas.md](./canvas.md) — After two `New Slice` on an imported empty document, dragging the last Timeline `Actor` onto the first Slice sets last `actors` to `[]`. `then Add Actor` / first has one Actor is leftover unused.
- [undo-rest.md](./undo-rest.md) — After `New Slice` then `Add Actor`, ⌘Z leaves 2 `Actor` listitems (Create + New Slice default). Redo shows 3. Count `1` / redo `2` is leftover unused. First-vs-last on the last Slice is `New Slice` then `Add Actor` (New Slice already seeds the first). `Add Actor` twice is leftover unused.
- [delete-rest.md](./delete-rest.md) — First-vs-last Actor Backspace/Delete on the last Slice is `New Slice` then `Add Actor`. `Add Actor` twice is leftover unused.
- [new-slice-shortcut.md](./new-slice-shortcut.md) — ⇧⌘N still appends title `New Slice`. Empty Slice JSON is leftover unused. Default Actor is this slice.
- [add-on-lane.md](./add-on-lane.md) — After `New Slice`, ⌥⌘1 last Slice `actors` length is `2` and last Actor is `actors.at(-1)`. `actors[0]` is leftover unused.
- [add-on-lane-rest.md](./add-on-lane-rest.md) — First `Add Actor on lane` / ⌥⌘1 still target the first Slice. Last `actors` `[]` is leftover unused (New Slice already seeds one).
- [chrome.md](./chrome.md) — Last Actor Name is `actors.at(-1)`. `actors[0]` after `New Slice` then `Add Actor` is leftover unused.
