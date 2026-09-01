# Designed surfaces

Status: released

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
- [x] GET `/` `header` link `Sign in` `:focus-visible` computed `box-shadow` is not `none`
- [x] GET `/` shows an image whose accessible name is `Event Model editor`
- [x] GET `/` heading `Event Modeling for the whole team` computed `font-size` is `56px`
- [x] GET `/` `main` computed `max-width` is `none`
- [x] GET `/shell.css` includes `fonts.googleapis.com/css2?family=Inter` and `font-family: Inter, ui-sans-serif, system-ui, sans-serif`
- [x] GET `/app/teams/{id}/models/{mid}` as a member `main` computed `display` is `grid`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Inspector`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Model`
- [x] GET `/app/teams/{id}/models/{mid}` as a member with no Slices shows a heading whose accessible name is `Start the timeline`
- [x] GET `/app/teams/{id}/models/{mid}` as a member shows the text `Time`
- [x] GET `/app/teams/{id}/models/{mid}` as a member with no local edits shows the text `Nothing Selected`

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
- **Look may grow:** on named screens, the implementer may add visual structure (section headings, product images of existing UI, layout regions, static public pages that do not persist) by appending ACs in the same commit as the production (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate* of that chrome. Look-may-grow is not skip review: `spec-review-loop` still runs on the PR after the first green commit; merge is still `release-manager`.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).
- Contrast proofs may be unit tests of the hex pairs; they must fail if a token changes below 4.5:1.
- Timeline empty copy is a `p` in `.timeline-empty`. Connection lines are `p[data-kind="connection"]` so undo restore does not insert into the empty region.

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Mac window chrome. Editing behavior (New Slice, Save, drag, inspect) stays the released editor specs. Product-visual token *values* (body canvas/ink, accent buttons, sticky-note fills) stay [product-visual.md](./product-visual.md). Landing depth is [landing-depth.md](./landing-depth.md).

## Restates

- [product-visual.md](./product-visual.md) — Token computed colors and sticky-note fills stay that file. Spacing, type composition, AppBar layout, Card padding, viewport, focus-visible, and contrast proofs are this slice. GET `/` heading `Event Modeling for the whole team` computed `font-size` is `56px`, not `36px`. GET `/` `main` computed `max-width` is `none`, not `576px`. Out of scope no longer parks look iteration; `visual-design` owns it. Out of scope no longer parks webfont files; Google Fonts Inter is this slice. Dark mode, public signup, waitlist table stay Out of scope.
- [public-face.md](./public-face.md) — Copy, routes, waitlist POST, body canvas/ink, Login Button primary colors stay that file. Landing/Login look (flex header, padding, waitlist Card padding) is this slice. Out of scope no longer parks webfont files; Google Fonts Inter is this slice.
- [visual-shell.md](./visual-shell.md) — AppBar wordmark hrefs stay that file. AppBar layout (flex, padding) is this slice. Out of scope no longer parks webfont files; Google Fonts Inter is this slice.
- [design-system.md](../design-system.md) — Tokens and primitive inventory stay that file. `type` is `Inter, ui-sans-serif, system-ui, sans-serif`. This slice ships the Google Fonts Inter `@import` and Inter prefix. Look is iterated under [ADR 0001](../../adr/0001-look-iteration.md); this slice applies composed layout. Accessibility bar is that ADR.
- [product.md](../product.md) — Contemporary SaaS on public, team/admin, and editor HTML includes composed look ([ADR 0001](../../adr/0001-look-iteration.md), this slice), not token checkboxes alone.
- [architecture.md](../architecture.md) — Public-face still applies public tokens; product-visual still applies type, Card, Field, Button primary, signed-in Page, and editor canvas styling. Composed look (spacing, AppBar flex, Card padding, viewport, focus-visible, Google Fonts Inter) is this slice.
- [editor-shell.md](./editor-shell.md) — GET Inspector chrome (heading, empty copy) is this slice. Inspector region name, New Slice, zoom, and dirty copy stay that file. Slice and Actor Name stay [chrome.md](./chrome.md).
