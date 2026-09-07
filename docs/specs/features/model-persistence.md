# Model persistence

Status: released

## Problem

A Team has no Event Models. Members cannot create, open, import, export, or Save a document, so they cannot work on one model together.

## Acceptance criteria

- [x] POST `/api/teams/{id}/models` as a member returns status 201
- [x] POST `/api/teams/{id}/models` as a member returns content-type `application/json; charset=utf-8`
- [x] POST `/api/teams/{id}/models` as a Person who is not a member returns status 404
- [x] POST `/api/teams/{id}/models` as a member creates an Event Model whose title is `Untitled`
- [x] POST `/api/teams/{id}/models` as a member creates an Event Model whose version is `1`
- [x] POST `/api/teams/{id}/models` as a member writes R2 object `models/{id}.eventmodel`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `format` is `eventmodel`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `schemaVersion` is `1`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `id` is the Event Model id
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `title` is `Untitled`
- [x] GET `/app/teams/{id}` as a member shows a button whose accessible name is `Create model`
- [x] GET `/app/teams/{id}` as a member with an Event Model titled `Untitled` shows a link whose accessible name is `Untitled`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Untitled`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows the Person's email
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Save`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Export`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Sign out`
- [x] GET `/app/teams/{id}/models/{mid}` as a Person who is not a member returns status 404
- [x] PUT `/api/models/{id}` as a member with matching version returns status 200
- [x] PUT `/api/models/{id}` as a member with matching version returns the new version `2`
- [x] PUT `/api/models/{id}` as a member with matching version writes the submitted document to `models/{id}.eventmodel`
- [x] PUT `/api/models/{id}` as a member with a mismatched version returns status 409
- [x] PUT `/api/models/{id}` as a Person who is not a member returns status 404
- [x] PUT `/api/models/{id}` with a document whose `format` is not `eventmodel` returns status 400
- [x] PUT `/api/models/{id}` with a document whose `format` is not `eventmodel` leaves version `1`
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` returns status 400
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves version `1`
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves the R2 object unchanged
- [x] GET `/api/models/{id}/export` as a member returns content-type `application/json`
- [x] GET `/api/models/{id}/export` as a member sets `Content-Disposition` to `attachment; filename="Untitled.eventmodel"`
- [x] GET `/api/models/{id}/export` as a Person who is not a member returns status 404
- [x] POST `/api/teams/{id}/imports` with a document whose `format` is not `eventmodel` returns status 400
- [x] POST `/api/teams/{id}/imports` with a document whose `format` is not `eventmodel` does not create an Event Model
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` returns status 400
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not create an Event Model
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not write an R2 object
- [x] POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` returns status 201
- [x] POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` creates an Event Model whose title is `Library`
- [x] After a member creates a model and a second session Saves with version `1` after the first Save, the second session shows the text `This Event Model was saved by someone else.`
- [x] `createD1Store` `insertEventModel` with title `Untitled` returns that row from `getEventModel`
- [x] `createD1Store` `listEventModelsForTeam` returns the Untitled model
- [x] `createR2Documents` `put` of `models/{id}.eventmodel` returns that body from `get`
- [x] Worker `fetch` when `TEST_MAIL` is not `1` puts `models/{id}.eventmodel` on `MODELS`
- [x] Worker `fetch` when `TEST_MAIL` is not `1` inserts the Event Model into `DB`

- [x] `createD1Store` `setEventModelVersion` sets version `2`

- [x] PUT `/api/models/{id}` as a member with matching version writes the submitted document to `models/{id}.eventmodel`
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` returns status 400
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves version `1`
- [x] PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves the R2 object unchanged
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` returns status 400
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not create an Event Model
- [x] POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not write an R2 object
- [x] POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` writes the submitted document to `models/{id}.eventmodel`

## Domain terms

Event Model, Team, Person, Version, Slice

## Seams

- `isValidEventModelDocument` in `src/document/validate.ts` — save and import reject a body that fails `schemas/eventmodel.schema.json`
- `createModel`, `saveModel`, `importModel`, and `exportModel` in `src/models/` — unit tests pass a fake store and fake R2
- `createD1Store` in `src/auth/d1-store.ts` — unit tests construct it so a broken event-model statement fails
- `createR2Documents` in `src/models/r2-documents.ts` — unit tests construct it so a broken object key fails
- `handleRequest` — HTTP routing
- Worker `fetch` — unit tests call the default export without injected `env.documents` or `env.auth`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Create and import JSON fields are `title` (optional on create; default `Untitled`) and `document` (import only).
- Save JSON fields are `version` and `document`.
- Create `slices` `[]` is leftover unused ([model-defaults.md](./model-defaults.md)). Empty Event Model JSON `{ "format": "eventmodel", "schemaVersion": 1, "id": "{uuid}", "title": "Untitled", "slices": [] }` is leftover unused; Create writes one Slice in that slice. Import of `slices` `[]` still stores the submitted document.
- Schema file is `schemas/eventmodel.schema.json`, copied from the Mac app and not diverged in this slice.
- `run_worker_first` includes `/app` and `/app/*`.

## Out of scope

Description-by-id and Slice type-by-id are [name-binding-rest.md](./name-binding-rest.md). Mac window chrome, document history. AppBar `Event Model` link on GET `/app/teams/{id}` is [visual-shell.md](./visual-shell.md). Team page Event Models heading, empty copy, and model `article` lift are [app-chrome.md](./app-chrome.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Undo New Slice, pan, and moving Slices (⌥⌘←) are [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Sidebar drag-reorder, drag of Command between Slices, undo Add Command, and ⌘+/⌘-/⌘0 are [canvas-rest.md](./canvas-rest.md). Pinch pan stays [canvas.md](./canvas.md). ⌥⌘→ is [move-slice-right.md](./move-slice-right.md). Editor canvas, New Slice, zoom, and the dirty indicator are [editor-shell.md](./editor-shell.md). Actors, commands, events, read models, and automations are [blocks.md](./blocks.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md). Event → Read Model inspect, Command Description after reload of one Command, Slice type after reload of one Slice, and Command Field after reload of one Command are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Command Description after reload of one Command, Slice type after reload of one Slice, Command Field after reload of one Command, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload of one Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload of one Slice, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md).

## Restates
- [teams-and-invites.md](./teams-and-invites.md) — Out of scope no longer owns Event Model create/import/save/export; GET `/app/teams/{id}` as a member shows Create model and Event Model title links
- [product.md](../product.md) — Playwright path “land on team list” is the team page model list in this slice; this slice’s Playwright flow is open Event Model, Save, and second-session 409. New Slice, dirty copy, and reload still lists New Slice are [editor-shell.md](./editor-shell.md). Add Actor is [blocks.md](./blocks.md). Command port drag is [connections.md](./connections.md). Slice Name is [chrome.md](./chrome.md). Team page Event Models heading, empty copy, and model `article` lift are [app-chrome.md](./app-chrome.md).
