# Inspect delete connection

Status: released

## Problem

Mac Connection inspector has `Delete Connection`. Web deletes only with Backspace after clicking `Command → Event Happened`. A member looking at From / To has no Inspector control to remove that Connection. Clicking Command, `Event Happened → Read Model`, TIME, or empty `.board` after that Connection click still leaves Inspector `Delete Connection`.

## Acceptance criteria

- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened`, the Inspector region shows a button whose accessible name is `Delete Connection`
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened`, then clicking the Timeline `Command` listitem, the Inspector region does not show a button whose accessible name is `Delete Connection`
- [x] After dragging from `Command port` onto `Event Happened port`, dragging from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Command → Event Happened`, then clicking the Timeline text `Event Happened → Read Model`, the Inspector region does not show a button whose accessible name is `Delete Connection`
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened`, then clicking `.time-chrome`, the Inspector region does not show a button whose accessible name is `Delete Connection`
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened`, then clicking `.board` at a point that is not a listitem, the Inspector region does not show a button whose accessible name is `Delete Connection`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — Inspector Delete Connection
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Backspace after clicking `Command → Event Happened` still deletes that Connection ([delete-blocks.md](./delete-blocks.md)). Showing Inspector `Delete Connection` is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Live Connection titles after rename are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Inserting Delete Connection after clicking `Event Happened → Read Model`. TIME click `Nothing Selected` and empty `.board` `Nothing Selected` stay [inspect-deselect.md](./inspect-deselect.md). Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-connection.md](./inspect-connection.md) — From / To inspect stays that file. Live titles after Name fill are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [delete-blocks.md](./delete-blocks.md) — Backspace still deletes the selected Connection. Inspector Delete Connection is this slice.
- [inspect-rest.md](./inspect-rest.md) — Naming hints, Slice type help, and ⇧⌘I stay not ported. Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [delete-rest.md](./delete-rest.md) — Actor / Event / Read Model / Automation Backspace stay that file. Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [connections.md](./connections.md) — Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [canvas.md](./canvas.md) — Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [add-on-lane.md](./add-on-lane.md) — Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [connection-feedback.md](./connection-feedback.md) — Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [inspect-description.md](./inspect-description.md) — Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [delete-event-read.md](./delete-event-read.md) — Event → Read Model Backspace stays that file. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — Field type / optional / example / delete stay that file. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [undo-rest.md](./undo-rest.md) — Undo of remaining delete stays that file. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Inspector Delete Connection is this slice.
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover Connection / From Command / To Event Happened after Command click stay that file. Leftover Delete Connection after Command click is this slice.
- [inspect-event-read.md](./inspect-event-read.md) — Leftover Add Field / Field name after `Event Happened → Read Model` stay that file. Leftover Delete Connection after `Event Happened → Read Model` is this slice. Inserting Delete Connection after that click stays Out of scope.
- [inspect-deselect.md](./inspect-deselect.md) — TIME click `Nothing Selected` and empty `.board` `Nothing Selected` stay that file. Leftover Delete Connection after TIME click and after empty `.board` click is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — GET `Nothing Selected` and TIME / empty board clear stay that file / [inspect-deselect.md](./inspect-deselect.md). Leftover Delete Connection after TIME click and after empty `.board` click is this slice.
- [product.md](../product.md) — Inspector Delete Connection is this slice. Naming hints, Slice type help, and ⇧⌘I stay not ported. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Playwright path for this slice adds: click `Command → Event Happened`, Inspector shows Delete Connection. After that click then the Timeline `Command` listitem, Inspector does not show Delete Connection.
