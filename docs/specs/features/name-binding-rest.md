# Name binding rest

Status: validated

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

## Domain terms

Event Model, Slice, Slice type, Actor, Command, Event, Read Model, Automation, Description, Team, Person, Version

## Seams

- `document` module — set Slice / Actor / Event / Read Model / Automation `title` or `name`, Slice / Actor / Command / Event / Read Model / Automation `description`, and Slice `sliceType` by id; the editor fill and select path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command Name-by-id, Command visible text, and Actor Name dirty stay [name-binding.md](./name-binding.md).
- Two default-named items are first vs last. Last-item titles stay the Add defaults when the first is renamed.
- Description-by-id for Slice, Actor, Command, Event, Read Model, and Automation is this slice.
- Slice type-by-id: two `New Slice` listitems are first vs last. Last Slice stays `STATE_CHANGE` when the first is set to `STATE_VIEW`. Type picker labels stay [slice-type.md](./slice-type.md) when that spec is present.
- Edits are in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Mac window chrome. Command Name-by-id, Command visible text, and Actor dirty stay [name-binding.md](./name-binding.md). Last-Slice Type picker stays [slice-type.md](./slice-type.md).

## Restates

- [name-binding.md](./name-binding.md) — Out of scope no longer owns multi-item Name for Slice / Actor / Event / Read Model / Automation, visible text for those kinds, or Command / Event Name dirty; this slice owns those. Command Name-by-id, Command visible text, and Actor dirty stay that file.
- [slice-type.md](./slice-type.md) — Out of scope no longer owns Type on the clicked Slice of two; this slice owns that. Last-Slice Type picker stays that file.
- [chrome.md](./chrome.md) — Slice / Actor multi-item Name is this slice. Slice Name dirty stays this file. Slice Description dirty is this slice. Actor Description dirty is this slice. Command Description dirty is this slice. Event Description dirty is this slice.
- [canvas.md](./canvas.md) — Slice Name binds to the clicked Slice; this slice owns that. Actor / Event / Read Model / Automation multi-item Name is this slice. Command is [name-binding.md](./name-binding.md). Slice / Actor / Command / Event / Read Model / Automation Description-by-id is this slice.
- [inspect-blocks.md](./inspect-blocks.md) — Multi-item Name and Name dirty for Event / Read Model / Automation is this slice.
- [inspect-description.md](./inspect-description.md) — Last-item Description stays that file. Description-by-id of two items is this slice. Slice / Actor / Event / Read Model / Automation multi-item Name is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — Slice / Actor / Event / Read Model / Automation multi-item Name of two in-session items is this slice. Inspect after reload stays that file.
- [editor-shell.md](./editor-shell.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete stay later. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [blocks.md](./blocks.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete stay later. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [connections.md](./connections.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete stay later. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [model-persistence.md](./model-persistence.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete stay later. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [connection-feedback.md](./connection-feedback.md) — Description-by-id and Slice type-by-id are this slice. Remaining Field type / optional / example / delete stay later. Last-Slice Type picker is [slice-type.md](./slice-type.md).
- [product.md](../product.md) — Name binds to the clicked Slice / Actor / Event / Read Model / Automation. Visible text follows Name. Command / Event / Read Model / Automation Name after Save shows Unsaved changes. Slice Description after Save shows Unsaved changes. Actor Description after Save shows Unsaved changes. Command Description after Save shows Unsaved changes. Event Description after Save shows Unsaved changes. Slice type binds to the clicked Slice. Playwright path for this slice adds: two of each kind, rename the first; visible text Checkout / Shopper / Order Placed / Orders / Send Email; Name dirty after Save; Description-by-id on Slice / Actor / Command / Event / Read Model / Automation; two New Slice, click the first, Type State View, first `sliceType` is `STATE_VIEW`, last stays `STATE_CHANGE`.
