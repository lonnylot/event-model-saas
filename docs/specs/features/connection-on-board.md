# Connection on board

Status: released

## Problem

Dragging `Command port` onto `Event Happened port` appends `Command → Event Happened` as a sibling of `.board` on the Timeline region. That copy sits under the slice columns, not on the board, so a Connection is not visible on the canvas it belongs to.

## Acceptance criteria

- [x] After dragging `Command port` onto `Event Happened port`, `.board` contains the text `Command → Event Happened`
- [x] After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, `.board` contains the text `Command → Event Happened`
- [x] After dragging `Event Happened port` onto `Read Model port`, `.board` contains the text `Event Happened → Read Model`
- [x] After dragging `Command port` onto `Event Happened port`, pressing ⌘Z, then pressing ⇧⌘Z, `.board` contains the text `Command → Event Happened`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person, Version

## Seams

- `bindEditor` in `public/editor.js` — append Connection copy
- `handleRequest` — model page HTML Connection copy
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Timeline region still shows `Command → Event Happened` ([connections.md](./connections.md)). That text living in `.board` is this slice. That copy as a later flex sibling of `.slice-col` is leftover unused; below the Slice is [connection-caption.md](./connection-caption.md). GET `data-id` on that `Command → Event Happened` node is [hydrate-connection-id.md](./hydrate-connection-id.md). Timeline still shows `Event Happened → Read Model` ([inspect-rest.md](./inspect-rest.md)); that text living in `.board` is this slice. GET `Event Happened → Read Model` `data-id` stays [hydrate-connection-id.md](./hydrate-connection-id.md) Out of scope.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Drawing Connections as canvas lines between ports. Pan and Zoom covering TIME chrome. GET ports after reload. GET `data-id` on `Command → Event Happened` is [hydrate-connection-id.md](./hydrate-connection-id.md). Landing. Mac window chrome. Copy changes.

## Restates

- [connections.md](./connections.md) — Timeline still shows `Command → Event Happened`. That text as a sibling of `.board` is leftover unused; `.board` contains it is this slice. Reload still shows that text; inside `.board` is this slice. `Event Happened → Read Model` as a sibling of `.board` is leftover unused; `.board` contains it is this slice.
- [inspect-rest.md](./inspect-rest.md) — Clicking Timeline text `Command → Event Happened` still opens Inspector From/To. That node living in `.board` is this slice. Clicking Timeline text `Event Happened → Read Model` still opens Inspector From/To. That node living in `.board` is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Connection copy on `.board` is this slice.
