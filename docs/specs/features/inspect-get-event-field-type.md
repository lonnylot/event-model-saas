# Inspect get event field type

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Events, clicking `Order Placed` (the first) shows Inspector Field type `Boolean` (the last Event). Field type binds `events.at(-1)`, so a member who reopens a model cannot inspect the first Event's Field type.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, selects `UUID` in `Field type`, fills `Name` with `Order Placed`, clicks `Add Event`, clicks the last Timeline `Event Happened` listitem, clicks `Add Field`, selects `Boolean` in `Field type`, fills `Name` with `Pinged`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem shows Inspector `Field type` with the value `UUID`

## Domain terms

Event Model, Slice, Event, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Event Field type bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Order Placed` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field type of one Event stays [inspect-rest.md](./inspect-rest.md). In-session Field type on the last Event stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Field type of the first of two Events is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event is [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event is [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Field type of one Event still shows the saved value. GET Field type of the first of two Events is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Order Placed` still opens Inspector Name. GET Field type of that listitem is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field type on the last Event stays that file. GET Field type of the first of two Events is this slice.
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Field type of the first of two Events is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Event Field type of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-read-model.md](./inspect-get-read-model.md) — GET Description of the first of two Read Models stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-actor.md](./inspect-get-actor.md) — GET Description of the first of two Actors stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-automation.md](./inspect-get-automation.md) — GET Description of the first of two Automations stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Field type of the first of two Events is this slice
- [inspect-get-read-model-field.md](./inspect-get-read-model-field.md) — GET Field of the first of two Read Models stays that file. GET Field type of the first of two Events is this slice.
- [inspect-get-automation-field.md](./inspect-get-automation-field.md) — GET Field of the first of two Automations stays that file. GET Field type of the first of two Events is this slice.
- [inspect-get-command-field-type.md](./inspect-get-command-field-type.md) — GET Field type of the first of two Commands stays that file. GET Field type of the first of two Events is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Event Field type is this slice.
- [editor-shell.md](./editor-shell.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [add-on-lane.md](./add-on-lane.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [blocks.md](./blocks.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [canvas.md](./canvas.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [chrome.md](./chrome.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [connection-feedback.md](./connection-feedback.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [connections.md](./connections.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [inspect-connection.md](./inspect-connection.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [inspect-description.md](./inspect-description.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [inspect-fields.md](./inspect-fields.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [model-persistence.md](./model-persistence.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [slice-type.md](./slice-type.md) — Event Field type after reload of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Event shows Inspector Field type of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is this slice.
