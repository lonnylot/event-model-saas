# Inspect switch

Status: released

## Problem

Clicking a Connection after a Slice leaves Inspector Type on screen. Clicking `Command → Event Happened` after `Event Happened → Read Model` leaves `From Event Happened` stacked above `From Command` and `To Read Model` stacked next to `To Event Happened`. Clicking `Command → Event Happened` after Command `Add Field` leaves Field name, Field type, Optional, Example, and Delete Field, so Inspector no longer matches the selected Connection.

## Acceptance criteria

- [x] After clicking the Timeline `New Slice` listitem, then dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, the Inspector region does not show a combobox whose accessible name is `Type`
- [x] After clicking the Timeline `New Slice` listitem, then dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, the Inspector region does not show a combobox whose accessible name is `Type`
- [x] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, then dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, the Inspector region does not show the text `From Event Happened`
- [x] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, then dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, the Inspector region does not show the text `To Read Model`
- [x] After clicking the Timeline `Command` listitem, then clicking `Command → Event Happened`, the Inspector region does not show a button whose accessible name is `Add Field`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, then clicking `Command → Event Happened`, the Inspector region does not show a textbox whose accessible name is `Field name`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, then clicking `Command → Event Happened`, the Inspector region does not show a combobox whose accessible name is `Field type`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, then clicking `Command → Event Happened`, the Inspector region does not show a checkbox whose accessible name is `Optional`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, then clicking `Command → Event Happened`, the Inspector region does not show a textbox whose accessible name is `Example`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, then clicking `Command → Event Happened`, the Inspector region does not show a button whose accessible name is `Delete Field`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — leftover Inspector Type after a Connection click; leftover From Event Happened, leftover To Read Model, leftover Add Field, leftover Field name, leftover Field type, leftover Optional, leftover Example, and leftover Delete Field after `Command → Event Happened`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Clicking Timeline `New Slice` still shows Inspector Type ([slice-type.md](./slice-type.md)). Clicking `Command → Event Happened` still shows Connection / From Command / To Event Happened ([inspect-connection.md](./inspect-connection.md)). Clicking `Event Happened → Read Model` still shows From Event Happened and To Read Model ([inspect-rest.md](./inspect-rest.md)). Clicking Command still shows `Add Field` ([inspect-fields.md](./inspect-fields.md)). Leftover Type after a Connection click, leftover From Event Happened, leftover To Read Model, leftover Add Field, leftover Field name, leftover Field type, leftover Optional, leftover Example, and leftover Delete Field after `Command → Event Happened` is this slice. Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Leftover Connection copy after clicking Command is [leftover-connection-command.md](./leftover-connection-command.md).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Shortcut listitem `data-kind` is [shortcut-kind.md](./shortcut-kind.md). Connection copy as a flex sibling of `.slice-col`. Narrow viewport layout is [editor-narrow.md](./editor-narrow.md). Leftover Connection copy after clicking Command is [leftover-connection-command.md](./leftover-connection-command.md). Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-connection.md](./inspect-connection.md) — Clicking `Command → Event Happened` still shows Connection / From Command / To Event Happened. Inspector Type after that click is leftover unused; this slice drops it.
- [inspect-rest.md](./inspect-rest.md) — Clicking `Event Happened → Read Model` still shows From Event Happened and To Read Model. Those texts remaining after a later click on `Command → Event Happened` are leftover unused; this slice drops them.
- [slice-type.md](./slice-type.md) — Clicking Timeline `New Slice` still shows Type. Type after switching to a Connection is this slice.
- [inspect-fields.md](./inspect-fields.md) — Clicking Command still shows `Add Field`. `Add Field` after `Command → Event Happened` is this slice. Leftover Field name / Field type / Optional / Example / Delete Field after `Add Field` then `Command → Event Happened` is this slice. Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Leftover Inspector Type after a Connection click, leftover From Event Happened, leftover To Read Model, leftover Add Field, leftover Field name, leftover Field type, leftover Optional, leftover Example, and leftover Delete Field after `Command → Event Happened` click is this slice.
