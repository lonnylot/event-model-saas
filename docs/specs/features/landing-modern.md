# Landing modern

Status: validated

## Problem

GET `/` is a centered brochure: stacked headline, pill CTA, product frame, three equal cards. Stripe and Linear compose left-aligned display type, a distinctive color field, and motion. Copy is not the miss. A visitor can tell this is a template, not those products. The one-slice mobile crop leaves empty canvas. The bento is a short caption strip, so the page ends almost immediately. Mobile hero padding sits tight under the AppBar.

## Acceptance criteria

- [x] GET `/` at viewport `1440x900`, `.hero` computed `display` is `grid`
- [x] GET `/` at viewport `1440x900`, heading `Event Modeling for the whole team` computed `text-align` is `start`
- [x] GET `/` at viewport `1440x900`, heading `Event Modeling for the whole team` computed `font-size` is `72px`
- [x] GET `/` `.hero h1 span` computed `color` is `rgb(15, 118, 110)`
- [x] GET `/` `header` link `Sign in` computed `border-top-width` is not `0px`
- [x] GET `/` without a Session, `.hero` link `Sign in` computed `border-top-width` is not `0px`
- [x] GET `/` with a Session, `header` link `Open app` computed `border-top-width` is not `0px`
- [x] GET `/` with a Session, `.hero` link `Open app` computed `border-top-width` is not `0px`
- [x] GET `/` at viewport `1440x900`, `.bento` computed `background-color` is `rgba(0, 0, 0, 0)`
- [x] GET `/` at viewport `1440x900`, `.bento article` computed `box-shadow` is `none`
- [x] GET `/` at viewport `1440x900`, `.bento article` computed `background-color` is `rgba(0, 0, 0, 0)`
- [x] GET `/` at viewport `390x844`, `.bento article` computed `box-shadow` is `none`
- [x] GET `/` `.bento` first `article` has `.team-shot`
- [x] GET `/` `.bento` second `article` has `.slice-shot`
- [x] GET `/` `.bento` third `article` has `.invite-shot`
- [x] GET `/` `.hero .product-shot` computed `animation-name` is not `none`
- [x] GET `/` with `prefers-reduced-motion: reduce`, `.hero .product-shot` computed `animation-name` is `none`
- [x] GET `/` at viewport `390x844`, heading `Event Modeling for the whole team` computed `text-align` is `start`
- [x] GET `/` at viewport `390x844`, `.hero` computed `padding-top` is `56px`
- [x] GET `/` at viewport `390x844`, `.hero .product-shot .shot-col` computed `flex-grow` is `1`
- [ ] GET `/` at viewport `390x844`, `.hero .product-shot .shot-lane-rail` computed `display` is `flex`

## Domain terms

Event Model, Team, Person, Slice, Session, Waitlist

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/shell.css`, `public/hero-mesh.jpg`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing. Primitives: Page, AppBar, Card, Button primary, Field, Footer. Look of Landing is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Desktop proofs use viewport `1440x900`. Narrow proofs use `390x844`.
- Locked copy from [landing-fold.md](./landing-fold.md) and [public-face.md](./public-face.md) stays: hero heading, hero sentence, Join the waitlist, Sign in / Open app, bento headings and one-paragraph bodies, waitlist copy. This slice does not restate those sentences.
- GET `/` at `1440x900`, `.product-shot` fully in the first viewport stays [landing-fold.md](./landing-fold.md). Split hero must still satisfy it.
- `.hero h1 span` wraps existing words inside the heading so the accessible name stays `Event Modeling for the whole team`. Accent is `accent` `#0F766E` → `rgb(15, 118, 110)`.
- Header / hero `Sign in` names and hrefs stay [public-face.md](./public-face.md) / [landing-fold.md](./landing-fold.md). This slice adds a visible `border` so those links read as controls, not bare text.
- `.bento` is three stacked rows, not a caption strip or a `canvas-subtle` band. Section fill is transparent (`rgba(0, 0, 0, 0)`), which restates [landing-depth.md](./landing-depth.md) `.bento` `rgb(248, 250, 252)` and [landing-chrome-depth.md](./landing-chrome-depth.md) `.bento` `box-shadow` not `none` as leftover unused. Articles are not Cards: transparent fill, `box-shadow` `none`. One `p` per article stays [landing-fold.md](./landing-fold.md). Each article pairs that copy with a decorative product image of existing UI (`aria-hidden`): Team models list (`.team-shot`), editor timeline (`.slice-shot`), Invite email + Save (`.invite-shot`). No new heading. No new product claims.
- Mobile `.hero .product-shot` still shows `Checkout` and does not show `Fulfillment` ([landing-fold.md](./landing-fold.md)). This slice fills that one slice: `.shot-col` `flex-grow` `1` and `.shot-lane-rail` visible. Do not hide the lane rail on the narrow viewport. Hero `padding-top` at `390x844` is `56px`.
- Hero product-shot animation is CSS. `prefers-reduced-motion: reduce` sets that shot’s `animation-name` to `none`. Bento `.slice-shot` is not animated.
- Body stays `canvas` `#FFFFFF`. This slice is Stripe-like light composition, not Linear dark mode.
- **Look may grow:** on Landing, the implementer may add look chrome (hero ribbon/mesh regeneration, grain, hover lift, waitlist atmosphere, density of the product images) by appending ACs in the same commit (`visual-design`). Do not change locked copy, add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate* of that chrome after this spec is validated. Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)). Accent span on `canvas` must stay ≥ 4.5:1 (`accent` on `canvas` is).

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Login restyle. Editor restyle. Mac window chrome. Copy changes. New product claims (pricing, SLA, "anyone can join"). Product-visual token *values* stay [product-visual.md](./product-visual.md). A second hero heading.

## Restates

- [designed-surfaces.md](./designed-surfaces.md) — GET `/` heading `Event Modeling for the whole team` computed `font-size` is `72px` at viewport `1440x900`, not `56px`. Viewport, flex header, Inter, `main` max-width `none` stay that file.
- [product-visual.md](./product-visual.md) — GET `/` heading `Event Modeling for the whole team` computed `font-size` is `72px` at viewport `1440x900`, not `56px`. Token colors stay that file.
- [landing-fold.md](./landing-fold.md) — Locked copy, first-screen product-shot visibility, waitlist row, footer Mark, hero Sign in / Open app, mobile `Checkout` not `Fulfillment` stay that file. Hero composition (grid, start-aligned display type, accent span, motion), the filled one-slice mobile frame, and stacked bento rows with product images are this slice.
- [landing-depth.md](./landing-depth.md) — Overlap, ink waitlist, footer landmark stay that file. Centered hero stack is leftover unused. `.bento` `canvas-subtle` fill, bento article `canvas` fill, and article `box-shadow` not `none` are leftover unused; stacked rows on `canvas` are this slice.
- [landing-chrome-depth.md](./landing-chrome-depth.md) — Header / waitlist / footer lift stay that file. `.bento` `box-shadow` not `none` is leftover unused; lift sits on the nested product images.
- [design-system.md](../design-system.md) — Tokens stay that file. Landing look is split-hero display type and stacked product-image rows, not a centered three-card brochure or a third canvas-subtle band.
- [product.md](../product.md) — GET `/` is still the marketing landing. Contemporary SaaS on Landing includes this slice’s composition (Stripe-like light, not Linear dark).
- [architecture.md](../architecture.md) — Public-face still applies public tokens. Landing modern composition is this slice.
