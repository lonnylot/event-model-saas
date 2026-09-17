# Leftover connection event

Status: validated

## Problem

Clicking a Timeline `Event Happened` listitem after `Command → Event Happened` leaves Inspector `Connection`, `From Command`, and `To Event Happened`. Command click already strips that copy. Mac rebuilds Inspector from selection. Inspector no longer matches the selected Event.

## Acceptance criteria

- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Event Happened` listitem, the Inspector region does not show the text `From Command`
- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Event Happened` listitem, the Inspector region does not show the text `To Event Happened`
- [x] After dragging `Command port` onto `Event Happened port`, clicking `Command → Event Happened`, then clicking the Timeline `Event Happened` listitem, the Inspector region does not show the text `Connection`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person

## Seams

- `bindInspect` in `public/editor-inspect.js` — leftover Connection copy after Event click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Leftover default From Command / To Event Happened / Connection after Command click stays [leftover-connection-command.md](./leftover-connection-command.md). Leftover after Event click is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Leftover Event → Read Model From / To after Command click. TIME click empty Inspector. Landing. Mac window chrome. Copy changes other than leftover default From / To / Connection.

## Restates

- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover after Command click stays that file. Leftover after Event click is this slice.
- [inspect-switch.md](./inspect-switch.md) — Leftover Type after a Connection click stays that file. Leftover Connection copy after Event click is this slice.
- [product.md](../product.md) — Leftover Connection copy after Event click is this slice.
- [architecture.md](../architecture.md) — Leftover Connection copy after Event click is this slice.
