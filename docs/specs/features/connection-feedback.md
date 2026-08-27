# Connection feedback

Status: validated

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
- Add still targets the last Slice. Highlight and illegal-pair tests add Command, Event, and Read Model on that Slice as needed.
- Connect is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Duplicate-connection refusal, self-connection refusal, Actor or Automation as connection endpoints, Command → Command, Event → Event, Read Model → Command, Read Model → Event, dashed Add on a lane, keyboard ⌥⌘1–5, canvas move / delete / pan / undo, Inspector Description / Fields / Slice type picker, inspect after reload, Mac window chrome.

## Restates

- [connections.md](./connections.md) — Out of scope no longer owns highlighting legal targets, snap-back, reason on the source, or Event → Command; this slice owns those. The released bullet that the page shows `A command can't write a read model.` is restated to the Command listitem. Duplicate-connection, self-connection, and other illegal-pair copy stay later. Undo is [canvas.md](./canvas.md).
- [product.md](../product.md) — Highlighting legal targets, snap-back, reason on the source, and Event → Command are this slice. Illegal connection: Command → Read Model reason is on the Command listitem; Event → Command reason is on the Event Happened listitem. Other illegal pairs stay later. Undo is [canvas.md](./canvas.md). Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md).
- [chrome.md](./chrome.md) — Highlighting legal targets is this slice.
- [blocks.md](./blocks.md) — Event → Command refusal is this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns highlighting legal targets, snap-back, reason on the source, or Event → Command; this slice owns those. Canvas still owns undo, pan, moving Slices, delete Slice, and Actor drag.
