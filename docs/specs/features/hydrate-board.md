# Hydrate board

Status: validated

## Problem

GET `/app/teams/{id}/models/{mid}` after Create model renders the seeded Slice as a `.slice-head` `div` with no Timeline `New Slice` listitem, no dashed lane Add buttons, and no `data-id`. Clicking the column title does not open Inspector. After Save and reload, Command and Event listitems have no ports, so a member cannot draw a new Connection. Click-created Slices (`mountSliceColumn`) already have that chrome.

## Acceptance criteria

- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a listitem whose accessible name is `New Slice`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Actor on lane`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Command on lane`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Event on lane`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Read Model on lane`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Automation on lane`
- [x] GET `/app/teams/{id}/models/{mid}` as a member after Create model, clicking the Timeline `New Slice` listitem shows the Inspector `Name` textbox with the value `New Slice`
- [x] After a member creates a model, opens it, clicks `Add Command`, and Saves, a reload of that page, the Timeline region shows a button whose accessible name is `Command port`
- [x] After a member creates a model, opens it, clicks `Add Event`, and Saves, a reload of that page, the Timeline region shows a button whose accessible name is `Event Happened port`
- [x] After a member creates a model, opens it, clicks `Add Read Model`, and Saves, a reload of that page, the Timeline region shows a button whose accessible name is `Read Model port`

## Domain terms

Event Model, Slice, Actor, Command, Event, Read Model, Automation, Connection, Team, Person, Version

## Seams

- `handleRequest` — model page HTML hydrates Timeline slice columns
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Create model still seeds one `New Slice` with one Actor named `Actor` ([model-defaults.md](./model-defaults.md)). Sidebar `New Slice` listitem stays that file. Timeline `New Slice` listitem is this slice.
- Lane button names stay `Add Actor on lane` / `Add Command on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` ([add-on-lane.md](./add-on-lane.md)). Those ACs stay “after clicking `New Slice`”. GET after Create without that click is this slice.
- `Command port` / `Event Happened port` after `New Slice` then Add stay [connections.md](./connections.md). Those ports after Save and reload (no extra `New Slice` click) are this slice.
- Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Pan and Zoom covering TIME chrome. Changing Create JSON defaults. Drawing Connections as canvas lines. Landing. Mac window chrome. Copy changes.

## Restates

- [model-defaults.md](./model-defaults.md) — Seeded Slice JSON and sidebar `New Slice` / Timeline `Actor` stay that file. Timeline `New Slice` listitem, dashed lane Add, and Inspector from clicking that listitem are this slice. After clicking `New Slice`, pressing ⌘Z leaves the Create default `New Slice` (2 listitems: sidebar + Timeline). Count `1` is leftover unused.
- [add-on-lane.md](./add-on-lane.md) — After clicking `New Slice`, dashed lane Add stays that file. GET after Create showing those buttons is this slice.
- [connections.md](./connections.md) — `Command port` after `New Slice` then `Add Command` stays that file. Reload still shows `Command → Event Happened` text. Ports after Save and reload (Command, Event Happened, Read Model) are this slice.
- [inspect-after-reload.md](./inspect-after-reload.md) — GET-rendered listitem click still opens Inspector Name. Timeline `New Slice` listitem on GET after Create is this slice.
- [editor-shell.md](./editor-shell.md) — Toolbar `New Slice` stays that file. Timeline `New Slice` listitem on GET after Create is this slice.
- [architecture.md](../architecture.md) — Editor canvas stays custom timeline TypeScript. GET hydrate of lane Add and ports is this slice.
- [canvas.md](./canvas.md) — After clicking `New Slice`, pressing ⌘Z leaves the Create default `New Slice` (2 listitems: sidebar + Timeline). Count `1` is leftover unused.
- [connection-refusals.md](./connection-refusals.md) — ⌘Z four times after a refused duplicate Command → Event leaves the Create default `New Slice` (2 listitems). Count `1` is leftover unused.
- [canvas-rest.md](./canvas-rest.md) — Restates of four-press undo still names Add Command on the stack; count `1` is leftover unused.
- [undo-rest.md](./undo-rest.md) — Restates of four-press undo still names Add Event on the stack; count `1` is leftover unused. After clicking `New Slice`, ⌘Z then ⇧⌘Z leaves Timeline `New Slice` listitems at the Create default plus the restored click-created Slice. Count `0` after undo is leftover unused.
- [inspect-rest.md](./inspect-rest.md) — GET after Create hydrates Timeline `New Slice` as well as the sidebar listitem. Clicking `Checkout` after reload uses the first matching listitem. A unique `Checkout` listitem is leftover unused.
- [chrome.md](./chrome.md) — GET after Create hydrates Timeline `New Slice` as well as the sidebar listitem. A unique `Checkout` listitem after reload is leftover unused.
- [product.md](../product.md) — Playwright leftover Mac pairs path: refused second Command → Event then ⌘Z four times shows 2 New Slice. Count `1` is leftover unused.
