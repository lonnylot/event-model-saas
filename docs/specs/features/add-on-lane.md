# Add on lane

Status: released

## Problem

Members can Add from the toolbar onto the last Slice only. They cannot Add on a dashed lane of a chosen Slice, or with ⌥⌘1–5, so adding a block still requires the toolbar and always hits the last Slice.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Actor on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Command on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Event on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Read Model on lane`
- [x] After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Automation on lane`
- [x] After clicking `New Slice` twice, clicking the first `Add Command on lane` appends a Command only on the first Slice
- [x] After clicking `New Slice`, pressing ⌥⌘1 appends an Actor whose `name` is `Actor`
- [x] After clicking `New Slice`, pressing ⌥⌘2 appends a Command whose `title` is `Command`
- [x] After clicking `New Slice`, pressing ⌥⌘3 appends an Event whose `title` is `Event Happened`
- [x] After clicking `New Slice`, pressing ⌥⌘4 appends a Read Model whose `title` is `Read Model`
- [x] After clicking `New Slice`, pressing ⌥⌘5 appends an Automation whose `title` is `Automation`
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘2 appends a Command only on the first Slice

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — append Command on a chosen Slice (not only the last); the editor lane-click `Add Command on lane` and selected-Slice ⌥⌘2 path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Toolbar `Add Actor` / `Add Command` / `Add Event` / `Add Read Model` / `Add Automation` still target the last Slice ([blocks.md](./blocks.md)). Lane buttons are a different accessible name so those tests stay green.
- Two `New Slice` listitems are first vs last. Chrome Name still mutates the last Slice.
- The first `Add Command on lane` is the first matching button in the Timeline (the first Slice's command lane).
- Empty JSON for lane Add and ⌥⌘1–5 is the same as toolbar Add in [blocks.md](./blocks.md).
- ⌥⌘1 Actor, ⌥⌘2 Command, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+Meta+Digit1` … `Digit5` (CI: `ControlOrMeta` for ⌘). Playwright waits for `networkidle` after open so `bindEditor` is attached, then for the New Slice listitem after click and for the named lane buttons, before asserting lane Add or pressing ⌥⌘1–5.
- After selecting a Slice, Inspector `Name` may have focus, so selected-Slice ⌥⌘2 runs after clicking the Timeline region (not while typing in `Name`). With no Slice selected, ⌥⌘2 targets the last Slice.
- Lane Add and keyboard Add are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Creating a Slice from Add when there are none. Toolbar Add stays [blocks.md](./blocks.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`, and selected-Slice targeting for ⌥⌘1 / ⌥⌘3–5, are [add-on-lane-rest.md](./add-on-lane-rest.md). Delete, Actor drag between Slices, undo, pan, and moving Slices (⌥⌘←) are [canvas.md](./canvas.md). Drag of Event, Read Model, and Automation between Slices, and Timeline Slice drag, are [drag-rest.md](./drag-rest.md). Connection highlight / snap-back / Event → Command, Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Inspect after reload is [inspect-after-reload.md](./inspect-after-reload.md). Mac window chrome. Heading Description dirty, Description-by-id, Slice type-by-id, Type dirty, and Add Field dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md). Slice Backspace stays [canvas.md](./canvas.md). Delete Command and Delete Connection are [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Description after reload, Slice type after reload, Field after reload, Connection after reload including Event → Read Model Connection after reload, Slice Name after reload, and heading Name after reload are [inspect-rest.md](./inspect-rest.md).

## Restates

- [blocks.md](./blocks.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those. Creating a Slice from Add when there are none stays later. Toolbar Add stays this file. Add targeting a non-last Slice is this slice for `Add Command on lane` and selected-Slice ⌥⌘2.
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns keyboard ⌥⌘1–5; this slice owns those.
- [chrome.md](./chrome.md) — Keyboard shortcuts for ⌥⌘1–5 are this slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those. ⇧⌘N is [new-slice-shortcut.md](./new-slice-shortcut.md).
- [connections.md](./connections.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [connection-feedback.md](./connection-feedback.md) — Out of scope no longer owns dashed Add on a lane or keyboard ⌥⌘1–5; this slice owns those.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns keyboard ⌥⌘1–5; this slice owns those.
- [product.md](../product.md) — Dashed Add on a lane and keyboard ⌥⌘1–5 are this slice. Playwright path for this slice adds: New Slice, `Add Command on lane` on the first of two Slices; ⌥⌘2 adds a Command. Toolbar Add stays [blocks.md](./blocks.md). Click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`, and selected-Slice keys other than ⌥⌘2, are [add-on-lane-rest.md](./add-on-lane-rest.md). Inspecting Command / Event / Read Model / Automation is [inspect-blocks.md](./inspect-blocks.md). Move / pan is [canvas.md](./canvas.md). Undo New Slice and undo Connection without a prior delete stay [canvas.md](./canvas.md). Undo of remaining Adds, move, delete, and redo are [undo-rest.md](./undo-rest.md). Undo Add Command stays [canvas-rest.md](./canvas-rest.md). Timeline Slice drag is [drag-rest.md](./drag-rest.md). Slice Backspace stays [canvas.md](./canvas.md). Delete Command and Delete Connection are [delete-blocks.md](./delete-blocks.md). Delete of Actor, Event, Read Model, and Automation is [delete-rest.md](./delete-rest.md). Highlighting legal targets is [connection-feedback.md](./connection-feedback.md).
