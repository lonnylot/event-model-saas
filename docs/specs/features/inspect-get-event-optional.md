# Inspect get event optional

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after Save of an Event with Optional checked, clicking `Event Happened` does not show Inspector Optional checked. GET Event inspect binds Field name and Field type only, so a member who reopens a model cannot inspect that Event's Optional.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, checks `Optional`, and Saves, a reload of that page, clicking the Timeline `Event Happened` listitem shows Inspector `Optional` checked

## Domain terms

Event Model, Slice, Event, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Event Optional bind after reload
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Event Happened` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Field of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of one Event stays [inspect-rest.md](./inspect-rest.md). In-session Event Optional stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Optional of one Command stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). Example after reload of one Event is [inspect-get-event-example.md](./inspect-get-event-example.md). Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates
- [inspect-get-event-example.md](./inspect-get-event-example.md) — Optional after reload of one Event stays this file. Example after reload of one Event is that file. Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).

- [inspect-rest.md](./inspect-rest.md) — GET Optional of one Command still shows the saved value. Optional after reload of one Event is this slice. Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Event Happened` still opens Inspector Name. Optional after reload of one Event is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Event Optional stays that file. Optional after reload of one Event is this slice.
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. Optional after reload of one Event is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Event Field of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. Optional after reload of one Event is this slice
- [inspect-get-read-model.md](./inspect-get-read-model.md) — GET Description of the first of two Read Models stays that file. Optional after reload of one Event is this slice
- [inspect-get-actor.md](./inspect-get-actor.md) — GET Description of the first of two Actors stays that file. Optional after reload of one Event is this slice
- [inspect-get-automation.md](./inspect-get-automation.md) — GET Description of the first of two Automations stays that file. Optional after reload of one Event is this slice
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. Optional after reload of one Event is this slice
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. Optional after reload of one Event is this slice
- [inspect-get-read-model-field.md](./inspect-get-read-model-field.md) — GET Field of the first of two Read Models stays that file. Optional after reload of one Event is this slice.
- [inspect-get-automation-field.md](./inspect-get-automation-field.md) — GET Field of the first of two Automations stays that file. Optional after reload of one Event is this slice.
- [inspect-get-command-field-type.md](./inspect-get-command-field-type.md) — GET Field type of the first of two Commands stays that file. Optional after reload of one Event is this slice.
- [inspect-get-event-field-type.md](./inspect-get-event-field-type.md) — GET Field type of the first of two Events stays that file. Optional after reload of one Event is this slice.
- [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md) — GET Field type of the first of two Read Models stays that file. Optional after reload of one Event is this slice.
- [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md) — GET Field type of the first of two Automations stays that file. Optional after reload of one Event is this slice.
- [inspect-get-command-optional.md](./inspect-get-command-optional.md) — GET Optional of the first of two Commands stays that file. Optional after reload of one Event is this slice.
- [inspect-get-command-example.md](./inspect-get-command-example.md) — GET Example of the first of two Commands stays that file. Optional after reload of one Event is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Optional after reload of one Event is this slice.
- [editor-shell.md](./editor-shell.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [add-on-lane.md](./add-on-lane.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [blocks.md](./blocks.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [canvas.md](./canvas.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [chrome.md](./chrome.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [connection-feedback.md](./connection-feedback.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [connections.md](./connections.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [inspect-connection.md](./inspect-connection.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [inspect-description.md](./inspect-description.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [inspect-fields.md](./inspect-fields.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [hydrate-add-field.md](./hydrate-add-field.md) — `Add Field` after reload stays that file. Optional after reload of one Event is this slice.
- [model-persistence.md](./model-persistence.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [slice-type.md](./slice-type.md) — Event Field after reload of one Event stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Command shows Inspector Optional stays [inspect-rest.md](./inspect-rest.md). Optional after reload of one Event is this slice. Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
