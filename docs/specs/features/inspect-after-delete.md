# Inspect after delete

Status: validated

## Problem

Backspace deletes a selected Command. Inspector still shows Name, Add Field, and Description. `Nothing Selected` does not return, so a member cannot tell the Command is gone.

## Acceptance criteria

- [x] After clicking `Add Command`, clicking the Timeline `Command` listitem, pressing Backspace, the Inspector region shows the text `Nothing Selected`
- [x] After clicking `Add Command`, clicking the Timeline `Command` listitem, pressing Backspace, the Inspector region does not show a button whose accessible name is `Add Field`

## Domain terms

Event Model, Slice, Command, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — Inspector empty state after Backspace delete
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Command Backspace still deletes the Command ([delete-blocks.md](./delete-blocks.md)). GET with no local edits still shows `Nothing Selected` ([designed-surfaces.md](./designed-surfaces.md)). Clearing Inspector after that Backspace is this slice. After selection, Inspector `Name` may have focus, so delete is Backspace after clicking the selected listitem (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

TIME click empty Inspector is [inspect-deselect.md](./inspect-deselect.md). Leftover Connection copy after Command click without delete is [leftover-connection-command.md](./leftover-connection-command.md). Inspector empty after Actor / Event / Read Model / Automation / Slice / Connection Backspace. Landing. Mac window chrome. Copy changes.

## Restates

- [delete-blocks.md](./delete-blocks.md) — Command Backspace still deletes the Command. Inspector empty state after that Backspace is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — GET with no local edits still shows `Nothing Selected`. `Nothing Selected` after Command Backspace is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Inspector empty state after Command Backspace is this slice.
- [inspect-deselect.md](./inspect-deselect.md) — TIME / empty `.board` still clear Inspector and `selected`. Inspector empty after Command Backspace is this slice.
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover Connection copy after Command click without delete stays that file. Inspector empty after Command Backspace is this slice.
