# Leftover field chrome switch

Status: validated

## Problem

Unbind-then-rebind of Field chrome runs only for GET-rendered listitems. Add Field on an Event, then click a new Command: Field name / type / Optional / Example / Delete Field stay as if they belong to the Command. Mac `FieldsEditor` is only on the selected element.

## Acceptance criteria

- [x] After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, clicking `Add Field`, clicking `Add Command`, clicking the Timeline `Command` listitem, the Inspector region does not show a textbox whose accessible name is `Field name`
- [x] After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, clicking `Add Field`, clicking `Add Command`, clicking the Timeline `Command` listitem, the Inspector region does not show a button whose accessible name is `Delete Field`

## Domain terms

Event Model, Slice, Command, Event, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — leftover Field chrome after in-session selection change
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Leftover Field chrome after `Command → Event Happened` stays [inspect-switch.md](./inspect-switch.md). Leftover Field chrome after Event → Command in-session click is this slice. The new Command has no Field yet, so Inspector must not keep the Event Field row.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET-rendered unbind stays [inspect-switch.md](./inspect-switch.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-switch.md](./inspect-switch.md) — Leftover Field chrome after Connection click stays that file. Leftover Field chrome after Event → Command in-session click is this slice.
- [inspect-fields.md](./inspect-fields.md) — Add Field on the selected Command stays that file.
- [product.md](../product.md) — Leftover Field chrome after in-session Event → Command click is this slice.
- [architecture.md](../architecture.md) — Leftover Field chrome after in-session Event → Command click is this slice.
