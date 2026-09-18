# Inspect command field optional first slice

Status: released

## Problem

`setFieldOptional` still searches only `slices.at(-1)` even when Command id is passed. GET Optional write of two Commands on one Slice already binds id. A member who reopens a first-Slice Command cannot change that Field's Optional.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Command on lane` on that Slice, clicks the Timeline `Command` listitem of the first Slice, clicks `Add Field`, checks `Optional`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, checks `Optional`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, unchecking `Optional`, clicking the Timeline `Cancel Order` listitem shows Inspector `Optional` checked

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `setFieldOptional` in `public/set-field-optional.js` — GET Command Optional write on the first of two Slices
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Optional write of the first of two Commands on the last Slice stays [inspect-command-optional-write.md](./inspect-command-optional-write.md). First-Slice Command Optional write is this slice. First-Slice Command Example write is [inspect-command-field-example-first-slice.md](./inspect-command-field-example-first-slice.md). First-Slice Event Optional write is [inspect-event-field-optional-first-slice.md](./inspect-event-field-optional-first-slice.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

First-Slice Command Example write is [inspect-command-field-example-first-slice.md](./inspect-command-field-example-first-slice.md). First-Slice Event Optional write is [inspect-event-field-optional-first-slice.md](./inspect-event-field-optional-first-slice.md). Second Field Optional is [inspect-command-second-field-optional.md](./inspect-command-second-field-optional.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-command-optional-write.md](./inspect-command-optional-write.md) — Two Commands on the last Slice stay that file. First-Slice Command Optional write is this slice.
- [inspect-command-field-type-first-slice.md](./inspect-command-field-type-first-slice.md) — First-Slice Command Field type write stays that file.
- [product.md](../product.md) — GET Optional write of a Command on the first of two Slices is this slice.
- [architecture.md](../architecture.md) — First-Slice Command Optional write is this slice.
