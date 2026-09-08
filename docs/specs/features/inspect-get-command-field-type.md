# Inspect get command field type

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Commands, clicking `Place Order` (the first) shows Inspector Field type `Boolean` (the last Command). Field type binds `commands.at(-1)`, so a member who reopens a model cannot inspect the first Command's Field type.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, selects `UUID` in `Field type`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, selects `Boolean` in `Field type`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows Inspector `Field type` with the value `UUID`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Command Field type bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Place Order` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field type of one Command stays [inspect-rest.md](./inspect-rest.md). In-session Field type on the clicked Command of two stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Field type of the first of two Commands is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event is [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event is [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates
- [inspect-get-event-optional.md](./inspect-get-event-optional.md) — GET Field type of the first of two Commands stays this file. Optional after reload of one Event is that file.

- [inspect-get-command-optional.md](./inspect-get-command-optional.md) — GET Optional of the first of two Commands is that file. GET Field type of the first of two Commands stays this file.
- [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md) — GET Field type of the first of two Automations is that file. GET Field type of the first of two Commands stays this file.
- [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md) — GET Field type of the first of two Read Models is that file. GET Field type of the first of two Commands stays this file.
- [inspect-get-event-field-type.md](./inspect-get-event-field-type.md) — GET Field type of the first of two Events is that file. GET Field type of the first of two Commands stays this file.
- [inspect-rest.md](./inspect-rest.md) — GET Field type of one Command still shows the saved value. GET Field type of the first of two Commands is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Place Order` still opens Inspector Name. GET Field type of that listitem is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field type on the clicked Command of two stays that file. GET Field type of the first of two Commands is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Field type of the first of two Commands is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Command Field type of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-read-model.md](./inspect-get-read-model.md) — GET Description of the first of two Read Models stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-actor.md](./inspect-get-actor.md) — GET Description of the first of two Actors stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-automation.md](./inspect-get-automation.md) — GET Description of the first of two Automations stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Field type of the first of two Commands is this slice
- [inspect-get-read-model-field.md](./inspect-get-read-model-field.md) — GET Field of the first of two Read Models stays that file. GET Field type of the first of two Commands is this slice.
- [inspect-get-automation-field.md](./inspect-get-automation-field.md) — GET Field of the first of two Automations stays that file. GET Field type of the first of two Commands is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Command Field type is this slice.
- [editor-shell.md](./editor-shell.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [add-on-lane.md](./add-on-lane.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [blocks.md](./blocks.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [canvas.md](./canvas.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [chrome.md](./chrome.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [connection-feedback.md](./connection-feedback.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [connections.md](./connections.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [inspect-connection.md](./inspect-connection.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [inspect-description.md](./inspect-description.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [inspect-fields.md](./inspect-fields.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [model-persistence.md](./model-persistence.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [slice-type.md](./slice-type.md) — Command Field type after reload of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Command shows Inspector Field type of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is this slice.
