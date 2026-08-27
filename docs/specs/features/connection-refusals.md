# Connection refusals

Status: validated

## Problem

Command → Read Model and Event → Command are refused with copy on the source. Duplicate edges, self-edges, Command → Command, Event → Event, Read Model → anything, and drops onto Actor or Automation still append or stay silent, so leftover Mac `ConnectionRules` pairs are missing.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` does not append a Connection
- [x] After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` shows the text `A command can't write a command.` in the first Command listitem
- [x] After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` does not append a Connection
- [x] After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` shows the text `An event can't feed an event.` in the first Event Happened listitem
- [x] Dragging from `Read Model port` onto `Command port` does not append a Connection
- [x] Dragging from `Read Model port` onto `Command port` shows the text `A read model can't issue a command.` in the Read Model listitem
- [ ] Dragging from `Read Model port` onto `Event Happened port` does not append a Connection
- [ ] Dragging from `Read Model port` onto `Event Happened port` shows the text `A read model can't write an event.` in the Read Model listitem
- [ ] After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` does not append a Connection
- [ ] After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` shows the text `A read model can't feed a read model.` in the first Read Model listitem
- [ ] After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again does not append a second Connection
- [ ] After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again shows the text `That connection already exists.` in the Command listitem
- [ ] Dragging from `Command port` onto the same `Command port` does not append a Connection
- [ ] Dragging from `Command port` onto the same `Command port` shows the text `A block can't connect to itself.` in the Command listitem
- [ ] Dragging from `Command port` onto the Timeline `Actor` listitem does not append a Connection
- [ ] Dragging from `Command port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Command listitem
- [ ] Dragging from `Command port` onto the Timeline `Automation` listitem does not append a Connection
- [ ] Dragging from `Command port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Command listitem
- [ ] Dragging from `Command port` onto the first `New Slice` listitem does not append a Connection
- [ ] Dragging from `Command port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Command listitem

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Connection, Team, Person, Version

## Seams

- `document` module — refuse those pairs the same way Command → Read Model is refused; the editor drag path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Legal v1 edges stay Command → Event and Event → Read Model ([connections.md](./connections.md)). Command → Read Model and Event → Command stay [connection-feedback.md](./connection-feedback.md).
- Two default-named Commands / Events / Read Models are first vs last Ports (`Command port`, `Event Happened port`, `Read Model port`).
- Reason on the source is the refusal copy inside the source listitem, same as [connection-feedback.md](./connection-feedback.md). Refusal strings match the Mac `ConnectionRules` copy except Event → Command, which already uses `trigger` on that spec.
- Add still targets the last Slice. Tests add the blocks they need on that Slice.
- Connect is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Highlight of remaining illegal targets. Dashed Add leftovers. Keyboard leftovers. Inspector Description / Fields / Slice type picker. Mac window chrome. Command → Read Model and Event → Command stay [connection-feedback.md](./connection-feedback.md).

## Restates

- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns duplicate-connection, self-connection, Actor or Automation as endpoints, Command → Command, Event → Event, Read Model → Command, Read Model → Event, Read Model → Read Model, or Slice drop; this slice owns those leftover Mac pairs’ reason-on-the-source copy. Highlight, snap-back, Command → Read Model copy, and Event → Command stay that file.
- [connections.md](./connections.md) — Out of scope no longer owns duplicate-connection, self-connection, or the other illegal-pair copy from the Mac app; this slice owns those. Legal edges stay this file. Command → Read Model stays [connection-feedback.md](./connection-feedback.md).
- [blocks.md](./blocks.md) — Actor and Automation as connection endpoints (refusal) are this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns other illegal pairs; this slice owns those leftover Mac pairs’ reason-on-the-source copy. Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md).
- [product.md](../product.md) — Other illegal pairs, duplicate, self-connection, and Slice drop are this slice. Illegal connection: leftover Mac pairs refuse with copy on the source. Playwright path for this slice adds: Command → Command, Event → Event, Read Model → Command / Event / Read Model, second Command → Event, Command onto itself, Command onto Actor, Command onto Automation, Command onto New Slice. Highlighting legal targets, snap-back, Command → Read Model copy, and Event → Command stay [connection-feedback.md](./connection-feedback.md).
