# Delete blocks

Status: released

## Problem

Backspace deletes the selected Slice. Members cannot delete a selected Command or Connection, so a mistaken block or edge stays until they undo the whole add.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, pressing Backspace sets the remaining Command `id` to the Command that was last
- [x] After dragging from `Command port` onto `Event Happened port` then from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Command → Event Happened`, pressing Backspace sets the remaining Connection `fromKind` to `EVENT`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person, Version

## Seams

- `document` module — `deleteCommand` and `deleteConnection`; the editor Backspace path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two Timeline `Command` listitems are first vs last. Command Name mutates the last Command only when that Command is selected. Command multi-item Name is [name-binding.md](./name-binding.md).
- Command selection is a click on the Timeline listitem. Connection selection is a click on the Timeline text `Command → Event Happened`. After that click, Inspector `Name` may have focus, so delete is Backspace after clicking the selected listitem or Connection text (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)). In-session Command → Event Backspace is this slice. In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). GET `Command → Event Happened` Backspace is [hydrate-connection-id.md](./hydrate-connection-id.md). GET `Event Happened → Read Model` Backspace is [hydrate-event-read-id.md](./hydrate-event-read-id.md).
- Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). With no Slice selected, toolbar Add Command still targets the last Slice. Add Command twice then Add Event and Add Read Model for the two Connections.
- Remaining Connection after deleting `Command → Event Happened` is Event → Read Model (`fromKind` `EVENT`).
- Slice Backspace stays [canvas.md](./canvas.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md).
- Delete is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Undo of delete is [undo-rest.md](./undo-rest.md). Inspecting a Connection is [inspect-connection.md](./inspect-connection.md). Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Last-item Description is [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Event Model title and Description are [model-inspector.md](./model-inspector.md). GET `Command → Event Happened` Backspace is [hydrate-connection-id.md](./hydrate-connection-id.md). GET `Event Happened → Read Model` Backspace is [hydrate-event-read-id.md](./hydrate-event-read-id.md). In-session Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Inspector empty after Command Backspace is [inspect-after-delete.md](./inspect-after-delete.md). Mac window chrome. Slice delete stays [canvas.md](./canvas.md).

## Restates

- [canvas.md](./canvas.md) — Out of scope no longer owns delete of a Command or Command → Event Connection; this slice owns those. Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Undo of delete is [undo-rest.md](./undo-rest.md). Slice Backspace stays this file.
- [connections.md](./connections.md) — Delete Command → Event Connection (Backspace) is this slice. Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md).
- [inspect-connection.md](./inspect-connection.md) — Command → Event Backspace is this slice. Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md).
- [blocks.md](./blocks.md) — Delete Command is this slice. Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md).
- [inspect-blocks.md](./inspect-blocks.md) — Delete Command is this slice.
- [chrome.md](./chrome.md) — Delete Command is this slice.
- [inspect-description.md](./inspect-description.md) — Delete Command and Command → Event Connection Backspace are this slice. Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Slice Backspace stays [canvas.md](./canvas.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md).
- [add-on-lane.md](./add-on-lane.md) — Delete Command and Command → Event Connection Backspace are this slice. Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Slice Backspace stays [canvas.md](./canvas.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md).
- [connection-feedback.md](./connection-feedback.md) — Delete Command and Command → Event Connection Backspace are this slice. Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Slice Backspace stays [canvas.md](./canvas.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md).
- [product.md](../product.md) — Delete the selected Command (Backspace) and the selected Command → Event Connection (Backspace). Inspector Delete Connection is [inspect-delete-connection.md](./inspect-delete-connection.md). Event → Read Model Backspace is [delete-event-read.md](./delete-event-read.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Playwright path for this slice adds: two Add Command, Backspace deletes the first; two Connections, Backspace deletes `Command → Event Happened`.
