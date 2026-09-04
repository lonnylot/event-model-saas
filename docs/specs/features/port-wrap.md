# Port wrap

Status: validated

## Problem

After `Add Event`, `Event Happened port` wraps onto a second line under the Event Happened title (`li:has(button)` `flex-wrap: wrap`). The port fits inside the Slice column ([port-fit.md](./port-fit.md)) but the Event block is two rows tall, so a member cannot read the Event as one chip.

## Acceptance criteria

- [x] After clicking `Add Event` on that page, `Event Happened port` `getBoundingClientRect.top` minus the Event Happened listitem `getBoundingClientRect.top` is less than or equal to `8`

## Domain terms

Event Model, Slice, Event, Team, Person

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`
- `env.ASSETS.fetch` — `public/shell.css`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `Event Happened port` after `Add Event` stays [connections.md](./connections.md). That button fitting inside its `.slice-col` and not intersecting the title text node stays [port-fit.md](./port-fit.md). That button staying on the same row as the Event Happened title is this slice.
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Same row means `Event Happened port` `getBoundingClientRect.top` minus the Event Happened listitem `getBoundingClientRect.top` is at most `8` pixels. Wrap onto a second line was about `33` pixels.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

GET ports after reload stay [hydrate-board.md](./hydrate-board.md). Connection copy on `.board`. Pan and Zoom. Changing port accessible names. Narrow viewport. Landing. Mac window chrome. Copy changes.

## Restates

- [port-fit.md](./port-fit.md) — `Event Happened port` still does not overflow `.slice-col` and still does not intersect the Event Happened title text node. That button wrapping onto a second line under the title, and staying on the same row as the Event Happened title, is this slice.
- [connections.md](./connections.md) — `Event Happened port` after `Add Event` stays that file. Same-row placement with the Event Happened title is this slice.
- [architecture.md](../architecture.md) — Public-face still applies public tokens. Editor look of the port on the same row as the Event title is this slice.
