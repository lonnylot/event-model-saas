# Inspect command field type first slice

Status: validated

## Problem

`setFieldType` still starts at `slices.at(-1)`. GET Field type write of a Command on the first of two Slices misses. Two Commands on the last Slice already write by id. A member who reopens a model cannot change that first-Slice Command's Field type.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Command on lane` on that Slice, clicks the Timeline `Command` listitem of the first Slice, clicks `Add Field`, selects `UUID` in `Field type`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, selects `Boolean` in `Field type`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, selecting `String` in `Field type`, clicking the Timeline `Cancel Order` listitem shows Inspector `Field type` with the value `Boolean`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldType` in `public/set-field-type.js` — GET Command Field type write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Field type write of the first of two Commands on the last Slice stays [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md). First-Slice Command Field type write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Field name write of a Command on the first of two Slices. Second Field type. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md) — Two Commands on the last Slice stay that file. First-Slice Command Field type write is this slice.
- [inspect-fields.md](./inspect-fields.md) — Last-Command Field type stays that file. First-Slice Command Field type write is this slice.
- [inspect-command-field-name-first-slice.md](./inspect-command-field-name-first-slice.md) — First-Slice Command Field name write stays that file. First-Slice Command Field type write is this slice.
- [product.md](../product.md) — GET Field type write of a Command on the first of two Slices is this slice.
