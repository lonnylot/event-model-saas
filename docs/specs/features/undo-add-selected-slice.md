# Undo add selected slice

Status: released

## Problem

`undoAddCommand` / `undoActor` / `undoEvent` / `undoReadModel` / `undoAutomation` `pop()` the last Slice. Toolbar Add Command on the selected first Slice already writes that Slice. ⌘Z then removes a Command from the last Slice. Mac undo restores the snapshot.

## Acceptance criteria

- [x] After clicking `New Slice`, clicking the first `New Slice` listitem in the Slices region, clicking `Add Command`, pressing ⌘Z, the first Slice Timeline region does not show a listitem whose accessible name is `Command`
- [x] After clicking `New Slice`, clicking the last `New Slice` listitem in the Slices region, clicking `Add Command`, clicking the first `New Slice` listitem in the Slices region, clicking `Add Command`, pressing ⌘Z, the last Slice Timeline region does not lose a listitem whose accessible name is `Command`

## Domain terms

Event Model, Slice, Command, Team, Person, Version

## Seams

- `undoAddCommand` in `public/undo-add-command.js` — undo Add Command removes the Command that was added
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Toolbar Add Command on the selected first Slice stays [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Undo of that Add is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Undo restore paint after delete is [undo-restore-selected-slice.md](./undo-restore-selected-slice.md). Redo of selected-Slice Add Command while that Slice stays selected is [undo-rest.md](./undo-rest.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [canvas-rest.md](./canvas-rest.md) — Undo Add Command on the last Slice stays that file. Undo of selected-Slice Add Command is this slice.
- [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md) — Toolbar Add Command on the selected first Slice stays that file. Undo of that Add is this slice.
- [undo-rest.md](./undo-rest.md) — Undo Add on the last Slice stays that file. Undo of selected-Slice Add Command is this slice. Redo of selected-Slice Add Command while that Slice stays selected stays that file.
- [product.md](../product.md) — Undo of selected-Slice Add Command is this slice.
- [architecture.md](../architecture.md) — Undo of selected-Slice Add Command is this slice.
- [add-on-lane.md](./add-on-lane.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [canvas.md](./canvas.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [connection-feedback.md](./connection-feedback.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [editor-shell.md](./editor-shell.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [undo-connection-event-read.md](./undo-connection-event-read.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [connection-refusals.md](./connection-refusals.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [blocks.md](./blocks.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [chrome.md](./chrome.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [connections.md](./connections.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [inspect-description.md](./inspect-description.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
- [model-persistence.md](./model-persistence.md) — Undo Add Command on the last Slice stays [canvas-rest.md](./canvas-rest.md). Undo of selected-Slice Add Command is this slice.
