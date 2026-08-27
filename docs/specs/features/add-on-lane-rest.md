# Add on lane rest

Status: validated

## Problem

Dashed lane buttons exist for every kind, and `Add Command on lane` plus selected-Slice ⌥⌘2 target the first Slice. Clicking the other lane buttons, and ⌥⌘1 / ⌥⌘3–5 after selecting a Slice, still hit the last Slice, so Add on a chosen column is incomplete.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `Add Actor on lane` appends an Actor only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `Add Event on lane` appends an Event only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `Add Read Model on lane` appends a Read Model only on the first Slice
- [ ] After clicking `New Slice` twice, clicking the first `Add Automation on lane` appends an Automation only on the first Slice
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘1 appends an Actor only on the first Slice
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘3 appends an Event only on the first Slice
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘4 appends a Read Model only on the first Slice
- [ ] After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing ⌥⌘5 appends an Automation only on the first Slice

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — append Actor / Event / Read Model / Automation on a chosen Slice (not only the last); the editor lane-click and selected-Slice ⌥⌘1 / ⌥⌘3–5 path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Lane button names stay `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` ([add-on-lane.md](./add-on-lane.md)). The first matching button is the first Slice's lane.
- Two `New Slice` listitems are first vs last. Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)). `Add Command on lane` and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- Empty JSON matches toolbar Add in [blocks.md](./blocks.md).
- ⌥⌘1 Actor, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+ControlOrMeta+Digit1` / `Digit3` / `Digit4` / `Digit5`. After selecting a Slice, Inspector `Name` may have focus, so the key runs after clicking the Timeline region.
- Lane Add and keyboard Add are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Creating a Slice from Add when there are none: Mac disables Add when there are no Slices; [blocks.md](./blocks.md) already does not create a Slice from toolbar Add. Toolbar Add stays [blocks.md](./blocks.md). `Add Command on lane` and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md). Connection refusals, Inspector Description is [inspect-description.md](./inspect-description.md). Fields, Slice type picker, Mac window chrome.

## Restates

- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Creating a Slice from Add when there are none stays not a feature (Mac disables Add; toolbar still does not create). Lane buttons and ⌥⌘1–5 last-Slice plus `Add Command on lane` / selected-Slice ⌥⌘2 stay that file.
- [blocks.md](./blocks.md) — Add targeting a non-last Slice for Actor / Event / Read Model / Automation is this slice. Toolbar Add stays this file. Clicking Add with no Slices still does not create a Slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Last-Slice ⌥⌘1–5 and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [connections.md](./connections.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [product.md](../product.md) — Click-append from the other lane buttons and selected-Slice ⌥⌘1 / ⌥⌘3–5 are this slice. Playwright path for this slice adds: two New Slice, first `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`; selected-Slice ⌥⌘1 / ⌥⌘3–5 on the first Slice. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
