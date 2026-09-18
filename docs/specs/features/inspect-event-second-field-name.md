# Inspect event second field name

Status: validated

## Problem

`bindSecondFieldName` is Command-only. Event / Read Model / Automation `setFieldName` always writes `fields[0]`. Mac `ForEach($fields)` binds each Field. A member cannot rename the second Field on an Event.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, fills the first `Field name` with `eventId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Event Happened` listitem, filling the second Inspector `Field name` with `sku` sets that Event `fields[1].name` to `sku`
- [x] After a member creates a model, opens it, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, clicks `Add Field`, fills the first `Field name` with `viewId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Read Model` listitem, filling the second Inspector `Field name` with `sku` sets that Read Model `fields[1].name` to `sku`
- [ ] After a member creates a model, opens it, clicks `Add Automation`, clicks the Timeline `Automation` listitem, clicks `Add Field`, fills the first `Field name` with `jobId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Automation` listitem, filling the second Inspector `Field name` with `sku` sets that Automation `fields[1].name` to `sku`

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `setFieldName` in `public/set-field-name.js` — GET second Event Field name write
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET second Command Field name write stays [inspect-second-field-name-write.md](./inspect-second-field-name-write.md). GET second Event Field name write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Second Field type / optional / example. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-second-field-name-write.md](./inspect-second-field-name-write.md) — Second Command Field name stays that file. Second Event Field name is this slice.
- [inspect-event-field-name-first-slice.md](./inspect-event-field-name-first-slice.md) — First Event Field name on the first Slice stays that file.
- [product.md](../product.md) — GET second Event Field name write is this slice.
- [architecture.md](../architecture.md) — GET second Event Field name write is this slice.
