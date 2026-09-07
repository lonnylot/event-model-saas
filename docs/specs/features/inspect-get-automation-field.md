# Inspect get automation field

Status: validated

## Problem

GET `/app/teams/{id}/models/{mid}` after two Automations, clicking `Send Email` (the first) does not show Field name `jobId`. Field binds `processors.at(-1)`, so a member who reopens a model cannot inspect the first Automation's Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Automation`, clicks the Timeline `Automation` listitem, clicks `Add Field`, fills `Field name` with `jobId`, fills `Name` with `Send Email`, clicks `Add Automation`, clicks the last Timeline `Automation` listitem, clicks `Add Field`, fills `Field name` with `billId`, fills `Name` with `Charge Card`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem shows Inspector `Field name` with the value `jobId`

## Domain terms

Event Model, Slice, Automation, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Automation Field bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Send Email` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of one Automation stays [inspect-rest.md](./inspect-rest.md). In-session Field name on the clicked Automation of two stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Field of the first of two Automations is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event is [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event is [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Field of one Automation still shows the saved value. GET Field of the first of two Automations is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name of `Send Email` still opens Inspector Name. GET Field of that listitem is this slice.
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field name on the clicked Automation of two stays that file. GET Field of the first of two Automations is this slice.
- [inspect-get-automation.md](./inspect-get-automation.md) — GET Description of the first of two Automations stays that file. GET Field of the first of two Automations is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Automation Field of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-read-model.md](./inspect-get-read-model.md) — GET Description of the first of two Read Models stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-actor.md](./inspect-get-actor.md) — GET Description of the first of two Actors stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Field of the first of two Automations is this slice
- [inspect-get-read-model-field.md](./inspect-get-read-model-field.md) — GET Field of the first of two Read Models stays that file. GET Field of the first of two Automations is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Automation Field is this slice.
- [editor-shell.md](./editor-shell.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [add-on-lane.md](./add-on-lane.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [blocks.md](./blocks.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [canvas.md](./canvas.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [chrome.md](./chrome.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [connection-feedback.md](./connection-feedback.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [connections.md](./connections.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [inspect-connection.md](./inspect-connection.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [inspect-description.md](./inspect-description.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [inspect-fields.md](./inspect-fields.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [model-persistence.md](./model-persistence.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [slice-type.md](./slice-type.md) — Automation Field after reload of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Automation shows Inspector Field name of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Automations is this slice.
