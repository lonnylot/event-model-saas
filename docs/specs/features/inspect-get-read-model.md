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
- GET Name of `Orders` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). In-session Read Model Description-by-id stays [name-binding-rest.md](./name-binding-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). TIME click empty Inspector. GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Description of one Read Model still shows the saved value. GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Orders` still opens Inspector Name. GET Description of that listitem is this slice. GET Field of that listitem is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [name-binding-rest.md](./name-binding-rest.md) — In-session Read Model Description-by-id stays that file. GET first-of-two Read Model Description is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation Description of one Automation stays [inspect-rest.md](./inspect-rest.md).
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Read Model Description is this slice. GET first-of-two Read Model Field is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [editor-shell.md](./editor-shell.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [add-on-lane.md](./add-on-lane.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [blocks.md](./blocks.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [canvas.md](./canvas.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [chrome.md](./chrome.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [connection-feedback.md](./connection-feedback.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [connections.md](./connections.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-blocks.md](./inspect-blocks.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-connection.md](./inspect-connection.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-description.md](./inspect-description.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [inspect-fields.md](./inspect-fields.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [model-persistence.md](./model-persistence.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
- [slice-type.md](./slice-type.md) — Read Model Description after reload of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is this slice. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md).
