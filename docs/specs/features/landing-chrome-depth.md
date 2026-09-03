# Landing chrome depth

Status: released

## Problem

GET `/` product frame still has a browser URL bar. The hero has depth; the nav, bento band, waitlist, and footer sit as flat strips. A visitor sees a designed hero on a brochure page.

## Acceptance criteria

- [x] GET `/` `.product-shot` does not show the text `event-model.lonnylot.com`
- [x] GET `/` `.product-shot` does not contain `.browser-bar`
- [x] GET `/` `header` computed `box-shadow` is not `none`
- [x] GET `/` `.bento` computed `box-shadow` is not `none`
- [x] GET `/` `.waitlist-band` computed `box-shadow` is not `none`
- [x] GET `/` `footer` computed `box-shadow` is not `none`

## Domain terms

Event Model, Session, Waitlist

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/shell.css`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing. Primitives: Page, AppBar, Card, Footer. Look of Landing is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `.product-shot` hosted editor names (`Save`, `Export`, `Sign out`, `New Slice`, `Model`, `Slices`, `Time`, `Inspector`) stay [landing-saas-shot.md](./landing-saas-shot.md). Decorative chrome stays `aria-hidden`.
- `.browser-bar` / `.browser-url` and the text `event-model.lonnylot.com` inside `.product-shot` are leftover unused.
- GET `/` `header` is the Landing AppBar (sticky). `footer` is the Landing Footer. `#waitlist-form` is `id="waitlist-form"`. `.bento` is the three-article band.
- Header `Sign in` / `Open app` locators stay [public-face.md](./public-face.md). Footer Sign in / Open app are leftover unused. Footer mark `img` is [landing-fold.md](./landing-fold.md).
- These ACs share one Landing stylesheet pass; Landing look is one `visual-design` pass (not one commit per CSS property).
- **Look may grow:** on Landing, the implementer may add look chrome (stronger lift, glass nav, inset band highlights) by appending ACs in the same commit (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate*. Hero composition stays [landing-depth.md](./landing-depth.md) unless an AC in this file names it. Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Login restyle. Editor restyle. Mac window chrome. Hero restyle (hero is OK). Editing behavior stays the released editor specs. Product-visual token *values* stay [product-visual.md](./product-visual.md). New product claims (pricing, SLA, "anyone can join"). Footer mark `img` is [landing-fold.md](./landing-fold.md).

## Restates

- [landing-saas-shot.md](./landing-saas-shot.md) — Hosted editor names in `.product-shot` stay that file. GET `/` `.product-shot` does not show `event-model.lonnylot.com`; `.browser-bar` is leftover unused. Browser address chrome is this slice (removed).
- [landing-depth.md](./landing-depth.md) — Layered hero, product-shot transform, figure overlap, bento `canvas-subtle` / article `canvas` fill, ink waitlist, footer landmark stay that file. AppBar / bento band / waitlist band / Footer *lift* (`box-shadow` not `none`) is this slice. Bento article `box-shadow` stays that file.
- [designed-surfaces.md](./designed-surfaces.md) — GET `/` image accessible name `Event Model editor` stays that file. AppBar flex / padding stay that file. AppBar `box-shadow` on Landing is this slice.
- [public-face.md](./public-face.md) — Copy, routes, waitlist POST, body `canvas`/`ink` stay that file.
- [design-system.md](../design-system.md) — Tokens stay that file. Landing AppBar, bento band, waitlist band, and Footer lift are this slice.
- [product.md](../product.md) — Public HTML is contemporary SaaS; Landing nav and below-hero bands have depth (this slice). The Landing product frame has no URL bar.
- [architecture.md](../architecture.md) — Hosted-editor product frame stays [landing-saas-shot.md](./landing-saas-shot.md). Landing chrome depth (no URL bar; nav / bento / waitlist / footer lift) is this slice.
