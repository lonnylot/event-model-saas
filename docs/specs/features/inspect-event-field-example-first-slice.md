# Inspect event field example first slice

Status: validated

## Problem

`setFieldExample` for Event / Read Model / Automation uses last Slice last block `fields[0]` and ignores id. Filling Example on a first-Slice Event writes the last Event. Mac binds the Field row.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Event on lane` on that Slice, clicks the Timeline `Event Happened` listitem of the first Slice, clicks `Add Field`, fills `Example` with `abc`, fills `Name` with `Order Placed`, clicks `Add Event`, clicks the last Timeline `Event Happened` listitem, clicks `Add Field`, fills `Example` with `xyz`, fills `Name` with `Order Cancelled`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem, filling `Example` with `one`, clicking the Timeline `Order Cancelled` listitem shows Inspector `Example` with the value `xyz`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Read Model on lane` on that Slice, clicks the Timeline `Read Model` listitem of the first Slice, clicks `Add Field`, fills `Example` with `abc`, fills `Name` with `Orders`, clicks `Add Read Model`, clicks the last Timeline `Read Model` listitem, clicks `Add Field`, fills `Example` with `xyz`, fills `Name` with `Cancellations`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem, filling `Example` with `one`, clicking the Timeline `Cancellations` listitem shows Inspector `Example` with the value `xyz`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Automation on lane` on that Slice, clicks the Timeline `Automation` listitem of the first Slice, clicks `Add Field`, fills `Example` with `abc`, fills `Name` with `Send Email`, clicks `Add Automation`, clicks the last Timeline `Automation` listitem, clicks `Add Field`, fills `Example` with `xyz`, fills `Name` with `Send SMS`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem, filling `Example` with `one`, clicking the Timeline `Send SMS` listitem shows Inspector `Example` with the value `xyz`

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `setFieldExample` in `public/set-field-example.js` — GET Event / Read Model / Automation Example write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Example of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). First-Slice Event Example write is this slice. GET Example of one Read Model stays [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). First-Slice Read Model Example write is this slice. GET Example of one Automation stays [inspect-get-automation-example.md](./inspect-get-automation-example.md). First-Slice Automation Example write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-get-event-example.md](./inspect-get-event-example.md) — Example after reload of one Event stays that file. First-Slice Event Example write is this slice.
- [inspect-get-read-model-example.md](./inspect-get-read-model-example.md) — Example after reload of one Read Model stays that file. First-Slice Read Model Example write is this slice.
- [inspect-get-automation-example.md](./inspect-get-automation-example.md) — Example after reload of one Automation stays that file. First-Slice Automation Example write is this slice.
- [inspect-event-field-optional-first-slice.md](./inspect-event-field-optional-first-slice.md) — First-Slice Event Optional stays that file.
- [product.md](../product.md) — GET Example write of an Event on the first of two Slices is this slice. GET Example write of a Read Model on the first of two Slices is this slice. GET Example write of an Automation on the first of two Slices is this slice.
- [architecture.md](../architecture.md) — First-Slice Event Example write is this slice. First-Slice Read Model Example write is this slice. First-Slice Automation Example write is this slice.
