# Cmd s save

Status: validated

## Problem

Product Save is explicit ⌘S, not autosave. The Editor Save button posts. Pressing ⌘S after a local edit leaves `Unsaved changes.`, so a member who uses the Mac shortcut does not Save.

## Acceptance criteria

- [x] After clicking `New Slice` on that page, pressing ⌘S, the page does not show the text `Unsaved changes.`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — ⌘S Save
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Clicking `New Slice` still shows `Unsaved changes.` ([editor-shell.md](./editor-shell.md)). Clicking Save still clears that text (that file). ⌘S is Playwright `ControlOrMeta+s`. Save still uses the version check from model-persistence.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Autosave. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [editor-shell.md](./editor-shell.md) — Clicking Save still clears `Unsaved changes.`. ⌘S Save is this slice.
- [product.md](../product.md) — Explicit Save (⌘S), not autosave, is this slice's keyboard path. The Save button stays [editor-shell.md](./editor-shell.md).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. ⌘S Save is this slice.
