# Connection event read id

Status: validated

## Problem

In-session Event → Read Model paints a `.board` `p` with no `data-id` and skips a second caption (`includes` guard). GET hydrate already sets `data-id`. Mac connections are UUID edges. A member cannot Backspace or inspect that in-session edge by id, and a second Event → Read Model is invisible.

## Acceptance criteria

- [x] After dragging from `Event Happened port` onto `Read Model port`, the `.board` `Event Happened → Read Model` node has a non-empty `data-id`
- [ ] After dragging from `Event Happened port` onto `Read Model port` twice, the Timeline region shows 2 text `Event Happened → Read Model`

## Domain terms

Event Model, Slice, Event, Read Model, Connection, Team, Person, Version

## Seams

- `bindPointer` in `public/editor-pointer.js` — in-session Event → Read Model `data-id` and a second caption
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET `Event Happened → Read Model` `data-id` stays [hydrate-event-read-id.md](./hydrate-event-read-id.md). In-session Command → Event `data-id` stays [connections.md](./connections.md). In-session Event → Read Model `data-id` and a second caption are this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Live titles after Name fill. Undo of Event → Read Model. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [hydrate-event-read-id.md](./hydrate-event-read-id.md) — GET `data-id` stays that file. In-session `data-id` is this slice.
- [connections.md](./connections.md) — In-session Command → Event caption stays that file. In-session Event → Read Model `data-id` is this slice.
- [product.md](../product.md) — In-session Event → Read Model `data-id` is this slice.
- [architecture.md](../architecture.md) — In-session Event → Read Model `data-id` is this slice.
