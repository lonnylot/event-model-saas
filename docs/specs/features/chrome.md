# Chrome

Status: released

## Problem

The Inspector region is empty. Members can add a Slice and an Actor but cannot select them to edit Name, so the timeline still shows only default titles.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Name` textbox with the value `New Slice`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` sets that Slice `title` to `Checkout`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` shows a listitem whose accessible name is `Checkout`
- [x] After clicking `New Slice`, Saving, then filling the Inspector `Name` textbox with `Checkout`, the page shows the text `Unsaved changes.`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Name` with `Checkout`, and Saves, a reload of that page shows a listitem whose accessible name is `Checkout`
- [x] After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows that `Name` textbox with the value `Actor`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting `Actor` sets that Actor `name` to `Shopper`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting `Actor` shows a Timeline listitem whose accessible name is `Shopper`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Name` with `Shopper`, and Saves, a reload of that page shows a listitem whose accessible name is `Shopper` in the Timeline region

## Domain terms

Event Model, Slice, Actor, Team, Person, Version

## Seams

- `document` module — set Slice `title` and Actor `name` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Slice selection is a click on the Slices listitem. Actor selection is a click on the Timeline Actor listitem.
- The Inspector `Name` textbox edits Slice `title` or Actor `name`. The JSON keys stay `title` and `name`.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description, fields, slice type picker, inspecting Command / Event / Read Model / Automation, inspecting a Connection, model-level Title, dashed Add on a lane, keyboard shortcuts, delete, drag blocks between Slices, undo, pan, moving Slices, Mac window chrome.

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns inspector fields for Slice and Actor Name; this slice owns those. Description, fields, and type picker stay later.
- [blocks.md](./blocks.md) — Out of scope no longer owns Slice or Actor selection; this slice owns those. Inspector fields other than Name stay later.
- [connections.md](./connections.md) — Out of scope no longer owns Inspector Name for Slice and Actor; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns inspector fields for Slice and Actor Name; this slice owns those.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, click New Slice, fill Name with Checkout, Save, reload still lists Checkout. Description, fields, type picker, and inspecting Command / Event / Read Model / Automation stay later.
