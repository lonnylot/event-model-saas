# Inspect command second field example

Status: released

## Problem

`setFieldExample` always writes `fields[0]`. Filling Example on the second Field overwrites the first. Mac has an Example text field per Field row.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Example` with `abc`, fills the first `Field name` with `orderId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Command` listitem, filling the second `Example` with `sku1`, clicking away and the Timeline `Command` listitem shows the first Inspector `Example` with the value `abc`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldExample` in `public/set-field-example.js` — GET second Command Field Example write
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- First Field Example stays [inspect-command-example-write.md](./inspect-command-example-write.md). Second Field Example write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Second Event Example. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-command-example-write.md](./inspect-command-example-write.md) — First Field Example stays that file. Second Field Example is this slice.
- [inspect-command-second-field-optional.md](./inspect-command-second-field-optional.md) — Second Field Optional stays that file. GET second Command Field Example write is this slice.
- [inspect-command-second-field-type.md](./inspect-command-second-field-type.md) — Out of scope no longer parks Second Field Example; GET second Command Field Example write is this slice.
- [product.md](../product.md) — GET second Command Field Example write is this slice.
- [architecture.md](../architecture.md) — GET second Command Field Example write is this slice.
