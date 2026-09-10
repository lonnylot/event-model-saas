# Inspect delete connection

Status: validated

## Problem

Mac Connection inspector has `Delete Connection`. Web deletes only with Backspace after clicking `Command → Event Happened`. A member looking at From / To has no Inspector control to remove that Connection.

## Acceptance criteria

- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened`, the Inspector region shows a button whose accessible name is `Delete Connection`

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

Live Connection titles after rename. Event → Read Model Delete Connection button. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-connection.md](./inspect-connection.md) — From / To inspect stays that file. Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [delete-blocks.md](./delete-blocks.md) — Backspace still deletes the selected Connection. Inspector Delete Connection is this slice.
- [inspect-rest.md](./inspect-rest.md) — Naming hints, Slice type help, and ⇧⌘I stay not ported. Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [delete-rest.md](./delete-rest.md) — Actor / Event / Read Model / Automation Backspace stay that file. Inspector Delete Connection is this slice. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md).
- [product.md](../product.md) — Inspector Delete Connection is this slice. Naming hints, Slice type help, and ⇧⌘I stay not ported. Command → Event Backspace stays [delete-blocks.md](./delete-blocks.md). Playwright path for this slice adds: click `Command → Event Happened`, Inspector shows Delete Connection.
