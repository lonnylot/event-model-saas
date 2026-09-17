# Leftover field chrome switch

Status: released

## Problem

Unbind-then-rebind of Field chrome runs only for GET-rendered listitems. Add Field on an Event, then click a new Command: Field name and Delete Field stay as if they belong to the Command. Mac `FieldsEditor` is only on the selected element.

## Acceptance criteria

- [x] After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, clicking `Add Field`, clicking `Add Command`, clicking the Timeline `Command` listitem, the Inspector region does not show a textbox whose accessible name is `Field name`
- [x] After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, clicking `Add Field`, clicking `Add Command`, clicking the Timeline `Command` listitem, the Inspector region does not show a button whose accessible name is `Delete Field`

## Domain terms

Event Model, Slice, Command, Event, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — leftover Field name and leftover Delete Field after in-session Event → Command click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Leftover Field chrome after `Command → Event Happened` stays [inspect-switch.md](./inspect-switch.md). Leftover Field name / leftover Delete Field after Event → Command in-session click is this slice. Leftover Field type / Optional / Example after that click stay later.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET-rendered unbind stays [inspect-switch.md](./inspect-switch.md). Leftover Field type / Optional / Example after Event → Command in-session click stay later. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-switch.md](./inspect-switch.md) — Leftover Field chrome after Connection click stays that file. Leftover Field name / leftover Delete Field after Event → Command in-session click is this slice. Leftover Field type / Optional / Example after that click stay later.
- [inspect-fields.md](./inspect-fields.md) — Add Field on the selected Command stays that file.
- [product.md](../product.md) — Leftover Field name / leftover Delete Field after in-session Event → Command click is this slice.
- [architecture.md](../architecture.md) — Leftover Field name / leftover Delete Field after in-session Event → Command click is this slice.
