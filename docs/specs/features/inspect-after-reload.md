# Inspect after reload

Status: validated

## Problem

Name edits Save and the Timeline lists the new title after reload, but clicking a GET-rendered Command, Event, Read Model, Automation, or Actor does not open Inspector Name, so an imported or reloaded Mac file cannot be renamed.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Name` with `Place Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows the Inspector `Name` textbox with the value `Place Order`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Name` with `Shopper`, and Saves, a reload of that page, clicking the Timeline `Shopper` listitem shows the Inspector `Name` textbox with the value `Shopper`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page shows a listitem whose accessible name is `Order Placed` in the Timeline region
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem shows the Inspector `Name` textbox with the value `Order Placed`
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page shows a listitem whose accessible name is `Orders` in the Timeline region
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem shows the Inspector `Name` textbox with the value `Orders`
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page shows a listitem whose accessible name is `Send Email` in the Timeline region
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem shows the Inspector `Name` textbox with the value `Send Email`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `handleRequest` — model page HTML hydrates Timeline listitems with kind so Inspector Name binds after GET
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command Place Order already lists after reload ([inspect-blocks.md](./inspect-blocks.md)). Actor Shopper already lists after reload ([chrome.md](./chrome.md)). This slice owns the click after reload and Event / Read Model / Automation reload-lists.
- Inspect after reload is a click on the GET-rendered Timeline listitem. Name JSON still mutates by id, not only the last of that kind for this click; multi-item Name binding of two in-session items stays later.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description, Fields, inspecting a Connection, in-session visible listitem text on Name fill, multi-item Name binding of two click-created items, Actor Name Unsaved changes, model-level Title, dashed Add on a lane, keyboard shortcuts, Mac window chrome. Slice type picker is [slice-type.md](./slice-type.md). Click-created inspect stays [chrome.md](./chrome.md) and [inspect-blocks.md](./inspect-blocks.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns inspect after reload or Event / Read Model / Automation reload-lists; this slice owns those. Description, Fields, and in-session visible Name text stay later. Slice type picker is [slice-type.md](./slice-type.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns inspect after reload; this slice owns those. Multi-item Name binding stays later.
- [blocks.md](./blocks.md) — Event / Read Model / Automation reload-lists are this slice. Actor reload-list stays [chrome.md](./chrome.md).
- [canvas.md](./canvas.md) — Out of scope no longer owns inspect after reload; this slice owns those.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Command, Event, or Actor opens Inspector Name. Playwright path for this slice adds: Save Place Order, reload, click Place Order, Name is Place Order; same for Shopper and Order Placed; Event reload-lists.
