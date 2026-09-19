# Inspect command second field type

Status: released

## Problem

`setFieldType` Command-with-id finds the Command across slices and always writes `fields[0]`. Second Field name already uses `fieldIndex`. Mac binds each Field's type picker. Changing type on the second Field overwrites the first.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, selects `UUID` in `Field type`, fills the first `Field name` with `orderId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Command` listitem, selecting `Boolean` in the second `Field type`, clicking away and the Timeline `Command` listitem shows the first Inspector `Field type` with the value `UUID`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldType` in `public/set-field-type.js` — GET second Command Field type write
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET second Field name write stays [inspect-second-field-name-write.md](./inspect-second-field-name-write.md). First Field type stays [inspect-fields.md](./inspect-fields.md). Second Field type write is this slice. Two Field names after reload stay [inspect-get-second-field.md](./inspect-get-second-field.md) display. GET second Command Field Optional write is [inspect-command-second-field-optional.md](./inspect-command-second-field-optional.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET second Command Field Optional write is [inspect-command-second-field-optional.md](./inspect-command-second-field-optional.md). Second Field Example. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-second-field-name-write.md](./inspect-second-field-name-write.md) — Second Field name stays that file. Second Field type is this slice.
- [inspect-command-field-type-first-slice.md](./inspect-command-field-type-first-slice.md) — Out of scope no longer parks second Field type; that is this slice.
- [inspect-event-second-field-name.md](./inspect-event-second-field-name.md) — Out of scope no longer parks unqualified Second Field type; GET second Command Field type write is this slice. Second Event Field type / optional / example stay later.
- [product.md](../product.md) — GET second Command Field type write is this slice.
- [architecture.md](../architecture.md) — GET second Command Field type write is this slice.
