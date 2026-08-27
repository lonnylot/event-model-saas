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
- [x] Clicking `Zoom in` on that page sets the Timeline `style.transform` to `scale(1.25)`
- [x] Clicking `Zoom out` on that page sets the Timeline `style.transform` to `scale(0.8)`
- [x] Clicking `Reset zoom` after `Zoom in` on that page sets the Timeline `style.transform` to `scale(1)`
- [x] After a member creates a model, opens it, clicks `New Slice`, and Saves, a reload of that page shows a listitem whose accessible name is `New Slice`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `document` module — append Slice on an in-memory Event Model; the editor click path calls it
- `handleRequest` — model page HTML
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- New Slice is in-memory until Save. Save still uses the version check from model-persistence.
- Empty Slice JSON is `{ "id": "{uuid}", "title": "New Slice", "sliceType": "STATE_CHANGE", "actors": [], "commands": [], "events": [], "readModels": [], "processors": [] }`.
- Zoom factors are `1.25` (in), `0.8` (out), `1` (reset). Pan is [canvas.md](./canvas.md).
- Inspector in this slice is an empty named region; Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Slice type picker is [slice-type.md](./slice-type.md). Empty New Slice stays `STATE_CHANGE`.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Undo, pan, and moving Slices are [canvas.md](./canvas.md). Mac window chrome. Actors, commands, events, read models, and automations are [blocks.md](./blocks.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice type picker is [slice-type.md](./slice-type.md).

## Restates

- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns editor canvas, New Slice, zoom, or the dirty indicator; this slice owns those. Undo is [canvas.md](./canvas.md). Connections are [connections.md](./connections.md). Slice and Actor Name are [chrome.md](./chrome.md).
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, dirty copy, Save, reload still lists New Slice. Add Actor is [blocks.md](./blocks.md).
