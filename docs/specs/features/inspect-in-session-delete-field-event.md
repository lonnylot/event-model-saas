# Inspect in-session delete field event

Status: released

## Problem

In-session Event re-click does not call `bindDeleteField`. The Add Field Delete Field listener passes Event id as `undefined`. Mac trash stays on the Field row. A member cannot delete that Event's Field after clicking away without adding another Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, clicks the Timeline `Actor` listitem, clicks the Timeline `Event Happened` listitem, the Inspector region shows a button whose accessible name is `Delete Field`

## Domain terms

Event Model, Slice, Event, Actor, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — in-session Event Delete Field after Actor unbind
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- In-session Command Delete Field after Actor unbind stays [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md). GET Event Delete Field write of the first of two Events stays [inspect-delete-field-event-write.md](./inspect-delete-field-event-write.md). In-session Event Delete Field after Actor unbind is this slice. The missing button and the missing Event id share one `bindDeleteField` arm.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

In-session Read Model / Automation Delete Field. Delete Field of one of two Fields is [inspect-delete-field-one.md](./inspect-delete-field-one.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md) — Command re-click Delete Field stays that file. Event re-click is this slice.
- [inspect-delete-field-event-write.md](./inspect-delete-field-event-write.md) — GET first of two Events Delete Field stays that file.
- [product.md](../product.md) — In-session Event Delete Field after Actor unbind is this slice.
