# Chrome

Status: released

## Problem

The Inspector region is empty. Members can add a Slice and an Actor but cannot select them to edit Name, so the timeline still shows only default titles.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Name` textbox with the value `New Slice`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` sets the last Slice `title` to `Checkout`
- [x] Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` shows a listitem whose accessible name is `Checkout`
- [x] After clicking `New Slice`, Saving, then filling the Inspector `Name` textbox with `Checkout`, the page shows the text `Unsaved changes.`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Name` with `Checkout`, and Saves, a reload of that page shows a listitem whose accessible name is `Checkout`
- [x] After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows a textbox whose accessible name is `Name` in the Inspector region
- [x] After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows that `Name` textbox with the value `Actor`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting `Actor` sets the last Actor `name` to `Shopper`
- [x] Filling the Inspector `Name` textbox with `Shopper` after selecting `Actor` shows a Timeline listitem whose accessible name is `Shopper`
- [x] After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Name` with `Shopper`, and Saves, a reload of that page shows a listitem whose accessible name is `Shopper` in the Timeline region

## Domain terms

Event Model, Slice, Actor, Team, Person, Version

## Seams

- `document` module — set Slice `title` and Actor `name` on an in-memory Event Model; the editor click and fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Slice selection is a click on the Slices listitem. Actor selection is a click on the Timeline Actor listitem.
- This slice is one in-session `New Slice` and one in-session Timeline `Actor`. Name JSON mutates the last slice/actor. Multi-item binding is later.
- Inspect is a click on a click-created listitem. Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md).
- The Inspector `Name` textbox edits Slice `title` or Actor `name`. The JSON keys stay `title` and `name`.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description is [inspect-description.md](./inspect-description.md). Add Field and Field name on Command are [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Inspecting a Connection is [inspect-connection.md](./inspect-connection.md). Multi-item Name binding, Actor Name Unsaved changes, Mac window chrome. Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md). Event Model title and Description are [model-inspector.md](./model-inspector.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Keyboard shortcuts for this slice's keys, drag blocks between Slices, undo, pan, and moving Slices are [canvas.md](./canvas.md). Slice Backspace is [canvas.md](./canvas.md). Delete Command is [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, and Read Model is [delete-rest.md](./delete-rest.md). Delete of Automation stays later. Highlighting legal targets is [connection-feedback.md](./connection-feedback.md). Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice ⌥⌘1 / ⌥⌘3–5 are [add-on-lane-rest.md](./add-on-lane-rest.md).

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns inspector fields for Slice and Actor Name; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md).
- [blocks.md](./blocks.md) — Out of scope no longer owns Slice or Actor selection; this slice owns those. Description is [inspect-description.md](./inspect-description.md). Inspector Name stays this slice. Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md).
- [connections.md](./connections.md) — Out of scope no longer owns Inspector Name for Slice and Actor; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns inspector fields for Slice and Actor Name; this slice owns those.
- [product.md](../product.md) — Playwright path for this slice is open Event Model, New Slice, click New Slice, fill Name with Checkout, Save, reload still lists Checkout. Description is [inspect-description.md](./inspect-description.md). Add Field is [inspect-fields.md](./inspect-fields.md). Slice type picker is [slice-type.md](./slice-type.md). Inspector Name for Command, Event, Read Model, and Automation is [inspect-blocks.md](./inspect-blocks.md).
