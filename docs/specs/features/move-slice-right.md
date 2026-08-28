# Move slice right

Status: released

## Problem

Members can move a selected Slice left with ⌥⌘←. They cannot move it right with ⌥⌘→, so a Slice that moved too far left cannot step back.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem and pressing ⌥⌘→ sets the last Slice `id` to the Slice that was first

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `document` module — `moveSliceRight`; the editor key path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two `New Slice` listitems are first vs last. Chrome Name still mutates the last Slice.
- Slice selection is a click on the Slices listitem. ⌥⌘→ is Playwright `Alt+ControlOrMeta+ArrowRight` (same ⌘ mapping as [canvas.md](./canvas.md) ⌥⌘←).
- ⌥⌘← stays [canvas.md](./canvas.md). Sidebar drag-reorder stays later.
- Move is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Sidebar drag-reorder, pinch pan, ⌘+/⌘-/⌘0, drag of Command / Event / Read Model / Automation between Slices, undo of move, Mac window chrome. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Description is [inspect-description.md](./inspect-description.md). Fields are [inspect-fields.md](./inspect-fields.md) and [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Delete of a block or Connection is [delete-blocks.md](./delete-blocks.md) and [delete-rest.md](./delete-rest.md).

## Restates

- [canvas.md](./canvas.md) — Out of scope no longer owns ⌥⌘→; this slice owns those. Sidebar drag-reorder stays later. ⌥⌘← stays this file.
- [editor-shell.md](./editor-shell.md) — ⌥⌘→ is this slice.
- [chrome.md](./chrome.md) — ⌥⌘→ is this slice.
- [blocks.md](./blocks.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [connections.md](./connections.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [inspect-blocks.md](./inspect-blocks.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [model-persistence.md](./model-persistence.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [inspect-description.md](./inspect-description.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [connection-feedback.md](./connection-feedback.md) — ⌥⌘→ is this slice. Moving Slices (⌥⌘←) stays [canvas.md](./canvas.md).
- [product.md](../product.md) — Move slices (⌥⌘← / ⌥⌘→). Sidebar drag-reorder stays later. Playwright path for this slice adds: two New Slice, click the first, ⌥⌘→ sets the last Slice `id` to the Slice that was first.
