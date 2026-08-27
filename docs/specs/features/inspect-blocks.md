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
- Inspect is a click on a click-created listitem. GET-rendered Timeline blocks omit `data-kind`; inspect after reload is later.
- The Inspector `Name` textbox edits Command, Event, Read Model, or Automation `title`. The JSON key stays `title`.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description is [inspect-description.md](./inspect-description.md). Fields, Slice type picker, inspecting a Connection, inspect after reload, Event / Read Model / Automation reload-lists, in-session visible listitem text on Name fill, multi-item Name binding, Actor Name Unsaved changes, model-level Title, Mac window chrome. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Slice and Actor Name are [chrome.md](./chrome.md). Delete, drag blocks between Slices, undo, pan, and moving Slices are [canvas.md](./canvas.md).

## Restates

- [chrome.md](./chrome.md) — Out of scope no longer owns inspecting Command / Event / Read Model / Automation; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later.
- [blocks.md](./blocks.md) — Out of scope no longer owns Inspector Name for Command, Event, Read Model, or Automation; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later.
- [editor-shell.md](./editor-shell.md) — Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later. Inspector Name for Command, Event, Read Model, and Automation is this slice.
- [connections.md](./connections.md) — Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later. Inspector Name for Command, Event, Read Model, and Automation is this slice.
- [model-persistence.md](./model-persistence.md) — Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later. Inspector Name for Command, Event, Read Model, and Automation is this slice.
- [product.md](../product.md) — Inspect a Slice, Actor, Command, Event, Read Model, or Automation; edit Name. Description is [inspect-description.md](./inspect-description.md). Fields and Slice type picker stay later. Playwright path for this slice adds: click Command, fill Name with Place Order, Save, reload still lists Place Order.
