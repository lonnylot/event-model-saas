# Time chrome stay

Status: validated

## Problem

GET `/app/teams/{id}/models/{mid}` the Editor Timeline is TIME chrome above `.board`. Scrolling or Zoom in applies `scale(` / `translate(` to `.board`, a later sibling, so the board paints over TIME chrome. The slice rail and Inspector stay put ([timeline-clip.md](./timeline-clip.md)). TIME chrome does not.

## Acceptance criteria

- [x] After scrolling the Timeline region, `document.elementFromPoint` at the center of `.time-chrome` is inside `.time-chrome`
- [x] After clicking `Zoom in` on that page, `document.elementFromPoint` at the center of `.time-chrome` is inside `.time-chrome`
- [x] After scrolling the Timeline region, `.board` `getBoundingClientRect` does not intersect `.time-chrome`
- [x] After clicking `Zoom in` on that page, `.board` `getBoundingClientRect` does not intersect `.time-chrome`

## Domain terms

Event Model, Slice, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — wheel pan and toolbar zoom
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Pan is still scroll on the Timeline region ([canvas.md](./canvas.md)). Zoom factors stay [editor-shell.md](./editor-shell.md). Those transforms live on `.board` ([timeline-clip.md](./timeline-clip.md)).
- TIME chrome is a sibling of `.board` inside the Timeline column ([timeline-clip.md](./timeline-clip.md)). Center of `.time-chrome` is `left + width/2`, `top + height/2`.
- After scrolling or Zoom in, Timeline `getBoundingClientRect` still does not intersect `.slice-rail` or Inspector ([timeline-clip.md](./timeline-clip.md)).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)); proofs use that Editor.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Changing zoom factors. Replacing pan with native overflow scroll. Landing. Mac window chrome. Copy changes. Slice rail and Inspector clip stay [timeline-clip.md](./timeline-clip.md). Toolbar Zoom in exact `.board` `scale(1.25)` stays [editor-shell.md](./editor-shell.md).

## Restates

- [timeline-clip.md](./timeline-clip.md) — Slice rail and Inspector clip stay that file. TIME chrome sibling markup stays that file. Board not covering TIME chrome after pan or Zoom in is this slice. Out of scope asserting `.time-chrome` itself is leftover unused for this coverage proof.
- [hydrate-board.md](./hydrate-board.md) — GET hydrate of lane Add and ports stays that file. Board covering TIME chrome after pan or Zoom in is this slice.
- [canvas.md](./canvas.md) — Scrolling the Timeline region still pans. `.board` `translate(` stays [timeline-clip.md](./timeline-clip.md). TIME chrome remaining the hit target after that pan is this slice.
- [editor-shell.md](./editor-shell.md) — Toolbar Zoom in still sets `.board` `scale(1.25)`. TIME chrome remaining the hit target after that zoom is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. TIME chrome staying above the transformed board is this slice.
