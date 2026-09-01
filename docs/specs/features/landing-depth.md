# Landing depth

Status: released

## Problem

GET `/` is a centered white stack. Hero mesh is washed out, bento cards and the waitlist sit on the same pale field, and the product frame is a flat CSS mock in document flow. A visitor cannot tell this is a layered SaaS landing.

## Acceptance criteria

- [x] GET `/` `.hero` computed `min-height` is not `0px`
- [x] GET `/` `.product-shot` computed `transform` is not `none`
- [x] GET `/` `.hero figure` computed `margin-bottom` is a negative value
- [x] GET `/` `.bento` computed `background-color` is `rgb(248, 250, 252)`
- [x] GET `/` `.bento article` computed `background-color` is `rgb(255, 255, 255)`
- [x] GET `/` `.bento article` computed `box-shadow` is not `none`
- [x] GET `/` `.waitlist-band` computed `background-color` is `rgb(15, 23, 42)`
- [x] GET `/` heading `Join the waitlist` computed `color` is `rgb(255, 255, 255)`
- [x] GET `/` the text `Leave your email. If you already have access, use Sign in.` computed `color` is `rgb(255, 255, 255)`
- [x] Contrast of `canvas` `#FFFFFF` on `ink` `#0F172A` is at least 4.5:1
- [x] GET `/` has a `footer`
- [x] GET `/` without a Session, `footer` shows a link whose accessible name is `Event Model`
- [x] GET `/` without a Session, the `footer` link `Event Model` has `href` `/`
- [x] GET `/` without a Session, `footer` shows a link whose accessible name is `Sign in`
- [x] GET `/` without a Session, the `footer` link `Sign in` has `href` `/login`
- [x] GET `/` with a Session, `footer` shows a link whose accessible name is `Open app`
- [x] GET `/` with a Session, the `footer` link `Open app` has `href` `/app`

## Domain terms

Event Model, Person, Session, Team, Waitlist, Slice, Command, Event, Read Model, Automation

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/shell.css`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`
- Unit — contrast of `canvas` on `ink`

## UI

Screens: Landing. Primitives: Page, Card, AppBar, Button primary, Field, Footer. Look of Landing is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Playwright computed colors: `canvas` `#FFFFFF` → `rgb(255, 255, 255)`, `canvas-subtle` `#F8FAFC` → `rgb(248, 250, 252)`, `ink` `#0F172A` → `rgb(15, 23, 42)`.
- Form `waitlist-form` is `id="waitlist-form"`. It stays a Card (`canvas` fill, `line` border) on the ink waitlist band.
- Existing accessible names, waitlist POST, and body `canvas`/`ink` from [public-face.md](./public-face.md) remain. Header `Event Model` / `Sign in` / `Open app` locators stay that file.
- GET `/` with a Session still does not show a link `Sign in` (header and footer both show `Open app`).
- `.hero`, `.product-shot`, `.bento`, `.waitlist-band` are the Landing section class names already on `public/index.html`.
- `.bento article` computed proofs use the first article.
- Negative `margin-bottom` on `.hero figure` is the overlap onto the next section.
- **Look may grow:** on Landing, the implementer may add look chrome (glow, mesh regeneration, section headings, product image of existing UI, landmarks) by appending ACs in the same commit as the production (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate* of that chrome. Landing look is one `visual-design` pass (not one commit per CSS property). Look-may-grow is not skip review: `spec-review-loop` still runs on the PR after the first green commit; merge is still `release-manager`.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)). `muted` `#64748B` on `ink` does not meet 4.5:1 — waitlist-band copy uses `canvas`, not `muted`.
- Contrast proofs may be unit tests of the hex pairs; they must fail if a token changes below 4.5:1.
- Header sticky / `backdrop-filter` already shipped with [designed-surfaces.md](./designed-surfaces.md); this slice does not re-prove them.

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Login restyle. Editor restyle. Mac window chrome. Editing behavior stays the released editor specs. Product-visual token *values* stay [product-visual.md](./product-visual.md). New product claims (pricing, SLA, "anyone can join"). Hosted-editor product frame on Landing (not Mac traffic lights) is [landing-saas-shot.md](./landing-saas-shot.md).

## Restates

- [public-face.md](./public-face.md) — Copy, routes, waitlist POST, body `canvas`/`ink` stay that file. GET `/` `header` wordmark / `Sign in` / `Open app` stay that file (locators pinned to `header` so `footer` can repeat them). Landing depth (hero min-height, product-shot transform, figure overlap, bento band, ink waitlist band, footer) is this slice.
- [product-visual.md](./product-visual.md) — Token computed colors, waitlist Button primary, waitlist-form Card, and `header` link `Sign in` color stay that file. Landing depth is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — Viewport, flex header, padding, Inter, heading `56px`, `main` max-width `none`, and `header` link `Sign in` `:focus-visible` stay that file. Landing depth is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file. Footer primitive and `canvas-subtle` as a Landing band are this slice.
- [product.md](../product.md) — Contemporary SaaS on public HTML includes Landing depth (this slice), not a white stack of equal fields.
- [architecture.md](../architecture.md) — Public-face still applies public tokens; designed-surfaces still applies composed spacing/Inter. Landing depth (layered fields, overlapping product frame, footer) is this slice.
