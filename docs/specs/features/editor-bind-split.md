# Editor bind split

Status: validated

## Problem

`bindEditor` in `public/editor.js` is one function that binds Inspector, keyboard, pointer (port drag, block drag, slice reorder), and Timeline pan/zoom. Leftover Inspector, keyboard, Connection, and canvas slices cannot proceed in parallel because they share one writer, so members wait on serialized leftover Editor bugs. GET Editor must still load `/editor.js` so the page bind stays one canvas script.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member includes a script whose `src` is `/editor.js`
- [x] `bindInspect` is imported only from `public/editor-inspect.js`
- [ ] `bindKeyboard` is imported only from `public/editor-keyboard.js`
- [ ] `bindPointer` is imported only from `public/editor-pointer.js`
- [ ] `bindCanvas` is imported only from `public/editor-canvas.js`

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

React, xyflow/React Flow, a store/framework rewrite, or a new `bindEditor` page seam. Leftover Inspector after `Event Happened → Read Model`. `Event Happened → Read Model` Backspace. ⌘S Save. GET Inspector for Slice type, Description, Command, Event, Read Model, Actor, or Automation. Connection caption placement. Shortcut listitem column. Mid-width Editor layout. CI job split. Landing. Mac window chrome. Copy changes.

## Restates

- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript (no xyflow/React Flow) matching the Mac layout. `bindEditor` in `public/editor.js` is the page bind and composes `bindInspect` (`public/editor-inspect.js`), `bindKeyboard` (`public/editor-keyboard.js`), `bindPointer` (`public/editor-pointer.js`), and `bindCanvas` (`public/editor-canvas.js`). Clip of pan/zoom, TIME chrome, GET hydrate, port look, shortcut DOM, Connection copy on `.board`, GET Inspector `Add Field`, leftover Inspector Type / Field chrome after a Connection, GET Actor / Automation `data-id`, GET `Command → Event Happened` `data-id`, shortcut `data-kind` / ports, narrow Editor layout, 800-wide Editor layout, Inspector empty after TIME or empty board, leftover Connection copy after Command click, and Inspector empty after Command Backspace stay the feature files that architecture Front end already names.
