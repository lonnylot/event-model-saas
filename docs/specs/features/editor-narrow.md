# Editor narrow

Status: validated

## Problem

At a 390-wide viewport the Editor AppBar wraps into several rows, the slice rail stacks above TIME, and `.slice-col` is clipped so lane labels overlap the Slice. A member on a phone cannot read or edit the Event Model.

## Acceptance criteria

- [x] After a member creates a model and opens it at viewport 390×844, the `.slice-col` `getBoundingClientRect` is inside the Timeline region `getBoundingClientRect`
- [x] After a member creates a model and opens it at viewport 390×844, `document.documentElement.scrollWidth` is not greater than `document.documentElement.clientWidth`
- [x] After a member creates a model and opens it at viewport 390×844, the Timeline region is visible

## Domain terms

Event Model, Slice, Team, Person

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Desktop Editor grid stays [designed-surfaces.md](./designed-surfaces.md) / [visual-shell.md](./visual-shell.md). Narrow layout so the Slice column stays inside Timeline is this slice.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)).
- Inside means the Slice column `left`/`right`/`top`/`bottom` is not outside the Timeline region box.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Changing zoom factors. Connection caption placement. Inspector leftover Type. Shortcut ports. Landing. Mac window chrome. Copy changes.

## Restates

- [designed-surfaces.md](./designed-surfaces.md) — Desktop Editor `main` grid stays that file. Narrow viewport Slice inside Timeline is this slice.
- [visual-shell.md](./visual-shell.md) — Editor shell tokens stay that file. Narrow AppBar / Timeline clip is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Narrow Editor layout is this slice.
