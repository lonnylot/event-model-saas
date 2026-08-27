# Name binding

Status: validated

## Problem

Inspector Name mutates the last Command, Actor Name after Save does not show dirty, and filling Name sets `aria-label` while visible text stays `Command`, so two Commands cannot be named separately and the Timeline still reads the Add default.

## Acceptance criteria

- [x] After clicking `New Slice` then `Add Actor` then `Save` on that page, filling the Inspector `Name` textbox with `Shopper` after selecting `Actor` shows the text `Unsaved changes.`
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, filling Inspector `Name` with `Place Order` sets the first Command `title` to `Place Order`
- [x] After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, filling Inspector `Name` with `Place Order` sets the last Command `title` to `Command`
- [x] Filling the Inspector `Name` textbox with `Place Order` after selecting `Command` sets the Timeline `Place Order` listitem visible text to `Place Order`

## Domain terms

Event Model, Slice, Actor, Command, Team, Person, Version

## Seams

- `document` module — set Command `title` by id; the editor fill path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Two Timeline `Command` listitems are first vs last. Click the first. Slice / Event / Read Model / Automation multi-item Name stays later. Slice Name dirty after Save stays [chrome.md](./chrome.md).
- Accessible name Place Order stays [inspect-blocks.md](./inspect-blocks.md). This slice owns visible text (`textContent` / Playwright `toHaveText`) on that Command listitem. Visible text for other kinds stays later.
- Name edits are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Multi-item Name for Slice, Actor, Event, Read Model, or Automation. Visible text for those kinds. Command / Event / Read Model / Automation Name dirty. Inspect after reload. Description, Fields, Slice type picker, Mac window chrome.

## Restates

- [chrome.md](./chrome.md) — Out of scope no longer owns Actor Name Unsaved changes or Command multi-item Name; this slice owns those. Slice Name dirty stays this file. Slice / Actor multi-item stays later.
- [canvas.md](./canvas.md) — Out of scope no longer owns Command multi-item Name; this slice owns that. Slice / Actor multi-item stays later.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns Actor Name Unsaved changes, multi-item Name binding for Command, or in-session visible listitem text on Command Name fill; this slice owns those. Other kinds stay later. Accessible name Place Order stays this file. Name still mutates the last Command only when that Command is selected.
- [product.md](../product.md) — Inspect the clicked Command Name, not only the last. Actor Name after Save shows Unsaved changes. Filling Command Name updates visible Timeline text. Playwright path for this slice adds: Add Actor, Save, fill Name Shopper, Unsaved changes; two Add Command, click the first, fill Place Order, first title is Place Order, last stays Command, listitem visible text is Place Order.
