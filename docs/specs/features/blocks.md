# Blocks

Status: released

## Problem

The editor shell has Slices, a Timeline, and Inspector, but members cannot put an Actor, Command, Event, Read Model, or Automation on a Slice, so they still cannot model.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Actor`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Command`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Event`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Read Model`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Automation`
- [x] GET `/app/teams/{id}/models/{mid}` as a member with no Actors does not show a listitem whose accessible name is `Actor`
- [x] Clicking `Add Actor` on that page after `New Slice` appends an Actor whose `name` is `Actor`
- [x] Clicking `Add Command` on that page after `New Slice` appends a Command whose `title` is `Command`
- [x] Clicking `Add Command` on that page after `New Slice` appends a Command whose `type` is `COMMAND`
- [x] Clicking `Add Command` on that page after `New Slice` appends a Command whose `fields` is `[]`
- [x] Clicking `Add Event` on that page after `New Slice` appends an Event whose `title` is `Event Happened`
- [x] Clicking `Add Event` on that page after `New Slice` appends an Event whose `type` is `EVENT`
- [x] Clicking `Add Event` on that page after `New Slice` appends an Event whose `fields` is `[]`
- [x] Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `title` is `Read Model`
- [x] Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `type` is `READMODEL`
- [x] Clicking `Add Read Model` on that page after `New Slice` appends a Read Model whose `fields` is `[]`
- [x] Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `title` is `Automation`
- [x] Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `type` is `AUTOMATION`
- [x] Clicking `Add Automation` on that page after `New Slice` appends an Automation whose `fields` is `[]`
- [x] After clicking `New Slice` then `Add Actor` on that page, the Timeline region shows 2 listitem whose accessible name is `Actor`
- [x] After clicking `New Slice` then `Add Command` on that page, the Timeline region shows a listitem whose accessible name is `Command`
- [x] After clicking `New Slice` then `Add Event` on that page, the Timeline region shows a listitem whose accessible name is `Event Happened`
- [x] After clicking `New Slice` then `Add Read Model` on that page, the Timeline region shows a listitem whose accessible name is `Read Model`
- [x] After clicking `New Slice` then `Add Automation` on that page, the Timeline region shows a listitem whose accessible name is `Automation`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, and Saves, a reload of that page shows 2 listitem whose accessible name is `Actor` in the Timeline region

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — append Actor, Command, Event, Read Model, and Automation on an in-memory Event Model; the editor click path calls it
- `handleRequest` — model page HTML
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Toolbar Add still targets the last Slice. Slice and Actor selection are [chrome.md](./chrome.md).
- Clicking an Add button with no Slices does not create a Slice.
- Empty Actor JSON is `{ "id": "{uuid}", "name": "Actor" }`.
- Empty Command JSON is `{ "id": "{uuid}", "title": "Command", "type": "COMMAND", "fields": [] }`.
- Empty Event JSON is `{ "id": "{uuid}", "title": "Event Happened", "type": "EVENT", "fields": [] }`.
- Empty Read Model JSON is `{ "id": "{uuid}", "title": "Read Model", "type": "READMODEL", "fields": [] }`.
- Empty Automation JSON is `{ "id": "{uuid}", "title": "Automation", "type": "AUTOMATION", "fields": [] }` in the Slice `processors` array. The UI label is Automation.
- New Slice still starts with empty `actors` / `commands` / `events` / `readModels` / `processors` (not a default Actor). GET after Create shows `Actor` ([model-defaults.md](./model-defaults.md)). GET with no Actors is a Slice that has none (imported empty actors).
- Add is in-memory until Save. Save still uses the version check from model-persistence.

## Out of scope

Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Shortcut-shown listitems are [shortcut-shows.md](./shortcut-shows.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Delete Command is [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Drag Actor between Slices, undo New Slice, pan, and moving Slices (⌥⌘←) are [canvas.md](./canvas.md). Drag of Command between Slices and undo Add Command are [canvas-rest.md](./canvas-rest.md). Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). Description-by-id and Slice type-by-id are [name-binding-rest.md](./name-binding-rest.md). Mac window chrome, creating a Slice from Add when there are none. Connections are [connections.md](./connections.md). Event → Command refusal is [connection-feedback.md](./connection-feedback.md). Actor and Automation as connection endpoints (refusal) are [connection-refusals.md](./connection-refusals.md). Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Event / Read Model / Automation reload-lists are [inspect-after-reload.md](./inspect-after-reload.md). Actor reload-list stays [chrome.md](./chrome.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Event → Read Model Connection after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). Read Model Field type after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). Automation Field type after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md).

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns Actors, commands, events, read models, or automations; this slice owns adding those blocks. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Moving Slices (⌥⌘←) is [canvas.md](./canvas.md). Timeline Slice drag is [drag-rest.md](./drag-rest.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md).
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns Actors, commands, events, read models, or automations; this slice owns adding those blocks.
- [model-defaults.md](./model-defaults.md) — GET after Create shows `Actor`. GET with no Actors stays this file for a Slice that has none.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, Add Actor, Save, reload still lists Actor on the Timeline. Command port drag is [connections.md](./connections.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md).
