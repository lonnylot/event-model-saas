# Timeline clip

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` the Editor is slice rail | Timeline | Inspector. Scrolling the Timeline applies `translate(` to the Timeline region itself, so that whole middle column — background and TIME chrome — moves over the slice rail and the Inspector.

## Acceptance criteria

- [x] After scrolling the Timeline region, `section[aria-label="Timeline"]` `getBoundingClientRect` does not intersect `.slice-rail`
- [x] After scrolling the Timeline region, `section[aria-label="Timeline"]` `getBoundingClientRect` does not intersect `section[aria-label="Inspector"]`
- [x] Scrolling the Timeline region sets `.board` `style.transform` to a value that includes `translate(`
- [x] After scrolling the Timeline region, `section[aria-label="Timeline"]` `style.transform` does not include `translate(`
- [x] After clicking `Zoom in` on that page, `section[aria-label="Timeline"]` `style.transform` does not include `scale(`

## Domain terms

Event Model, Slice, Team, Person

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`
- `bindEditor` in `public/editor.js` — wheel pan and toolbar zoom

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Pan is still scroll on the Timeline region ([canvas.md](./canvas.md)). The `translate(` lives on `.board`, not on `section[aria-label="Timeline"]`.
- Zoom factors `scale(1.25)` / `scale(0.8)` / `scale(1)` stay [editor-shell.md](./editor-shell.md). Those scales live on `.board`. Keyboard zoom ([canvas-rest.md](./canvas-rest.md)) and pinch zoom ([pinch-zoom.md](./pinch-zoom.md)) use the same transform target.
- TIME chrome is a sibling of `.board` inside the Timeline column (existing markup). Asserting `.time-chrome` itself is not this slice.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)); scroll proofs use that Editor.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Replacing pan with native overflow scroll. Changing zoom factors. Landing. Mac window chrome. Copy changes. Asserting `.time-chrome` itself. Toolbar Zoom in exact `.board` `scale(1.25)` stays [editor-shell.md](./editor-shell.md).

## Restates

- [canvas.md](./canvas.md) — Scrolling the Timeline region still pans. `section[aria-label="Timeline"]` `style.transform` includes `translate(` is leftover unused; `.board` `translate(` is this slice. After Zoom in, Timeline `scale(1.25)` and `translate(` together is leftover unused; those values live on `.board`.
- [editor-shell.md](./editor-shell.md) — Toolbar Zoom in / Zoom out / Reset zoom stay. Timeline `style.transform` `scale(1.25)` / `scale(0.8)` / `scale(1)` are leftover unused; those scales live on `.board`.
- [canvas-rest.md](./canvas-rest.md) — ⌘+/⌘-/⌘0 still zoom. Timeline `style.transform` scale values are leftover unused; scale lives on `.board`.
- [pinch-zoom.md](./pinch-zoom.md) — Ctrl+wheel still scales. Timeline `style.transform` scale is leftover unused; scale lives on `.board`.
- [product.md](../product.md) — Pan (scroll) and zoom stay. Transform target is `.board` (this slice).
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Clip of pan/zoom to the Timeline column is this slice.
