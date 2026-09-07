# Inspect connection

Status: released

## Problem

Members can drag a legal Port onto a Port and see `Command → Event Happened` on the Timeline, but clicking that Connection does not open Inspector, so From and To cannot be read the way the Mac inspector shows them.

## Acceptance criteria

- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `Connection` in the Inspector region
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `From Command` in the Inspector region
- [x] After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `To Event Happened` in the Inspector region

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Connect is still a drag from a Port onto a Port ([connections.md](./connections.md)). Add still targets the last Slice.
- Connection selection is a click on the Timeline text `Command → Event Happened`.
- Inspect is a click on a click-created Connection. Inspect after reload of a Connection is [inspect-rest.md](./inspect-rest.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- Inspector From / To use the Command `title` and Event `title` (`Command` and `Event Happened` at Add defaults).
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Command → Event Delete Connection is [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Last-item Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Mac window chrome. Event Model title and Description are [model-inspector.md](./model-inspector.md). Legal edges stay [connections.md](./connections.md). Event → Read Model inspect, inspect after reload of a Connection, Description after reload of one Slice, Slice type after reload of one Slice, Field after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Leftover Type after clicking `Command → Event Happened` is [inspect-switch.md](./inspect-switch.md). Leftover Connection / From Command / To Event Happened after clicking Command is [leftover-connection-command.md](./leftover-connection-command.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Last-item Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Name inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Last-item Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- [connections.md](./connections.md) — Inspecting a Connection is this slice. Command → Event Delete Connection is [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — Out of scope no longer owns inspecting a Connection; this slice owns click-created Connection inspect. Inspect after reload of a Connection is [inspect-rest.md](./inspect-rest.md).
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns inspecting a Connection; this slice owns those.
- [inspect-fields.md](./inspect-fields.md) — Out of scope no longer owns inspecting a Connection; this slice owns those. Last-Command Add Field and last-Command Field name stay that spec. Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [slice-type.md](./slice-type.md) — Out of scope no longer owns inspecting a Connection; this slice owns those.
- [product.md](../product.md) — Inspect a Connection; show From and To. Delete of a Command → Event Connection is [delete-blocks.md](./delete-blocks.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Playwright path for this slice adds: drag Command port onto Event Happened port, click `Command → Event Happened`, Inspector shows Connection, From Command, To Event Happened.
