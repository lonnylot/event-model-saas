# Inspect command second field optional

Status: validated

## Problem

`setFieldOptional` always writes `fields[0]`. Checking Optional on the second Field flips the first. Mac has a Toggle per Field row.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, checks `Optional`, fills the first `Field name` with `orderId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Command` listitem, unchecking the second `Optional`, clicking away and the Timeline `Command` listitem shows the first Inspector `Optional` checked

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldOptional` in `public/set-field-optional.js` — GET second Command Field Optional write
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- First Field Optional stays [inspect-command-optional-write.md](./inspect-command-optional-write.md). Second Field Optional write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Second Field Example. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-command-optional-write.md](./inspect-command-optional-write.md) — First Field Optional stays that file. Second Field Optional is this slice.
- [inspect-command-second-field-type.md](./inspect-command-second-field-type.md) — Second Field type stays that file.
- [product.md](../product.md) — GET second Command Field Optional write is this slice.
- [architecture.md](../architecture.md) — GET second Command Field Optional write is this slice.
