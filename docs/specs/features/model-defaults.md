# Model defaults

Status: released

## Problem

POST Create model wrote `{ title: "Untitled", slices: [] }`. The hosted editor opened on a blank timeline. The Mac app's `Slice()` default is one Slice titled `New Slice` of type `STATE_CHANGE` with one Actor named `Actor`. A member who clicked Create model could not start modeling until they also clicked New Slice and Add Actor.

## Acceptance criteria

- [x] POST `/api/teams/{id}/models` as a member writes a document whose `description` is `""`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `connections` is `[]`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose `slices` length is `1`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `title` is `New Slice`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `sliceType` is `STATE_CHANGE`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `actors` length is `1`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice first Actor `name` is `Actor`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `commands` is `[]`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `events` is `[]`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `readModels` is `[]`
- [x] POST `/api/teams/{id}/models` as a member writes a document whose first Slice `processors` is `[]`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model shows a listitem whose accessible name is `New Slice`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model shows a listitem whose accessible name is `Actor` in the Timeline region

## Domain terms

Event Model, Team, Person, Slice, Actor

## Seams

- `createModel` in `src/models/` — unit tests pass a fake store and fake R2
- `env.documents` / `createR2Documents` — stored body
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Team, Editor. Primitives: Page, Button primary (`Create model`). Look of those screens stays `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Event Model `title` stays `Untitled` ([model-persistence.md](./model-persistence.md)). Mac JSON title `Untitled Event Model` is not this slice.
- Mac untitled *file* is empty `slices`. Mac `Slice()` init is `title` `New Slice`, `sliceType` `STATE_CHANGE`, `actors` `[Actor(name: "Actor")]`, empty commands / events / read models / processors. This slice seeds Create with one such Slice so the hosted editor is not a blank board.
- First Slice `id` and first Actor `id` are new UUIDs (`runtime.randomId` / `crypto.randomUUID`).
- Clicking `New Slice` still appends `actors` `[]` ([editor-shell.md](./editor-shell.md)). That click path is not this slice.
- Import still stores the submitted document ([model-persistence.md](./model-persistence.md)). An imported document with `slices` `[]` still has no Slices.
- GET `/app/teams/{id}/models/{mid}` as a member with no Slices does not show a listitem `New Slice` stays [editor-shell.md](./editor-shell.md) for an imported empty document. Sidebar `New Slice` listitem on GET after Create stays this file. Timeline `New Slice` listitem on GET after Create is [hydrate-board.md](./hydrate-board.md).
- Architecture adapter `documents` is still constructed only under the production Worker path / `TEST_MAIL` not `1` ([architecture.md](../architecture.md), [model-persistence.md](./model-persistence.md)).

## Out of scope

Renaming Untitled. Changing New Slice click defaults. Import. Sample Library Checkout content. Mac window chrome. Copy changes on Team / Editor chrome.

## Restates

- [model-persistence.md](./model-persistence.md) — POST Create still returns 201, title `Untitled`, version `1`, `format` `eventmodel`, `schemaVersion` `1`, `id` the Event Model id. `slices` `[]` is leftover unused; one default Slice is this slice. Empty Event Model JSON in Assumptions is leftover unused.
- [editor-shell.md](./editor-shell.md) — Clicking `New Slice` still appends title `New Slice`, `sliceType` `STATE_CHANGE`, `actors` `[]`. GET after Create now shows `New Slice` (this slice). GET with no Slices (imported empty) stays that file.
- [blocks.md](./blocks.md) — GET with no Actors does not show listitem `Actor` stays that file for a Slice that has none. GET after Create shows `Actor` (this slice). Add Actor after New Slice stays that file.
- [product.md](../product.md) — Create is no longer “empty Event Model (valid schema, no slices)”; Create writes the default Slice in this slice, then opens the editor.
- [architecture.md](../architecture.md) — `models` create still goes through `createModel`. Default Slice body is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — GET with no Slices shows `Start the timeline` stays that file for an imported empty document. Create is no longer that fixture.
- [canvas.md](./canvas.md) — After clicking `New Slice`, pressing ⌘Z leaves the Create default `New Slice` (2 listitems: sidebar + Timeline). Count `1` is leftover unused. Timeline `New Slice` listitem on GET after Create is [hydrate-board.md](./hydrate-board.md).
- [connection-refusals.md](./connection-refusals.md) — ⌘Z four times after a refused duplicate Command → Event leaves the Create default `New Slice` (2 listitems). Count `1` is leftover unused. Timeline `New Slice` listitem on GET after Create is [hydrate-board.md](./hydrate-board.md).
- [canvas-rest.md](./canvas-rest.md) — Restates of four-press undo still names Add Command on the stack; count `0` is leftover unused.
- [undo-rest.md](./undo-rest.md) — Restates of four-press undo still names Add Event on the stack; count `0` is leftover unused. After clicking `New Slice` then `Add Actor`, ⌘Z leaves the Create default `Actor` (1 listitem); redo shows 2.
- [delete-rest.md](./delete-rest.md) — Backspace/Delete of the first Timeline Actor after New Slice then Add Actor twice targets the last Slice.
