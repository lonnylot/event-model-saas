# Name binding rest

Status: released

## Problem

Command Name binds by id, shows visible text, and Actor Name dirties after Save. Slice, Actor, Event, Read Model, and Automation Name still mutate the last item or skip dirty and visible text, and Slice type still mutates the last Slice, so inspector binding is not Mac-complete.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the first Slice `title` to `Checkout`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the last Slice `title` to `New Slice`
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Name` with `Shopper` sets the first Actor `name` to `Shopper`
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Name` with `Order Placed` sets the first Event `title` to `Order Placed`
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Name` with `Orders` sets the first Read Model `title` to `Orders`
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Name` with `Send Email` sets the first Automation `title` to `Send Email`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting the first of two `New Slice` listitems sets that listitem visible text to `Checkout`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting the first Timeline `Actor` sets that listitem visible text to `Shopper`
- [x] Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` sets the Timeline `Order Placed` listitem visible text to `Order Placed`
- [x] Filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` sets the Timeline `Orders` listitem visible text to `Orders`
- [x] Filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` sets the Timeline `Send Email` listitem visible text to `Send Email`
- [x] After clicking `New Slice` then `Add Command` then `Save` on that page, filling the Inspector `Name` textbox with `Place Order` after selecting `Command` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Event` then `Save` on that page, filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Read Model` then `Save` on that page, filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Automation` then `Save` on that page, filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Description` with `First column` sets the first Slice `description` to `First column`
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, filling Inspector `Description` with `Submit cart` sets the first Command `description` to `Submit cart`
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Description` with `Librarian` sets the first Actor `description` to `Librarian`
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Description` with `It happened` sets the first Event `description` to `It happened`
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Description` with `List view` sets the first Read Model `description` to `List view`
- [x] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Description` with `When paid` sets the first Automation `description` to `When paid`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, selecting `State View` in Inspector `Type` sets the first Slice `sliceType` to `STATE_VIEW`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, selecting `State View` in Inspector `Type` sets the last Slice `sliceType` to `STATE_CHANGE`
- [x] After clicking `New Slice` then `Save` on that page, filling the Inspector `Description` textbox with `First column` after selecting `New Slice` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Actor` then `Save` on that page, filling the Inspector `Description` textbox with `Librarian` after selecting `Actor` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Command` then `Save` on that page, filling the Inspector `Description` textbox with `Submit cart` after selecting `Command` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Event` then `Save` on that page, filling the Inspector `Description` textbox with `It happened` after selecting `Event Happened` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Read Model` then `Save` on that page, filling the Inspector `Description` textbox with `List view` after selecting `Read Model` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Automation` then `Save` on that page, filling the Inspector `Description` textbox with `When paid` after selecting `Automation` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Save` on that page, selecting `State View` in Inspector `Type` after selecting `New Slice` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Command` then `Save` on that page, clicking `Add Field` after selecting `Command` shows the text `Unsaved changes.`
- [x] After a member creates a model, opens it, clicks the `Untitled` heading, clicks `Save`, then fills the Inspector `Name` textbox with `Library Checkout`, the page shows the text `Unsaved changes.`
- [x] After a member creates a model, opens it, clicks the `Untitled` heading, clicks `Save`, then fills the Inspector `Description` textbox with `Library checkout blueprint`, the page shows the text `Unsaved changes.`

## Domain terms

Event Model, Slice, Slice type, Actor, Command, Event, Read Model, Automation, Description, Team, Person, Version

## Seams

- `document` module — set Slice / Actor / Event / Read Model / Automation `title` or `name`, Slice / Actor / Command / Event / Read Model / Automation `description`, and Slice `sliceType` by id; the editor fill and select path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command Name-by-id, Command visible text, and Actor Name dirty stay [name-binding.md](./name-binding.md).
- Two default-named items are first vs last. Last-item titles stay the Add defaults when the first is renamed.
- Description-by-id for Slice, Actor, Command, Event, Read Model, and Automation is this slice.
- Slice type-by-id: two `New Slice` listitems are first vs last. Last Slice stays `STATE_CHANGE` when the first is set to `STATE_VIEW`. Last-Slice Type picker is [slice-type.md](./slice-type.md). Type picker labels stay that file.
- Edits are in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Mac window chrome. Command Name-by-id, Command visible text, and Actor dirty stay [name-binding.md](./name-binding.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). GET Actor Name JSON is [hydrate-kind-id.md](./hydrate-kind-id.md).

## Restates

- [name-binding.md](./name-binding.md) — Out of scope no longer owns multi-item Name for Slice / Actor / Event / Read Model / Automation, visible text for those kinds, Command / Event Name dirty, Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, or heading dirty; this slice owns those. Command Name-by-id, Command visible text, and Actor dirty stay that file. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- [slice-type.md](./slice-type.md) — Last-Slice Type picker stays that file. Slice type-by-id and Type dirty are this slice. Heading Name dirty, Add Field dirty, and heading Description dirty are this slice.
- [chrome.md](./chrome.md) — Slice / Actor multi-item Name is this slice. Slice Name dirty stays this file. Slice Description dirty is this slice. Type dirty is this slice. Add Field dirty is this slice. Heading Name dirty is this slice. Heading Description dirty is this slice. Actor Description dirty is this slice. Command Description dirty is this slice. Event Description dirty is this slice. Read Model Description dirty is this slice. Automation Description dirty is this slice.
- [canvas.md](./canvas.md) — Slice Name binds to the clicked Slice; this slice owns that. Actor / Event / Read Model / Automation multi-item Name is this slice. Command is [name-binding.md](./name-binding.md). Slice / Actor / Command / Event / Read Model / Automation Description-by-id is this slice. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [inspect-blocks.md](./inspect-blocks.md) — Multi-item Name and Name dirty for Event / Read Model / Automation is this slice. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [inspect-description.md](./inspect-description.md) — Last-item Description stays that file. Heading Description dirty, Description-by-id, Slice type-by-id, Type dirty, and Add Field dirty are this slice. Slice / Actor / Event / Read Model / Automation multi-item Name is this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — Slice / Actor / Event / Read Model / Automation multi-item Name of two in-session items is this slice. Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Inspect after reload stays that file. Last-Slice Type picker is [slice-type.md](./slice-type.md). Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md).
- [editor-shell.md](./editor-shell.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [blocks.md](./blocks.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [connections.md](./connections.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [model-persistence.md](./model-persistence.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [connection-feedback.md](./connection-feedback.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [add-on-lane.md](./add-on-lane.md) — Heading Description dirty, Description-by-id, Slice type-by-id, Type dirty, and Add Field dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [add-on-lane-rest.md](./add-on-lane-rest.md) — Heading Description dirty, Description-by-id, Slice type-by-id, Type dirty, and Add Field dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [inspect-fields.md](./inspect-fields.md) — Slice type-by-id, Type dirty, heading Name dirty, Add Field dirty, and heading Description dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [inspect-fields-rest.md](./inspect-fields-rest.md) — Remaining Field type / optional / example / delete stay that file. Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [new-slice-shortcut.md](./new-slice-shortcut.md) — Description, Fields, Slice type picker no longer stay unowned later. Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). ⇧⌘N stays that file.
- [canvas-rest.md](./canvas-rest.md) — Last-item Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Sidebar drag-reorder stays that file.
- [move-slice-right.md](./move-slice-right.md) — Last-item Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). ⌥⌘→ stays that file.
- [connection-refusals.md](./connection-refusals.md) — Last-item Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Leftover Mac pair refusals stay that file.
- [delete-blocks.md](./delete-blocks.md) — Last-item Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Command / Connection Backspace stay that file.
- [inspect-connection.md](./inspect-connection.md) — Last-item Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Click-created Command → Event inspect stays that file.
- [model-inspector.md](./model-inspector.md) — Last-item Slice / Actor / block Description stays [inspect-description.md](./inspect-description.md). Description-by-id, Slice type-by-id, Type dirty, Add Field dirty, and heading dirty are this slice. Remaining Field type / optional / example / delete are [inspect-fields-rest.md](./inspect-fields-rest.md). Last-Slice Type picker is [slice-type.md](./slice-type.md). Event Model title and Description stay that file.
- [product.md](../product.md) — Name binds to the clicked Slice / Actor / Event / Read Model / Automation. Visible text follows Name. Command / Event / Read Model / Automation Name after Save shows Unsaved changes. Slice Description after Save shows Unsaved changes. Actor Description after Save shows Unsaved changes. Command Description after Save shows Unsaved changes. Event Description after Save shows Unsaved changes. Read Model Description after Save shows Unsaved changes. Automation Description after Save shows Unsaved changes. Slice type after Save shows Unsaved changes. Add Field after Save shows Unsaved changes. Heading Name after Save shows Unsaved changes. Heading Description after Save shows Unsaved changes. Slice type binds to the clicked Slice. Last-Slice Type picker is [slice-type.md](./slice-type.md). Playwright path for this slice adds: two of each kind, rename the first; visible text Checkout / Shopper / Order Placed / Orders / Send Email; Name dirty after Save; Description-by-id on Slice / Actor / Command / Event / Read Model / Automation; two New Slice, click the first, Type State View, first `sliceType` is `STATE_VIEW`, last stays `STATE_CHANGE`.
