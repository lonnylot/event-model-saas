# Add on lane

Status: validated

## Problem

Members can Add from the toolbar onto the last Slice only. They cannot Add on a dashed lane of a chosen Slice, or with ⌥⌘1–5, so adding a block still requires the toolbar and always hits the last Slice.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Actor on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Command on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Event on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Read Model on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Automation on lane`
- [x] After clicking `New Slice` twice, clicking the first `Add Command on lane` sets the first Slice `commands` to one Command and the last Slice `commands` to `[]`
- [x] After clicking `New Slice`, pressing ⌥⌘1 appends an Actor whose `name` is `Actor`
- [x] After clicking `New Slice`, pressing ⌥⌘2 appends a Command whose `title` is `Command`
- [x] After clicking `New Slice`, pressing ⌥⌘3 appends an Event whose `title` is `Event Happened`
- [x] After clicking `New Slice`, pressing ⌥⌘4 appends a Read Model whose `title` is `Read Model`
- [x] After clicking `New Slice`, pressing ⌥⌘5 appends an Automation whose `title` is `Automation`
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘2 sets the first Slice `commands` to one Command and the last Slice `commands` to `[]`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — append Actor, Command, Event, Read Model, and Automation on a chosen Slice (not only the last); the editor lane-click and key path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Toolbar `Add Actor` / `Add Command` / `Add Event` / `Add Read Model` / `Add Automation` still target the last Slice ([blocks.md](./blocks.md)). Lane buttons are a different accessible name so those tests stay green.
- Two `New Slice` listitems are first vs last. Chrome Name still mutates the last Slice.
- The first `Add Command on lane` is the first matching button in the Timeline (the first Slice's command lane).
- Empty JSON for lane Add and ⌥⌘1–5 is the same as toolbar Add in [blocks.md](./blocks.md).
- ⌥⌘1 Actor, ⌥⌘2 Command, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+Meta+Digit1` … `Digit5` (CI: `ControlOrMeta` for ⌘). Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5. Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5.
- After selecting a Slice, Inspector `Name` may have focus, so ⌥⌘1–5 that target the selected Slice run after clicking the Timeline region (not while typing in `Name`). With no Slice selected, ⌥⌘1–5 target the last Slice.
- Lane Add and keyboard Add are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Creating a Slice from Add when there are none. Toolbar Add stays [blocks.md](./blocks.md). Canvas move / delete / pan / undo, connection highlight / snap-back / Event → Command, Inspector Description / Fields / Slice type picker, inspect after reload, Mac window chrome.

## Restates

- [blocks.md](./blocks.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those. Creating a Slice from Add when there are none stays later. Toolbar Add stays this file. Add targeting a non-last Slice is this slice for lane click and selected-Slice keys.
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns keyboard ⌥⌘1–5; this slice owns those.
- [chrome.md](./chrome.md) — Keyboard shortcuts for ⌥⌘1–5 are this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns dashed Add on a lane or keyboard shortcuts; this slice owns those.
- [connections.md](./connections.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns keyboard ⌥⌘1–5; this slice owns those.
- [product.md](../product.md) — Dashed Add on a lane and keyboard ⌥⌘1–5 are this slice. Playwright path for this slice adds: New Slice, `Add Command on lane` on the first of two Slices; ⌥⌘2 adds a Command. Toolbar Add stays [blocks.md](./blocks.md). Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md). Move / delete / pan / undo is [canvas.md](./canvas.md). Highlighting legal targets is [connection-feedback.md](./connection-feedback.md).
