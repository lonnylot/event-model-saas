# Shortcut kind

Status: validated

## Problem

⌥⌘2 shows a Timeline `Command` listitem with no `data-kind` and no `Command port`. Clicking that listitem opens Inspector Type as if it were a Slice, so a member who used the shortcut cannot inspect or connect that Command.

## Acceptance criteria

- [x] After pressing ⌥⌘1 on that page, the new Timeline listitem whose accessible name is `Actor` (in addition to the Create default Actor) has `data-kind` `actor`
- [x] After pressing ⌥⌘2 on that page, the Timeline region shows a button whose accessible name is `Command port` on the listitem whose accessible name is `Command`
- [x] After pressing ⌥⌘3 on that page, the Timeline region shows a button whose accessible name is `Event Happened port` on the listitem whose accessible name is `Event Happened`
- [x] After pressing ⌥⌘4 on that page, the Timeline region shows a button whose accessible name is `Read Model port` on the listitem whose accessible name is `Read Model`
- [x] After pressing ⌥⌘5 on that page, the Timeline listitem whose accessible name is `Automation` has `data-kind` `automation`
- [ ] After pressing ⌥⌘2 on that page, then clicking the Timeline `Command` listitem, the Inspector region shows a textbox whose accessible name is `Name` with the value `Command`
- [ ] After pressing ⌥⌘2 on that page, then clicking the Timeline `Command` listitem, the Inspector region does not show a combobox whose accessible name is `Type`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — ⌥⌘1–5 listitem attributes and ports
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- ⌥⌘1–5 still show Timeline listitems ([shortcut-shows.md](./shortcut-shows.md)). Toolbar Add still mounts ports ([blocks.md](./blocks.md) / [connections.md](./connections.md)). Shortcut ports and `data-kind` so inspect binds are this slice.
- Create model still seeds one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). ⌥⌘1 adds a second Actor listitem.
- ⌥⌘1 Actor, ⌥⌘2 Command, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+ControlOrMeta+Digit1` … `Digit5`. After open, wait for `networkidle` so `bindEditor` is attached, then click the Timeline region before the keys.
- JSON still uses selected Slice; shortcut DOM is last-column `lastLaneList` ([shortcut-shows.md](./shortcut-shows.md)). Targeting is not this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Changing which Slice the shortcut targets. GET ports after reload stay [hydrate-board.md](./hydrate-board.md). Inspector leftover Type after switching from a Slice to a Connection stays later. Inspect/delete on shortcut-shown Event Happened / Read Model listitems. Delete on shortcut-shown Actor / Command / Automation. Pan and Zoom. Landing. Mac window chrome. Copy changes.

## Restates

- [shortcut-shows.md](./shortcut-shows.md) — ⌥⌘1–5 still show Timeline listitems. In-memory ports and `data-kind` / inspect on those listitems were leftover-narrow Out of scope; this slice owns them. JSON still uses selected Slice; shortcut DOM is last-column `lastLaneList` stays that file.
- [add-on-lane.md](./add-on-lane.md) — ⌥⌘1–5 still append JSON. Shortcut ports and inspect are this slice.
- [connections.md](./connections.md) — Toolbar Add still mounts `Command port` / `Event Happened port` / `Read Model port`. Shortcut-shown ports are this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Clicking a click-created Command still opens Inspector Name. Clicking a shortcut-shown Command is this slice.
- [inspect-switch.md](./inspect-switch.md) — Leftover Inspector Type after a Connection click stays that file. Shortcut listitem `data-kind` is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Shortcut `data-kind` / ports are this slice.
