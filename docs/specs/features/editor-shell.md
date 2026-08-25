# Editor shell

Status: validated

## Problem

The open Event Model page is Save, Export, and Sign out. Members cannot see a Slice sidebar, timeline, or inspector, cannot add a Slice, and cannot tell the document is dirty, so they cannot start modeling.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member shows the Team name
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `New Slice`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Slices`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member with no Slices does not show a listitem whose accessible name is `New Slice`
- [ ] Clicking `New Slice` on that page shows a listitem whose accessible name is `New Slice`
- [ ] Clicking `New Slice` on that page appends a Slice whose `title` is `New Slice`
- [ ] Clicking `New Slice` on that page appends a Slice whose `sliceType` is `STATE_CHANGE`
- [ ] Clicking `New Slice` on that page appends a Slice whose `actors` is `[]`
- [ ] Clicking `New Slice` on that page appends a Slice whose `commands` is `[]`
- [ ] Clicking `New Slice` on that page appends a Slice whose `events` is `[]`
- [ ] Clicking `New Slice` on that page appends a Slice whose `readModels` is `[]`
- [ ] Clicking `New Slice` on that page appends a Slice whose `processors` is `[]`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Timeline`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Inspector`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member with no local edits does not show the text `Unsaved changes.`
- [ ] After clicking `New Slice` on that page, the page shows the text `Unsaved changes.`
- [ ] After clicking `New Slice` then `Save` on that page, the page does not show the text `Unsaved changes.`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom in`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom out`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Reset zoom`
- [ ] Clicking `Zoom in` on that page sets the Timeline `style.transform` to `scale(1.25)`
- [ ] Clicking `Zoom out` on that page sets the Timeline `style.transform` to `scale(0.8)`
- [ ] Clicking `Reset zoom` after `Zoom in` on that page sets the Timeline `style.transform` to `scale(1)`
- [ ] After a member creates a model, opens it, clicks `New Slice`, and Saves, a reload of that page shows a listitem whose accessible name is `New Slice`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `document` module — append Slice on an in-memory Event Model
- `handleRequest` — model page HTML
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- New Slice is in-memory until Save. Save still uses the version check from model-persistence.
- Empty Slice JSON is `{ "id": "{uuid}", "title": "New Slice", "sliceType": "STATE_CHANGE", "actors": [], "commands": [], "events": [], "readModels": [], "processors": [] }`.
- Zoom factors are `1.25` (in), `0.8` (out), `1` (reset). Pan is later.
- Inspector in this slice is an empty named region; editing Slice or block fields is later.

## Out of scope

Actors, commands, events, read models, automations, connections, undo, pan, keyboard shortcuts, inspector fields, moving Slices, Mac window chrome.

## Restates

- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns editor canvas, New Slice, zoom, or the dirty indicator; this slice owns those. Undo, connections, and inspector fields stay later.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, dirty copy, Save, reload still lists New Slice; it is not “add a slice” as a block, connections, or inspector fields
