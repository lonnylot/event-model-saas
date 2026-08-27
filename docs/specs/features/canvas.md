# Canvas

Status: validated

## Problem

Members can add Slices and blocks and zoom, but cannot reorder Slices, drag a block to another Slice, delete a selection, pan, or undo, so they cannot correct layout or mistakes on the timeline.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the last `New Slice` listitem and pressing ⌥⌘← sets the first Slice `id` to the Slice that was last
- [x] After clicking `New Slice` twice then `Add Actor`, dragging the Timeline `Actor` listitem onto the first Slices `New Slice` listitem sets the first Slice `actors` to one Actor and the last Slice `actors` to `[]`
- [ ] After clicking `New Slice` then the `New Slice` listitem then the Timeline region, pressing Backspace does not show a listitem whose accessible name is `New Slice`
- [ ] Scrolling the Timeline region sets the Timeline `style.transform` to a value that includes `translate(`
- [ ] After clicking `Zoom in` then scrolling the Timeline region, the Timeline `style.transform` includes `scale(1.25)` and `translate(`
- [ ] After clicking `New Slice`, pressing ⌘Z does not show a listitem whose accessible name is `New Slice`
- [ ] After dragging `Command port` onto `Event Happened port`, pressing ⌘Z does not show the text `Command → Event Happened`

## Domain terms

Event Model, Slice, Actor, Command, Event, Connection, Team, Person, Version

## Seams

- `document` module — move Slice, move Actor between Slices, delete Slice, undo those mutations and undo Connection; the editor key, drag, and scroll path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two `New Slice` listitems are distinguished as first vs last, not by renaming. Chrome Name still mutates the last Slice; multi-item Name binding stays later.
- Slice selection for move and delete is a click on the Slices listitem. After that click, Inspector `Name` may have focus, so delete is Backspace after clicking the Timeline region (not while typing in `Name`).
- Add Actor still targets the last Slice ([blocks.md](./blocks.md)).
- Drag-between-Slices drop target is the first Slices listitem. Same lane on the canvas is that move.
- ⌥⌘← is Playwright `Alt+Meta+ArrowLeft` (CI: `ControlOrMeta` for ⌘). ⌥⌘→ is later.
- Backspace deletes the selected Slice. Delete is the same path.
- ⌘Z is Playwright `Meta+z` (CI: `ControlOrMeta+z`).
- Pan is scroll on the Timeline region. One scroll produces a `translate(` in `style.transform`. Pinch pan is later.
- Zoom still uses `scale(1.25)` / `scale(0.8)` / `scale(1)` from [editor-shell.md](./editor-shell.md).
- Mutations are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Pinch pan, sidebar drag-reorder, ⌥⌘→, extra move/delete/undo toolbar buttons, dashed Add on a lane, keyboard ⌥⌘1–5, delete of a block or Connection except undo of a Connection, highlighting legal targets, snap-back, reason on the source, other illegal pairs, Inspector Description / Fields / Slice type picker, inspect after reload, multi-item Name binding, Mac window chrome.

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns undo, pan, or moving Slices; this slice owns those. Keyboard ⌥⌘1–5 stay later. Zoom stays this file.
- [blocks.md](./blocks.md) — Out of scope no longer owns delete, drag between Slices, undo, pan, or moving Slices; this slice owns those. Dashed Add and keyboard ⌥⌘1–5 stay later.
- [chrome.md](./chrome.md) — Out of scope no longer owns keyboard shortcuts for this slice's keys, delete, drag blocks between Slices, undo, pan, or moving Slices; this slice owns those. Multi-item Name binding stays later.
- [connections.md](./connections.md) — Out of scope no longer owns undo; this slice owns undo of a Connection. Highlighting legal targets, snap-back, reason on the source, and other illegal pairs stay later.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns undo, pan, or moving Slices; this slice owns those.
- [product.md](../product.md) — Move slices (⌥⌘←), drag blocks between slices on the same lane, delete selection (Backspace), pan (scroll), and undo structural edits including connections are this slice. Playwright path for this slice adds: two New Slice, ⌥⌘← reorders; drag Actor onto the first Slice; Backspace deletes a Slice; scroll pans; ⌘Z undoes New Slice and undoes Command → Event. Pinch pan, ⌥⌘→, sidebar drag-reorder, dashed Add, keyboard ⌥⌘1–5, highlighting legal targets, snap-back, reason on the source, and other illegal pairs stay later. Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md) when that spec is present; until it is released those words stay later.
