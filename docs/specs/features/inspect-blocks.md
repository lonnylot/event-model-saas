# Inspect blocks

Status: released

## Problem

Members can inspect Slice and Actor Name, but clicking Command, Event Happened, Read Model, or Automation does not open Inspector Name, so those titles stay the Add defaults.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows that `Name` textbox with the value `Command`
- [x] Filling the Inspector `Name` textbox with `Place Order` after selecting `Command` sets the last Command `title` to `Place Order`
- [x] Filling the Inspector `Name` textbox with `Place Order` after selecting `Command` shows a Timeline listitem whose accessible name is `Place Order`
- [x] After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows that `Name` textbox with the value `Event Happened`
- [x] Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` sets the last Event `title` to `Order Placed`
- [x] Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` shows a Timeline listitem whose accessible name is `Order Placed`
- [x] After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows that `Name` textbox with the value `Read Model`
- [x] Filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` sets the last Read Model `title` to `Orders`
- [x] Filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` shows a Timeline listitem whose accessible name is `Orders`
- [x] After clicking `New Slice` then `Add Automation` on that page, clicking the Timeline `Automation` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Automation` on that page, clicking the Timeline `Automation` listitem shows that `Name` textbox with the value `Automation`
- [x] Filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` sets the last Automation `title` to `Send Email`
- [x] Filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` shows a Timeline listitem whose accessible name is `Send Email`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Name` with `Place Order`, and Saves, a reload of that page shows a listitem whose accessible name is `Place Order` in the Timeline region

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — set Command, Event, Read Model, and Automation `title` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command, Event, Read Model, and Automation selection is a click on the Timeline listitem. The Inspector `Name` textbox is one control; selecting another of those kinds in the same session updates that `Name` value.
- Toolbar Add still targets the last Slice. Clicking Add Command, Add Event, Add Read Model, or Add Automation with no Slice does not append a Timeline listitem.
- This slice is one in-session Command, Event, Read Model, and Automation. Name JSON mutates the last of that kind.
- Inspect is a click on a click-created listitem. Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Description after reload is [inspect-rest.md](./inspect-rest.md).
- The Inspector `Name` textbox edits Command, Event, Read Model, or Automation `title`. The JSON key stays `title`.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspecting Command → Event is [inspect-connection.md](./inspect-connection.md). Event → Read Model inspect is [inspect-rest.md](./inspect-rest.md). In-session visible listitem text on Name fill, multi-item Name binding, Actor Name Unsaved changes, Mac window chrome. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md). Slice and Actor Name are [chrome.md](./chrome.md). Event Model title and Description are [model-inspector.md](./model-inspector.md). Inspect after reload and Event / Read Model / Automation reload-lists are [inspect-after-reload.md](./inspect-after-reload.md). Delete Command is [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Drag blocks between Slices, undo, pan, and moving Slices are [canvas.md](./canvas.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Event → Read Model inspect and Command Description after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Command Description after reload, and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload on Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model Connection after reload stays later. Event → Read Model inspect, Description after reload on Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload, Field after reload on Command / Event / Read Model / Automation, Command → Event Connection after reload, Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Event → Read Model inspect, Description after reload on Slice / Actor / Command / Event / Read Model / Automation, Slice type after reload, Field after reload on Command / Event / Read Model / Automation, Field type after reload on Command / Event / Read Model / Automation, Optional / Example after reload on Command, Command → Event Connection after reload, Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). Optional / Example after reload on Event / Read Model / Automation stay later.

## Restates







## Restates







## Restates
- [chrome.md](./chrome.md) — Out of scope no longer owns inspecting Command / Event / Read Model / Automation; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).
- [blocks.md](./blocks.md) — Out of scope no longer owns Inspector Name for Command, Event, Read Model, or Automation; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md).
- [editor-shell.md](./editor-shell.md) — Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspector Name for Command, Event, Read Model, and Automation is this slice. Add Field is [inspect-fields.md](./inspect-fields.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). - [editor-shell.md](./editor-shell.md) — Command Description after reload, Slice type after reload, Command Field after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). - [editor-shell.md](./editor-shell.md) — Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).
- [connections.md](./connections.md) — Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspector Name for Command, Event, Read Model, and Automation is this slice. Add Field is [inspect-fields.md](./inspect-fields.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). - [connections.md](./connections.md) — Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). - [connections.md](./connections.md) — Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md).
- [model-persistence.md](./model-persistence.md) — Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspector Name for Command, Event, Read Model, and Automation is this slice. Add Field is [inspect-fields.md](./inspect-fields.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). - [model-persistence.md](./model-persistence.md) — Command Description after reload, Slice type after reload, Command Field after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md). - [model-persistence.md](./model-persistence.md) — Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).
- [product.md](../product.md) — Inspect a Slice, Actor, Command, Event, Read Model, or Automation; edit Name. Description is [inspect-description.md](./inspect-description.md). Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Playwright path for this slice adds: click Command, fill Name with Place Order, Save, reload still lists Place Order. Command Description after reload and Slice type after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, and Command Field after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Slice type after reload, Command Field after reload, and Slice Name after reload are [inspect-rest.md](./inspect-rest.md). Description after reload, Slice type after reload, Field after reload, Command → Event Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).
