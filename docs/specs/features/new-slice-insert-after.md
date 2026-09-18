# New slice insert after

Status: validated

## Problem

`appendSlice` always pushes the end with title `New Slice`. Mac `insertSlice(after: selection.sliceID)` and `nextSliceTitle()` (`Slice N`). A member on an earlier Slice cannot insert between columns, and titles do not number.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem in the Slices region, clicking `New Slice`, the last Slice `id` is the Slice that was last before that click
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem in the Slices region, clicking `New Slice`, the second Slice `title` is `Slice 4`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `appendSlice` in `public/append-slice.js` — insert after the selected Slice with title `Slice N`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Toolbar New Slice default Actor stays [new-slice-default-actor.md](./new-slice-default-actor.md). Create still seeds title `New Slice` ([model-defaults.md](./model-defaults.md)). Insert after the selected Slice and title `Slice N` are this slice. Create + two New Slice is three Slices; `nextSliceTitle` uses count + 1 (`Slice 4`).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Create-model default title `New Slice`. TIME click empty Inspector. Landing. Mac window chrome. Copy changes other than `Slice N`.

## Restates

- [new-slice-default-actor.md](./new-slice-default-actor.md) — Out of scope no longer parks inserting New Slice after the selected Slice; that is this slice. Title `Slice N` stays that file.
- [slice-type-state-change-write.md](./slice-type-state-change-write.md) — Out of scope no longer parks New Slice insert after the selected Slice; that is this slice.
- [product.md](../product.md) — New Slice insert after the selected Slice is this slice.
- [architecture.md](../architecture.md) — New Slice insert after the selected Slice is this slice.
