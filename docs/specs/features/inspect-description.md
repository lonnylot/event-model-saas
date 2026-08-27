# Inspect description

Status: validated

## Problem

Members can inspect Name on a Slice, Actor, Command, Event, Read Model, or Automation, but Inspector has no Description, so Mac `.eventmodel` notes on those entities cannot be edited on the web.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [x] Filling the Inspector `Description` textbox with `Checkout flow` after selecting `New Slice` sets the last Slice `description` to `Checkout flow`
- [x] After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [x] Filling the Inspector `Description` textbox with `Shopper persona` after selecting `Actor` sets the last Actor `description` to `Shopper persona`
- [x] After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [x] Filling the Inspector `Description` textbox with `Customer submits cart` after selecting `Command` sets the last Command `description` to `Customer submits cart`
- [x] After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [x] Filling the Inspector `Description` textbox with `Cart was submitted` after selecting `Event Happened` sets the last Event `description` to `Cart was submitted`
- [ ] After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [ ] Filling the Inspector `Description` textbox with `Orders the shopper can see` after selecting `Read Model` sets the last Read Model `description` to `Orders the shopper can see`
- [ ] After clicking `New Slice` then `Add Automation` on that page, clicking the Timeline `Automation` listitem shows a textbox whose accessible name is `Description` in the Inspector region
- [ ] Filling the Inspector `Description` textbox with `Email when paid` after selecting `Automation` sets the last Automation `description` to `Email when paid`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Description` with `Customer submits cart`, and Saves, a reload of that page sets the last Command `description` to `Customer submits cart`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Description, Team, Person, Version

## Seams

- `document` module — set Slice, Actor, Command, Event, Read Model, and Automation `description` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Selection is the same click as Name ([chrome.md](./chrome.md), [inspect-blocks.md](./inspect-blocks.md)). The Inspector `Description` textbox is one control; selecting another of those kinds in the same session updates that `Description` value.
- Add still targets the last Slice. This slice is one in-session item of each kind. Description JSON mutates the last of that kind.
- Inspect is a click on a click-created listitem. GET-rendered inspect of Description stays later with inspect after reload.
- Empty JSON may omit `description`. Filling Description writes the `description` key. The JSON key stays `description`.
- Description edits are in-memory until Save. Save still uses the version check from model-persistence.
- Reload proof reads `#event-model-document` after GET hydrates the saved body. It does not click Inspector after reload.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Fields, Slice type picker, inspecting a Connection, inspect after reload, Event / Read Model / Automation reload-lists, in-session visible listitem text on Name fill, multi-item Name binding, Actor Name Unsaved changes, model-level Title, model-level Description, Mac window chrome. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Name stays [chrome.md](./chrome.md) and [inspect-blocks.md](./inspect-blocks.md). Delete, drag blocks between Slices, undo, pan, and moving Slices are [canvas.md](./canvas.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Description; this slice owns those. Fields, Slice type picker, inspect after reload, and model-level Title stay later.
- [chrome.md](./chrome.md) — Out of scope no longer owns Description; this slice owns those. Fields and Slice type picker stay later.
- [blocks.md](./blocks.md) — Description is this slice. Fields and Slice type picker stay later.
- [editor-shell.md](./editor-shell.md) — Description is this slice. Fields and Slice type picker stay later.
- [connections.md](./connections.md) — Description is this slice. Fields and Slice type picker stay later.
- [model-persistence.md](./model-persistence.md) — Description is this slice. Fields and Slice type picker stay later.
- [canvas.md](./canvas.md) — Out of scope no longer owns Inspector Description; this slice owns those. Fields and Slice type picker stay later.
- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns Inspector Description; this slice owns those. Fields and Slice type picker stay later.
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns Inspector Description; this slice owns those. Fields and Slice type picker stay later.
- [product.md](../product.md) — Inspect a Slice, Actor, Command, Event, Read Model, or Automation; edit Name and Description. Fields and Slice type picker stay later. Playwright path for this slice adds: click Command, fill Description with Customer submits cart, Save, reload last Command `description` is Customer submits cart.
