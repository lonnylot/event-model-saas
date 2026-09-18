# Inspect after delete

Status: released

## Problem

Backspace deletes a selected Command. Inspector still shows Add Field. A member cannot tell the Command is gone.

## Acceptance criteria

- [x] After clicking `Add Command`, clicking the Timeline `Command` listitem, pressing Backspace, the Inspector region does not show a button whose accessible name is `Add Field`

## Domain terms

Event Model, Slice, Command, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — leftover Add Field after Backspace delete
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Command Backspace still deletes the Command ([delete-blocks.md](./delete-blocks.md)). GET with no local edits still shows `Nothing Selected` ([designed-surfaces.md](./designed-surfaces.md)). Leftover Add Field after that Backspace is this slice. Parent Slice Type after that Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). After selection, Inspector `Name` may have focus, so delete is Backspace after clicking the selected listitem (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). With no Slice selected, toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

TIME click empty Inspector is [inspect-deselect.md](./inspect-deselect.md). Leftover Connection copy after Command click without delete is [leftover-connection-command.md](./leftover-connection-command.md). Parent Slice Type after Command Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). After-delete parent Slice for Actor / Event / Read Model / Automation is [inspect-after-delete-parent-rest.md](./inspect-after-delete-parent-rest.md). Inspector empty after Slice / Connection Backspace. Landing. Mac window chrome. Copy changes.

## Restates

- [delete-blocks.md](./delete-blocks.md) — Command Backspace still deletes the Command. Leftover Add Field after that Backspace is this slice. Parent Slice Type after that Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md).
- [designed-surfaces.md](./designed-surfaces.md) — GET with no local edits still shows `Nothing Selected`. Parent Slice Type after Command Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). Leftover Add Field after that Backspace is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Leftover Add Field after Command Backspace is this slice. Parent Slice Type after that Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md).
- [inspect-deselect.md](./inspect-deselect.md) — TIME / empty `.board` still clear Inspector and `selected`. Leftover Add Field after Command Backspace is this slice. Parent Slice Type after that Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md).
- [leftover-connection-command.md](./leftover-connection-command.md) — Leftover Connection copy after Command click without delete stays that file. Leftover Add Field after Command Backspace is this slice. Parent Slice Type after that Backspace is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md).
