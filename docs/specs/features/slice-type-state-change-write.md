# Slice type State Change write

Status: validated

## Problem

Inspector Type can set `STATE_VIEW` and `AUTOMATION`. Selecting `State Change` after `State View` maps to null and returns. Mac `Picker` writes `STATE_CHANGE`. A member cannot mark the last Slice as a State Change again.

## Acceptance criteria

- [x] After clicking `New Slice`, clicking the last Timeline `New Slice` listitem, selecting `State View` in `Type`, selecting `State Change` in `Type` sets the last Slice `sliceType` to `STATE_CHANGE`

## Domain terms

Event Model, Slice, Slice type, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — Type `State Change` writes `STATE_CHANGE`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Type combobox and State View / Automation writes stay [slice-type.md](./slice-type.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). Writing `STATE_CHANGE` from `State Change` is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Slice type help copy. New Slice insert after the selected Slice. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [slice-type.md](./slice-type.md) — Type combobox, State View, and Automation writes stay that file. Selecting `State Change` writes `STATE_CHANGE` is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — Type on the clicked Slice of two stays that file.
- [product.md](../product.md) — Selecting Type `State Change` writes `STATE_CHANGE`.
