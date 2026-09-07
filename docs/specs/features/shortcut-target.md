# Shortcut target

Status: released

## Problem

⌥⌘2 appends a Command on the selected Slice in JSON and paints the Timeline listitem with `lastLaneList` (the last column). After selecting the first of two Slices, the Command lives in the first Slice's JSON and shows in the last Slice's column, so a member cannot tell which column they edited.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first Timeline `New Slice` listitem then the Timeline region, pressing ⌥⌘2, a listitem whose accessible name is `Command` shows only on the first `.slice-col` command lane

## Domain terms

Event Model, Slice, Command, Team, Person

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — ⌥⌘2 listitem column
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- ⌥⌘2 still appends JSON on the selected Slice ([add-on-lane.md](./add-on-lane.md)). Timeline listitem from that key stays [shortcut-shows.md](./shortcut-shows.md). JSON still uses selected Slice; shortcut DOM is last-column `lastLaneList` was leftover unused for ⌥⌘2; this slice paints that listitem on the selected Slice's column.
- ⌥⌘2 is Playwright `Alt+ControlOrMeta+Digit2`. After selecting a Slice, Inspector `Name` may have focus, so the key runs after clicking the Timeline region.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Two `New Slice` listitems are first vs last. With no Slice selected, ⌥⌘2 still targets the last Slice ([add-on-lane.md](./add-on-lane.md)).
- Shortcut ports and `data-kind` stay [shortcut-kind.md](./shortcut-kind.md). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

⌥⌘1 / ⌥⌘3–5 listitem column (those keys' DOM is still last-column `lastLaneList`). Shortcut ports and `data-kind`. Inspector leftover Type is [inspect-switch.md](./inspect-switch.md). GET ports after reload stay [hydrate-board.md](./hydrate-board.md). Pan and Zoom. Landing. Mac window chrome. Copy changes.

## Restates

- [shortcut-shows.md](./shortcut-shows.md) — ⌥⌘1–5 still show Timeline listitems. JSON still uses selected Slice. Shortcut DOM is last-column `lastLaneList` is leftover unused for ⌥⌘2; this slice paints ⌥⌘2 on the selected Slice's column. ⌥⌘1 / ⌥⌘3–5 DOM stays last-column `lastLaneList`.
- [shortcut-kind.md](./shortcut-kind.md) — Shortcut ports and `data-kind` stay that file. Changing which Slice ⌥⌘2 paints is this slice. ⌥⌘1 / ⌥⌘3–5 DOM stays last-column `lastLaneList`.
- [add-on-lane.md](./add-on-lane.md) — selected-Slice ⌥⌘2 still appends JSON only on the first Slice. Timeline listitem column for that key is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindKeyboard` in `public/editor-keyboard.js` stays that file. Out of scope Shortcut listitem column is leftover unused for ⌥⌘2; this slice owns that column.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Shortcut-shown listitem DOM stays [shortcut-shows.md](./shortcut-shows.md). ⌥⌘2 listitem column is this slice.
