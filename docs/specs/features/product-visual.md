# Product visual

Status: validated

## Problem

Public pages have copy and body colors only. Signed-in pages are paper cream. The editor has no stylesheet. A Person cannot tell this is a designed SaaS product.

## Acceptance criteria

- [x] GET `/` `body` computed `font-family` includes `system-ui`
- [x] GET `/` `header` computed `border-bottom-color` is `rgb(226, 232, 240)`
- [x] GET `/` link `Sign in` computed `color` is `rgb(15, 118, 110)`
- [x] GET `/` heading `Event Modeling for the whole team` computed `font-size` is `36px`
- [x] GET `/` the text `One Event Model, signed in. No passing files around.` computed `color` is `rgb(100, 116, 139)`
- [x] GET `/` `main` computed `max-width` is `576px`
- [x] GET `/` button `Join the waitlist` computed `background-color` is `rgb(15, 118, 110)`
- [x] GET `/` button `Join the waitlist` computed `color` is `rgb(255, 255, 255)`
- [x] GET `/` button `Join the waitlist` computed `border-radius` is `10px`
- [x] GET `/` textbox `Email` computed `border-top-color` is `rgb(226, 232, 240)`
- [x] GET `/` textbox `Email` computed `border-radius` is `10px`
- [x] GET `/` form `waitlist-form` computed `border-top-color` is `rgb(226, 232, 240)`
- [x] GET `/` form `waitlist-form` computed `border-radius` is `10px`
- [x] GET `/` form `waitlist-form` computed `max-width` is `384px`
- [x] GET `/login` `body` computed `font-family` includes `system-ui`
- [ ] GET `/login` `header` computed `border-bottom-color` is `rgb(226, 232, 240)`
- [ ] GET `/login` link `Event Model` computed `color` is `rgb(15, 118, 110)`
- [ ] GET `/login` textbox `Email` computed `border-top-color` is `rgb(226, 232, 240)`
- [ ] GET `/login` textbox `Email` computed `border-radius` is `10px`
- [ ] GET `/login` form `login` computed `max-width` is `384px`
- [ ] GET `/login` form `login` computed `border-radius` is `10px`
- [ ] GET `/login` button `Email me a link` computed `border-radius` is `10px`
- [ ] GET `/login` link `Join the waitlist` computed `color` is `rgb(15, 118, 110)`
- [ ] GET an unknown document path `body` computed `font-family` includes `system-ui`
- [ ] GET an unknown document path heading `Not found` computed `font-size` is `36px`
- [ ] GET `/api/auth/consume` with a used magic-link token `body` computed `font-family` includes `system-ui`
- [ ] GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `background-color` is `rgb(15, 118, 110)`
- [ ] GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `color` is `rgb(255, 255, 255)`
- [ ] GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `border-radius` is `10px`
- [ ] GET `/app` as site admin with no teams `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app` as site admin with no teams `body` computed `color` is `rgb(15, 23, 42)`
- [ ] GET `/app` as site admin with no teams `body` computed `font-family` includes `system-ui`
- [ ] GET `/app` as site admin with no teams `header` computed `border-bottom-color` is `rgb(226, 232, 240)`
- [ ] GET `/app` as site admin with no teams, the link `Event Model` computed `color` is `rgb(15, 118, 110)`
- [ ] GET `/app` as site admin with no teams, the button `Create team` computed `background-color` is `rgb(15, 118, 110)`
- [ ] GET `/app` as site admin with no teams, the button `Create team` computed `color` is `rgb(255, 255, 255)`
- [ ] GET `/app` as site admin with no teams, the button `Create team` computed `border-radius` is `10px`
- [ ] GET `/app` as site admin with no teams, the textbox `Team name` computed `border-top-color` is `rgb(226, 232, 240)`
- [ ] GET `/app` as site admin with no teams, the textbox `Team name` computed `border-radius` is `10px`
- [ ] GET `/app` as site admin with no teams, the button `Sign out` computed `background-color` is `rgba(0, 0, 0, 0)`
- [ ] GET `/app` as a Person who is not site admin with no teams `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app` as a Person with two Teams `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app` as a Person with two Teams, a link whose accessible name is the first Team name computed `color` is `rgb(15, 118, 110)`
- [ ] GET `/app/teams/{id}` as a member `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app/teams/{id}` as a member, the button `Create model` computed `background-color` is `rgb(15, 118, 110)`
- [ ] GET `/app/teams/{id}` as a member, the button `Create model` computed `color` is `rgb(255, 255, 255)`
- [ ] GET `/app/teams/{id}` as a member, the button `Create model` computed `border-radius` is `10px`
- [ ] GET `/app/admin/teams` as site admin `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app/admin/teams` as site admin, the button `Send invite` computed `background-color` is `rgb(15, 118, 110)`
- [ ] GET `/app/admin/teams` as site admin, the button `Send invite` computed `color` is `rgb(255, 255, 255)`
- [ ] GET `/app/admin/teams` as site admin, the textbox `Invite email` computed `border-top-color` is `rgb(226, 232, 240)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member `body` computed `background-color` is `rgb(255, 255, 255)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member `body` computed `font-family` includes `system-ui`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member `header` computed `border-bottom-color` is `rgb(226, 232, 240)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `background-color` is `rgb(15, 118, 110)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `color` is `rgb(255, 255, 255)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `border-radius` is `10px`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the button `Export` computed `background-color` is `rgba(0, 0, 0, 0)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the button `Sign out` computed `background-color` is `rgba(0, 0, 0, 0)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the region `Timeline` computed `background-color` is `rgb(248, 250, 252)`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the region `Inspector` computed `border-left-color` is `rgb(226, 232, 240)`
- [ ] After clicking `New Slice` then `Add Actor` on that page, the Timeline listitem `Actor` computed `background-color` is `rgb(254, 243, 199)`
- [ ] After clicking `New Slice` then `Add Actor` on that page, the Timeline listitem `Actor` computed `border-top-color` is `rgb(245, 158, 11)`
- [ ] After clicking `New Slice` then `Add Command` on that page, the Timeline listitem `Command` computed `background-color` is `rgb(219, 234, 254)`
- [ ] After clicking `New Slice` then `Add Command` on that page, the Timeline listitem `Command` computed `border-top-color` is `rgb(37, 99, 235)`
- [ ] After clicking `New Slice` then `Add Event` on that page, the Timeline listitem `Event Happened` computed `background-color` is `rgb(255, 237, 213)`
- [ ] After clicking `New Slice` then `Add Event` on that page, the Timeline listitem `Event Happened` computed `border-top-color` is `rgb(234, 88, 12)`
- [ ] After clicking `New Slice` then `Add Read Model` on that page, the Timeline listitem `Read Model` computed `background-color` is `rgb(220, 252, 231)`
- [ ] After clicking `New Slice` then `Add Read Model` on that page, the Timeline listitem `Read Model` computed `border-top-color` is `rgb(22, 163, 74)`
- [ ] After clicking `New Slice` then `Add Automation` on that page, the Timeline listitem `Automation` computed `background-color` is `rgb(237, 233, 254)`
- [ ] After clicking `New Slice` then `Add Automation` on that page, the Timeline listitem `Automation` computed `border-top-color` is `rgb(124, 58, 237)`
- [ ] After clicking `New Slice` then `Add Actor` on that page, the Timeline listitem `Actor` computed `border-radius` is `10px`

## Domain terms

Event Model, Person, Site admin, Session, Team, Slice, Actor, Command, Event, Read Model, Automation, Waitlist

## Seams

- `env.ASSETS.fetch` — `public/shell.css`, `public/index.html`, `public/login.html`, `public/404.html`
- `shell` in `src/teams/pages.ts`
- `appPageHtml` in `src/auth/session.ts`
- `expiredLinkHtml` in `src/auth/consume-link.ts`
- `modelPageHtml` in `src/teams/pages.ts`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing, Login, Not found, Expired link, App, Team picker, Team, Teams admin, Editor. Primitives this slice composes: Page (`canvas` background, `ink` text, `type`), AppBar, Marketing header, Card, Field, Button primary (`accent` / `on-accent` / `radius` on `Email me a link`, `Join the waitlist`, `Create team`, `Create model`, `Send invite`, `Save`, expired `Sign in`), sticky-note block fills. Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright computed colors are the sRGB of `canvas` `#FFFFFF` → `rgb(255, 255, 255)`, `canvas-subtle` `#F8FAFC` → `rgb(248, 250, 252)`, `ink` `#0F172A` → `rgb(15, 23, 42)`, `muted` `#64748B` → `rgb(100, 116, 139)`, `line` `#E2E8F0` → `rgb(226, 232, 240)`, `accent` `#0F766E` → `rgb(15, 118, 110)`, `on-accent` `#FFFFFF` → `rgb(255, 255, 255)`.
- Block fills: Actor `#FEF3C7` → `rgb(254, 243, 199)` border `#F59E0B` → `rgb(245, 158, 11)`; Command `#DBEAFE` → `rgb(219, 234, 254)` border `#2563EB` → `rgb(37, 99, 235)`; Event `#FFEDD5` → `rgb(255, 237, 213)` border `#EA580C` → `rgb(234, 88, 12)`; Read Model `#DCFCE7` → `rgb(220, 252, 231)` border `#16A34A` → `rgb(22, 163, 74)`; Automation `#EDE9FE` → `rgb(237, 233, 254)` border `#7C3AED` → `rgb(124, 58, 237)`.
- `radius` `10px`. Landing `main` `max-width` `36rem` → `576px`. Card / waitlist form `max-width` `24rem` → `384px`. Display heading `font-size` `36px`.
- Quiet controls (`Sign out`, `Export`) use a transparent background `rgba(0, 0, 0, 0)`.
- `TEST_MAIL=1` Playwright `workers` is `1`. Playwright `webServer` wrangler `--port` and `--inspector-port` are checkout-unique from a hash of `cwd`; worker fixtures read `E2E_PORT`.
- Form `waitlist-form` is `id="waitlist-form"`. Form `login` is `id="login"`.
- Timeline listitem accessible names after Add are `Actor`, `Command`, `Event Happened`, `Read Model`, `Automation` (existing defaults).

## Out of scope

Webfont files. Dark mode. Public signup. Site admin waitlist table UI. Mac window chrome. Editing behavior (New Slice, Save, drag, inspect) stays the released editor specs.

## Restates

- [public-face.md](./public-face.md) — Card, Field, font `type`, `radius`, and Landing `Join the waitlist` Button primary are this slice. Login Button primary colors on `Email me a link` stay that file; `radius` on that button is this slice. Signed-in restyle and editor styling are this slice, not a later slice. Dark mode, webfont files, public signup, and waitlist table UI stay that file's Out of scope.
- [visual-shell.md](./visual-shell.md) — Page background on `/app`, picker, team, and Teams admin is `canvas` `rgb(255, 255, 255)`, not paper. AppBar `Event Model` href `/app` stays that file. Editor canvas stylesheet and sticky-note colors are this slice.
- [design-system.md](../design-system.md) — One contemporary SaaS look on public HTML, signed-in HTML, and the editor. Paper tokens are leftover unused. Sticky-note lane colors are this slice. Editor is a screen in that file.
- [product.md](../product.md) — Team/admin HTML and editor chrome use contemporary SaaS ([design-system.md](../design-system.md), this slice), not paper workshop.
- [architecture.md](../architecture.md) — Worker HTML plus `public/` CSS includes the editor canvas page. Tokens in `design-system.md` apply on `/`, `/login`, 404, expired, `/app`, and `/app/teams/{id}/models/{mid}`.
- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns canvas styling; this slice owns stylesheet, AppBar, Timeline background, Inspector border, and block fills on that page. New Slice, zoom, and dirty copy stay that file.
