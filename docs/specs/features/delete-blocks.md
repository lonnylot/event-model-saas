# Delete blocks

Status: validated

## Problem

Backspace deletes the selected Slice. Members cannot delete a selected Command or Connection, so a mistaken block or edge stays until they undo the whole add.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem then the Timeline region, pressing Backspace sets the remaining Command `id` to the Command that was last
- [ ] After dragging from `Command port` onto `Event Happened port` then from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Command → Event Happened` then the Timeline region, pressing Backspace sets the remaining Connection `fromKind` to `EVENT`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person, Version

## Seams

- `document` module — `deleteCommand` and `deleteConnection`; the editor Backspace path calls those
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two Timeline `Command` listitems are first vs last. Chrome Name still mutates the last Command.
- Command selection is a click on the Timeline listitem. Connection selection is a click on the Timeline text `Command → Event Happened`. After that click, Inspector `Name` may have focus, so delete is Backspace after clicking the Timeline region (not while typing in `Name`).
- Add still targets the last Slice. Add Command twice then Add Event and Add Read Model for the two Connections.
- Remaining Connection after deleting `Command → Event Happened` is Event → Read Model (`fromKind` `EVENT`).
- Slice Backspace stays [canvas.md](./canvas.md). Delete of Actor / Event / Read Model / Automation stays later.
- Delete is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Delete Actor, Event, Read Model, or Automation. Undo of delete. Inspecting a Connection is [inspect-connection.md](./inspect-connection.md). Description is [inspect-description.md](./inspect-description.md). Add Field and Field name on Command are [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Event Model title and Description are [model-inspector.md](./model-inspector.md). Mac window chrome. Slice delete stays [canvas.md](./canvas.md).

## Restates

- [canvas.md](./canvas.md) — Out of scope no longer owns delete of a Command or Connection; this slice owns those. Delete of Actor / Event / Read Model / Automation and undo of delete stay later. Slice Backspace stays this file.
- [connections.md](./connections.md) — Delete Connection is this slice.
- [blocks.md](./blocks.md) — Delete Command is this slice. Delete of other blocks stays later.
- [inspect-blocks.md](./inspect-blocks.md) — Delete Command is this slice.
- [chrome.md](./chrome.md) — Delete Command is this slice.
- [product.md](../product.md) — Delete the selected Command (Backspace) and the selected Connection (Backspace). Delete of Actor / Event / Read Model / Automation stays later. Playwright path for this slice adds: two Add Command, Backspace deletes the first; two Connections, Backspace deletes `Command → Event Happened`.
