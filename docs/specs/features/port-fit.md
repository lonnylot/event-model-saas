# Port fit

Status: released

## Problem

GET `/app/teams/{id}/models/{mid}` after `Add Event`, the `Event Happened port` button overflows the Slice column. The Event title is clipped (`Event Happen`) and the port sits past the `.slice-col` edge.

## Acceptance criteria

- [x] After clicking `Add Event` on that page, `Event Happened port` `getBoundingClientRect` does not overflow the `.slice-col` that contains it
- [x] After clicking `Add Event` on that page, `Event Happened port` `getBoundingClientRect` does not intersect the Event Happened listitem title text node `getBoundingClientRect`

## Domain terms

Event Model, Slice, Event, Team, Person

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`
- `env.ASSETS.fetch` — `public/shell.css`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `Event Happened port` after `Add Event` stays [connections.md](./connections.md). That button fitting inside its `.slice-col` is this slice. That button wrapping onto a second line under the title, and staying on the same row as the Event Happened title, is [port-wrap.md](./port-wrap.md).
- Create model still seeds a default Slice ([model-defaults.md](./model-defaults.md)). Toolbar Add Command on the selected first of two Slices is [add-toolbar-selected-slice.md](./add-toolbar-selected-slice.md). Toolbar Add Actor on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Event on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Read Model on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). Toolbar Add Automation on the selected first of two Slices is [add-toolbar-selected-slice-rest.md](./add-toolbar-selected-slice-rest.md). With no Slice selected, toolbar Add still targets the last Slice ([blocks.md](./blocks.md)).
- Overflow means the port's `getBoundingClientRect` `left`/`right`/`top`/`bottom` is outside that `.slice-col` box.
- Intersect means the port box overlaps the title text node's `getBoundingClientRect` (`left`/`right`/`top`/`bottom`). The Event title clipped to `Event Happen` is that overlap.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).
- **Look may grow:** on Editor, the implementer may keep `Command port` and `Read Model port` inside `.slice-col` by appending ACs in the same commit (`visual-design`). Look-may-grow is not skip review.

## Out of scope

GET ports after reload. Connection copy on `.board`. Pan and Zoom. Changing port accessible names. Landing. Mac window chrome. Copy changes. That button wrapping onto a second line under the title, and staying on the same row as the Event Happened title, is [port-wrap.md](./port-wrap.md).

## Restates

- [connections.md](./connections.md) — `Event Happened port` after `Add Event` stays that file. That button not overflowing `.slice-col`, and not intersecting the Event Happened title text, is this slice.
- [architecture.md](../architecture.md) — Public-face still applies public tokens. Editor look of the port in the Slice column is this slice.
