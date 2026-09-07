# Delete event read

Status: released

## Problem

Clicking `Event Happened → Read Model` then Backspace leaves the Connection in JSON and the caption on `.board`. Delete binds `selectedConnectionNode` only on `Command → Event Happened`, so a member cannot remove an Event → Read Model edge the Mac way.

## Acceptance criteria

- [x] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model` then the Timeline region, pressing Backspace sets Event Model `connections` to `[]`
- [x] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model` then the Timeline region, pressing Backspace, `.board` does not show the text `Event Happened → Read Model`

## Domain terms

Event Model, Slice, Event, Read Model, Connection, Team, Person

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — Backspace on `Event Happened → Read Model`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Clicking `Event Happened → Read Model` still shows From Event Happened / To Read Model ([inspect-rest.md](./inspect-rest.md)). In-session Backspace of `Event Happened → Read Model` is this slice. After selection, Inspector may have focus, so delete is Backspace after clicking the selected Connection then the Timeline region (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Delete is in-memory until Save.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET `Event Happened → Read Model` `data-id` is [hydrate-event-read-id.md](./hydrate-event-read-id.md). Leftover Add Field after that click. Landing. Mac window chrome. Copy changes.

## Restates

- [delete-blocks.md](./delete-blocks.md) — Command → Event Backspace stays that file. Event → Read Model Backspace is this slice.
- [inspect-rest.md](./inspect-rest.md) — Clicking `Event Happened → Read Model` still shows From/To. Backspace on that click-created node is this slice.
- [connections.md](./connections.md) — Timeline still shows `Event Happened → Read Model`. Deleting that Connection is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Event → Read Model Backspace is this slice.
- [hydrate-connection-id.md](./hydrate-connection-id.md) — GET `Command → Event Happened` Backspace stays that file. GET `Event Happened → Read Model` Backspace is [hydrate-event-read-id.md](./hydrate-event-read-id.md). In-session Event → Read Model Backspace is this slice.
- [hydrate-event-read-id.md](./hydrate-event-read-id.md) — GET `Event Happened → Read Model` `data-id` and GET `Event Happened → Read Model` Backspace are that file. In-session Event → Read Model Backspace is this slice.
- [inspect-connection.md](./inspect-connection.md) — Command → Event inspect stays that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [inspect-deselect.md](./inspect-deselect.md) — TIME chrome / empty `.board` deselect stays that file. In-session Event → Read Model Backspace after clicking the selected Connection then the Timeline region is this slice.
- [delete-rest.md](./delete-rest.md) — Actor / Event / Read Model / Automation Backspace stays that file. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [canvas.md](./canvas.md) — Slice Backspace stays that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — Field type / optional / example / delete stay that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [product.md](../product.md) — Delete the selected Command → Event Connection (Backspace) stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice. Playwright path for this slice adds: drag Event Happened port onto Read Model port, click `Event Happened → Read Model` then the Timeline region, Backspace sets connections to [], `.board` does not show `Event Happened → Read Model`.
- [add-on-lane.md](./add-on-lane.md) — Lane Add and ⌥⌘2 stay that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [connection-feedback.md](./connection-feedback.md) — Highlighting legal targets stays that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [inspect-description.md](./inspect-description.md) — Last-item Description stays that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — Description-by-id stays that file. Command → Event Connection Backspace stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
- [undo-rest.md](./undo-rest.md) — Undo of remaining delete stays that file. Command → Event Delete Connection stays [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is this slice.
