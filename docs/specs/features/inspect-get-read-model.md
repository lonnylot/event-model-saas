# Inspect get read model

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Read Models, clicking `Orders` (the first) shows Inspector Description `Cancel view` (the last Read Model). Description binds `readModels.at(-1)`, so a member who reopens a model cannot inspect the first Read Model's Description.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, fills `Description` with `List view`, clicks `Add Read Model`, clicks the last Timeline `Read Model` listitem, fills `Name` with `Cancels`, fills `Description` with `Cancel view`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem shows the Inspector `Description` textbox with the value `List view`

## Domain terms

Event Model, Slice, Read Model, Description, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Read Model Description bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Orders` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). In-session Read Model Description-by-id stays [name-binding-rest.md](./name-binding-rest.md). GET Description of the first of two Read Models is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). TIME click empty Inspector. GET Actor Description of the first of two Actors. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Description of one Read Model still shows the saved value. GET Description of the first of two Read Models is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Orders` still opens Inspector Name. GET Description of that listitem is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — In-session Read Model Description-by-id stays that file. GET first-of-two Read Model Description is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Inspector for Actor or Automation stays that file's Out of scope.
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Description of the first of two Read Models is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Description of the first of two Read Models is this slice.
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Description of the first of two Read Models is this slice.
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Read Model Description is this slice.
- [editor-shell.md](./editor-shell.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [add-on-lane.md](./add-on-lane.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [blocks.md](./blocks.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [canvas.md](./canvas.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [chrome.md](./chrome.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [connection-feedback.md](./connection-feedback.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [connections.md](./connections.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [inspect-connection.md](./inspect-connection.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [inspect-description.md](./inspect-description.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [inspect-fields.md](./inspect-fields.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [model-persistence.md](./model-persistence.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
- [slice-type.md](./slice-type.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice.
