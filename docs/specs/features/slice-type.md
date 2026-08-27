# Slice type

Status: validated

## Problem

Every new Slice is `STATE_CHANGE`. Members cannot pick Slice type in Inspector, so a State View or Automation column cannot be marked on the web.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a combobox whose accessible name is `Type` in the Inspector region
- [ ] After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Type` combobox with the value `State Change`
- [ ] Selecting `State View` in Inspector `Type` after selecting `New Slice` sets the last Slice `sliceType` to `STATE_VIEW`
- [ ] Selecting `Automation` in Inspector `Type` after selecting `New Slice` sets the last Slice `sliceType` to `AUTOMATION`
- [ ] After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, selects `State View` in `Type`, and Saves, a reload of that page sets the last Slice `sliceType` to `STATE_VIEW`

## Domain terms

Event Model, Slice, Slice type, Automation, Team, Person, Version

## Seams

- `document` module — set Slice `sliceType` on an in-memory Event Model; the editor click and select path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Slice selection is a click on the Slices listitem ([chrome.md](./chrome.md)).
- This slice is one in-session `New Slice`. Slice type JSON mutates the last Slice.
- Combobox option labels are `State Change`, `State View`, and `Automation`. JSON stays `STATE_CHANGE`, `STATE_VIEW`, `AUTOMATION`.
- New Slice still starts as `STATE_CHANGE` ([editor-shell.md](./editor-shell.md)).
- Slice type edits are in-memory until Save. Save still uses the version check from model-persistence.
- Reload proof reads `#event-model-document` after GET hydrates the saved body.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Description, Fields, inspecting a Connection, inspect after reload, Slice type help copy, creating a Slice as State View from New Slice, multi-item Slice type binding, model-level Title, dashed Add on a lane, keyboard shortcuts, Mac window chrome. Name stays [chrome.md](./chrome.md).

## Restates

- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description and Fields stay later.
- [chrome.md](./chrome.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description and Fields stay later.
- [editor-shell.md](./editor-shell.md) — Slice type picker is this slice. Empty New Slice stays `STATE_CHANGE`. Description and Fields stay later.
- [blocks.md](./blocks.md) — Slice type picker is this slice. Description and Fields stay later.
- [connections.md](./connections.md) — Slice type picker is this slice. Description and Fields stay later.
- [model-persistence.md](./model-persistence.md) — Slice type picker is this slice. Description and Fields stay later.
- [canvas.md](./canvas.md) — Out of scope no longer owns Slice type picker; this slice owns those. Description and Fields stay later.
- [product.md](../product.md) — Inspect a Slice; edit Slice type. Description and Fields stay later. Playwright path for this slice adds: click New Slice, select State View in Type, Save, reload last Slice `sliceType` is `STATE_VIEW`.
