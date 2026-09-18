# Inspect command field name first slice

Status: released

## Problem

`setFieldName` still starts at `slices.at(-1)`. GET Field name write of a Command on the first of two Slices misses. Mac binds the selected element's Field. A member who reopens a model cannot rename that Command's Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Command on lane` on that Slice, clicks the Timeline `Command` listitem of the first Slice, clicks `Add Field`, fills `Name` with `Place Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, filling Inspector `Field name` with `orderId` sets that Command `fields[0].name` to `orderId`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldName` in `public/set-field-name.js` — GET Command Field name write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Add Field on a Command in the first of two Slices stays [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md). GET second Field name write on one Command stays [inspect-second-field-name-write.md](./inspect-second-field-name-write.md). GET Field name write of a Command on the first of two Slices is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Field type write of a Command on the first of two Slices is [inspect-command-field-type-first-slice.md](./inspect-command-field-type-first-slice.md). Event / Read Model / Automation Field name on the first of two Slices is [inspect-event-field-name-first-slice.md](./inspect-event-field-name-first-slice.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-fields.md](./inspect-fields.md) — Last-Command Field name stays that file. First-Slice Command Field name write is this slice.
- [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md) — Add Field on that Command stays that file. Field name write after reload is this slice.
- [inspect-second-field-name-write.md](./inspect-second-field-name-write.md) — Second Field name on one Command stays that file.
- [product.md](../product.md) — GET Field name write of a Command on the first of two Slices is this slice.
