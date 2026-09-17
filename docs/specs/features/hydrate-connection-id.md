# Hydrate connection id

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after Save of `Command → Event Happened` hydrates a `.board` `p` with `data-kind` `connection` and no `data-id`. Backspace looks up `dataset.id`, so a member who reopens a model cannot delete that Connection: the caption vanishes and the JSON still has the edge.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, the `.board` `Command → Event Happened` node has a non-empty `data-id`
- [x] After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, clicking `Command → Event Happened`, pressing Backspace sets Event Model `connections` to `[]`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `handleRequest` — model page HTML hydrates `Command → Event Happened` copy with `data-id`
- `bindEditor` in `public/editor.js` — Backspace on that GET node
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `.board` still contains `Command → Event Happened` ([connection-on-board.md](./connection-on-board.md)). GET From/To inspect stays [inspect-rest.md](./inspect-rest.md). In-session Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). GET `data-id` and Backspace on that `Command → Event Happened` node are this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- After selection, Inspector may have focus, so delete is Backspace after clicking the selected Connection text (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event / Read Model / Automation still targets the last Slice ([blocks.md](./blocks.md)).
- Delete is in-memory until Save. Save still uses the version check from model-persistence.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Actor / Automation `data-id`. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md). Connection caption sitting beside the Slice as an extra column is leftover unused; wrapping below the Slice is [connection-caption.md](./connection-caption.md). Inspector leftover Type is [inspect-switch.md](./inspect-switch.md). Drawing Connections as canvas lines. Landing. Mac window chrome. Copy changes.

## Restates

- [connection-on-board.md](./connection-on-board.md) — `.board` still contains `Command → Event Happened`. GET `data-id` on that `Command → Event Happened` node is this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- [inspect-rest.md](./inspect-rest.md) — Clicking GET `Command → Event Happened` still shows From/To. Backspace on that GET node is this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- [delete-blocks.md](./delete-blocks.md) — In-session Command → Event Backspace stays that file. GET `Command → Event Happened` Backspace is this slice. GET `Event Happened → Read Model` Backspace is [hydrate-event-read-id.md](./hydrate-event-read-id.md). In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md).
- [connections.md](./connections.md) — Timeline still shows `Command → Event Happened` after reload. GET `Command → Event Happened` `data-id` is this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- [hydrate-kind-id.md](./hydrate-kind-id.md) — GET Actor / Automation `data-id` stays that file. GET `Command → Event Happened` `data-id` is this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET `Command → Event Happened` `data-id` is this slice. GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
