# Visual shell

Status: released

## Problem

Login, 404, expired magic link, and signed-in team pages are unstyled HTML: email and Sign out on a blank page. A Person cannot tell this is a hosted Event Model product.

## Acceptance criteria

- [x] GET `/favicon.png` returns status 200
- [x] GET `/favicon.png` returns content-type `image/png`
- [x] GET `/og.png` returns status 200
- [x] GET `/og.png` returns content-type `image/png`
- [x] GET `/shell.css` returns status 200
- [x] GET `/shell.css` returns content-type `text/css`
- [x] GET `/` has a `link[rel="icon"]` whose `href` is `/favicon.png`
- [x] GET `/` has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/` has a `meta[property="og:image"]` whose `content` ends with `/og.png`
- [x] GET `/` has a `meta[property="og:title"]` whose `content` is `Event Model`
- [x] GET an unknown document path has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET an unknown document path `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/api/auth/consume` with a used magic-link token has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/app` as site admin with no teams has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/app` as site admin with no teams `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/app` as site admin with no teams shows a link whose accessible name is `Event Model`
- [x] GET `/app` as site admin with no teams, the link `Event Model` has `href` `/app`
- [x] GET `/app` as a Person who is not site admin with no teams `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/app` as a Person who is not site admin with no teams shows a link whose accessible name is `Event Model`
- [x] GET `/app` as a Person with two Teams `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/app` as a Person with two Teams shows a link whose accessible name is `Event Model`
- [x] GET `/app/teams/{id}` as a member `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/app/teams/{id}` as a member shows a link whose accessible name is `Event Model`
- [x] GET `/app/admin/teams` as site admin `body` computed `background-color` is `rgb(247, 244, 238)`
- [x] GET `/app/admin/teams` as site admin shows a link whose accessible name is `Event Model`

## Domain terms

Event Model, Person, Team, Site admin, Session, Magic link

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/404.html`, `public/shell.css`, `public/favicon.png`, `public/og.png`
- `handleRequest` — GET `/favicon.png`, `/og.png`, and `/shell.css` after `ASSETS.fetch`; content-type is set only when that AC is implemented
- `expiredLinkHtml` in `src/auth/consume-link.ts`
- `shell` in `src/teams/pages.ts`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Not found, Expired link, App, Team picker, Team, Teams admin. Primitives this slice composes: Page (signed-in: `body` background `paper`, color `ink-paper`), AppBar. Public Page and Login Button primary are [public-face.md](./public-face.md). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Token hex values and primitive rules live in [design-system.md](../design-system.md). Playwright computed colors on `/app`, picker, team, and Teams admin are the sRGB of `paper` and `ink-paper` (`rgb(247, 244, 238)` and `rgb(28, 25, 23)`). GET `/` Page background and color are [public-face.md](./public-face.md).
- `og:image` `content` ends with `/og.png`. `og:description` is [public-face.md](./public-face.md).
- Login heading `Sign in` and marketing header `Event Model` link are [public-face.md](./public-face.md).
- AppBar `Event Model` is a link to `/app`. Teams admin, email, and Sign out stay the existing controls. `appPageHtml` (Person who is not site admin, no teams) composes AppBar the same way `shell` does.
- `TEST_MAIL=1` Playwright `workers` is `1` (hosted-app / magic-link). Playwright `webServer` wrangler `--port` and `--inspector-port` are checkout-unique from a hash of `cwd` so parallel worktrees do not collide; worker fixtures read `E2E_PORT`.
- POST `/api/test/non-admin-session` and POST `/api/test/picker-session` exist only when `TEST_MAIL` is `1`. The first inserts a Person who is not site admin with no teams and sets a Session cookie. The second inserts a Person with two Teams and sets a Session cookie. When `TEST_MAIL` is not `1`, those paths are JSON 404.
- Favicon and OG PNGs are the two-slice paper mark with no letters.

## Out of scope

Editor canvas (`/app/teams/{id}/models/{mid}`), Inspector, sticky-note lane colors, dark mode, webfont files, extra “Request a new one” on the expired page. Card, Field, Page font `type`, Button primary `radius`, `measure`, and `hairline` stay later. Login Button primary is [public-face.md](./public-face.md). Viewport meta on routes that already have it stays.

## Restates

- [hosted-app.md](./hosted-app.md) — GET `/` heading is [public-face.md](./public-face.md). Text `Access is by invite.` and 404 heading `Not found` stay that file. Paper tokens, favicon, Open Graph, and stylesheet on those documents are this slice. Login Button primary is [public-face.md](./public-face.md). Card stays later.
- [magic-link-auth.md](./magic-link-auth.md) — Expired heading and signed-in email / Sign out stay that file. Expired Page background is [public-face.md](./public-face.md). AppBar on `/app` that is not redirected stays this slice.
- [teams-and-invites.md](./teams-and-invites.md) — Team name, Create team, Teams admin, picker `Your teams`, team heading stay that file. AppBar `Event Model` link and Page background on `/app`, picker, team, and Teams admin are this slice. Creating a Team still does not create Event Models; Event Model persistence is [model-persistence.md](./model-persistence.md).
- [model-persistence.md](./model-persistence.md) — Create model and the Untitled link stay that file. AppBar `Event Model` link on GET `/app/teams/{id}` is this slice.
- [product.md](../product.md) — Team/admin HTML is paper workshop ([design-system.md](../design-system.md)). GET `/` Page background is [public-face.md](./public-face.md). Expired / used magic link is the heading only (no path to request a new one). The schema file is in this repo. Editor web shell (team name, in-session heading, dirty, Save, Export, sign out) stays later for a later slice.
- [architecture.md](../architecture.md) — Design tokens live in `docs/specs/design-system.md`. Signed-out and team/admin HTML is Worker HTML plus `public/` CSS. Editor canvas TypeScript stays the timeline; its styling stays later. `run_worker_first` includes `/favicon.png`, `/og.png`, and `/shell.css` as those ACs land.
- [design-system.md](../design-system.md) — this slice composes signed-in Page background and color and AppBar. Public Page background on `/` is [public-face.md](./public-face.md). Login Button primary is [public-face.md](./public-face.md). Card, Field, font `type`, and `radius` stay later.
