# Editor midwidth

Status: validated

## Problem

At an 800-wide viewport the Editor `main` stays slice rail | Timeline | Inspector. The Slice column overflows the Timeline region by the Inspector width, so a member on a tablet cannot read the Slice title or the dashed lane Add buttons.

## Acceptance criteria

- [x] After a member creates a model and opens it at viewport 800×600, the `.slice-col` `getBoundingClientRect` is inside the Timeline region `getBoundingClientRect`

## Domain terms

Event Model, Slice, Team, Person

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Desktop Editor grid stays [designed-surfaces.md](./designed-surfaces.md) / [visual-shell.md](./visual-shell.md). The 720px stacked grid is leftover unused for this width (800 is above that breakpoint). Slice column inside Timeline at 800×600 is this slice.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)).
- Inside means the Slice column `left`/`right`/`top`/`bottom` is not outside the Timeline region box.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

390-wide stacked layout. Changing zoom factors. Connection caption placement. Inspector leftover Type. Shortcut ports. Landing. Mac window chrome. Copy changes. Timeline region name stays [editor-shell.md](./editor-shell.md).

## Restates

- [designed-surfaces.md](./designed-surfaces.md) — Desktop Editor `main` grid stays that file. 800-wide Slice inside Timeline is this slice.
- [visual-shell.md](./visual-shell.md) — Editor shell tokens stay that file. 800-wide Slice inside Timeline is this slice.
- [timeline-clip.md](./timeline-clip.md) — Pan/zoom still clip to the Timeline column. Unzoomed 800-wide Slice inside Timeline is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. 800-wide Editor layout is this slice.
