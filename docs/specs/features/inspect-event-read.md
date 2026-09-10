# Inspect event read

Status: released

## Problem

Clicking `Event Happened → Read Model` after Command `Add Field` leaves Inspector `Add Field` and Field name. Inspect-switch unbinds those controls on `Command → Event Happened` only, so Inspector no longer matches the selected Connection.

## Acceptance criteria

- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, the Inspector region does not show a button whose accessible name is `Add Field`
- [x] After clicking the Timeline `Command` listitem, clicking `Add Field`, dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, the Inspector region does not show a textbox whose accessible name is `Field name`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Field, Team, Person

## Seams

- `bindInspect` in `public/editor-inspect.js` — leftover Add Field and Field name after `Event Happened → Read Model`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Clicking Command still shows `Add Field` ([inspect-fields.md](./inspect-fields.md)). Clicking `Event Happened → Read Model` still shows From Event Happened / To Read Model ([inspect-rest.md](./inspect-rest.md)). Leftover Type after that click stays [inspect-switch.md](./inspect-switch.md). Leftover Add Field / Field name after `Command → Event Happened` stays that file. Leftover Add Field / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor / Event / Read Model / Automation still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Leftover Type after a Connection. Leftover Field type / Optional / Example / Delete Field after `Event Happened → Read Model` is [inspect-event-read-fields.md](./inspect-event-read-fields.md). Leftover Delete Connection after `Event Happened → Read Model` is [inspect-delete-connection.md](./inspect-delete-connection.md). TIME click empty Inspector. GET Connection `data-id`. Shortcut ports. Narrow viewport. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-switch.md](./inspect-switch.md) — Leftover Type after a Connection click and leftover Add Field / Field chrome after `Command → Event Happened` stay that file. Leftover Add Field / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
- [inspect-fields.md](./inspect-fields.md) — Clicking Command still shows `Add Field`. `Add Field` / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
- [inspect-rest.md](./inspect-rest.md) — Clicking `Event Happened → Read Model` still shows From Event Happened / To Read Model. Leftover Add Field / Field name after that click is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md). Leftover Delete Connection after that click is [inspect-delete-connection.md](./inspect-delete-connection.md).
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover Connection copy after Command click stays that file. Leftover Add Field / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. Leftover Add Field / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Leftover Add Field / Field name after `Event Happened → Read Model` is this slice. Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
