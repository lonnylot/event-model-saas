# Editor bind split

Status: released

## Problem

`bindEditor` in `public/editor.js` is one function that binds Inspector, keyboard, pointer (port drag, block drag, slice reorder), and Timeline pan/zoom. Leftover Inspector, keyboard, Connection, and canvas slices cannot proceed in parallel because they share one writer, so members wait on serialized leftover Editor bugs. GET Editor must still load `/editor.js` so the page bind stays one canvas script.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member includes a script whose `src` is `/editor.js`
- [x] `bindInspect` is imported only from `public/editor-inspect.js`
- [x] `bindKeyboard` is imported only from `public/editor-keyboard.js`
- [x] `bindPointer` is imported only from `public/editor-pointer.js`
- [x] `bindCanvas` is imported only from `public/editor-canvas.js`

## Domain terms

Event Model, Slice, Command, Event, Read Model, Connection, Team, Person

## Seams

- `handleRequest` — model page HTML script `src`
- `bindEditor` in `public/editor.js` — page bind; calls `bindInspect`, `bindKeyboard`, `bindPointer`, and `bindCanvas`
- `bindInspect` in `public/editor-inspect.js` — Inspector Name, Description, Type, Fields, leftover unbind, empty state
- `bindKeyboard` in `public/editor-keyboard.js` — Backspace, undo, Slice shortcut, zoom keys, kind shortcuts
- `bindPointer` in `public/editor-pointer.js` — port drag, block drag, slice reorder
- `bindCanvas` in `public/editor-canvas.js` — Timeline pan/zoom transform
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `bindEditor(root)` remains the page bind. GET Editor still boots that bind from `/editor.js`. This slice does not add a second page script entry.
- Inspector Name still [inspect-blocks.md](./inspect-blocks.md). Command Backspace still [delete-blocks.md](./delete-blocks.md). Command port drag still [connections.md](./connections.md). Timeline pan still [canvas.md](./canvas.md). Toolbar zoom still [editor-shell.md](./editor-shell.md). Those behaviors stay those files; this slice owns where the bind is imported from.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

React, xyflow/React Flow, a store/framework rewrite, or a new `bindEditor` page seam. Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Leftover Field type / Optional / Example / Delete Field after that click is [inspect-event-read-fields.md](./inspect-event-read-fields.md). `Event Happened → Read Model` Backspace. ⌘S Save is [cmd-s-save.md](./cmd-s-save.md). GET Inspector for Slice type of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Type of the first of two Slices is [inspect-get-slice-type.md](./inspect-get-slice-type.md). GET Inspector for Slice Description of one Slice stays [inspect-rest.md](./inspect-rest.md). GET Description of the first of two Slices is [inspect-get-slice-description.md](./inspect-get-slice-description.md). GET Description of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Field of the first of two Commands is [inspect-get-command.md](./inspect-get-command.md). GET Inspector for Command Description of one Command stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Command Field of one Command stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Command Field type of one Command stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Commands is [inspect-get-command-field-type.md](./inspect-get-command-field-type.md). GET Description of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Description of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field of the first of two Events is [inspect-get-event.md](./inspect-get-event.md). GET Inspector for Event Field of one Event stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Event Field type of one Event stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Events is [inspect-get-event-field-type.md](./inspect-get-event-field-type.md). GET Description of the first of two Read Models is [inspect-get-read-model.md](./inspect-get-read-model.md). GET Field of the first of two Read Models is [inspect-get-read-model-field.md](./inspect-get-read-model-field.md). GET Description of the first of two Actors is [inspect-get-actor.md](./inspect-get-actor.md). GET Description of the first of two Automations is [inspect-get-automation.md](./inspect-get-automation.md). GET Field of the first of two Automations is [inspect-get-automation-field.md](./inspect-get-automation-field.md). GET Inspector for Read Model Description of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Read Model Field of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Read Model Field type of one Read Model stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Read Models is [inspect-get-read-model-field-type.md](./inspect-get-read-model-field-type.md). GET Inspector for Actor Description of one Actor stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation Description of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation Field of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Inspector for Automation Field type of one Automation stays [inspect-rest.md](./inspect-rest.md). GET Field type of the first of two Automations is [inspect-get-automation-field-type.md](./inspect-get-automation-field-type.md). Connection caption placement is [connection-caption.md](./connection-caption.md). ⌥⌘2 listitem column is [shortcut-target.md](./shortcut-target.md). ⌥⌘1 / ⌥⌘3–5 listitem column. Mid-width Editor layout. CI job split. Landing. Mac window chrome. Copy changes.

## Restates

- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript (no xyflow/React Flow) matching the Mac layout. `bindEditor` in `public/editor.js` is the page bind and composes `bindInspect` (`public/editor-inspect.js`), `bindKeyboard` (`public/editor-keyboard.js`), `bindPointer` (`public/editor-pointer.js`), and `bindCanvas` (`public/editor-canvas.js`). Clip of pan/zoom, TIME chrome, GET hydrate, port look, shortcut DOM, ⌥⌘2 listitem column, Connection copy on `.board`, GET Inspector `Add Field`, leftover Inspector Type / Field chrome after `Command → Event Happened`, GET Actor / Automation `data-id`, GET `Command → Event Happened` `data-id`, shortcut `data-kind` / ports, narrow Editor layout, 800-wide Editor layout, Inspector empty after TIME or empty board, leftover Connection copy after Command click, and Inspector empty after Command Backspace stay the feature files that architecture Front end already names. Leftover Add Field / Field name after `Event Happened → Read Model` is [inspect-event-read.md](./inspect-event-read.md). Leftover Field type / Optional / Example / Delete Field after `Event Happened → Read Model` is [inspect-event-read-fields.md](./inspect-event-read-fields.md).
