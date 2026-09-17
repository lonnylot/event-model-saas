# Inspect connection live titles

Status: released

## Problem

Inspector From / To and Timeline Connection text stay the Add defaults `Command` and `Event Happened`. Mac `title(ofElement:)` follows the current Command and Event names. After a member names those blocks, they cannot click or read the Connection by those names.

## Acceptance criteria

- [x] After dragging from `Command port` onto `Event Happened port`, filling the Timeline `Command` listitem Inspector `Name` with `Place Order`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, the Timeline region shows the text `Place Order → Order Placed`
- [x] After dragging from `Command port` onto `Event Happened port`, filling the Timeline `Command` listitem Inspector `Name` with `Place Order`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, clicking the Timeline text `Place Order → Order Placed` shows the text `From Place Order` in the Inspector region
- [x] After dragging from `Command port` onto `Event Happened port`, filling the Timeline `Command` listitem Inspector `Name` with `Place Order`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, clicking the Timeline text `Place Order → Order Placed` shows the text `To Order Placed` in the Inspector region

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — Connection caption and From / To use current titles
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- At Add defaults, clicking `Command → Event Happened` still shows Connection / From Command / To Event Happened ([inspect-connection.md](./inspect-connection.md)). Command → Event live titles after Name fill are this slice. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Delete Connection button. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md). Connection redo of a selected pair is [redo-connection-pair.md](./redo-connection-pair.md). Port highlight of the hovered Event. TIME click empty Inspector. Landing. Mac window chrome. Copy changes other than these titles.

## Restates

- [inspect-connection.md](./inspect-connection.md) — Default-title inspect stays that file. Command → Event live titles after Name fill are this slice. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover default From Command / To Event Happened after Command click stays that file.
- [connection-on-board.md](./connection-on-board.md) — Connection text living in `.board` stays that file. Command → Event live titles are this slice. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).
- [inspect-delete-connection.md](./inspect-delete-connection.md) — Inspector Delete Connection stays that file. Command → Event live titles after Name fill are this slice. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).
- [product.md](../product.md) — Inspect a Connection after rename uses current Command and Event titles. Inspect an Event → Read Model after rename uses current Event and Read Model titles ([inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md)).
- [connections.md](./connections.md) — Command → Event live caption is this slice. Event → Read Model live titles are [inspect-connection-event-read-titles.md](./inspect-connection-event-read-titles.md).
