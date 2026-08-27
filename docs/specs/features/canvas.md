# Canvas

Status: released

## Problem

Members can add Slices and blocks and zoom, but cannot reorder Slices, drag a block to another Slice, delete a selection, pan, or undo, so they cannot correct layout or mistakes on the timeline.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the last `New Slice` listitem and pressing ⌥⌘← sets the first Slice `id` to the Slice that was last
- [x] After clicking `New Slice` twice then `Add Actor`, dragging the Timeline `Actor` listitem onto the first Slices `New Slice` listitem sets the first Slice `actors` to one Actor and the last Slice `actors` to `[]`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing Backspace sets the remaining Slice `id` to the Slice that was last
- [x] Scrolling the Timeline region sets the Timeline `style.transform` to a value that includes `translate(`
- [x] After clicking `Zoom in` then scrolling the Timeline region, the Timeline `style.transform` includes `scale(1.25)` and `translate(`
- [x] After clicking `New Slice`, pressing ⌘Z does not show a listitem whose accessible name is `New Slice`
- [x] After dragging `Command port` onto `Event Happened port`, pressing ⌘Z does not show the text `Command → Event Happened`

## Domain terms

Event Model, Slice, Actor, Command, Event, Connection, Team, Person, Version

## Seams

- `document` module — `moveSliceLeft`, `moveActorToSlice`, `deleteSlice`, `undoConnection`; the editor key and drag path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two `New Slice` listitems are distinguished as first vs last, not by renaming. Chrome Name still mutates the last Slice; multi-item Name binding stays later.
- Slice selection for move and delete is a click on the Slices listitem. After that click, Inspector `Name` may have focus, so delete is Backspace after clicking the Timeline region (not while typing in `Name`).
- Add Actor still targets the last Slice ([blocks.md](./blocks.md)). Clicking Add Actor with no Slice does not append a Timeline listitem.
- Drag-between-Slices drop target is the first Slices listitem. Same lane on the canvas is that move.
- ⌥⌘← is Playwright `Alt+Meta+ArrowLeft` (CI: `ControlOrMeta` for ⌘). ⌥⌘→ is later.
- Backspace deletes the selected Slice. Two `New Slice` listitems: the first is the clicked item. Delete is the same path.
- ⌘Z is Playwright `Meta+z` (CI: `ControlOrMeta+z`).
- Pan is scroll on the Timeline region. One scroll produces a `translate(` in `style.transform`. Pinch pan is later.
- Zoom still uses `scale(1.25)` / `scale(0.8)` / `scale(1)` from [editor-shell.md](./editor-shell.md).
- Mutations are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Pinch pan, sidebar drag-reorder, ⌥⌘→, extra move/delete/undo toolbar buttons, drag of Command / Event / Read Model / Automation between Slices, delete of a block or Connection except undo of a Connection, undo of move / delete / Add, Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Multi-item Name binding, Mac window chrome. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Other illegal pairs, duplicate, self-connection, Actor or Automation as endpoints, and Slice drop (copy on the source) are [connection-refusals.md](./connection-refusals.md). A refused duplicate Command → Event does not push an extra connection undo ([connection-refusals.md](./connection-refusals.md)). Add Field and Field name on Command are [inspect-fields.md](./inspect-fields.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns undo, pan, or moving Slices; this slice owns those. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Zoom stays this file.
- [blocks.md](./blocks.md) — Out of scope no longer owns delete, drag between Slices, undo, pan, or moving Slices; this slice owns those. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns keyboard shortcuts for this slice's keys, delete, drag blocks between Slices, undo, pan, or moving Slices; this slice owns those. Multi-item Name binding stays later.
- [connections.md](./connections.md) — Out of scope no longer owns undo, delete, drag blocks between Slices, pan, or moving Slices; this slice owns those. Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Other illegal pairs (copy on the source) are [connection-refusals.md](./connection-refusals.md).
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns undo, pan, or moving Slices; this slice owns those.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns delete, drag blocks between Slices, undo, pan, or moving Slices; this slice owns those.
- [product.md](../product.md) — Move slices (⌥⌘←), drag Actor between slices on the same lane, delete the selected Slice (Backspace), pan (scroll), undo New Slice, and undo Command → Event are this slice. Playwright path for this slice adds: two New Slice, ⌥⌘← reorders; drag Actor onto the first Slice; Backspace deletes the first Slice; scroll pans; ⌘Z undoes New Slice and undoes Command → Event. Drag of Command / Event / Read Model / Automation between slices, delete of a block or Connection, undo of move / delete / Add, pinch pan, ⌥⌘→, sidebar drag-reorder stay later. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Other illegal pairs (copy on the source) are [connection-refusals.md](./connection-refusals.md). Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md).
