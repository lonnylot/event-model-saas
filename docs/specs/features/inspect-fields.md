# Inspect fields

Status: validated

## Problem

Members can inspect Name on a Command, Event, Read Model, or Automation, but Inspector has no Fields, so Mac `.eventmodel` Field lists cannot be added or named on the web.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows a button whose accessible name is `Add Field` in the Inspector region
- [x] After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows a button whose accessible name is `Add Field` in the Inspector region
- [x] After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows a button whose accessible name is `Add Field` in the Inspector region
- [x] After clicking `New Slice` then `Add Automation` on that page, clicking the Timeline `Automation` listitem shows a button whose accessible name is `Add Field` in the Inspector region
- [x] After clicking `New Slice` then `Add Command` then `Add Actor` on that page, clicking the Timeline `Command` listitem then the Timeline `Actor` listitem does not show a button whose accessible name is `Add Field`
- [x] After clicking `New Slice` then `Add Command` then `Add Actor` on that page, clicking the Timeline `Command` listitem, clicking `Add Field`, then the Timeline `Actor` listitem does not show a textbox whose accessible name is `Field name`
- [x] Clicking `Add Field` after selecting `Command` appends a Field whose `name` is `newField` on the last Command
- [x] Clicking `Add Field` after selecting `Command` appends a Field whose `type` is `String` on the last Command
- [x] Filling the Inspector `Field name` textbox with `orderId` after clicking `Add Field` on `Command` sets the last Command `fields[0].name` to `orderId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, and Saves, a reload of that page sets the last Command `fields[0].name` to `orderId`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Field, Team, Person, Version

## Seams

- `document` module — append a Field and set Field `name` on the last Command of an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Selection is the same click as Name ([inspect-blocks.md](./inspect-blocks.md)).
- Add still targets the last Slice. This slice is one in-session Command. Field JSON mutates the last Command.
- Empty Field JSON is `{ "id": "{uuid}", "name": "newField", "type": "String" }` matching the Mac `Field(name: "newField")` default.
- The Field name textbox accessible name is `Field name` so it is not the Inspector `Name` textbox.
- Field edits are in-memory until Save. Save still uses the version check from model-persistence.
- Reload proof reads `#event-model-document` after GET hydrates the saved body.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Slice type picker, inspecting a Connection, inspect after reload, Field `type` picker after Add, `optional`, `example`, delete Field, Add Field that appends on Event / Read Model / Automation (those kinds still show the button), leftover Add Field and Field name on Slice, leftover Field name on Event / Read Model / Automation after Add Field on Command, multi-item Field binding, model-level Title, Mac window chrome. Description is [inspect-description.md](./inspect-description.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Name stays [chrome.md](./chrome.md) and [inspect-blocks.md](./inspect-blocks.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Fields; this slice owns Add Field and Field name on Command. Description is [inspect-description.md](./inspect-description.md). Slice type picker, Field type / optional / example / delete, and inspect after reload stay later.
- [chrome.md](./chrome.md) — Out of scope no longer owns Fields; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [blocks.md](./blocks.md) — Fields is this slice. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [editor-shell.md](./editor-shell.md) — Fields is this slice. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [connections.md](./connections.md) — Fields is this slice. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [model-persistence.md](./model-persistence.md) — Fields is this slice. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [canvas.md](./canvas.md) — Out of scope no longer owns Inspector Fields; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns Inspector Fields; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns Inspector Fields; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later.
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns Fields; this slice owns those. Slice type picker stay later.
- [product.md](../product.md) — Inspect a Command; Add Field; edit Field name. Description is [inspect-description.md](./inspect-description.md). Slice type picker stay later. Playwright path for this slice adds: click Command, Add Field, fill Field name with orderId, Save, reload last Command `fields[0].name` is orderId.
