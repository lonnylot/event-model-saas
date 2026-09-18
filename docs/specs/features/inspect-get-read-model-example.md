# Inspect get read model example

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after Save of a Read Model with Example `abc`, clicking `Read Model` does not show Inspector Example `abc`. GET Read Model inspect binds Field name and Field type only, so a member who reopens a model cannot inspect that Read Model's Example.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, clicks `Add Field`, fills `Example` with `abc`, and Saves, a reload of that page, clicking the Timeline `Read Model` listitem shows Inspector `Example` with the value `abc`

## Domain terms

Event Model, Slice, Read Model, Field, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Read Model Example bind after reload
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET Name of `Read Model` still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Field of one Read Model stays [inspect-rest.md](./inspect-rest.md). Example after reload of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). In-session Read Model Example stays [inspect-fields-rest.md](./inspect-fields-rest.md). Example after reload of one Read Model is this slice. First-Slice Read Model Example write is [inspect-event-field-example-first-slice.md](./inspect-event-field-example-first-slice.md).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

First-Slice Read Model Example write is [inspect-event-field-example-first-slice.md](./inspect-event-field-example-first-slice.md). Optional after reload of one Read Model is [inspect-get-read-model-optional.md](./inspect-get-read-model-optional.md). Optional after reload of one Automation is [inspect-get-automation-optional.md](./inspect-get-automation-optional.md). Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md). Delete Field after reload of one Command is [inspect-get-delete-field.md](./inspect-get-delete-field.md). Delete Field after reload of one Event is [inspect-get-delete-field-event.md](./inspect-get-delete-field-event.md). Delete Field after reload of one Read Model is [inspect-get-delete-field-read-model.md](./inspect-get-delete-field-read-model.md). Delete Field after reload of one Automation is [inspect-get-delete-field-automation.md](./inspect-get-delete-field-automation.md). GET Inspector of two Fields on one Command is [inspect-get-second-field.md](./inspect-get-second-field.md). GET Field type write of the first of two Commands is [inspect-get-command-field-type-write.md](./inspect-get-command-field-type-write.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models stays [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors stays [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations stays [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations stays [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands stays [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events stays [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models stays [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations stays [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands stays [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands stays [inspect-get-command-example.md](./inspect-get-command-example.md). Optional after reload of one Event stays [inspect-get-event-optional.md](./inspect-get-event-optional.md). Example after reload of one Event stays [inspect-get-event-example.md](./inspect-get-event-example.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name still opens Inspector Name. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-fields-rest.md](./inspect-fields-rest.md) — In-session Field type / optional / example / delete stay that file. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-fields.md](./inspect-fields.md) — Last-Command Add Field and Field name stay that file. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-get-event-optional.md](./inspect-get-event-optional.md) — Optional after reload of one Event stays that file. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-get-event-example.md](./inspect-get-event-example.md) — Example after reload of one Event stays that file. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [hydrate-add-field.md](./hydrate-add-field.md) — `Add Field` after reload stays that file. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [product.md](../product.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [editor-shell.md](./editor-shell.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [blocks.md](./blocks.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [inspect-blocks.md](./inspect-blocks.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
- [model-persistence.md](./model-persistence.md) — Example after reload of one Read Model is this slice. Example after reload of one Automation is [inspect-get-automation-example.md](./inspect-get-automation-example.md).
