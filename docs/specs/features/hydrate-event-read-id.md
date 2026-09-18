# Hydrate event read id

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after Save of `Event Happened → Read Model` hydrates a `.board` `p` with `data-kind` `connection` and no `data-id`. Backspace looks up `dataset.id`, so a member who reopens a model cannot delete that Connection: the caption vanishes and the JSON still has the edge.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks `Add Read Model`, drags `Event Happened port` onto `Read Model port`, and Saves, a reload of that page, the `.board` `Event Happened → Read Model` node has a non-empty `data-id`
- [x] After a member creates a model, opens it, clicks `Add Event`, clicks `Add Read Model`, drags `Event Happened port` onto `Read Model port`, and Saves, a reload of that page, clicking `Event Happened → Read Model` then the Timeline region, pressing Backspace sets Event Model `connections` to `[]`

## Domain terms

Event Model, Slice, Event, Read Model, Connection, Team, Person, Version

## Seams

- `modelPageHtml` in `src/teams/pages.ts` — hydrates Event → Read Model copy with `data-id`
- `bindKeyboard` in `public/editor-keyboard.js` — Backspace on that GET node
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `.board` still contains `Event Happened → Read Model` ([connection-on-board.md](./connection-on-board.md)). GET From/To inspect stays [inspect-rest.md](./inspect-rest.md). In-session Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). GET `Command → Event Happened` `data-id` is [hydrate-connection-id.md](./hydrate-connection-id.md). GET `data-id` and Backspace on `Event Happened → Read Model` are this slice. In-session Event → Read Model `data-id` is [connection-event-read-id.md](./connection-event-read-id.md).
- After selection, Inspector may have focus, so delete is Backspace after clicking the Timeline region.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). With no Slice selected, toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Delete is in-memory until Save. Save still uses the version check from model-persistence.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET `Command → Event Happened` `data-id` is [hydrate-connection-id.md](./hydrate-connection-id.md). GET Actor / Automation `data-id` is [hydrate-kind-id.md](./hydrate-kind-id.md). In-session Event → Read Model `data-id` is [connection-event-read-id.md](./connection-event-read-id.md). Connection caption as a flex sibling of `.slice-col`. Leftover Add Field after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Landing. Mac window chrome. Copy changes.

## Restates

- [connection-on-board.md](./connection-on-board.md) — `.board` still contains `Event Happened → Read Model`. GET `data-id` on that node is this slice.
- [inspect-rest.md](./inspect-rest.md) — Clicking GET `Event Happened → Read Model` still shows From/To. Backspace on that GET node is this slice.
- [delete-blocks.md](./delete-blocks.md) — In-session Command → Event Backspace stays that file. In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). GET `Event Happened → Read Model` Backspace is this slice.
- [connections.md](./connections.md) — Timeline still shows `Event Happened → Read Model` after reload. GET `data-id` and GET `Event Happened → Read Model` Backspace are this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET `Event Happened → Read Model` `data-id` is this slice. GET `Event Happened → Read Model` Backspace is this slice.
- [hydrate-connection-id.md](./hydrate-connection-id.md) — GET `Command → Event Happened` `data-id` and GET `Command → Event Happened` Backspace stay that file. GET `Event Happened → Read Model` `data-id` and GET `Event Happened → Read Model` Backspace are this slice.
- [hydrate-kind-id.md](./hydrate-kind-id.md) — GET Actor / Automation `data-id` stays that file. GET `Event Happened → Read Model` `data-id` is this slice.
- [delete-event-read.md](./delete-event-read.md) — In-session Event → Read Model Backspace stays that file. GET `Event Happened → Read Model` `data-id` and GET `Event Happened → Read Model` Backspace are this slice.
