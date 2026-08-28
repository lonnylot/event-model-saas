# Canvas rest

Status: validated

## Problem

Canvas shipped ⌥⌘←, Actor drag, Slice Backspace, scroll pan, and undo of New Slice / Connection. Members still cannot drag Slices in the sidebar, drag a Command to another Slice, undo Add Command, zoom from the keyboard, or pan with a horizontal wheel, so leftover Mac timeline controls are missing.

## Acceptance criteria

- [x] After clicking `New Slice` twice, dragging the first `New Slice` listitem onto the last `New Slice` listitem sets the first Slice `id` to the Slice that was last
- [x] After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the first Slice `commands` to one Command
- [ ] After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the last Slice `commands` to `[]`
- [ ] After clicking `New Slice` then `Add Command`, pressing ⌘Z does not show a listitem whose accessible name is `Command`
- [ ] After clicking `New Slice` then `Add Command`, pressing ⌘Z shows a listitem whose accessible name is `New Slice`
- [ ] Pressing ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1.25)`
- [ ] Pressing ⌘- on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(0.8)`
- [ ] Pressing ⌘0 after ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1)`
- [ ] A horizontal wheel on the Timeline region sets the Timeline `style.transform` to a value that includes `translate(`

## Domain terms

Event Model, Slice, Command, Team, Person, Version

## Seams

- `document` module — reorder Slices, `moveCommandToSlice`, undo Add Command; the editor drag and ⌘Z path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two `New Slice` listitems are first vs last. Sidebar drag uses the Slices list. Command drop target is the first Slices listitem. Add Command still targets the last Slice ([blocks.md](./blocks.md)).
- ⌘Z is Playwright `ControlOrMeta+z`. Undo stack: Add Command is last, so one ⌘Z removes Command and leaves New Slice. Undo New Slice and undo Command → Event stay [canvas.md](./canvas.md).
- ⌘+ is `ControlOrMeta+Equal`. ⌘- is `ControlOrMeta+Minus`. ⌘0 is `ControlOrMeta+Digit0`. Zoom factors stay `1.25` / `0.8` / `1` from [editor-shell.md](./editor-shell.md). Toolbar zoom stays that file.
- Playwright `mouse.wheel({ deltaX: 80 })` on the Timeline is the pinch-pan stand-in. Vertical scroll pan stays [canvas.md](./canvas.md).
- Mutations are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Drag of Event / Read Model / Automation between Slices, undo of move / delete / other Adds, extra zoom or undo toolbar, Mac window chrome. Pinch zoom is [pinch-zoom.md](./pinch-zoom.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). New Slice (⇧⌘N) is [new-slice-shortcut.md](./new-slice-shortcut.md). Toolbar New Slice stays [editor-shell.md](./editor-shell.md). Description is [inspect-description.md](./inspect-description.md). Fields are [inspect-fields.md](./inspect-fields.md) and [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Actor drag, Slice Backspace, ⌥⌘←, vertical scroll pan, undo New Slice, and undo Connection stay [canvas.md](./canvas.md).

## Restates

- [canvas.md](./canvas.md) — Out of scope no longer owns sidebar drag-reorder, drag of Command between Slices, undo of Add, pinch pan, or ⌘+/⌘-/⌘0; this slice owns those. Drag of Event / Read Model / Automation, undo of move / delete, stay later. Actor drag, Slice Backspace, ⌥⌘←, vertical scroll, undo New Slice, and undo Connection stay this file.
- [blocks.md](./blocks.md) — Drag Command between Slices and undo Add Command are this slice.
- [editor-shell.md](./editor-shell.md) — Keyboard zoom is this slice. Toolbar zoom stays this file.
- [chrome.md](./chrome.md) — Drag of Command between Slices, undo Add Command, pinch pan, and ⌘+/⌘-/⌘0 are this slice.
- [connections.md](./connections.md) — Drag of Command between Slices, undo Add Command, pinch pan, and ⌘+/⌘-/⌘0 are this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Drag of Command between Slices, undo Add Command, pinch pan, and ⌘+/⌘-/⌘0 are this slice.
- [inspect-description.md](./inspect-description.md) — Drag of Command between Slices, undo Add Command, pinch pan, and ⌘+/⌘-/⌘0 are this slice.
- [model-persistence.md](./model-persistence.md) — Sidebar drag-reorder, drag of Command between Slices, undo Add Command, pinch pan, and ⌘+/⌘-/⌘0 are this slice.
- [move-slice-right.md](./move-slice-right.md) — ⌥⌘→ stays that file. Sidebar drag-reorder is this slice.
- [new-slice-shortcut.md](./new-slice-shortcut.md) — ⇧⌘N stays that file. Toolbar New Slice stays [editor-shell.md](./editor-shell.md).
- [pinch-zoom.md](./pinch-zoom.md) — Keyboard zoom and pinch pan are this slice. Ctrl+wheel scale stays this file. Vertical scroll pan stays [canvas.md](./canvas.md). Toolbar zoom stays [editor-shell.md](./editor-shell.md).
- [features/_TEMPLATE.md](./_TEMPLATE.md) — Problem example no longer uses ⌘+/⌘-/⌘0 as later-slice current.
- [product.md](../product.md) — Move slices (sidebar drag). Drag Command between slices. Undo Add Command. Zoom / pan (toolbar zoom, ⌘+/⌘-/⌘0, scroll to pan, pinch pan). Playwright path for this slice adds: two New Slice, drag first Slices listitem onto last; Add Command, drag onto the first Slice; Add Command, ⌘Z removes Command and leaves New Slice; ⌘+ scale(1.25), ⌘- scale(0.8), ⌘0 after ⌘+ scale(1); horizontal wheel includes `translate(`. Drag of Event / Read Model / Automation, undo of move / delete, stay later.
