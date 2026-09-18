# Empty canvas new slice

Status: released

## Problem

Imported empty Event Model has no Slice. Toolbar Add Command, Add Event, Add Read Model, and Add Automation stay clickable and no-op. Empty canvas has no Timeline New Slice. A member cannot start a blank import from the Timeline.

## Acceptance criteria

- [x] After opening Empty Import, the Timeline region shows a button whose accessible name is `New Slice`
- [x] After opening Empty Import, the button whose accessible name is `Add Actor` is disabled

## Domain terms

Event Model, Slice, Actor, Team, Person, Version

## Seams

- `modelPageHtml` in `src/teams/pages.ts` — empty Timeline New Slice; toolbar Add Actor disabled when there are no Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Empty Import is the same fixture as [add-on-lane-rest.md](./add-on-lane-rest.md). Creating a Slice from toolbar Add stays not a feature ([blocks.md](./blocks.md)). Empty canvas Timeline New Slice and disabled toolbar Add Actor are this slice. Toolbar New Slice in the AppBar still exists.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Creating a Slice from toolbar Add. Disabled toolbar Add Command, Add Event, Add Read Model, and Add Automation when there are no Slices stay later. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [blocks.md](./blocks.md) — Clicking Add with no Slices still does not create a Slice. Empty canvas Timeline New Slice is this slice. Disabled toolbar Add Actor when there are no Slices is this slice. Disabled toolbar Add Command, Add Event, Add Read Model, and Add Automation stay later.
- [add-on-lane-rest.md](./add-on-lane-rest.md) — Creating a Slice from Add when there are none stays not a feature. Empty canvas Timeline New Slice and disabled toolbar Add Actor when there are no Slices are this slice.
- [product.md](../product.md) — Empty canvas Timeline New Slice and disabled toolbar Add Actor when there are no Slices are this slice.
- [architecture.md](../architecture.md) — Empty canvas Timeline New Slice and disabled toolbar Add Actor when there are no Slices are this slice.
- [editor-shell.md](./editor-shell.md) — Toolbar `New Slice` stays that file. Timeline empty New Slice is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — `Start the timeline` heading stays that file. Timeline empty New Slice is this slice.
