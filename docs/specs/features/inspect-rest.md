# Inspect rest

Status: validated

## Problem

Inspector inspects Command → Event and Name after reload. Members cannot inspect Event → Read Model, reopen Description / Slice type / Fields after Save, inspect a GET-rendered Connection, or reopen Description and Fields on the other kinds, so those edits do not round-trip like Name.

## Acceptance criteria

- [x] After dragging from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Event Happened → Read Model` shows the text `From Event Happened` in the Inspector region
- [x] After dragging from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Event Happened → Read Model` shows the text `To Read Model` in the Inspector region
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Description` with `Customer submits cart`, and Saves, a reload of that page, clicking the Timeline `Command` listitem shows the Inspector `Description` textbox with the value `Customer submits cart`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, selects `State View` in `Type`, and Saves, a reload of that page, clicking the `New Slice` listitem shows Inspector `Type` with the value `State View`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, and Saves, a reload of that page, clicking the Timeline `Command` listitem shows Inspector `Field name` with the value `orderId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Name` with `Checkout`, and Saves, a reload of that page, clicking the `Checkout` listitem shows the Inspector `Name` textbox with the value `Checkout`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Description` with `First column`, and Saves, a reload of that page, clicking the `New Slice` listitem shows the Inspector `Description` textbox with the value `First column`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Description` with `Librarian`, and Saves, a reload of that page, clicking the Timeline `Actor` listitem shows the Inspector `Description` textbox with the value `Librarian`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Description` with `It happened`, and Saves, a reload of that page, clicking the Timeline `Event Happened` listitem shows the Inspector `Description` textbox with the value `It happened`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Description` with `List view`, and Saves, a reload of that page, clicking the Timeline `Read Model` listitem shows the Inspector `Description` textbox with the value `List view`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Description` with `When paid`, and Saves, a reload of that page, clicking the Timeline `Automation` listitem shows the Inspector `Description` textbox with the value `When paid`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, fills `Field name` with `eventId`, and Saves, a reload of that page, clicking the Timeline `Event Happened` listitem shows Inspector `Field name` with the value `eventId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, clicks `Add Field`, fills `Field name` with `viewId`, and Saves, a reload of that page, clicking the Timeline `Read Model` listitem shows Inspector `Field name` with the value `viewId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, clicks `Add Field`, fills `Field name` with `jobId`, and Saves, a reload of that page, clicking the Timeline `Automation` listitem shows Inspector `Field name` with the value `jobId`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks `Add Event`, drags from `Command port` onto `Event Happened port`, and Saves, a reload of that page, clicking the Timeline text `Command → Event Happened` shows the text `From Command` in the Inspector region
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks `Add Event`, drags from `Command port` onto `Event Happened port`, and Saves, a reload of that page, clicking the Timeline text `Command → Event Happened` shows the text `To Event Happened` in the Inspector region
- [ ] After a member creates a model, opens it, clicks the `Untitled` heading, fills `Name` with `Library Checkout`, and Saves, a reload of that page, clicking the heading whose accessible name is `Library Checkout` shows the Inspector `Name` textbox with the value `Library Checkout`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Connection, Field, Slice type, Description, Team, Person, Version

## Seams

- `document` module — set Slice / Actor / Command / Event / Read Model / Automation `description`, Slice `sliceType` / `title`, Event Model `title`, append Field, and set Field `name` on an in-memory Event Model; the editor click, fill, and select path calls it
- `handleRequest` — model page HTML hydrates Timeline Connection text and Slice / heading listitems so Inspector binds after GET
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command → Event inspect From/To on a click-created Connection stays [inspect-connection.md](./inspect-connection.md) when that spec is present. Event → Read Model summary text is `Event Happened → Read Model` (Add defaults). GET-rendered Connection summary text is `Command → Event Happened`.
- Description / Type / Field / Connection / Slice Name / heading Name after reload is a click on the GET-rendered listitem or heading, same as [inspect-after-reload.md](./inspect-after-reload.md) for Name.
- Delete Connection is Backspace ([delete-blocks.md](./delete-blocks.md)). No extra Inspector delete button.
- Heading click to open model Inspector stays [model-inspector.md](./model-inspector.md) when that spec is present. This slice owns the click after reload. No ⇧⌘I.
- Add Field on Event / Read Model / Automation appends `newField` ([inspect-fields.md](./inspect-fields.md) / [inspect-fields-rest.md](./inspect-fields-rest.md) when present). This slice owns the Field name after reload inspect.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Mac inspector captions (naming hints, Slice type help). Mac Model Info ⇧⌘I. Inspector Delete Connection button. Model inspector counts, connection roster, and format line. Extra zoom percentages. Mac window chrome (`NSDocument`, native menus, welcome window). Click-created Command → Event inspect, in-session heading-click model inspect, Name after reload on Actor / Command / Event / Read Model / Automation, and Backspace delete Connection stay those specs.

## Restates

- [inspect-connection.md](./inspect-connection.md) — Do not edit this file if it is not on the branch. Out of scope no longer owns Event → Read Model inspect or Connection after reload; this slice owns those. Click-created Command → Event From/To stay that file. Inspector Delete Connection button is not this product.
- [model-inspector.md](./model-inspector.md) — Do not edit this file if it is not on the branch. ⇧⌘I stays Mac menu chrome (not ported). In-session heading click stays that file. Heading Name after reload is this slice.
- [slice-type.md](./slice-type.md) — Do not edit this file if it is not on the branch. Slice type help copy stays Mac inspector caption (not ported). Type picker stays that file.
- [inspect-after-reload.md](./inspect-after-reload.md) — Out of scope no longer owns Command Description after reload; this slice owns those. Description / Type / Field after reload is this slice. Name after reload stays that file.
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns Event → Read Model inspect, Command Description after reload, Slice type after reload, or Command Field after reload; this slice owns those. In-session Description stays that file. Command → Event inspect stays later. Slice type help is not ported.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Event → Read Model inspect, Description after reload, Slice type after reload, Field after reload, Connection after reload, or Slice Name after reload; this slice owns those. Click-created Command → Event inspect stays later unless [inspect-connection.md](./inspect-connection.md) is present. Slice type help is not ported.
- [chrome.md](./chrome.md) — Out of scope no longer owns Event → Read Model inspect, Description after reload, Slice type after reload, Field after reload, Connection after reload, or Slice Name after reload; this slice owns those. Slice type help is not ported.
- [connections.md](./connections.md) — Event → Read Model inspect and Connection after reload are this slice. Description after reload, Slice type after reload, and Field after reload are this slice. Slice type help is not ported.
- [canvas.md](./canvas.md) — Out of scope no longer owns Inspector Description / Fields / Slice type picker after reload; this slice owns those plus Connection after reload and Slice Name after reload. Slice type help is not ported.
- [editor-shell.md](./editor-shell.md) — Event → Read Model inspect, Description after reload, Slice type after reload, Field after reload, Connection after reload, Slice Name after reload, and heading Name after reload are this slice. Slice type help is not ported.
- [blocks.md](./blocks.md) — Event → Read Model inspect, Description after reload, Slice type after reload, Field after reload, Connection after reload, and Slice Name after reload are this slice. Slice type help is not ported.
- [model-persistence.md](./model-persistence.md) — Event → Read Model inspect, Description after reload, Slice type after reload, Field after reload, Connection after reload, Slice Name after reload, and heading Name after reload are this slice. Slice type help is not ported.
- [product.md](../product.md) — Inspect Event → Read Model. Description, Slice type, Field, Connection, Slice Name, and heading Name survive reload inspect. Naming hints, Slice type help, ⇧⌘I, and an Inspector Delete Connection button are not ported. Playwright path for this slice adds Event → Read Model From/To; Description / Type / Field after reload on Command; Description after reload on Slice / Actor / Event / Read Model / Automation; Field after reload on Event / Read Model / Automation; Connection after reload From/To; Slice Name Checkout after reload; heading Name Library Checkout after reload.
