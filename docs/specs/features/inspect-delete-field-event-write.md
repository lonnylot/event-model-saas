# Inspect delete field event write

Status: released

## Problem

GET Delete Field of one Event shows the button, but clicking it on the first of two Events clears `events.at(-1).fields`. `deleteField` for event ignores id. A member who reopens a model cannot delete the first Event's Field.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, fills `Name` with `Order Placed`, clicks `Add Event`, clicks the last Timeline `Event Happened` listitem, clicks `Add Field`, fills `Name` with `Order Cancelled`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem, clicking `Delete Field`, clicking the Timeline `Order Cancelled` listitem shows Inspector `Field name` with the value `newField`

## Domain terms

Event Model, Slice, Event, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Event Delete Field write binds the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Delete Field button of one Event stays [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md). Delete Field write of the first of two Events is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Add Field on a Command in the first of two Slices is [inspect-add-field-first-slice.md](./inspect-add-field-first-slice.md). GET Optional write of the first of two Commands is [inspect-command-optional-write.md](./inspect-command-optional-write.md). GET Example write of the first of two Commands is [inspect-command-example-write.md](./inspect-command-example-write.md). GET Field type write of the first of two Events is [inspect-event-field-type-write.md](./inspect-event-field-type-write.md). GET Field type write of the first of two Read Models is [inspect-read-model-field-type-write.md](./inspect-read-model-field-type-write.md). GET Field type write of the first of two Automations is [inspect-automation-field-type-write.md](./inspect-automation-field-type-write.md). In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md). GET second Field name write of two Fields on one Command is [inspect-second-field-name-write.md](./inspect-second-field-name-write.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models stays [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations stays [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type write of the first of two Commands stays [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md). GET Field type of the first of two Events stays [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models stays [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations stays [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands stays [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands stays [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event stays [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). Optional after reload of one Read Model stays [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Example after reload of one Read Model stays [inspect-get-read-model-example.md](./inspect-get-read-model-example.md). Optional after reload of one Automation stays [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation stays [inspect-get-automation-example.md](./inspect-get-automation-example.md). Delete Field after reload of one Command stays [inspect-get-delete-field.md](./inspect-get-delete-field.md). Delete Field after reload of one Event stays [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md). Delete Field after reload of one Read Model stays [inspect-get-delete-field-read-model.md](./inspect-get-delete-field-read-model.md). Delete Field after reload of one Automation stays [inspect-get-delete-field-automation.md](./inspect-get-delete-field-automation.md). GET Inspector of two Fields on one Command stays [inspect-get-second-field.md](./inspect-get-second-field.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [inspect-fields-rest.md](./inspect-fields-rest.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [inspect-fields.md](./inspect-fields.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [hydrate-add-field.md](./hydrate-add-field.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [editor-bind-split.md](./editor-bind-split.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [architecture.md](../architecture.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [product.md](../product.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [editor-shell.md](./editor-shell.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [blocks.md](./blocks.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [inspect-blocks.md](./inspect-blocks.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [model-persistence.md](./model-persistence.md) — Delete Field write of the first of two Events is this slice. In-session Delete Field after re-click of a Command that already has a Field is [inspect-in-session-delete-field.md](./inspect-in-session-delete-field.md).
- [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md) — GET Delete Field button of one Event stays that file. Delete Field write of the first of two Events is this slice.
- [inspect-automation-field-type-write.md](./inspect-automation-field-type-write.md) — GET Field type write of the first of two Automations stays that file. Delete Field write of the first of two Events is this slice.
