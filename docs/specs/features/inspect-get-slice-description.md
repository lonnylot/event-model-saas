# Inspect get slice description

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after two Slices, clicking the first Timeline `New Slice` listitem shows Inspector Description `Second column` (the last Slice). Description binds `slices.at(-1)`, so a member who reopens a model cannot inspect the first Slice's Description.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks the Timeline `New Slice` listitem, fills `Description` with `First column`, clicks `New Slice`, clicks the last Timeline `New Slice` listitem, fills `Description` with `Second column`, and Saves, a reload of that page, clicking the first Timeline `New Slice` listitem shows the Inspector `Description` textbox with the value `First column`

## Domain terms

Event Model, Slice, Description, Team, Person, Version

## Seams

- `bindInspect` in `public/editor-inspect.js` — GET Slice Description bind by the clicked listitem
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Clicking `New Slice` still appends a Slice ([editor-shell.md](./editor-shell.md)). GET Description of one Slice stays [inspect-rest.md](./inspect-rest.md). In-session Slice Description-by-id stays [name-binding-rest.md](./name-binding-rest.md). GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is this slice.
- Two `New Slice` listitems are first vs last. The first Timeline `New Slice` is the Create default.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Type of the first of two Slices stays [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Command Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-rest.md](./inspect-rest.md) — GET Description of one Slice still shows the saved value. GET Description of the first of two Slices is this slice.
- [name-binding-rest.md](./name-binding-rest.md) — In-session Slice Description-by-id stays that file. GET first-of-two Slice Description is this slice.
- [editor-bind-split.md](./editor-bind-split.md) — `bindInspect` stays `public/editor-inspect.js`. GET Inspector for Command Description of one Command stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Inspector for Command Field of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Description of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Field of one Event stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation Description of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-get-slice-type.md](./inspect-get-slice-type.md) — GET Inspector for Description no longer stays [editor-bind-split.md](./editor-bind-split.md) Out of scope. GET Description of the first of two Slices is this slice. GET Type of the first of two Slices stays that file.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET first-of-two Slice Description is this slice.
- [editor-shell.md](./editor-shell.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [add-on-lane.md](./add-on-lane.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [blocks.md](./blocks.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [canvas.md](./canvas.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [chrome.md](./chrome.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [connection-feedback.md](./connection-feedback.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [connections.md](./connections.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-connection.md](./inspect-connection.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-description.md](./inspect-description.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [inspect-fields.md](./inspect-fields.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [model-persistence.md](./model-persistence.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
- [slice-type.md](./slice-type.md) — Description after reload of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is this slice.
