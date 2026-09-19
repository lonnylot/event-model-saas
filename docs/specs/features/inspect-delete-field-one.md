# Inspect delete field one

Status: validated

## Problem

`deleteField` sets `fields: []`. Mac `fields.removeAll { $0.id == field.id }`. Delete Field on a two-Field Command removes both. A member cannot remove only the selected Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills the first `Field name` with `orderId`, clicks `Add Field`, fills the second `Field name` with `sku`, and Saves, a reload of that page, clicking the Timeline `Command` listitem, clicking `Delete Field`, that Command `fields[0].name` is `sku`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `deleteField` in `public/delete-field.js` — Delete Field removes one Field
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Delete Field after reload of one Command (one Field) stays [inspect-get-delete-field.md](./inspect-get-delete-field.md). Delete Field of one of two Fields is this slice. After delete of the first Field, the remaining Field is `fields[0]` named `sku`.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

First-Slice Delete Field is [inspect-delete-field-first-slice.md](./inspect-delete-field-first-slice.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-second-field-name-write.md](./inspect-second-field-name-write.md) — Out of scope no longer parks Delete Field of one of two Fields; that is this slice.
- [inspect-get-delete-field.md](./inspect-get-delete-field.md) — Delete Field of one Field stays that file. Delete Field of one of two Fields is this slice.
- [inspect-in-session-delete-field-event.md](./inspect-in-session-delete-field-event.md) — Out of scope no longer parks Delete Field of one of two Fields; that is this slice.
- [product.md](../product.md) — Delete Field of one of two Fields is this slice.
- [architecture.md](../architecture.md) — Delete Field of one of two Fields is this slice.
