# Inspect get command field type write

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Commands, clicking `Place Order` (the first) shows Inspector Field type `UUID`, but selecting `String` writes `commands.at(-1)`. GET Field type display binds the clicked Command; the change listener still calls `setFieldType` without id, so a member who reopens a model cannot change the first Command's Field type.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, selects `UUID` in `Field type`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, selects `Boolean` in `Field type`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, selecting `String` in `Field type`, clicking the Timeline `Cancel Order` listitem shows Inspector `Field type` with the value `Boolean`

## Domain terms

Event Model, Slice, Command, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Command Field type write binds the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Field type of the first of two Commands still shows `UUID` ([inspect-get-command-field-type.md](./inspect-get-command-field-type.md)). In-session Field type on the clicked Command of two stays [inspect-fields-rest.md](./inspect-fields-rest.md). GET Field type write of the first of two Commands is this slice. GET Field type write of a Command on the first of two Slices is [inspect-command-field-type-first-slice.md](./inspect-command-field-type-first-slice.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model is [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md). Delete Field after reload of one Command is [inspect-get-delete-field.md](./inspect-get-delete-field.md). Delete Field after reload of one Event is [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md). Delete Field after reload of one Read Model is [inspect-get-delete-field-read-model.md](./inspect-get-delete-field-read-model.md). Delete Field after reload of one Automation is [inspect-get-delete-field-automation.md](./inspect-get-delete-field-automation.md). GET Inspector of two Fields on one Command is [inspect-get-second-field.md](./inspect-get-second-field.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models stays [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations stays [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events stays [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models stays [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations stays [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands stays [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands stays [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event stays [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-get-command-field-type.md](./inspect-get-command-field-type.md) — GET Field type display of the first of two Commands stays that file. GET Field type write of the first of two Commands is this slice.
- [inspect-rest.md](./inspect-rest.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name still opens Inspector Name. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field type / optional / example / delete stay that file. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-fields.md](./inspect-fields.md) — Last-Command Add Field and Field name stay that file. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-get-event-optional.md](./inspect-get-event-optional.md) — Optional after reload of one Event stays that file. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-get-event-example.md](./inspect-get-event-example.md) — Example after reload of one Event stays that file. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [hydrate-add-field.md](./hydrate-add-field.md) — `Add Field` after reload stays that file. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [product.md](../product.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [editor-shell.md](./editor-shell.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [blocks.md](./blocks.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [inspect-blocks.md](./inspect-blocks.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
- [model-persistence.md](./model-persistence.md) — GET Field type write of the first of two Commands is this slice. GET Field type display of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md).
