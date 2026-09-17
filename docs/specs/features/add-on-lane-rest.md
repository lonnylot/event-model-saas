# Add on lane rest

Status: released

## Problem

Dashed lane buttons exist for every kind, and `Add Command on lane` plus selected-Slice ⌥⌘2 target the first Slice. Clicking the other lane buttons, and ⌥⌘1 / ⌥⌘3–5 after selecting a Slice, still hit the last Slice, so Add on a chosen column is incomplete.

## Acceptance criteria

- [x] After clicking `New Slice` twice, clicking the first `Add Actor on lane` appends an Actor only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `Add Event on lane` appends an Event only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `Add Read Model on lane` appends a Read Model only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `Add Automation on lane` appends an Automation only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, pressing ⌥⌘1 appends an Actor only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, pressing ⌥⌘3 appends an Event only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, pressing ⌥⌘4 appends a Read Model only on the first Slice
- [x] After clicking `New Slice` twice, clicking the first `New Slice` listitem, pressing ⌥⌘5 appends an Automation only on the first Slice

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Team, Person, Version

## Seams

- `document` module — append Actor / Event / Read Model / Automation on a chosen Slice (not only the last); the editor lane-click and selected-Slice ⌥⌘1 / ⌥⌘3–5 path calls it
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Lane button names stay `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` ([add-on-lane.md](./add-on-lane.md)). The first matching button is the first Slice's lane.
- Two `New Slice` listitems are first vs last. Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation still targets the last Slice ([blocks.md](./blocks.md)). `Add Command on lane` and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md). Toolbar New Slice default Actor is [new-slice-default-actor.md](./new-slice-default-actor.md). After two New Slice on an imported empty document, first `Add Actor on lane` / ⌥⌘1 leaves last Slice with the New Slice default Actor (length `1`); last `actors` `[]` is leftover unused.
- Empty JSON matches toolbar Add in [blocks.md](./blocks.md).
- ⌥⌘1 Actor, ⌥⌘3 Event, ⌥⌘4 Read Model, ⌥⌘5 Automation. Playwright `Alt+ControlOrMeta+Digit1` / `Digit3` / `Digit4` / `Digit5`. After selecting a Slice, Inspector `Name` may have focus, so the key runs after clicking the selected listitem (focus leaves Inspector, selection stays), not after clicking TIME chrome or empty `.board` ([inspect-deselect.md](./inspect-deselect.md)).
- Lane Add and keyboard Add are in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Toolbar New Slice default Actor is [new-slice-default-actor.md](./new-slice-default-actor.md). Creating a Slice from Add when there are none: Mac disables Add when there are no Slices; [blocks.md](./blocks.md) already does not create a Slice from toolbar Add. Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation stays [blocks.md](./blocks.md). `Add Command on lane` and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md). Timeline listitem from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` is [add-on-lane-paint.md](./add-on-lane-paint.md). Connection refusals, Inspector Description is [inspect-description.md](./inspect-description.md). Slice type picker is [slice-type.md](./slice-type.md). Mac window chrome. Heading Description dirty, Description-by-id, Slice type-by-id, Type dirty, and Add Field dirty are [name-binding-rest.md](./name-binding-rest.md). Last-Command Add Field and last-Command Field name stay [inspect-fields.md](./inspect-fields.md). Field name on the clicked Command / Event / Read Model / Automation of two, Field type / optional / example / delete on the clicked Command of two, and Field name / type / optional / example / delete on Event / Read Model / Automation, are [inspect-fields-rest.md](./inspect-fields-rest.md).

## Restates

- [add-on-lane.md](./add-on-lane.md) — Out of scope no longer owns click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Creating a Slice from Add when there are none stays not a feature (Mac disables Add; toolbar still does not create). Lane buttons and ⌥⌘1–5 last-Slice plus `Add Command on lane` / selected-Slice ⌥⌘2 stay that file.
- [blocks.md](./blocks.md) — Add targeting a non-last Slice for Actor / Event / Read Model / Automation is this slice. Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation stays this file. Clicking Add with no Slices still does not create a Slice.
- [canvas.md](./canvas.md) — Out of scope no longer owns click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [chrome.md](./chrome.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Last-Slice ⌥⌘1–5 and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [connections.md](./connections.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns click-append from those lane buttons or selected-Slice ⌥⌘1 / ⌥⌘3–5; this slice owns those. Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
- [product.md](../product.md) — Click-append from the other lane buttons and selected-Slice ⌥⌘1 / ⌥⌘3–5 are this slice. Playwright path for this slice adds: two New Slice, first `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`; selected-Slice ⌥⌘1 / ⌥⌘3–5 on the first Slice. Timeline listitem from those lane clicks is [add-on-lane-paint.md](./add-on-lane-paint.md). Showing dashed lane buttons, `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 stay [add-on-lane.md](./add-on-lane.md).
