# Editor shell

Status: released

## Problem

The open Event Model page is Save, Export, and Sign out. Members cannot see a Slice sidebar, timeline, or inspector, cannot add a Slice, and cannot tell the document is dirty, so they cannot start modeling.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member shows the Team name
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `New Slice`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Slices`
- [x] GET `/app/teams/{id}/models/{mid}` as a member with no Slices does not show a listitem whose accessible name is `New Slice`
- [x] Clicking `New Slice` on that page shows a listitem whose accessible name is `New Slice`
- [x] Clicking `New Slice` on that page appends a Slice whose `title` is `New Slice`
- [x] Clicking `New Slice` on that page appends a Slice whose `sliceType` is `STATE_CHANGE`
- [x] Clicking `New Slice` on that page appends a Slice whose `actors` is `[]`
- [x] Clicking `New Slice` on that page appends a Slice whose `commands` is `[]`
- [x] Clicking `New Slice` on that page appends a Slice whose `events` is `[]`
- [x] Clicking `New Slice` on that page appends a Slice whose `readModels` is `[]`
- [x] Clicking `New Slice` on that page appends a Slice whose `processors` is `[]`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Timeline`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Inspector`
- [x] GET `/app/teams/{id}/models/{mid}` as a member with no local edits does not show the text `Unsaved changes.`
- [x] After clicking `New Slice` on that page, the page shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Save` on that page, the page does not show the text `Unsaved changes.`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom in`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom out`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Reset zoom`
- [x] Clicking `Zoom in` on that page sets `.board` `style.transform` to `scale(1.25)`
- [x] Clicking `Zoom out` on that page sets `.board` `style.transform` to `scale(0.8)`
- [x] Clicking `Reset zoom` after `Zoom in` on that page sets `.board` `style.transform` to `scale(1)`
- [x] After a member creates a model, opens it, clicks `New Slice`, and Saves, a reload of that page shows a listitem whose accessible name is `New Slice`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `document` module — append Slice on an in-memory Event Model; the editor click path calls it
- `handleRequest` — model page HTML
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- New Slice is in-memory until Save. Save still uses the version check from model-persistence. The Save button stays this file. ⌘S Save is [cmd-s-save.md](./cmd-s-save.md).
- GET `/app/teams/{id}/models/{mid}` as a member shows the Team name stays this file; that name is a link to the Team page ([app-chrome.md](./app-chrome.md)). Editor `nav` (Event Model href `/app`, Teams admin for site admin) is [app-chrome.md](./app-chrome.md).
- Empty Slice JSON is `{ "id": "{uuid}", "title": "New Slice", "sliceType": "STATE_CHANGE", "actors": [], "commands": [], "events": [], "readModels": [], "processors": [] }`.
- Zoom factors are `1.25` (in), `0.8` (out), `1` (reset). Those scales live on `.board` ([timeline-clip.md](./timeline-clip.md)). `section[aria-label="Timeline"]` `style.transform` `scale(1.25)` / `scale(0.8)` / `scale(1)` are leftover unused. Toolbar zoom stays this file. Keyboard ⌘+/⌘-/⌘0 are [canvas-rest.md](./canvas-rest.md). Scroll pan and pinch pan are [canvas.md](./canvas.md). TIME chrome remaining the hit target after Zoom in is [time-chrome-stay.md](./time-chrome-stay.md).
- GET Inspector chrome (heading, empty copy) is [designed-surfaces.md](./designed-surfaces.md); Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Slice type picker is [slice-type.md](./slice-type.md). Empty New Slice stays `STATE_CHANGE`.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.
- GET `/app/teams/{id}/models/{mid}` as a member with no Slices is an imported empty document ([model-defaults.md](./model-defaults.md)). GET after Create shows `New Slice`. Toolbar `New Slice` stays this file. Timeline `New Slice` listitem on GET after Create is [hydrate-board.md](./hydrate-board.md).

## Out of scope

⌘S Save is [cmd-s-save.md](./cmd-s-save.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Pan and moving Slices (⌥⌘←) are [canvas.md](./canvas.md). Undo New Slice stays [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md). Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Keyboard ⌘+/⌘-/⌘0 and sidebar drag-reorder are [canvas-rest.md](./canvas-rest.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). Description-by-id and Slice type-by-id are [name-binding-rest.md](./name-binding-rest.md). Mac window chrome. Editor stylesheet, Timeline background, Inspector border, and sticky-note block fills are [product-visual.md](./product-visual.md). Actors, commands, events, read models, and automations are [blocks.md](./blocks.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Event → Read Model inspect, Command Description after reload of one Command, Slice type after reload of one Slice, and Command Field after reload of one Command are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Command Description after reload of one Command, Slice type after reload of one Slice, Command Field after reload of one Command, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). The Landing picture of editor chrome is [landing-saas-shot.md](./landing-saas-shot.md). Editor AppBar `nav`, AppBar Mark, and Team name as a link to `/app/teams/{id}` are [app-chrome.md](./app-chrome.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). Read Model Field type after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). Automation Field type after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md).

## Restates

- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns editor canvas, New Slice, zoom, or the dirty indicator; this slice owns those. Undo New Slice is [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md).
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, dirty copy, Save, reload still lists New Slice. Add Actor is [blocks.md](./blocks.md). Editor stylesheet and block fills are [product-visual.md](./product-visual.md). Editor AppBar `nav` and AppBar Mark are [app-chrome.md](./app-chrome.md).
- [admin-nav.md](./admin-nav.md) — `nav` on App, picker, Team, Teams admin stays that file. Editor `nav` is [app-chrome.md](./app-chrome.md).
