# Slice type

Status: released

## Problem

Every new Slice is `STATE_CHANGE`. Members cannot pick Slice type in Inspector, so a State View or Automation column cannot be marked on the web.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a combobox whose accessible name is `Type` in the Inspector region
- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Type` combobox with the value `State Change`
- [x] Selecting `State View` in Inspector `Type` after selecting `New Slice` sets the last Slice `sliceType` to `STATE_VIEW`
- [x] Selecting `Automation` in Inspector `Type` after selecting `New Slice` sets the last Slice `sliceType` to `AUTOMATION`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, selects `State View` in `Type`, and Saves, a reload of that page sets the last Slice `sliceType` to `STATE_VIEW`

## Domain terms

Event Model, Slice, Slice type, Automation, Team, Person, Version

## Seams

- `document` module — set Slice `sliceType` on an in-memory Event Model; the editor click and select path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Slice selection is a click on the Slices listitem ([chrome.md](./chrome.md)).
- This slice is one in-session `New Slice`. Slice type JSON mutates the last Slice. Type on the clicked Slice of two is [name-binding-rest.md](./name-binding-rest.md). GET Type of one Slice is [inspect-rest.md](./inspect-rest.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md).
- Combobox option labels are `State Change`, `State View`, and `Automation`. JSON stays `STATE_CHANGE`, `STATE_VIEW`, `AUTOMATION`.
- New Slice still starts as `STATE_CHANGE` ([editor-shell.md](./editor-shell.md)).
- Slice type edits are in-memory until Save. Save still uses the version check from model-persistence.
- Reload proof reads `#event-model-document` after GET hydrates the saved body.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Inspecting a Connection is [inspect-connection.md](./inspect-connection.md). Slice type help copy, creating a Slice as State View from New Slice, dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Type on the clicked Slice of two is [name-binding-rest.md](./name-binding-rest.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Mac window chrome. Event Model title and Description are [model-inspector.md](./model-inspector.md). Name stays [chrome.md](./chrome.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Event → Read Model inspect, Slice type after reload of one Slice, Connection after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). Leftover Type after switching to a Connection is [inspect-switch.md](./inspect-switch.md). Type after TIME click is [inspect-deselect.md](./inspect-deselect.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [editor-shell.md](./editor-shell.md) — Slice type picker is this slice. Empty New Slice stays `STATE_CHANGE`. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [blocks.md](./blocks.md) — Slice type picker is this slice. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [connections.md](./connections.md) — Slice type picker is this slice. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [model-persistence.md](./model-persistence.md) — Slice type picker is this slice. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [canvas.md](./canvas.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [inspect-fields.md](./inspect-fields.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay this file. Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description stays this file. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [add-on-lane-rest.md](./add-on-lane-rest.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [product.md](../product.md) — Inspect a Slice; edit Slice type. Description is [inspect-description.md](./inspect-description.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Playwright path for this slice adds: click New Slice, select State View in Type, Save, reload last Slice `sliceType` is `STATE_VIEW`.
