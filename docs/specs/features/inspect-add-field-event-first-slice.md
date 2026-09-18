# Inspect add field event first slice

Status: validated

## Problem

`appendField` Command-with-id walks slices. Event / Read Model / Automation still write `slices.at(-1)` even when id is passed. Add Field on a first-Slice Event misses. Mac appends to the selected element's `fields`.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Event on lane` on that Slice, clicks the Timeline `Event Happened` listitem of the first Slice, and clicks `Add Field`, that Event `fields[0].name` is `newField`
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Read Model on lane` on that Slice, clicks the Timeline `Read Model` listitem of the first Slice, and clicks `Add Field`, that Read Model `fields[0].name` is `newField`
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Automation on lane` on that Slice, clicks the Timeline `Automation` listitem of the first Slice, and clicks `Add Field`, that Automation `fields[0].name` is `newField`

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `appendField` in `public/append-field.js` — Add Field on Event / Read Model / Automation in the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Add Field on a Command in the first of two Slices stays [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md). Lane Add Event / Read Model / Automation JSON stays [add-on-lane-rest.md](./add-on-lane-rest.md). Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Field name write after that Add Field is [inspect-event-field-name-first-slice.md](./inspect-event-field-name-first-slice.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md) — Out of scope no longer parks Add Field on Event / Read Model / Automation in the first of two Slices; those are this slice.
- [inspect-fields.md](./inspect-fields.md) — Last-Slice Add Field stays that file. Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [inspect-rest.md](./inspect-rest.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [hydrate-add-field.md](./hydrate-add-field.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [editor-shell.md](./editor-shell.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [blocks.md](./blocks.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [model-persistence.md](./model-persistence.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [product.md](../product.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
- [architecture.md](../architecture.md) — Add Field on Event / Read Model / Automation in the first of two Slices is this slice.
