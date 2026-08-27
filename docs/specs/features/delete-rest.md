# Delete rest

Status: validated

## Problem

Backspace deletes a selected Slice, Command, or Connection. Members cannot delete a selected Actor, Event, Read Model, or Automation, so those blocks cannot be removed the Mac way.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace sets the remaining Actor `id` to the Actor that was last
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace sets the remaining Event `id` to the Event that was last
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem then the Timeline region, pressing Backspace sets the remaining Read Model `id` to the Read Model that was last
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace sets the remaining Automation `id` to the Automation that was last
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Delete sets the remaining Actor `id` to the Actor that was last

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — delete Actor / Event / Read Model / Automation by id; the editor Backspace and Delete path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two listitems of the same default name are first vs last. After selection, Inspector `Name` may have focus, so delete is Backspace or Delete after clicking the Timeline region.
- Slice / Command / Connection delete stay [canvas.md](./canvas.md) and [delete-blocks.md](./delete-blocks.md). Delete is the same path as Backspace (Mac `onDeleteCommand`).
- Delete is in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Undo of delete. Inspector Delete Connection button. Mac window chrome. Slice Backspace stays [canvas.md](./canvas.md). Command / Connection Backspace stay [delete-blocks.md](./delete-blocks.md).

## Restates

- [delete-blocks.md](./delete-blocks.md) — Out of scope no longer owns delete of Actor, Event, Read Model, or Automation; this slice owns those. Command and Connection Backspace stay that file.
- [canvas.md](./canvas.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Slice Backspace stays this file. Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md).
- [blocks.md](./blocks.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md).
- [chrome.md](./chrome.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Slice Backspace stays [canvas.md](./canvas.md). Delete Command stays [delete-blocks.md](./delete-blocks.md).
- [connections.md](./connections.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Connection stays [delete-blocks.md](./delete-blocks.md).
- [inspect-blocks.md](./inspect-blocks.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Command stays [delete-blocks.md](./delete-blocks.md).
- [add-on-lane.md](./add-on-lane.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md).
- [connection-feedback.md](./connection-feedback.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md).
- [inspect-description.md](./inspect-description.md) — Delete of Actor, Event, Read Model, and Automation is this slice. Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md).
- [product.md](../product.md) — Delete the selected Actor, Event, Read Model, or Automation (Backspace/Delete). Delete Command / Connection stay [delete-blocks.md](./delete-blocks.md). Playwright path for this slice adds: two of each kind, Backspace the first; Delete on Actor.
