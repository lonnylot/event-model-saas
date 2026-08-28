# Public face

Status: validated

## Problem

GET `/` is the login form. A visitor cannot tell what Event Model is. Paper-workshop tokens on public pages read as an unfinished sketch, not a hosted SaaS product.

## Acceptance criteria

- [x] `wrangler.jsonc` `run_worker_first` includes `/`
- [x] `wrangler.jsonc` `run_worker_first` includes `/login`
- [x] GET `/` without a Session shows a heading whose accessible name is `Event Modeling for the whole team`
- [x] GET `/` without a Session shows the text `One Event Model, signed in. No passing files around.`
- [x] GET `/` without a Session shows a link whose accessible name is `Event Model`
- [x] GET `/` without a Session, the link `Event Model` has `href` `/`
- [x] GET `/` without a Session shows a link whose accessible name is `Sign in`
- [x] GET `/` without a Session, a link `Sign in` has `href` `/login`
- [x] GET `/` without a Session does not show a link whose accessible name is `Open app`
- [x] GET `/` without a Session does not show a button whose accessible name is `Email me a link`
- [x] GET `/` without a Session does not show a control whose accessible name is `Sign up`
- [x] GET `/` without a Session shows a heading whose accessible name is `The model lives with the team`
- [x] GET `/` without a Session shows the text `Here the Event Model belongs to a Team.`
- [x] GET `/` without a Session shows a heading whose accessible name is `A timeline of slices`
- [x] GET `/` without a Session shows the text `a vertical column on the timeline`
- [x] GET `/` without a Session shows the text `intent, then a fact that happened`
- [x] GET `/` without a Session shows the text `a view of state from events`
- [x] GET `/` without a Session shows the text `a processor with no human actor`
- [x] GET `/` without a Session shows the text `Commands connect to events. Events connect to read models.`
- [x] GET `/` without a Session shows a heading whose accessible name is `Invite-only, version-checked saves`
- [x] GET `/` without a Session shows the text `The Mac app is local: one person, one .eventmodel file.`
- [x] GET `/` without a Session shows the text `Magic-link sign-in. No password, no public signup.`
- [x] GET `/` without a Session shows the text `Site admin creates Teams and sends Invites.`
- [x] GET `/` without a Session shows the text `Save is explicit.`
- [x] GET `/` without a Session shows a heading whose accessible name is `Join the waitlist`
- [x] GET `/` without a Session shows the text `Leave your email. If you already have access, use Sign in.`
- [x] GET `/` without a Session shows a link whose accessible name is `Join the waitlist`
- [x] GET `/` without a Session, a link `Join the waitlist` has an `href` that ends with `#waitlist`
- [x] GET `/` without a Session shows a textbox whose accessible name is `Email`
- [x] GET `/` without a Session shows a button whose accessible name is `Join the waitlist`
- [x] GET `/` with a Session shows a link whose accessible name is `Open app`
- [x] GET `/` with a Session, a link `Open app` has `href` `/app`
- [x] GET `/` with a Session does not show a link whose accessible name is `Sign in`
- [x] GET `/` with a Session does not show a button whose accessible name is `Sign out`
- [x] GET `/` `body` computed `background-color` is `rgb(255, 255, 255)`
- [x] GET `/` `body` computed `color` is `rgb(15, 23, 42)`
- [x] GET `/` has a `meta[property="og:description"]` whose `content` is `Event Modeling for the whole team.`
- [x] GET `/login` without a Session returns status 200
- [x] GET `/login` without a Session has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/login` without a Session has a `link[rel="icon"]` whose `href` is `/favicon.png`
- [x] GET `/login` without a Session shows a heading whose accessible name is `Sign in`
- [x] GET `/login` without a Session shows the text `We'll email you a magic link.`
- [x] GET `/login` without a Session shows a link whose accessible name is `Join the waitlist`
- [x] GET `/login` without a Session, the link `Join the waitlist` has `href` `/#waitlist`
- [x] GET `/login` without a Session shows a link whose accessible name is `Event Model`
- [x] GET `/login` without a Session, the link `Event Model` has `href` `/`
- [x] GET `/login` with a Session returns status 303
- [x] GET `/login` with a Session sets `Location` to `/app`
- [x] GET `/login` `body` computed `background-color` is `rgb(255, 255, 255)`
- [x] GET `/login` button `Email me a link` computed `background-color` is `rgb(15, 118, 110)`
- [x] GET `/login` button `Email me a link` computed `color` is `rgb(255, 255, 255)`
- [x] GET `/api/auth/consume` with a used magic-link token `body` computed `background-color` is `rgb(255, 255, 255)`
- [x] GET `/api/auth/consume` with a used magic-link token shows a link whose accessible name is `Sign in`
- [x] GET `/api/auth/consume` with a used magic-link token, the link `Sign in` has `href` `/login`
- [x] GET an unknown document path `body` computed `background-color` is `rgb(255, 255, 255)`
- [x] POST `/api/waitlist` returns status 200
- [x] POST `/api/waitlist` returns content-type `application/json; charset=utf-8`
- [x] POST `/api/waitlist` returns body `{"ok":true,"message":"If you're on the list, we'll be in touch."}`
- [x] POST `/api/waitlist` with a new email inserts that email into the waitlist
- [x] POST `/api/waitlist` with a new email sends a waitlist mail to `SITE_ADMIN_EMAIL` whose text includes that address
- [x] Waitlist mail subject is `Waitlist request`
- [x] POST `/api/waitlist` with an email already on the waitlist does not insert a second row and does not send mail
- [x] POST `/api/waitlist` with an existing Person email does not insert a waitlist row and does not send mail
- [x] POST `/api/waitlist` does not create a Person
- [x] POST `/api/waitlist` does not set a Session cookie
- [x] POST `/api/waitlist` with an invalid email returns status 200
- [x] POST `/api/waitlist` with an invalid email does not insert a waitlist row and does not send mail
- [x] The sixth POST `/api/waitlist` for the same email within one hour does not send mail
- [ ] The twenty-first POST `/api/waitlist` from the same client IP within one hour does not send mail and does not insert a waitlist row
- [ ] POST `/api/waitlist` when the waitlist insert fails returns status 500 and does not send mail
- [ ] POST `/api/auth/request-link` with an unknown email does not insert a waitlist row
- [ ] `createD1Store` `insertWaitlist` with email `wait@example.com` then `isWaitlisted` returns true
- [ ] Submitting `Join the waitlist` on `/` with email `wait@example.com` shows the text `If you're on the list, we'll be in touch.`

## Domain terms

Event Model, Person, Site admin, Session, Magic link, Team, Invite, Waitlist, Slice, Command, Event, Read Model, Automation

## Seams

- `handleRequest` — GET `/`, GET `/login`, POST `/api/waitlist`; unit tests pass a fake store and fake mail
- `joinWaitlist` in `src/auth/` — unit tests pass a fake store and fake mail
- `createD1Store` in `src/auth/d1-store.ts` — unit tests construct it so a broken waitlist statement fails
- `env.ASSETS.fetch` — `public/index.html`, `public/login.html`, `public/404.html`, `public/shell.css`, `public/favicon.png`, `public/og.png`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing, Login, Not found, Expired link. Primitives this slice composes: Page (public: `canvas` background, `ink` text), Marketing header, Button primary (`accent` fill, `on-accent` text), Card, Field. Inventory: [design-system.md](../design-system.md).

## Assumptions

- Waitlist POST JSON field is `email`. Email is trimmed and lowercased before lookup.
- Invalid email includes a missing field, empty string, and a value that is not an email.
- Waitlist rate limits are independent of login rate limits: 5 POSTs per email per hour, 20 per client IP per hour.
- Playwright computed colors are the sRGB of `canvas` `#FFFFFF` → `rgb(255, 255, 255)`, `ink` `#0F172A` → `rgb(15, 23, 42)`, `accent` `#0F766E` → `rgb(15, 118, 110)`, `on-accent` `#FFFFFF` → `rgb(255, 255, 255)`.
- `TEST_MAIL=1` Playwright `workers` is `1`. Playwright `webServer` wrangler `--port` and `--inspector-port` are checkout-unique from a hash of `cwd`; worker fixtures read `E2E_PORT`.
- GET `/` with a Session uses an existing `TEST_MAIL=1` session helper (consume a magic link, or POST `/api/test/non-admin-session`).
- Favicon and OG PNGs are the two-slice timeline mark in `ink` and `accent` on `canvas`, with no letters. Open Graph title stays `Event Model`.
- Login heading is `Sign in`. The wordmark link `Event Model` is the Marketing header, not a second heading.

## Out of scope

Signed-in AppBar, team picker, team page, and Teams admin restyle (those pages stay paper workshop until a later slice). Editor canvas styling. Site admin waitlist table UI. Webfont files. Dark mode. Public signup. Sticky-note lane colors.

## Restates

- [hosted-app.md](./hosted-app.md) — GET `/` heading is `Event Modeling for the whole team`. GET `/` does not show the text `Access is by invite.` GET `/` still does not show `Sign up`. 404 heading `Not found` stays that file.
- [magic-link-auth.md](./magic-link-auth.md) — Email and `Email me a link` live on GET `/login`. GET `/app` without a Session sets `Location` to `/login`. Submitting `Email me a link` is on `/login`. POST sign-out still sets `Location` to `/`. Consume of a valid magic link still sets `Location` to `/app`.
- [visual-shell.md](./visual-shell.md) — Public Page background and color, Login Button primary colors, 404 and expired Page background, and `og:description` are this slice. Favicon, stylesheet, `og:image`, `og:title`, and AppBar plus paper Page on `/app`, picker, team, and Teams admin stay that file.
- [design-system.md](../design-system.md) — Public HTML is contemporary SaaS (`canvas`, `ink`, `accent`). Paper tokens remain for signed-in team/admin HTML. Login is GET `/login`. Landing is GET `/`. Card, Field, Marketing header, and public Button primary are this slice.
- [product.md](../product.md) — GET `/` is the marketing landing. Login is GET `/login`. Waitlist is not public signup. Expired used-link page shows `Sign in` to `/login`. Public HTML is contemporary SaaS; team/admin HTML stays paper workshop until a later slice. Session missing opens `/login`.
- [architecture.md](../architecture.md) — `run_worker_first` includes `/` and `/login`. D1 holds waitlist emails. `auth` joins the waitlist. `web` serves Landing at `/` and Login at `/login`. Public tokens are [design-system.md](../design-system.md) as applied by this slice.
