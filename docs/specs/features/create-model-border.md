# Create model border

Status: released

## Problem

GET `/app/teams/{id}` `Create model` is Button primary (`accent` fill, `on-accent` type, `radius`) but keeps the user-agent `border`. Login `Email me a link` and waitlist `Join the waitlist` set `border` `0`. The Team page control reads as a teal pill with a grey outline.

## Acceptance criteria

- [x] GET `/app/teams/{id}` as a member, the button `Create model` computed `border-top-width` is `0px`

## Domain terms

Team, Person, Event Model

## Seams

- `env.ASSETS.fetch` — `public/shell.css`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Team. Primitives: Button primary (`Create model`). Look of Team is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Button primary `accent` / `on-accent` / `radius` on `Create model` stay [product-visual.md](./product-visual.md). This slice adds `border` `0` so that control matches waitlist / login Button primary.
- `:focus-visible` on buttons stays [designed-surfaces.md](./designed-surfaces.md) (`box-shadow` accent). This slice does not remove that affordance.
- Create model name, href, and POST stay [model-persistence.md](./model-persistence.md).

## Out of scope

Create team / Send invite / Save borders. Dark mode. Public signup. Editor restyle. Copy changes.

## Restates

- [product-visual.md](./product-visual.md) — Create model Button primary fill, type, and `radius` stay that file. `border-top-width` `0px` on that button is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file. Button primary on Team `Create model` has no UA border.
- [app-chrome.md](./app-chrome.md) — Team Event Models heading, empty copy, and model `article` lift stay that file.
- [architecture.md](../architecture.md) — Public CSS still applies tokens. Create model border is this slice.
