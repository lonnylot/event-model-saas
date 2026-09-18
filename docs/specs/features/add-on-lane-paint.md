# Add on lane paint

Status: released

## Problem

Lane `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` write JSON on the chosen Slice and do not append a Timeline listitem. `Add Command on lane` paints. Mac `addElement` shows the card at once. A member who clicks those lane buttons cannot see or inspect the block until Save and reload.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `Add Actor on lane`, the first Slice Timeline region shows 2 listitem whose accessible name is `Actor`
- [x] After clicking `New Slice` twice, clicking the first `Add Event on lane`, the first Slice Timeline region shows a listitem whose accessible name is `Event Happened`
- [x] After clicking `New Slice` twice, clicking the first `Add Read Model on lane`, the first Slice Timeline region shows a listitem whose accessible name is `Read Model`
- [x] After clicking `New Slice` twice, clicking the first `Add Automation on lane`, the first Slice Timeline region shows a listitem whose accessible name is `Automation`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `bindEditor` in `public/editor.js` — lane Add Actor / Event / Read Model / Automation paints a Timeline listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- JSON append on the first Slice stays [add-on-lane-rest.md](./add-on-lane-rest.md). `Add Command on lane` paint stays [add-on-lane.md](./add-on-lane.md). Lane paint of Actor / Event / Read Model / Automation is this slice. Empty Import two `New Slice` is the same fixture as [add-on-lane-rest.md](./add-on-lane-rest.md) (first Slice already has the New Slice default Actor).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

`Add Command on lane` paint. Toolbar Add Actor / Event / Read Model / Automation on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). In-memory ports and inspect/delete on those lane-painted listitems. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [add-on-lane-rest.md](./add-on-lane-rest.md) — JSON append on the first Slice stays that file. Timeline listitem paint is this slice.
- [add-on-lane.md](./add-on-lane.md) — `Add Command on lane` paint stays that file. Other lane paint is this slice.
- [product.md](../product.md) — Lane Add Actor / Event / Read Model / Automation Timeline listitem is this slice.
- [architecture.md](../architecture.md) — Lane Add paint of Actor / Event / Read Model / Automation is this slice.
