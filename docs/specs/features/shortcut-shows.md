# Shortcut shows

Status: validated

## Problem

⌥⌘2 (and ⌥⌘1 / ⌥⌘3–5) appends a Command (or Actor / Event / Read Model / Automation) in the Event Model JSON. The Timeline does not show a new listitem, so a member who uses the shortcut sees no block until Save and reload.

## Acceptance criteria

- [x] After pressing ⌥⌘1 on that page, the Timeline region shows a listitem whose accessible name is `Actor` in addition to the Create default Actor
- [ ] After pressing ⌥⌘2 on that page, the Timeline region shows a listitem whose accessible name is `Command`
- [ ] After pressing ⌥⌘3 on that page, the Timeline region shows a listitem whose accessible name is `Event Happened`
- [ ] After pressing ⌥⌘4 on that page, the Timeline region shows a listitem whose accessible name is `Read Model`
- [ ] After pressing ⌥⌘5 on that page, the Timeline region shows a listitem whose accessible name is `Automation`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — ⌥⌘1–5
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). ⌥⌘1 adds a second Actor listitem.
- JSON titles after ⌥⌘1–5 stay [add-on-lane.md](./add-on-lane.md). Timeline listitems from those keys are this slice.
- ⌥⌘1 Actor, ⌥⌘2 Command, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+ControlOrMeta+Digit1` … `Digit5`. After open, wait for `networkidle` so `bindEditor` is attached, then click the Timeline region before the keys (Inspector `Name` may have focus).
- Toolbar Add still shows listitems ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Changing which Slice the shortcut targets. GET ports after reload. Pan and Zoom. Landing. Mac window chrome. Copy changes.

## Restates

- [add-on-lane.md](./add-on-lane.md) — ⌥⌘1–5 still append JSON on the last Slice (or selected Slice for ⌥⌘2). Timeline listitem from those keys is this slice.
- [blocks.md](./blocks.md) — Toolbar Add still shows listitems. Shortcut-shown listitems are this slice.
- [model-defaults.md](./model-defaults.md) — Create still seeds one Actor. A second Actor listitem from ⌥⌘1 is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Shortcut DOM is this slice.
