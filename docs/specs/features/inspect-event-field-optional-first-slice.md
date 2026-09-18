# Inspect event field optional first slice

Status: validated

## Problem

`setFieldOptional` for Event / Read Model / Automation uses last Slice last block `fields[0]` and ignores id. Checking Optional on a first-Slice Event, Read Model, or Automation flips the last block of that kind. Mac toggles the bound Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Event on lane` on that Slice, clicks the Timeline `Event Happened` listitem of the first Slice, clicks `Add Field`, checks `Optional`, fills `Name` with `Order Placed`, clicks `Add Event`, clicks the last Timeline `Event Happened` listitem, clicks `Add Field`, checks `Optional`, fills `Name` with `Order Cancelled`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem, unchecking `Optional`, clicking the Timeline `Order Cancelled` listitem shows Inspector `Optional` checked
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Read Model on lane` on that Slice, clicks the Timeline `Read Model` listitem of the first Slice, clicks `Add Field`, checks `Optional`, fills `Name` with `Orders`, clicks `Add Read Model`, clicks the last Timeline `Read Model` listitem, clicks `Add Field`, checks `Optional`, fills `Name` with `Cancellations`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem, unchecking `Optional`, clicking the Timeline `Cancellations` listitem shows Inspector `Optional` checked
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Automation on lane` on that Slice, clicks the Timeline `Automation` listitem of the first Slice, clicks `Add Field`, checks `Optional`, fills `Name` with `Send Email`, clicks `Add Automation`, clicks the last Timeline `Automation` listitem, clicks `Add Field`, checks `Optional`, fills `Name` with `Send SMS`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem, unchecking `Optional`, clicking the Timeline `Send SMS` listitem shows Inspector `Optional` checked

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `setFieldOptional` in `public/set-field-optional.js` — GET Event Optional write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Optional of one Event stays [inspect-get-event-optional.md](./inspect-get-event-optional.md). First-Slice Event Optional write is this slice. GET Optional of one Read Model stays [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). First-Slice Read Model Optional write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-get-event-optional.md](./inspect-get-event-optional.md) — Optional after reload of one Event stays that file. First-Slice Event Optional write is this slice.
- [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md) — Optional after reload of one Read Model stays that file. First-Slice Read Model Optional write is this slice.
- [inspect-command-field-optional-first-slice.md](./inspect-command-field-optional-first-slice.md) — First-Slice Command Optional stays that file.
- [product.md](../product.md) — GET Optional write of an Event on the first of two Slices is this slice. GET Optional write of a Read Model on the first of two Slices is this slice.
- [architecture.md](../architecture.md) — First-Slice Event Optional write is this slice. First-Slice Read Model Optional write is this slice.
