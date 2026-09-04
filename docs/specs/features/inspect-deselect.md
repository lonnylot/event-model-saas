# Inspect deselect

Status: validated

## Problem

Clicking TIME chrome or empty `.board` after a Slice is selected leaves Inspector Name and Type. `Nothing Selected` does not return, so a member cannot clear the Inspector without picking another block.

## Acceptance criteria

- [x] After clicking the Timeline `New Slice` listitem, then clicking `.time-chrome`, the Inspector region shows the text `Nothing Selected`
- [ ] After clicking the Timeline `Actor` listitem, then clicking `.board` at a point that is not a listitem, the Inspector region shows the text `Nothing Selected`

## Domain terms

Event Model, Slice, Actor, Team, Person

## Seams

- `bindEditor` in `public/editor.js` — Inspector empty state after TIME or empty board click
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- GET with no local edits still shows `Nothing Selected` ([designed-surfaces.md](./designed-surfaces.md)). Clicking Timeline `New Slice` still shows Inspector Type ([slice-type.md](./slice-type.md)). Clicking Actor still shows Inspector Name ([chrome.md](./chrome.md)). Clearing that chrome after TIME or empty board click is this slice.
- `.time-chrome` is the TIME label sibling of `.board` ([time-chrome-stay.md](./time-chrome-stay.md)). Empty `.board` click is a point inside `.board` that is not a listitem or Connection `p`.
- Create model still seeds a default Slice and one Actor named `Actor` ([model-defaults.md](./model-defaults.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Leftover Type after a Connection click. GET last-of-kind Description. Shortcut ports. Narrow viewport. Landing. Mac window chrome. Copy changes.

## Restates

- [designed-surfaces.md](./designed-surfaces.md) — GET with no local edits still shows `Nothing Selected`. Clearing Inspector after TIME or empty board click is this slice.
- [slice-type.md](./slice-type.md) — Clicking Timeline `New Slice` still shows Type. Type after TIME click is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. Inspector empty state after TIME or empty board click is this slice.
