# Connections

Status: released

## Problem

Members can put Commands, Events, and Read Models on a Slice, but they cannot connect them, so the timeline is still a pile of blocks instead of a model.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` on that page, the Command listitem shows a button whose accessible name is `Command port`
- [x] After clicking `New Slice` then `Add Event` on that page, the Event Happened listitem shows a button whose accessible name is `Event Happened port`
- [x] After clicking `New Slice` then `Add Read Model` on that page, the Read Model listitem shows a button whose accessible name is `Read Model port`
- [x] After clicking `New Slice` then `Add Actor` on that page, the Actor listitem does not show a button whose accessible name is `Actor port`
- [x] After clicking `New Slice` then `Add Automation` on that page, the Automation listitem does not show a button whose accessible name is `Automation port`
- [x] Dragging from `Command port` onto `Event Happened port` appends a Connection whose `fromKind` is `COMMAND`
- [x] Dragging from `Command port` onto `Event Happened port` appends a Connection whose `toKind` is `EVENT`
- [x] Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `fromKind` is `EVENT`
- [x] Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `toKind` is `READMODEL`
- [x] Dragging from `Command port` onto `Read Model port` does not append a Connection
- [x] Dragging from `Command port` onto `Read Model port` shows the text `A command can't write a read model.` in the Command listitem
- [x] After dragging from `Command port` onto `Event Happened port`, the Timeline region shows the text `Command → Event Happened`
- [x] After a member creates a model, opens it, clicks `New Slice`, adds a Command and an Event, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page shows the text `Command → Event Happened` in the Timeline region

## Domain terms

Event Model, Slice, Command, Event, Read Model, Actor, Automation, Connection, Team, Person, Version

## Seams

- `document` module — append Connection on an in-memory Event Model; the editor drag path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Connect is a drag from a Port onto a Port. Legal v1 edges are Command → Event and Event → Read Model, matching the Mac app.
- Empty Connection JSON is `{ "id": "{uuid}", "fromID": "{command or event uuid}", "fromKind": "COMMAND" | "EVENT", "toID": "{event or read model uuid}", "toKind": "EVENT" | "READMODEL" }`.
- Connections live on the Event Model `connections` array, not on the Slice.
- Toolbar Add still targets the last Slice. There is no Slice selection in this slice. `Add Command on lane` on a non-last Slice is [add-on-lane.md](./add-on-lane.md).
- Connect is in-memory until Save. Save still uses the version check from model-persistence.

## Out of scope

Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Mac window chrome. Duplicate-connection, self-connection, Actor or Automation as connection endpoints, and the other illegal-pair copy from the Mac app are [connection-refusals.md](./connection-refusals.md). Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Delete Command and Delete Connection are [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Drag blocks between Slices, pan, moving Slices, and undo are [canvas.md](./canvas.md). Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Event → Read Model inspect is [inspect-rest.md](./inspect-rest.md). Command → Event inspect is [inspect-connection.md](./inspect-connection.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Command Description after reload is [inspect-rest.md](./inspect-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Command → Event Connection after reload, Description after reload on Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload, Field after reload on Command / Event / Read Model / Automation, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Command → Event Connection after reload, GET-rendered Event → Read Model Connection after reload, Description after reload on Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload, Field after reload on Command / Event / Read Model / Automation, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md).

## Restates







## Restates
- [blocks.md](./blocks.md) — Out of scope no longer owns connections; this slice owns Command → Event and Event → Read Model. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Slice and Actor Name are [chrome.md](./chrome.md).
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns connections; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns connections; this slice owns those.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, Add Command, Add Event, drag Command port onto Event Happened port, Save, reload still shows `Command → Event Happened`. Highlighting legal targets, snap-back, reason on the source, and Event → Command are [connection-feedback.md](./connection-feedback.md). Duplicate-connection, self-connection, and other illegal-pair copy on the source are [connection-refusals.md](./connection-refusals.md). Delete Command and Delete Connection are [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Drag blocks between Slices, pan, moving Slices, and undo are [canvas.md](./canvas.md).
