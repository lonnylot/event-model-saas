# Drag rest

Status: released

## Problem

Members can drag an Actor or Command onto another Slice, and drag Slices in the sidebar. They cannot drag an Event, Read Model, or Automation between Slices, or drag a Slice on the Timeline, so Mac same-lane and canvas-slice move is incomplete.

## Acceptance criteria

- [x] After clicking `New Slice` twice then `Add Event`, dragging the Timeline `Event Happened` listitem onto the first Slices `New Slice` listitem sets the first Slice `events` to one Event and the last Slice `events` to `[]`
- [x] After clicking `New Slice` twice then `Add Read Model`, dragging the Timeline `Read Model` listitem onto the first Slices `New Slice` listitem sets the first Slice `readModels` to one Read Model and the last Slice `readModels` to `[]`
- [x] After clicking `New Slice` twice then `Add Automation`, dragging the Timeline `Automation` listitem onto the first Slices `New Slice` listitem sets the first Slice `processors` to one Automation and the last Slice `processors` to `[]`
- [x] After clicking `New Slice` twice, dragging the first Timeline `New Slice` listitem onto the last Timeline `New Slice` listitem sets the first Slice `id` to the Slice that was last

## Domain terms

Event Model, Slice, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — `moveEventToSlice`, `moveReadModelToSlice`, `moveAutomationToSlice`, reorder Slices from the Timeline; the editor drag path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model / Automation still targets the last Slice. Drop target for blocks is the first Slices listitem (same as Actor / Command drag). Timeline Slice drag uses Timeline `New Slice` listitems, not the Slices sidebar ([canvas-rest.md](./canvas-rest.md) sidebar).
- Actor drag stays [canvas.md](./canvas.md). Command drag and sidebar reorder stay [canvas-rest.md](./canvas-rest.md). Insert before a Command card is [drag-insert-before-command.md](./drag-insert-before-command.md).
- Move is in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Undo of move is [undo-rest.md](./undo-rest.md). Mac window chrome. Actor / Command drag and sidebar drag stay those specs. Insert before a Command card is [drag-insert-before-command.md](./drag-insert-before-command.md). Pinch zoom is [pinch-zoom.md](./pinch-zoom.md).

## Restates

- [canvas-rest.md](./canvas-rest.md) — Out of scope no longer owns drag of Event, Read Model, and Automation between Slices; this slice owns those. Command drag and sidebar reorder stay that file. Insert before a Command card is [drag-insert-before-command.md](./drag-insert-before-command.md). Timeline Slice drag is this slice.
- [canvas.md](./canvas.md) — Timeline Slice drag is this slice. Actor drag stays this file. Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Insert before a Command card is [drag-insert-before-command.md](./drag-insert-before-command.md).
- [editor-shell.md](./editor-shell.md) — Timeline Slice drag is this slice. Undo New Slice / Connection, pan, and moving Slices (⌥⌘←) stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Drag of Event, Read Model, and Automation between Slices is this slice.
- [model-persistence.md](./model-persistence.md) — Timeline Slice drag is this slice. Undo New Slice / Connection, pan, and moving Slices (⌥⌘←) stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Drag of Event, Read Model, and Automation between Slices is this slice.
- [connection-feedback.md](./connection-feedback.md) — Timeline Slice drag is this slice. Undo New Slice / Connection, pan, and moving Slices (⌥⌘←) stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Drag of Event, Read Model, and Automation between Slices is this slice.
- [blocks.md](./blocks.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Actor drag stays [canvas.md](./canvas.md).
- [chrome.md](./chrome.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Actor drag stays [canvas.md](./canvas.md).
- [connections.md](./connections.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Actor drag stays [canvas.md](./canvas.md).
- [inspect-blocks.md](./inspect-blocks.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Actor drag stays [canvas.md](./canvas.md).
- [product.md](../product.md) — Drag Event, Read Model, and Automation between slices on the same lane. Timeline Slice drag is this slice. Command drag and sidebar reorder stay [canvas-rest.md](./canvas-rest.md). Insert before a Command card is [drag-insert-before-command.md](./drag-insert-before-command.md). Playwright path for this slice adds: two New Slice, drag Event onto the first Slice; drag Read Model onto the first Slice; drag Automation onto the first Slice; drag first Timeline New Slice onto last.
- [move-slice-right.md](./move-slice-right.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. ⌥⌘→ stays that file.
- [pinch-zoom.md](./pinch-zoom.md) — Pinch zoom stays that file.
- [add-on-lane.md](./add-on-lane.md) — Canvas move / pan / undo no longer packs Timeline Slice drag; Timeline Slice drag is this slice. ⌥⌘← stays [canvas.md](./canvas.md).
- [inspect-description.md](./inspect-description.md) — Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, is this slice. Actor drag stays [canvas.md](./canvas.md). Command drag stays [canvas-rest.md](./canvas-rest.md).
