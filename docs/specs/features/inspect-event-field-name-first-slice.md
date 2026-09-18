# Inspect event field name first slice

Status: released

## Problem

`setFieldName` for Event / Read Model / Automation still starts at `slices.at(-1)` and writes `fields[0]`. Command first-Slice Field name already walks slices. A member who reopens a first-Slice Event cannot rename that Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Event on lane` on that Slice, clicks the Timeline `Event Happened` listitem of the first Slice, clicks `Add Field`, fills `Name` with `Order Placed`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem, filling Inspector `Field name` with `eventId` sets that Event `fields[0].name` to `eventId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Read Model on lane` on that Slice, clicks the Timeline `Read Model` listitem of the first Slice, clicks `Add Field`, fills `Name` with `Orders`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem, filling Inspector `Field name` with `viewId` sets that Read Model `fields[0].name` to `viewId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Automation on lane` on that Slice, clicks the Timeline `Automation` listitem of the first Slice, clicks `Add Field`, fills `Name` with `Send Email`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem, filling Inspector `Field name` with `jobId` sets that Automation `fields[0].name` to `jobId`

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `setFieldName` in `public/set-field-name.js` — GET Event / Read Model / Automation Field name write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Field name write of a Command on the first of two Slices stays [inspect-command-field-name-first-slice.md](./inspect-command-field-name-first-slice.md). Add Field on those first-Slice blocks stays [inspect-add-field-event-first-slice.md](./inspect-add-field-event-first-slice.md). Field name write of Event / Read Model / Automation on the first of two Slices is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Second Event Field name is [inspect-event-second-field-name.md](./inspect-event-second-field-name.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-command-field-name-first-slice.md](./inspect-command-field-name-first-slice.md) — Out of scope no longer parks Event / Read Model / Automation Field name on the first of two Slices; those are this slice.
- [product.md](../product.md) — GET Field name write of Event / Read Model / Automation on the first of two Slices is this slice.
- [architecture.md](../architecture.md) — First-Slice Event / Read Model / Automation Field name write is this slice.
