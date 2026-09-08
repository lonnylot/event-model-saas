# Inspect get second field

Status: validated

## Problem

GET `/app/teams/{id}/models/{mid}` after Save of two Fields on one Command, clicking `Command` shows Inspector Field name `orderId` (`fields[0]`) and does not show `newField`. Inspector binds one Field row, so a member who reopens a model cannot inspect the second Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Command` listitem shows Inspector `Field name` with the value `newField`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Command second Field bind after reload
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md). In-session Add Field that appends a second Field whose `name` is `newField` stays [inspect-fields.md](./inspect-fields.md). GET Inspector of the second Field on one Command is this slice.
- After two `Add Field` clicks, `fields[1].name` is `newField`. After reload, Inspector `Field name` `newField` is that second Field.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md). Delete Field after reload of one Command is [inspect-get-delete-field.md](./inspect-get-delete-field.md). Delete Field after reload of one Event is [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md). Delete Field after reload of one Read Model is [inspect-get-delete-field-read-model.md](./inspect-get-delete-field-read-model.md). Delete Field after reload of one Automation is [inspect-get-delete-field-automation.md](./inspect-get-delete-field-automation.md). GET Field type write of the first of two Commands is [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models stays [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations stays [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events stays [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models stays [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations stays [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands stays [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands stays [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event stays [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name still opens Inspector Name. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field type / optional / example / delete stay that file. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-fields.md](./inspect-fields.md) — Last-Command Add Field and Field name stay that file. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-get-event-optional.md](./inspect-get-event-optional.md) — Optional after reload of one Event stays that file. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-get-event-example.md](./inspect-get-event-example.md) — Example after reload of one Event stays that file. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [hydrate-add-field.md](./hydrate-add-field.md) — `Add Field` after reload stays that file. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [product.md](../product.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [editor-shell.md](./editor-shell.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [blocks.md](./blocks.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [inspect-blocks.md](./inspect-blocks.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
- [model-persistence.md](./model-persistence.md) — GET Inspector of the second Field on one Command is this slice. GET Field of one Command (`fields[0]`) stays [inspect-rest.md](./inspect-rest.md).
