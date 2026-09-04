# Inspect after reload

Status: released

## Problem

Name edits Save and the Timeline lists the new title after reload, but clicking a GET-rendered Command, Event, Read Model, Automation, or Actor does not open Inspector Name, so an imported or reloaded Mac file cannot be renamed.

## Acceptance criteria

- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Name` with `Place Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows the Inspector `Name` textbox with the value `Place Order`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Name` with `Shopper`, and Saves, a reload of that page, clicking the Timeline `Shopper` listitem shows the Inspector `Name` textbox with the value `Shopper`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page shows a listitem whose accessible name is `Order Placed` in the Timeline region
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem shows the Inspector `Name` textbox with the value `Order Placed`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page shows a listitem whose accessible name is `Orders` in the Timeline region
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem shows the Inspector `Name` textbox with the value `Orders`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page shows a listitem whose accessible name is `Send Email` in the Timeline region
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem shows the Inspector `Name` textbox with the value `Send Email`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `handleRequest` — model page HTML hydrates Timeline listitems with kind so Inspector Name binds after GET
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command Place Order already lists after reload ([inspect-blocks.md](./inspect-blocks.md)). Actor Shopper already lists after reload ([chrome.md](./chrome.md)). This slice owns the click after reload and Event / Read Model / Automation reload-lists.
- Inspect after reload is a click on the GET-rendered Timeline listitem. Name JSON mutates the last of that kind. Slice / Actor / Event / Read Model / Automation multi-item Name of two in-session items is [name-binding-rest.md](./name-binding-rest.md). Command multi-item Name is [name-binding.md](./name-binding.md). Timeline `New Slice` listitem on GET after Create is [hydrate-board.md](./hydrate-board.md).
- GET-rendered inspect binds Inspector Name. Description after reload is [inspect-rest.md](./inspect-rest.md). Last-Command Add Field on click-created inspect stays [inspect-fields.md](./inspect-fields.md). `Add Field` after reload is [hydrate-add-field.md](./hydrate-add-field.md). In-session Field type / optional / example / delete and Add Field on Event / Read Model / Automation are [inspect-fields-rest.md](./inspect-fields-rest.md). Field after reload, Field type after reload, and Optional / Example after reload on Command are [inspect-rest.md](./inspect-rest.md).
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Inspecting a click-created Connection is [inspect-connection.md](./inspect-connection.md). In-session visible listitem text on Event / Read Model / Automation Name fill and Slice / Actor / Event / Read Model / Automation multi-item Name of two click-created items are [name-binding-rest.md](./name-binding-rest.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md). Mac window chrome. Actor Name Unsaved changes, Command multi-item Name, and in-session visible listitem text on Command Name fill are [name-binding.md](./name-binding.md). Event Model title and Description are [model-inspector.md](./model-inspector.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Click-created inspect stays [chrome.md](./chrome.md) and [inspect-blocks.md](./inspect-blocks.md). Last-Command Add Field and last-Command Field name on click-created inspect stay [inspect-fields.md](./inspect-fields.md). `Add Field` after reload is [hydrate-add-field.md](./hydrate-add-field.md). In-session Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, leftover Field name on those kinds after Add Field on Command, Field name on the clicked Command of two, and Field type / optional / example / delete on the clicked Command of two are [inspect-fields-rest.md](./inspect-fields-rest.md). Command Description after reload is [inspect-rest.md](./inspect-rest.md). Command Description after reload and Command Field name after reload are [inspect-rest.md](./inspect-rest.md). Command Description after reload, Command Field name after reload, and Actor Description after reload are [inspect-rest.md](./inspect-rest.md). Description after reload, Field after reload, inspecting a Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns inspect after reload or Event / Read Model / Automation reload-lists; this slice owns those. In-session visible Name text on Event / Read Model / Automation is [name-binding-rest.md](./name-binding-rest.md). In-session visible listitem text on Command Name fill is [name-binding.md](./name-binding.md). Inspecting a click-created Connection is [inspect-connection.md](./inspect-connection.md). In-session Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, leftover Field name on those kinds after Add Field on Command, Field name on the clicked Command of two, and Field type / optional / example / delete on the clicked Command of two are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). `Add Field` after reload is [hydrate-add-field.md](./hydrate-add-field.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are [name-binding-rest.md](./name-binding-rest.md). Description after reload, Field after reload, and inspecting a Connection after reload are [inspect-rest.md](./inspect-rest.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns inspect after reload; this slice owns those. Slice / Actor multi-item Name is [name-binding-rest.md](./name-binding-rest.md). Command multi-item Name is [name-binding.md](./name-binding.md).
- [blocks.md](./blocks.md) — Event / Read Model / Automation reload-lists are this slice. Actor reload-list stays [chrome.md](./chrome.md).
- [canvas.md](./canvas.md) — Out of scope no longer owns inspect after reload; this slice owns those.
- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns inspect after reload; this slice owns those.
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns inspect after reload; this slice owns those.
- [inspect-description.md](./inspect-description.md) — Out of scope no longer owns Name inspect after reload or Event / Read Model / Automation reload-lists; this slice owns those. Description after reload on Slice / Actor / Command / Event / Read Model / Automation is [inspect-rest.md](./inspect-rest.md).
- [inspect-fields.md](./inspect-fields.md) — Out of scope no longer owns Name inspect after reload; this slice owns those. In-session Field type / optional / example / delete, Add Field that appends on Event / Read Model / Automation, leftover Field name on those kinds after Add Field on Command, Field name on the clicked Command of two, and Field type / optional / example / delete on the clicked Command of two are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Command Add Field and last-Command Field name stay this file. Field after reload, Field type after reload, and Optional / Example after reload on Command are [inspect-rest.md](./inspect-rest.md). `Add Field` after reload is [hydrate-add-field.md](./hydrate-add-field.md).
- [slice-type.md](./slice-type.md) — Out of scope no longer owns inspect after reload; this slice owns those.
- [product.md](../product.md) — After Save and reload, clicking the GET-rendered Command, Event, Read Model, Automation, or Actor opens Inspector Name. Playwright path for this slice adds: Save Place Order, reload, click Place Order, Name is Place Order; same for Shopper, Order Placed, Orders, Send Email; Event / Read Model / Automation reload-lists.
