# Inspect fields rest

Status: validated

## Problem

Inspector can Add Field on a Command and rename it. Members cannot set Field type, optional, or example, cannot delete a Field, cannot append a Field on Event, Read Model, or Automation, and cannot name or type those Fields, so the Mac Fields editor is incomplete.

## Acceptance criteria

- [x] After clicking `Add Field` on `Command`, selecting `UUID` in Inspector `Field type` sets the last Command `fields[0].type` to `UUID`
- [x] After clicking `Add Field` on `Command`, checking Inspector `Optional` sets the last Command `fields[0].optional` to `true`
- [x] After clicking `Add Field` on `Command`, filling Inspector `Example` with `abc` sets the last Command `fields[0].example` to `abc`
- [x] After clicking `Add Field` on `Command`, clicking `Delete Field` sets the last Command `fields` to `[]`
- [x] Clicking `Add Field` after selecting `Event Happened` appends a Field whose `name` is `newField` on the last Event
- [x] Clicking `Add Field` after selecting `Read Model` appends a Field whose `name` is `newField` on the last Read Model
- [x] Clicking `Add Field` after selecting `Automation` appends a Field whose `name` is `newField` on the last Automation
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, filling `Field name` with `orderId` sets the first Command `fields[0].name` to `orderId`
- [x] After clicking `Add Field` on `Event Happened`, filling Inspector `Field name` with `eventId` sets the last Event `fields[0].name` to `eventId`
- [x] After clicking `Add Field` on `Read Model`, filling Inspector `Field name` with `viewId` sets the last Read Model `fields[0].name` to `viewId`
- [x] After clicking `Add Field` on `Automation`, filling Inspector `Field name` with `jobId` sets the last Automation `fields[0].name` to `jobId`
- [x] After clicking `Add Field` on `Event Happened`, selecting `UUID` in Inspector `Field type` sets the last Event `fields[0].type` to `UUID`
- [x] After clicking `Add Field` on `Read Model`, selecting `UUID` in Inspector `Field type` sets the last Read Model `fields[0].type` to `UUID`
- [x] After clicking `Add Field` on `Automation`, selecting `UUID` in Inspector `Field type` sets the last Automation `fields[0].type` to `UUID`
- [x] After clicking `Add Field` on `Event Happened`, checking Inspector `Optional` sets the last Event `fields[0].optional` to `true`
- [x] After clicking `Add Field` on `Read Model`, checking Inspector `Optional` sets the last Read Model `fields[0].optional` to `true`
- [x] After clicking `Add Field` on `Automation`, checking Inspector `Optional` sets the last Automation `fields[0].optional` to `true`
- [x] After clicking `Add Field` on `Event Happened`, filling Inspector `Example` with `abc` sets the last Event `fields[0].example` to `abc`
- [x] After clicking `Add Field` on `Read Model`, filling Inspector `Example` with `abc` sets the last Read Model `fields[0].example` to `abc`
- [x] After clicking `Add Field` on `Automation`, filling Inspector `Example` with `abc` sets the last Automation `fields[0].example` to `abc`
- [x] After clicking `Add Field` on `Event Happened`, clicking `Delete Field` sets the last Event `fields` to `[]`
- [x] After clicking `Add Field` on `Read Model`, clicking `Delete Field` sets the last Read Model `fields` to `[]`
- [x] After clicking `Add Field` on `Automation`, clicking `Delete Field` sets the last Automation `fields` to `[]`
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, clicking `Add Field`, filling `Field name` with `eventId` sets the first Event `fields[0].name` to `eventId`
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, clicking `Add Field`, filling `Field name` with `viewId` sets the first Read Model `fields[0].name` to `viewId`
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, clicking `Add Field`, filling `Field name` with `jobId` sets the first Automation `fields[0].name` to `jobId`
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, selecting `UUID` in Inspector `Field type` sets the first Command `fields[0].type` to `UUID`
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, checking Inspector `Optional` sets the first Command `fields[0].optional` to `true`
- [ ] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, filling Inspector `Example` with `abc` sets the first Command `fields[0].example` to `abc`
- [ ] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, clicking `Delete Field` sets the first Command `fields` to `[]`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `document` module — set Field `type` / `optional` / `example`, delete Field, append Field on Event / Read Model / Automation, set Field `name` on the clicked Command / Event / Read Model / Automation; the editor path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Last-Command `Add Field` and last-Command `newField` / `String` / Field name stay [inspect-fields.md](./inspect-fields.md) when that spec is present.
- Field type option labels are the schema enum: `String`, `Boolean`, `Int`, `Long`, `Double`, `Decimal`, `Date`, `DateTime`, `UUID`, `Custom`. Combobox accessible name is `Field type`.
- `Optional` is a checkbox. `Example` is a textbox. `Delete Field` is a button on that Field row.
- Add still targets the last Slice. Command Field type / optional / example / delete mutate the last Command. Add Field after selecting Event / Read Model / Automation mutates the last of that kind, including Field name / type / optional / example / delete. After two Commands, Add Field and Field name mutate the clicked Command. After two Events, Add Field and Field name mutate the clicked Event. After two Read Models, Add Field and Field name mutate the clicked Read Model. After two Automations, Add Field and Field name mutate the clicked Automation. After two Commands, Field type / Optional / Example / Delete Field mutate the clicked Command.
- Edits are in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Actor Fields (Mac has none). Mac window chrome. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Inspect Fields after reload is [inspect-rest.md](./inspect-rest.md).

## Restates

- [inspect-fields.md](./inspect-fields.md) — Do not edit this file if it is not on the branch. Out of scope no longer owns Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, Field name / type / optional / example / delete on those kinds, or Field name on the clicked Command of two; this slice owns those. Last-Command Add Field and last-Command Field name stay that file.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Field type / optional / example / delete or Add Field that appends on Event / Read Model / Automation; this slice owns those plus Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns Field type / optional / example / delete; this slice owns those plus Field name / type / optional / example / delete on Event / Read Model / Automation, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [blocks.md](./blocks.md) — Field type / optional / example / delete and Add Field that appends on Event / Read Model / Automation are this slice, including Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [editor-shell.md](./editor-shell.md) — Field type / optional / example / delete and Add Field that appends on Event / Read Model / Automation are this slice, including Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [connections.md](./connections.md) — Field type / optional / example / delete and Add Field that appends on Event / Read Model / Automation are this slice, including Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [model-persistence.md](./model-persistence.md) — Field type / optional / example / delete and Add Field that appends on Event / Read Model / Automation are this slice, including Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [canvas.md](./canvas.md) — Out of scope no longer owns Inspector Field type / optional / example / delete; this slice owns those plus Field name / type / optional / example / delete on Event / Read Model / Automation, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md).
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns Inspector Fields; Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two are this slice. Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md).
- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns Inspector Fields; Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two are this slice. Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md).
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns Field type / optional / example / delete or Add Field that appends on Event / Read Model / Automation; this slice owns those plus Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md).
- [add-on-lane-rest.md](./add-on-lane-rest.md) — Out of scope no longer owns Field type / optional / example / delete or Add Field that appends on Event / Read Model / Automation; this slice owns those plus Field name / type / optional / example / delete on those kinds, Field name on the clicked Command / Event / Read Model / Automation of two, and Field type / optional / example / delete on the clicked Command of two. Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md).
- [product.md](../product.md) — Inspect Fields: type, optional, example, delete, and Add Field on Event / Read Model / Automation with name / type / optional / example / delete. Playwright path for this slice adds: Add Field on Command, Field type UUID, Optional, Example abc, Delete Field; Add Field on Event / Read Model / Automation appends newField then Field name eventId / viewId / jobId, Field type UUID, Optional, Example abc, Delete Field; two Add Command, click the first Command, Add Field, Field name orderId; two Add Event, click the first Event Happened, Add Field, Field name eventId; two Add Read Model, click the first Read Model, Add Field, Field name viewId; two Add Automation, click the first Automation, Add Field, Field name jobId; two Add Command, click the first Command, Add Field, Field type UUID, Optional.
