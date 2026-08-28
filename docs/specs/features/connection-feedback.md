# Connection feedback

Status: released

## Problem

Members can drag a legal Port onto a Port, and Command → Read Model is rejected with page copy, but legal targets do not highlight, an illegal drop does not snap back, the reason is not on the source, and Event → Command is unrejected, so the drag still does not match Mac connection feedback.

## Acceptance criteria

- [x] After pointer-down on `Command port`, the `Event Happened port` has `aria-current` `true`
- [x] After pointer-down on `Command port`, the `Read Model port` does not have `aria-current` `true`
- [x] After pointer-down on `Event Happened port`, the `Read Model port` has `aria-current` `true`
- [x] After pointer-down on `Event Happened port`, the `Command port` does not have `aria-current` `true`
- [x] After dragging from `Command port` onto `Read Model port`, the `Event Happened port` does not have `aria-current` `true`
- [x] Dragging from `Command port` onto `Read Model port` shows the text `A command can't write a read model.` in the Command listitem
- [x] Dragging from `Event Happened port` onto `Command port` does not append a Connection
- [x] Dragging from `Event Happened port` onto `Command port` shows the text `An event can't trigger a command.` in the Event Happened listitem

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person, Version

## Seams

- `document` module — reject Event → Command the same way Command → Read Model is rejected; the editor pointer-down and drag path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Pointer-down is mousedown on the source Port and hold; highlight is visible before mouseup. Playwright `mouse.down` on the source Port (hover uses `force` so Timeline pan does not move the Port). Playwright waits for the New Slice listitem after click, and for the named Ports before pointer-down or drag.
- Legal v1 edges stay Command → Event and Event → Read Model ([connections.md](./connections.md)).
- Highlight is `aria-current="true"` on a legal target Port only while the pointer is down on a source Port.
- Snap-back is: after mouseup on an illegal Port, no Port still has `aria-current` `true`, and no Connection is appended (Command → Read Model still does not append, [connections.md](./connections.md)).
- Reason on the source is the illegal-pair copy inside the source listitem (Command listitem for Command → Read Model; Event Happened listitem for Event → Command), not a page-level paragraph.
- Toolbar Add still targets the last Slice. Highlight and illegal-pair tests add Command, Event, and Read Model on that Slice as needed.
- Connect is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Duplicate-connection refusal, self-connection refusal, Actor or Automation as connection endpoints, Command → Command, Event → Event, Read Model → Command, Read Model → Event, Read Model → Read Model, and Slice drop are [connection-refusals.md](./connection-refusals.md). Unhighlight of a duplicate Command → Event or Event → Read Model is [connection-refusals.md](./connection-refusals.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Delete, Actor drag between Slices, undo, pan, and moving Slices (⌥⌘←) are [canvas.md](./canvas.md). Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Description-by-id and Slice type-by-id are [name-binding-rest.md](./name-binding-rest.md). Mac window chrome. Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Slice Backspace stays [canvas.md](./canvas.md). Delete Command and Delete Connection are [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Event → Read Model inspect (in-session), Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect (in-session), Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).

## Restates

- [connections.md](./connections.md) — Out of scope no longer owns highlighting legal targets, snap-back, reason on the source, or Event → Command; this slice owns those. The released bullet that the page shows `A command can't write a read model.` is restated to the Command listitem. Duplicate-connection, self-connection, and other illegal-pair copy are [connection-refusals.md](./connection-refusals.md). Undo New Slice and undo Connection without a prior delete stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md).
- [product.md](../product.md) — Highlighting legal targets, snap-back, reason on the source, and Event → Command are this slice. Illegal connection: Command → Read Model reason is on the Command listitem; Event → Command reason is on the Event Happened listitem. Other illegal pairs, duplicate, self-connection, and Slice drop are [connection-refusals.md](./connection-refusals.md). Undo New Slice and undo Connection without a prior delete stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md). Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md).
- [chrome.md](./chrome.md) — Highlighting legal targets is this slice.
- [blocks.md](./blocks.md) — Event → Command refusal is this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns highlighting legal targets, snap-back, reason on the source, or Event → Command; this slice owns those. Canvas still owns undo New Slice / Connection, pan, moving Slices (⌥⌘←), delete Slice, and Actor drag. Timeline Slice drag is [drag-rest.md](./drag-rest.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). Other illegal pairs are [connection-refusals.md](./connection-refusals.md).
