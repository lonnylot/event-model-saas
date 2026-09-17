# Inspect connection event read titles

Status: validated

## Problem

Inspector From / To and Timeline Event → Read Model text stay the Add defaults `Event Happened` and `Read Model`. Command → Event live titles already follow Name. Mac `title(ofElement:)` follows both ends. After a member names those blocks, they cannot click or read the Connection by those names.

## Acceptance criteria

- [x] After dragging from `Event Happened port` onto `Read Model port`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, filling the Timeline `Read Model` listitem Inspector `Name` with `Orders`, the Timeline region shows the text `Order Placed → Orders`
- [x] After dragging from `Event Happened port` onto `Read Model port`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, filling the Timeline `Read Model` listitem Inspector `Name` with `Orders`, clicking the Timeline text `Order Placed → Orders` shows the text `From Order Placed` in the Inspector region
- [x] After dragging from `Event Happened port` onto `Read Model port`, filling the Timeline `Event Happened` listitem Inspector `Name` with `Order Placed`, filling the Timeline `Read Model` listitem Inspector `Name` with `Orders`, clicking the Timeline text `Order Placed → Orders` shows the text `To Orders` in the Inspector region

## Domain terms

Event Model, Slice, Event, Read Model, Connection, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — Event → Read Model caption and From / To use current titles
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- At Add defaults, clicking `Event Happened → Read Model` still shows From Event Happened / To Read Model ([inspect-rest.md](./inspect-rest.md)). Command → Event live titles stay [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice. In-session `data-id` is [connection-event-read-id.md](./connection-event-read-id.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Command → Event live titles are [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes other than these titles.

## Restates

- [inspect-connection-live-titles.md](./inspect-connection-live-titles.md) — Out of scope no longer parks Event → Read Model live titles; those titles are this slice. Command → Event live titles stay that file.
- [inspect-rest.md](./inspect-rest.md) — Default-title Event → Read Model inspect stays that file. Live titles after Name fill are this slice.
- [connections.md](./connections.md) — Command → Event live caption stays [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice.
- [connection-on-board.md](./connection-on-board.md) — Connection text living in `.board` stays that file. Command → Event live titles stay [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice.
- [inspect-delete-connection.md](./inspect-delete-connection.md) — Inspector Delete Connection stays that file. Command → Event live titles stay [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice.
- [connection-event-read-id.md](./connection-event-read-id.md) — In-session `data-id` stays that file. Event → Read Model live titles after Name fill are this slice.
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover default From Command / To Event Happened after Command click stays that file. Command → Event live titles stay [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice.
- [inspect-connection.md](./inspect-connection.md) — Default-title Command → Event inspect stays that file. Command → Event live titles stay [inspect-connection-live-titles.md](./inspect-connection-live-titles.md). Event → Read Model live titles after Name fill are this slice.
- [product.md](../product.md) — Inspect an Event → Read Model after rename uses current Event and Read Model titles.
- [architecture.md](../architecture.md) — Event → Read Model live titles are this slice.
