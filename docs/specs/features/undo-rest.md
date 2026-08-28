# Undo rest

Status: validated

## Problem

⌘Z undoes New Slice, Command → Event, and Add Command. It does not undo other Adds, a Slice move, or a delete, so Mac structural undo is incomplete. ⇧⌘Z does not redo.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Actor`, pressing ⌘Z does not show a listitem whose accessible name is `Actor`
- [x] After clicking `New Slice` then `Add Event`, pressing ⌘Z does not show a listitem whose accessible name is `Event Happened`
- [x] After clicking `New Slice` then `Add Read Model`, pressing ⌘Z does not show a listitem whose accessible name is `Read Model`
- [x] After clicking `New Slice` then `Add Automation`, pressing ⌘Z does not show a listitem whose accessible name is `Automation`
- [x] After clicking `New Slice` twice, clicking the last `New Slice` listitem, pressing ⌥⌘←, then pressing ⌘Z, the first Slice `id` is the Slice that was first before the move
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Slice `id` is the Slice that was last and the first Slice `id` is the Slice that was first
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Command `id` is the Command that was last and the first Command `id` is the Command that was first
- [x] After dragging from `Command port` onto `Event Happened port` twice, clicking the first Timeline text `Command → Event Happened` then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining connection `id` is the connection that was last and the first connection `id` is the connection that was first
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Actor `id` is the Actor that was last and the first Actor `id` is the Actor that was first
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Event `id` is the Event that was last and the first Event `id` is the Event that was first
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Read Model `id` is the Read Model that was last and the first Read Model `id` is the Read Model that was first
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Automation `id` is the Automation that was last and the first Automation `id` is the Automation that was first
- [x] After clicking `New Slice` then `Add Command`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Command`
- [x] After clicking `New Slice` then `Add Actor`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Actor`
- [x] After clicking `New Slice` then `Add Event`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Event Happened`
- [x] After clicking `New Slice` then `Add Read Model`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Read Model`
- [x] After clicking `New Slice` then `Add Automation`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Automation`
- [x] After clicking `New Slice` twice, clicking the last `New Slice` listitem, pressing ⌥⌘←, pressing ⌘Z, then pressing ⇧⌘Z, the first Slice `id` is the Slice that was last before the undo
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Slice `id` is the Slice that was last
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Command `id` is the Command that was last
- [x] After dragging from `Command port` onto `Event Happened port` twice, clicking the first Timeline text `Command → Event Happened` then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining connection `id` is the connection that was last
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Actor `id` is the Actor that was last
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Event `id` is the Event that was last
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Read Model `id` is the Read Model that was last
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Automation `id` is the Automation that was last
- [x] After clicking `New Slice`, pressing ⌘Z, then pressing ⇧⌘Z, a listitem whose accessible name is `New Slice` is shown
- [x] After dragging from `Command port` onto `Event Happened port`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows the text `Command → Event Happened`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Connection, Team, Person, Version

## Seams

- `document` module — undo stack records Add Actor / Event / Read Model / Automation / Command, move Slice, delete Slice / Command / Connection / Actor / Event / Read Model / Automation, and redo; the editor ⌘Z / ⇧⌘Z path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- ⌘Z is `ControlOrMeta+z`. ⇧⌘Z is `Shift+ControlOrMeta+z`. ⌥⌘← stays [canvas.md](./canvas.md). Undo New Slice and undo Connection stay [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- After ⌥⌘← on two Slices, the first Slice id became what was last; ⌘Z restores the order from before that key.
- After Backspace on the first of two Slices, remaining JSON `id` is the last; ⌘Z restores the first `id`.
- Two default-named Commands / Connections / Actors / Events / Read Models / Automations are first vs last, not by renaming. After Backspace of the first, remaining JSON `id` is the last; ⌘Z restores the first `id`.
- After Add Command then ⌘Z, ⇧⌘Z restores the Command listitem. After Add Actor then ⌘Z, ⇧⌘Z restores the Actor listitem. After Add Event then ⌘Z, ⇧⌘Z restores the Event Happened listitem. After Add Read Model then ⌘Z, ⇧⌘Z restores the Read Model listitem. After Add Automation then ⌘Z, ⇧⌘Z restores the Automation listitem. After undo of move, ⇧⌘Z reapplies that move (the first Slice `id` is the Slice that was last before the undo). After undo of Slice Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Command Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Connection Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Actor Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Event Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Read Model Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo of Automation Backspace, ⇧⌘Z reapplies that delete (remaining JSON `id` is the last). After undo New Slice, ⇧⌘Z restores the Slice listitem. After undo Connection, ⇧⌘Z restores the Connection text.
- Undo is in-memory.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Extra undo toolbar. Mac window chrome. Undo New Slice, undo Connection (without a prior delete), and undo Add Command stay those specs.

## Restates

- [canvas-rest.md](./canvas-rest.md) — Undo Add Command stays that file. Undo of remaining Adds, move, delete, and redo are this slice.
- [connection-refusals.md](./connection-refusals.md) — After a refused second Command → Event, ⌘Z four times does not show New Slice (Add Event is on the undo stack). Three presses no longer reach New Slice. Port onto a Slice stays that file.
- [canvas.md](./canvas.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice and undo Connection without a prior delete stay that file.
- [blocks.md](./blocks.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [chrome.md](./chrome.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [connections.md](./connections.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice and undo Connection without a prior delete stay [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [inspect-blocks.md](./inspect-blocks.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [editor-shell.md](./editor-shell.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [model-persistence.md](./model-persistence.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [inspect-description.md](./inspect-description.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [connection-feedback.md](./connection-feedback.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice and undo Connection without a prior delete stay [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [add-on-lane.md](./add-on-lane.md) — Undo of remaining Adds, move, delete, and redo are this slice. Undo New Slice stays [canvas.md](./canvas.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [move-slice-right.md](./move-slice-right.md) — Undo of move is this slice. ⌥⌘→ stays that file.
- [delete-blocks.md](./delete-blocks.md) — Undo of remaining delete is this slice. Delete Command / Connection stay that file.
- [delete-rest.md](./delete-rest.md) — Undo of remaining delete is this slice. Delete of Actor, Event, Read Model, and Automation stay that file.
- [product.md](../product.md) — Undo of move, delete of Slice / Command / Connection / Actor / Event / Read Model / Automation, remaining Adds, and redo (⇧⌘Z). Undo Add Command stays [canvas-rest.md](./canvas-rest.md). Playwright path for this slice adds: ⌘Z after Add Actor / Event / Read Model / Automation; ⌘Z after ⌥⌘←; ⌘Z after Slice / Command / Connection / Actor / Event / Read Model / Automation Backspace; ⇧⌘Z after undo Add Command, ⇧⌘Z after undo Add Actor, ⇧⌘Z after undo Add Event, ⇧⌘Z after undo Add Read Model, ⇧⌘Z after undo Add Automation, ⇧⌘Z after undo of ⌥⌘←, ⇧⌘Z after undo Slice Backspace, ⇧⌘Z after undo Command Backspace, ⇧⌘Z after undo Connection Backspace, ⇧⌘Z after undo Actor Backspace, ⇧⌘Z after undo Event Backspace, ⇧⌘Z after undo Read Model Backspace, ⇧⌘Z after undo Automation Backspace, ⇧⌘Z after undo New Slice, ⇧⌘Z after undo Connection.
