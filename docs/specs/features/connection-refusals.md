# Connection refusals

Status: released

## Problem

Command → Read Model and Event → Command are refused with copy on the source. Duplicate edges, self-edges, Command → Command, Event → Event, Read Model → anything, and drops onto Actor or Automation still append or stay silent, so leftover Mac `ConnectionRules` pairs are missing.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` does not append a Connection
- [x] After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` shows the text `A command can't write a command.` in the first Command listitem
- [x] After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` does not append a Connection
- [x] After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` shows the text `An event can't feed an event.` in the first Event Happened listitem
- [x] Dragging from `Read Model port` onto `Command port` does not append a Connection
- [x] Dragging from `Read Model port` onto `Command port` shows the text `A read model can't issue a command.` in the Read Model listitem
- [x] Dragging from `Read Model port` onto `Event Happened port` does not append a Connection
- [x] Dragging from `Read Model port` onto `Event Happened port` shows the text `A read model can't write an event.` in the Read Model listitem
- [x] After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` does not append a Connection
- [x] After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` shows the text `A read model can't feed a read model.` in the first Read Model listitem
- [x] After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again does not append a second Connection
- [x] After dragging from `Event Happened port` onto `Read Model port`, dragging from `Event Happened port` onto `Read Model port` again does not append a second Connection
- [x] After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again shows the text `That connection already exists.` in the Command listitem
- [x] After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again, pressing ⌘Z three times does not show a listitem whose accessible name is `New Slice`
- [x] After dragging from `Event Happened port` onto `Read Model port`, dragging from `Event Happened port` onto `Read Model port` again shows the text `That connection already exists.` in the Event Happened listitem
- [x] Dragging from `Command port` onto the same `Command port` does not append a Connection
- [x] Dragging from `Command port` onto the same `Command port` shows the text `A block can't connect to itself.` in the Command listitem
- [x] Dragging from `Event Happened port` onto the same `Event Happened port` does not append a Connection
- [x] Dragging from `Event Happened port` onto the same `Event Happened port` shows the text `A block can't connect to itself.` in the Event Happened listitem
- [x] Dragging from `Read Model port` onto the same `Read Model port` does not append a Connection
- [x] Dragging from `Read Model port` onto the same `Read Model port` shows the text `A block can't connect to itself.` in the Read Model listitem
- [x] Dragging from `Command port` onto the Timeline `Actor` listitem does not append a Connection
- [x] Dragging from `Command port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Command listitem
- [x] Dragging from `Event Happened port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Event Happened listitem
- [x] Dragging from `Read Model port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Read Model listitem
- [x] Dragging from `Command port` onto the Timeline `Automation` listitem does not append a Connection
- [x] Dragging from `Command port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Command listitem
- [x] Dragging from `Event Happened port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Event Happened listitem
- [x] Dragging from `Read Model port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Read Model listitem
- [x] Dragging from `Command port` onto the first `New Slice` listitem does not append a Connection
- [x] Dragging from `Command port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Command listitem
- [x] Dragging from `Event Happened port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Event Happened listitem
- [x] Dragging from `Read Model port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Read Model listitem
- [x] After dragging from `Command port` onto `Event Happened port`, pointer-down on `Command port`, the `Event Happened port` does not have `aria-current` `true`
- [x] After dragging from `Event Happened port` onto `Read Model port`, pointer-down on `Event Happened port`, the `Read Model port` does not have `aria-current` `true`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Connection, Team, Person, Version

## Seams

- `document` module — refuse those pairs the same way Command → Read Model is refused; the editor drag path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Legal v1 edges stay Command → Event and Event → Read Model ([connections.md](./connections.md)). Command → Read Model and Event → Command stay [connection-feedback.md](./connection-feedback.md). Duplicate is the same `fromID`/`toID`; Command → Event and Event → Read Model share that refuse.
- Two default-named Commands / Events / Read Models are first vs last Ports (`Command port`, `Event Happened port`, `Read Model port`). Same-port drop is that Port onto itself. The editor does not call `appendConnection` on same-port. Pointer-down is mousedown on the source Port and hold; highlight is visible before mouseup. Playwright `mouse.down` on the source Port (hover uses `force` so Timeline pan does not move the Port). Playwright waits for the New Slice listitem after click, and for the named Ports before pointer-down or drag.
- Two `New Slice` listitems are first vs last. Add still targets the last Slice, so Slice-drop tests put the Command / Event / Read Model on the last Slice and drag onto the first.
- Reason on the source is the refusal copy inside the source listitem, same as [connection-feedback.md](./connection-feedback.md). Refusal strings match the Mac `ConnectionRules` copy except Event → Command, which already uses `trigger` on that spec.
- Add still targets the last Slice. Tests add the blocks they need on that Slice.
- Connect is in-memory until Save. Save still uses the version check from model-persistence.
- ⌘Z is Playwright `ControlOrMeta+z`. After a refused second Command → Event, three presses: first undoes the successful Command → Event ([canvas.md](./canvas.md)); second undoes Add Command ([canvas-rest.md](./canvas-rest.md)); third undoes New Slice. A refused drop that still `undoStack.push("connection")` consumes the third press.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Dashed Add leftovers. Keyboard leftovers. Inspector Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Mac window chrome. Command → Read Model and Event → Command stay [connection-feedback.md](./connection-feedback.md). Legal-target highlight of Command → Event and Event → Read Model (no existing edge) stays [connection-feedback.md](./connection-feedback.md). Unhighlight of Command → Command, Event → Event, and Read Model source stays [connection-feedback.md](./connection-feedback.md) (highlighting legal targets). Undo of a successful Command → Event stays [canvas.md](./canvas.md). Undo Add Command is [canvas-rest.md](./canvas-rest.md).

## Restates

- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns duplicate-connection, self-connection, Actor or Automation as endpoints, Command → Command, Event → Event, Read Model → Command, Read Model → Event, Read Model → Read Model, or Slice drop; this slice owns those leftover Mac pairs’ reason-on-the-source copy. Event / Read Model onto Actor, Automation, and New Slice copy is this slice. Unhighlight of duplicate Command → Event and Event → Read Model is this slice. Unhighlight of Command → Command, Event → Event, and Read Model source stays that file (highlighting legal targets). Legal Command → Event and Event → Read Model highlight, snap-back, Command → Read Model copy, and Event → Command stay that file.
- [connections.md](./connections.md) — Out of scope no longer owns duplicate-connection, self-connection, or the other illegal-pair copy from the Mac app; this slice owns those. Legal edges stay this file. Command → Read Model stays [connection-feedback.md](./connection-feedback.md).
- [blocks.md](./blocks.md) — Actor and Automation as connection endpoints (refusal) are this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns other illegal pairs; this slice owns those leftover Mac pairs’ reason-on-the-source copy. Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Undo of Command → Event stays that file. A refused duplicate Command → Event does not push an extra connection undo.
- [product.md](../product.md) — Other illegal pairs, duplicate, self-connection, and Slice drop are this slice. Event / Read Model onto Actor, Automation, and New Slice refuse with copy on the source. Duplicate Command → Event and Event → Read Model do not highlight. Illegal connection: leftover Mac pairs refuse with copy on the source. Playwright path for this slice adds: Command → Command, Event → Event, Read Model → Command / Event / Read Model, second Command → Event, second Event → Read Model, Command onto itself, Event onto itself, Read Model onto itself, Command onto Actor, Event / Read Model onto Actor, Command onto Automation, Event / Read Model onto Automation, Command onto New Slice, Event / Read Model onto New Slice, refused second Command → Event then ⌘Z three times does not show New Slice, duplicate Command → Event does not highlight, duplicate Event → Read Model does not highlight. Legal Command → Event and Event → Read Model highlight, snap-back, Command → Read Model copy, and Event → Command stay [connection-feedback.md](./connection-feedback.md).
