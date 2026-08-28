# Canvas rest

Status: released

## Problem

Canvas shipped ⌥⌘←, Actor drag, Slice Backspace, scroll pan, and undo of New Slice / Connection. Members still cannot drag Slices in the sidebar, drag a Command to another Slice, undo Add Command, or zoom from the keyboard, so leftover Mac timeline controls are missing.

## Acceptance criteria

- [x] After clicking `New Slice` twice, dragging the first `New Slice` listitem onto the last `New Slice` listitem sets the first Slice `id` to the Slice that was last
- [x] After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the first Slice `commands` to one Command
- [x] After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the last Slice `commands` to `[]`
- [x] After clicking `New Slice` then `Add Command`, pressing ⌘Z does not show a listitem whose accessible name is `Command`
- [x] After clicking `New Slice` then `Add Command`, pressing ⌘Z shows a listitem whose accessible name is `New Slice`
- [x] Pressing ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1.25)`
- [x] Pressing ⌘- on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(0.8)`
- [x] Pressing ⌘0 after ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1)`

## Domain terms

Event Model, Slice, Command, Team, Person, Version

## Seams

- `document` module — reorder Slices, `moveCommandToSlice`, undo Add Command; the editor drag and ⌘Z path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two `New Slice` listitems are first vs last. Sidebar drag uses the Slices list. Command drop target is the first Slices listitem. Command listitem drag is mousedown on the listitem, not on `Command port`. Port onto a Slice stays [connection-refusals.md](./connection-refusals.md). Add Command still targets the last Slice ([blocks.md](./blocks.md)).
- ⌘Z is Playwright `ControlOrMeta+z`. Undo stack: Add Command is last, so one ⌘Z removes Command and leaves New Slice. Undo New Slice and undo Command → Event stay [canvas.md](./canvas.md).
- ⌘+ is `ControlOrMeta+Equal`. ⌘- is `ControlOrMeta+Minus`. ⌘0 is `ControlOrMeta+Digit0`. Zoom factors stay `1.25` / `0.8` / `1` from [editor-shell.md](./editor-shell.md). Toolbar zoom stays that file.
- Mutations are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Extra zoom or undo toolbar, Mac window chrome. Pinch zoom is [pinch-zoom.md](./pinch-zoom.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). New Slice (⇧⌘N) is [new-slice-shortcut.md](./new-slice-shortcut.md). Toolbar New Slice stays [editor-shell.md](./editor-shell.md). Last-item Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Actor drag, Slice Backspace, ⌥⌘←, scroll pan, pinch pan, undo New Slice, and undo Connection stay [canvas.md](./canvas.md).

## Restates

- [connection-refusals.md](./connection-refusals.md) — After a refused second Command → Event, ⌘Z four times does not show New Slice (Add Command is on the undo stack). Two presses no longer reach New Slice. Port onto a Slice stays that file.
- [canvas.md](./canvas.md) — Out of scope no longer owns sidebar drag-reorder, drag of Command between Slices, undo of Add, or ⌘+/⌘-/⌘0; this slice owns those. Pinch pan stays this file (the Timeline `wheel` listener). Drag of Event, Read Model, and Automation, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Actor drag, Slice Backspace, ⌥⌘←, scroll pan, undo New Slice, and undo Connection stay this file.
- [blocks.md](./blocks.md) — Drag Command between Slices and undo Add Command are this slice.
- [editor-shell.md](./editor-shell.md) — Keyboard zoom is this slice. Toolbar zoom stays this file. Pinch pan stays [canvas.md](./canvas.md).
- [chrome.md](./chrome.md) — Drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are this slice. Pinch pan stays [canvas.md](./canvas.md).
- [connections.md](./connections.md) — Drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are this slice. Pinch pan stays [canvas.md](./canvas.md).
- [inspect-blocks.md](./inspect-blocks.md) — Drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are this slice. Pinch pan stays [canvas.md](./canvas.md).
- [inspect-description.md](./inspect-description.md) — Drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are this slice. Pinch pan stays [canvas.md](./canvas.md).
- [model-persistence.md](./model-persistence.md) — Sidebar drag-reorder, drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are this slice. Pinch pan stays [canvas.md](./canvas.md).
- [move-slice-right.md](./move-slice-right.md) — ⌥⌘→ stays that file. Sidebar drag-reorder is this slice.- [new-slice-shortcut.md](./new-slice-shortcut.md) — ⇧⌘N stays that file. Toolbar New Slice stays [editor-shell.md](./editor-shell.md).
- [pinch-zoom.md](./pinch-zoom.md) — Keyboard zoom is this slice. Ctrl+wheel scale stays this file. Vertical scroll pan and pinch pan stay [canvas.md](./canvas.md). Toolbar zoom stays [editor-shell.md](./editor-shell.md).
- [features/_TEMPLATE.md](./_TEMPLATE.md) — Problem example no longer uses ⌘+/⌘-/⌘0 as later-slice current.
- [product.md](../product.md) — Move slices (sidebar drag). Drag Command between slices. Undo Add Command. Keyboard zoom (⌘+/⌘-/⌘0). Toolbar zoom stays [features/editor-shell.md](./editor-shell.md). Scroll to pan and pinch pan stay [features/canvas.md](./canvas.md). Playwright path for this slice adds: two New Slice, drag first Slices listitem onto last; Add Command, drag onto the first Slice; Add Command, ⌘Z removes Command and leaves New Slice; ⌘+ scale(1.25), ⌘- scale(0.8), ⌘0 after ⌘+ scale(1). Drag of Event, Read Model, and Automation, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md).
