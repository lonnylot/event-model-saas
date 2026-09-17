# Inspect command field example first slice

Status: released

## Problem

`setFieldExample` still searches only `slices.at(-1)` even when Command id is passed. GET Example write of two Commands on one Slice already binds id. A member who reopens a first-Slice Command cannot change that Field's Example.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Command on lane` on that Slice, clicks the Timeline `Command` listitem of the first Slice, clicks `Add Field`, fills `Example` with `abc`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, fills `Example` with `xyz`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, filling `Example` with `one`, clicking the Timeline `Cancel Order` listitem shows Inspector `Example` with the value `xyz`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldExample` in `public/set-field-example.js` — GET Command Example write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Example write of the first of two Commands on the last Slice stays [inspect-command-example-write.md](./inspect-command-example-write.md). First-Slice Command Example write is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

First-Slice Command Optional write is [inspect-command-field-optional-first-slice.md](./inspect-command-field-optional-first-slice.md). Second Field Example is [inspect-command-second-field-example.md](./inspect-command-second-field-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-command-example-write.md](./inspect-command-example-write.md) — Two Commands on the last Slice stay that file. First-Slice Command Example write is this slice.
- [inspect-command-field-optional-first-slice.md](./inspect-command-field-optional-first-slice.md) — First-Slice Command Optional write stays that file.
- [product.md](../product.md) — GET Example write of a Command on the first of two Slices is this slice.
- [architecture.md](../architecture.md) — First-Slice Command Example write is this slice.
