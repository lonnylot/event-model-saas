# Designed surfaces

Status: validated

## Problem

Public and signed-in HTML apply tokens as isolated computed properties. Landing is still a stack of unspaced headings and a teal button. A visitor cannot tell this is a designed SaaS product. Spacing, type, and layout were treated as extra chrome, so implementers could not iterate look.

## Acceptance criteria

- [x] GET `/` has a `meta[name="viewport"]` whose `content` includes `width=device-width`
- [x] GET `/` `header` computed `display` is `flex`
- [x] GET `/` `header` computed `padding-top` is not `0px`
- [x] GET `/` `main` computed `padding-top` is not `0px`
- [x] GET `/` form `waitlist-form` computed `padding-top` is not `0px`
- [x] GET `/login` `header` computed `display` is `flex`
- [x] GET `/login` `header` computed `padding-top` is not `0px`
- [x] GET `/login` form `login` computed `padding-top` is not `0px`
- [x] GET `/app` as site admin with no teams `header` computed `display` is `flex`
- [x] GET `/app` as site admin with no teams `header` computed `padding-top` is not `0px`
- [x] GET `/app/teams/{id}/models/{mid}` as a member `header` computed `display` is `flex`
- [x] GET `/app/teams/{id}/models/{mid}` as a member `header` computed `padding-top` is not `0px`
- [x] Contrast of `ink` `#0F172A` on `canvas` `#FFFFFF` is at least 4.5:1
- [x] Contrast of `on-accent` `#FFFFFF` on `accent` `#0F766E` is at least 4.5:1
- [x] GET `/` link `Sign in` `:focus-visible` computed `box-shadow` is not `none`

## Domain terms

Event Model, Person, Site admin, Session, Team, Waitlist

## Seams

- `env.ASSETS.fetch` — `public/shell.css`, `public/index.html`, `public/login.html`, `public/404.html`
- `shell` / `appPageHtml` / `expiredLinkHtml` / `modelPageHtml` — signed-in and expired HTML
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`
- Unit — contrast of design-system token pairs

## UI

Screens: Landing, Login, Not found, Expired link, App, Team picker, Team, Teams admin, Editor. Primitives: Page, Card, AppBar, Button primary, Field. Look of those screens is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md) / [product-visual.md](./product-visual.md).
- Form `waitlist-form` is `id="waitlist-form"`. Form `login` is `id="login"`.
- Existing accessible names and body token colors from [public-face.md](./public-face.md) and [product-visual.md](./product-visual.md) remain.
- **Look may grow:** on named screens, the implementer may add visual structure (section headings, product images of existing UI, layout regions, static public pages that do not persist) by appending ACs in the same commit as the production (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. The PR is the human gate — do not halt for a new validate.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).
- Contrast proofs may be unit tests of the hex pairs; they must fail if a token changes below 4.5:1.

## Out of scope

Webfont files. Dark mode. Public signup. Site admin waitlist table UI. Mac window chrome. Editing behavior (New Slice, Save, drag, inspect) stays the released editor specs. Product-visual token *values* (body canvas/ink, accent buttons, sticky-note fills) stay [product-visual.md](./product-visual.md).

## Restates

- [product-visual.md](./product-visual.md) — Token computed colors and sticky-note fills stay that file. Spacing, type composition, AppBar layout, Card padding, viewport, focus-visible, and contrast proofs are this slice. Out of scope no longer parks look iteration; `visual-design` owns it. Webfont, dark mode, public signup, waitlist table stay Out of scope.
- [public-face.md](./public-face.md) — Copy, routes, waitlist POST, body canvas/ink, Login Button primary colors stay that file. Landing/Login look (flex header, padding, waitlist Card padding) is this slice.
- [visual-shell.md](./visual-shell.md) — AppBar wordmark hrefs stay that file. AppBar layout (flex, padding) is this slice.
- [design-system.md](../design-system.md) — Tokens and primitive inventory stay that file. Look is iterated under [ADR 0001](../../adr/0001-look-iteration.md); this slice applies composed layout. Accessibility bar is that ADR.
- [product.md](../product.md) — Contemporary SaaS on public, team/admin, and editor HTML includes composed look ([ADR 0001](../../adr/0001-look-iteration.md), this slice), not token checkboxes alone.
