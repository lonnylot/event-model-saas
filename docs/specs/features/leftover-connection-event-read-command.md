# Leftover connection event read command

Status: validated

## Problem

Command click strips Command → Event From / To, not `From Event Happened` / `To Read Model`. After inspecting Event → Read Model, a Command inspector still shows that copy. Mac rebuilds Inspector from selection.

## Acceptance criteria

- [x] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, then clicking the Timeline `Command` listitem, the Inspector region does not show the text `From Event Happened`
- [ ] After dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, then clicking the Timeline `Command` listitem, the Inspector region does not show the text `To Read Model`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person

## Seams

- `bindInspect` in `public/editor-inspect.js` — leftover Event → Read Model From / To after Command click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Leftover From Event Happened / To Read Model after a later `Command → Event Happened` click stays [inspect-switch.md](./inspect-switch.md). Leftover after Command click is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Leftover Connection copy after Event click is [leftover-connection-event.md](./leftover-connection-event.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-switch.md](./inspect-switch.md) — Leftover From Event Happened after `Command → Event Happened` stays that file. Leftover after Command click is this slice.
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover Command → Event copy after Command click stays that file.
- [leftover-connection-event.md](./leftover-connection-event.md) — Leftover Connection copy after Event click stays that file. Leftover Event → Read Model From / To after Command click is this slice.
- [product.md](../product.md) — Leftover Event → Read Model From / To after Command click is this slice.
- [architecture.md](../architecture.md) — Leftover Event → Read Model From / To after Command click is this slice.
