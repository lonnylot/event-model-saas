# Name binding rest

Status: validated

## Problem

Command Name binds by id, shows visible text, and Actor Name dirties after Save. Slice, Actor, Event, Read Model, and Automation Name still mutate the last item or skip dirty and visible text, so inspector binding is not Mac-complete.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the first Slice `title` to `Checkout`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the last Slice `title` to `New Slice`
- [x] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Name` with `Shopper` sets the first Actor `name` to `Shopper`
- [x] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Name` with `Order Placed` sets the first Event `title` to `Order Placed`
- [x] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Name` with `Orders` sets the first Read Model `title` to `Orders`
- [ ] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Name` with `Send Email` sets the first Automation `title` to `Send Email`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting the first of two `New Slice` listitems sets that listitem visible text to `Checkout`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting the first Timeline `Actor` sets that listitem visible text to `Shopper`
- [ ] Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` sets the Timeline `Order Placed` listitem visible text to `Order Placed`
- [ ] After clicking `New Slice` then `Add Command` then `Save` on that page, filling the Inspector `Name` textbox with `Place Order` after selecting `Command` shows the text `Unsaved changes.`
- [ ] After clicking `New Slice` then `Add Event` then `Save` on that page, filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` shows the text `Unsaved changes.`
- [ ] After clicking `New Slice` then `Add Read Model` then `Save` on that page, filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` shows the text `Unsaved changes.`
- [ ] After clicking `New Slice` then `Add Automation` then `Save` on that page, filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` shows the text `Unsaved changes.`
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Description` with `First column` sets the first Slice `description` to `First column`
- [ ] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, filling Inspector `Description` with `Submit cart` sets the first Command `description` to `Submit cart`
- [ ] After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Description` with `Librarian` sets the first Actor `description` to `Librarian`
- [ ] After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Description` with `It happened` sets the first Event `description` to `It happened`
- [ ] After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Description` with `List view` sets the first Read Model `description` to `List view`
- [ ] After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Description` with `When paid` sets the first Automation `description` to `When paid`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Description, Team, Person, Version

## Seams

- `document` module — set Slice / Actor / Event / Read Model / Automation `title` or `name` and Slice `description` by id; the editor fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Command Name-by-id, Command visible text, and Actor Name dirty stay [name-binding.md](./name-binding.md).
- Two default-named items are first vs last. Last-item titles stay the Add defaults when the first is renamed.
- Description-by-id for Slice, Actor, Command, Event, Read Model, and Automation is this slice.
- Edits are in-memory until Save.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Mac window chrome. Command Name-by-id, Command visible text, and Actor dirty stay [name-binding.md](./name-binding.md).

## Restates

- [name-binding.md](./name-binding.md) — Out of scope no longer owns multi-item Name for Slice / Actor / Event / Read Model / Automation, visible text for those kinds, or Command / Event Name dirty; this slice owns those. Command Name-by-id, Command visible text, and Actor dirty stay that file.
- [chrome.md](./chrome.md) — Slice / Actor multi-item Name is this slice. Slice Name dirty stays this file.
- [canvas.md](./canvas.md) — Slice Name binds to the clicked Slice; this slice owns that. Actor / Event / Read Model / Automation multi-item Name is this slice. Command is [name-binding.md](./name-binding.md).
- [inspect-blocks.md](./inspect-blocks.md) — Multi-item Name and Name dirty for Event / Read Model / Automation is this slice.
- [inspect-description.md](./inspect-description.md) — Slice Description-by-id is this slice. Slice / Actor / Event / Read Model / Automation multi-item Name is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — Slice / Actor / Event / Read Model / Automation multi-item Name of two in-session items is this slice. Inspect after reload stays that file.
- [product.md](../product.md) — Name binds to the clicked Slice / Actor / Event / Read Model / Automation. Visible text follows Name. Command / Event Name after Save shows Unsaved changes. Playwright path for this slice adds: two of each kind, rename the first; visible text Checkout / Shopper / Order Placed; Command and Event Name dirty after Save; first Slice Description First column.
