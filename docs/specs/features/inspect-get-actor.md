# Inspect get actor

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Actors, clicking the first Timeline `Actor` listitem shows Inspector Description `Librarian` (the last Actor). Description binds `actors.at(-1)`, so a member who reopens a model cannot inspect the first Actor's Description.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks the Timeline `Actor` listitem, fills `Description` with `Default actor`, clicks `Add Actor`, clicks the last Timeline `Actor` listitem, fills `Name` with `Shopper`, fills `Description` with `Librarian`, and Saves, a reload of that page, clicking the first Timeline `Actor` listitem shows the Inspector `Description` textbox with the value `Default actor`

## Domain terms

Event Model, Slice, Actor, Description, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Actor Description bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). GET Name of Actor / Shopper still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). GET Description of one Actor stays [inspect-rest.md](./inspect-rest.md). In-session Actor Description-by-id stays [name-binding-rest.md](./name-binding-rest.md). GET Actor `data-id` stays [hydrate-kind-id.md](./hydrate-kind-id.md). GET Description of the first of two Actors is this slice.
- Two Timeline `Actor` listitems are first vs last. The first is the Create default.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices stays [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands stays [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events stays [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models stays [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Actor `data-id` stays [hydrate-kind-id.md](./hydrate-kind-id.md). TIME click empty Inspector. GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md). Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Description of one Actor still shows the saved value. GET Description of the first of two Actors is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET Name still opens Inspector Name. GET Description of the first of two Actors is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — In-session Actor Description-by-id stays that file. GET first-of-two Actor Description is this slice.
- [model-defaults.md](./model-defaults.md) — Create still seeds one Actor named `Actor`. GET Description of that listitem when a second Actor exists is this slice.
- [hydrate-kind-id.md](./hydrate-kind-id.md) — GET Actor `data-id` stays that file. GET Description of the first of two Actors is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice. GET Inspector for Automation Description of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Optional of the first of two Commands is [inspect-get-command-optional.md](./inspect-get-command-optional.md). GET Example of the first of two Commands is [inspect-get-command-example.md](./inspect-get-command-example.md).
- [inspect-get-read-model.md](./inspect-get-read-model.md) — GET Description of the first of two Read Models stays that file. GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is this slice.
- [inspect-get-event.md](./inspect-get-event.md) — GET Description of the first of two Events stays that file. GET Field of the first of two Events stays that file. GET Description of the first of two Actors is this slice.
- [inspect-get-command.md](./inspect-get-command.md) — GET Description of the first of two Commands stays that file. GET Field of the first of two Commands stays that file. GET Description of the first of two Actors is this slice.
- [inspect-get-slice-description.md](./inspect-get-slice-description.md) — GET Description of the first of two Slices stays that file. GET Description of the first of two Actors is this slice.
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Type of the first of two Slices stays that file. GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Actor Description is this slice.
- [editor-shell.md](./editor-shell.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [add-on-lane.md](./add-on-lane.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [blocks.md](./blocks.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [canvas.md](./canvas.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [chrome.md](./chrome.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [connection-feedback.md](./connection-feedback.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [connections.md](./connections.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [inspect-connection.md](./inspect-connection.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [inspect-description.md](./inspect-description.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [inspect-fields.md](./inspect-fields.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [model-persistence.md](./model-persistence.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
- [slice-type.md](./slice-type.md) — Actor Description after reload of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Actors is this slice.
