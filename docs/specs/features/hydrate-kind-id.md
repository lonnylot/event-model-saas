# Hydrate kind id

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` hydrates Command, Event, and Read Model listitems with `data-id`. Actor and Automation listitems have none. Inspector Name and Backspace look up `dataset.id`, so a member who reopens a model cannot rename the first of two GET Actors or delete the first of two GET Actors or GET Automations: the Timeline listitem vanishes and the JSON still has the block.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline `Actor` listitem has a non-empty `data-id`
- [x] After a member creates a model, opens it, clicks `Add Automation`, and Saves, a reload of that page, the Timeline `Automation` listitem has a non-empty `data-id`
- [x] After a member creates a model, opens it, clicks `Add Actor`, and Saves, a reload of that page, clicking the first Timeline `Actor` listitem, filling Inspector `Name` with `Shopper` sets the first Actor `name` to `Shopper` and the last Actor `name` to `Actor`
- [x] After a member creates a model, opens it, clicks `Add Actor`, and Saves, a reload of that page, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace sets the remaining Actor `id` to the Actor that was last
- [x] After a member creates a model, opens it, clicks `Add Automation` twice, and Saves, a reload of that page, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace sets the remaining Automation `id` to the Automation that was last

## Domain terms

Event Model, Slice, Actor, Automation, Team, Person, Version

## Seams

- `handleRequest` — model page HTML hydrates Timeline Actor and Automation listitems with `data-id`
- `bindEditor` in `public/editor.js` — Name and Backspace on those GET listitems
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). GET Command / Event / Read Model `data-id` and ports stay [hydrate-board.md](./hydrate-board.md).
- Two GET Actors are that Create default plus one `Add Actor`, then Save and reload. First vs last. Clicking GET Actor still opens Inspector Name ([inspect-after-reload.md](./inspect-after-reload.md)). In-session Actor / Automation Name-by-id stays [name-binding-rest.md](./name-binding-rest.md). Name JSON on the first GET Actor is this slice.
- Two GET Automations are `Add Automation` twice, then Save and reload. In-session Actor / Automation Backspace stays [delete-rest.md](./delete-rest.md). Backspace on the first GET Actor or GET Automation is this slice. After selection, Inspector `Name` may have focus, so delete is Backspace after clicking the Timeline region.
- Actors never have ports ([connections.md](./connections.md)). Automations never have ports (that file).
- Name and delete are in-memory until Save. Save still uses the version check from model-persistence.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET Connection `data-id`. GET Inspector Description of the first of two Actors (last-of-kind helpers). GET Automation Name JSON. Shortcut listitem `data-kind` is [shortcut-kind.md](./shortcut-kind.md). Pan and Zoom. Landing. Mac window chrome. Copy changes.

## Restates

- [hydrate-board.md](./hydrate-board.md) — GET Command / Event / Read Model ports and Slice `data-id` stay that file. GET Actor / Automation `data-id` is this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — Clicking GET Actor / Automation still opens Inspector Name. GET Actor Name JSON and GET Actor / Automation Backspace are this slice.
- [name-binding-rest.md](./name-binding-rest.md) — In-session Actor / Automation Name-by-id stays that file. GET Actor Name JSON is this slice.
- [delete-rest.md](./delete-rest.md) — In-session Actor / Automation Backspace stays that file. GET Actor / Automation Backspace is this slice.
- [model-defaults.md](./model-defaults.md) — Create still seeds one Actor named `Actor`. GET `data-id` on that listitem is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET Actor / Automation `data-id` is this slice.
