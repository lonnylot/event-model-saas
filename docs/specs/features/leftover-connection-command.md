# Leftover connection command

Status: released

## Problem

Clicking a Timeline `Command` listitem after `Command → Event Happened` leaves Inspector `Connection`, `From Command`, and `To Event Happened`. Inspect-switch unbinds Type / Add Field / Field chrome on that Connection click, not leftover Connection copy after switching to a Command, so Inspector no longer matches the selected Command.

## Acceptance criteria

- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Command` listitem, the Inspector region does not show the text `From Command`
- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Command` listitem, the Inspector region does not show the text `To Event Happened`
- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Command` listitem, the Inspector region does not show the text `Connection`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — leftover Connection copy after Command click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Clicking `Command → Event Happened` still shows Connection / From Command / To Event Happened ([inspect-connection.md](./inspect-connection.md)). Live titles after Name fill are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Leftover Type / leftover Add Field after that click stays [inspect-switch.md](./inspect-switch.md). Leftover default From Command / To Event Happened after clicking Command is this slice. Inspector empty after Command Backspace is [inspect-after-delete.md](./inspect-after-delete.md).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor / Event / Read Model / Automation still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Live titles after Name fill are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Leftover Field type / Optional / Example / Delete Field after `Event Happened → Read Model` is [inspect-event-read-fields.md](./inspect-event-read-fields.md). Leftover Delete Connection after Command click is [inspect-delete-connection.md](./inspect-delete-connection.md). TIME click empty Inspector is [inspect-deselect.md](./inspect-deselect.md). Inspector empty after Command Backspace is [inspect-after-delete.md](./inspect-after-delete.md). Landing. Mac window chrome. Copy changes other than leftover default From / To / Connection.

## Restates

- [inspect-connection.md](./inspect-connection.md) — Clicking `Command → Event Happened` still shows Connection / From Command / To Event Happened. Live titles after Name fill are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Those default texts remaining after a later Command click are leftover unused; this slice drops them. Leftover Delete Connection after Command click is [inspect-delete-connection.md](./inspect-delete-connection.md).
- [inspect-switch.md](./inspect-switch.md) — Leftover Type / leftover Add Field / leftover Field chrome after `Command → Event Happened` stay that file. Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Leftover Field type / Optional / Example / Delete Field after `Event Happened → Read Model` is [inspect-event-read-fields.md](./inspect-event-read-fields.md). Leftover Connection copy after Command click is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Clicking Command still opens Inspector Name. Leftover Connection copy after that click is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Leftover Connection copy after Command click is this slice.
