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
- [x] GET `/api/auth/consume` with a used magic-link token has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/app` as site admin with no teams has a `link[rel="stylesheet"]` whose `href` is `/shell.css`
- [x] GET `/app` as site admin with no teams shows a link whose accessible name is `Event Model`
- [x] GET `/app` as site admin with no teams, the link `Event Model` has `href` `/app`
- [x] GET `/app` as a Person who is not site admin with no teams shows a link whose accessible name is `Event Model`
- [x] GET `/app` as a Person with two Teams shows a link whose accessible name is `Event Model`
- [x] GET `/app/teams/{id}` as a member shows a link whose accessible name is `Event Model`
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

Screens: App, Team picker, Team, Teams admin. Primitives this slice composes: AppBar (`Event Model` href `/app`). AppBar layout (flex, padding) is [designed-surfaces.md](./designed-surfaces.md). Page `canvas` background and `ink` color on those screens are [product-visual.md](./product-visual.md). Public Page, Login Button primary, Landing, Login, Not found, and Expired link are [public-face.md](./public-face.md). AppBar Mark and Editor `header` link `Event Model` href `/app` are [app-chrome.md](./app-chrome.md). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Token hex values and primitive rules live in [design-system.md](../design-system.md). Playwright computed colors on `/app`, picker, team, Teams admin, and the editor are [product-visual.md](./product-visual.md). GET `/` Page background and color are [public-face.md](./public-face.md).
- `og:image` `content` ends with `/og.png`. `og:description` is [public-face.md](./public-face.md).
- Login heading `Sign in` and marketing header `Event Model` link are [public-face.md](./public-face.md).
- AppBar `Event Model` is a link to `/app` on App, picker, Team, and Teams admin. Teams admin, email, and Sign out stay the existing controls. Signed-in AppBar `nav` (Teams admin href) is [admin-nav.md](./admin-nav.md). Editor `header` link `Event Model` href `/app` and the AppBar Mark are [app-chrome.md](./app-chrome.md). `appPageHtml` (Person who is not site admin, no teams) composes AppBar the same way `shell` does.
- `TEST_MAIL=1` Playwright `workers` is `1` (hosted-app / magic-link). Playwright `webServer` wrangler `--port` and `--inspector-port` are checkout-unique from a hash of `cwd` so parallel worktrees do not collide; worker fixtures read `E2E_PORT`.
- POST `/api/test/non-admin-session` and POST `/api/test/picker-session` exist only when `TEST_MAIL` is `1`. The first inserts a Person who is not site admin with no teams and sets a Session cookie. The second inserts a Person with two Teams and sets a Session cookie. POST `/api/test/reset-store` exists only when `TEST_MAIL` is `1`; it recreates the in-process fake store and mail so an empty-state file still sees no Teams after a mutating file. When `TEST_MAIL` is not `1`, those paths are JSON 404.
- Favicon and OG PNG mark is [public-face.md](./public-face.md).

## Out of scope

Dark mode. Public Page, Login, Landing, Marketing header, expired `Sign in`, and Login Button primary are [public-face.md](./public-face.md). Card, Field, font `type`, `radius`, Landing `Join the waitlist` Button primary, signed-in Page colors, editor stylesheet, and sticky-note colors are [product-visual.md](./product-visual.md). Extra “Request a new one” heading on the expired page stays out. AppBar layout (flex, padding), GET `/` viewport, composed look, and Google Fonts Inter are [designed-surfaces.md](./designed-surfaces.md). Viewport meta on 404 stays. Signed-in AppBar `nav` is [admin-nav.md](./admin-nav.md). AppBar Mark and Editor `header` link `Event Model` href `/app` are [app-chrome.md](./app-chrome.md).

## Restates

- [hosted-app.md](./hosted-app.md) — 404 heading `Not found` stays that file. GET `/` heading and `Access is by invite.` are [public-face.md](./public-face.md). Favicon, stylesheet, `og:image`, and `og:title` on `/` stay this slice.
- [magic-link-auth.md](./magic-link-auth.md) — Expired heading and signed-in email / Sign out stay that file. Expired Page background and `Sign in` are [public-face.md](./public-face.md). AppBar on `/app` that is not redirected stays this slice.
- [teams-and-invites.md](./teams-and-invites.md) — Team name, Create team, Teams admin, picker `Your teams`, team heading stay that file. AppBar `Event Model` link on `/app`, picker, team, and Teams admin stays this slice. Page `canvas` background and `ink` color on those screens are [product-visual.md](./product-visual.md). Creating a Team still does not create Event Models; Event Model persistence is [model-persistence.md](./model-persistence.md).
- [model-persistence.md](./model-persistence.md) — Create model and the Untitled link stay that file. AppBar `Event Model` link on GET `/app/teams/{id}` is this slice.
- [product.md](../product.md) — Team/admin HTML and editor chrome are contemporary SaaS ([product-visual.md](./product-visual.md)). Public HTML is [public-face.md](./public-face.md). Expired heading stays this file's leftover of magic-link-auth; expired `Sign in` is [public-face.md](./public-face.md). The schema file is in this repo.
- [architecture.md](../architecture.md) — Design tokens live in `docs/specs/design-system.md`. Team/admin and editor HTML is Worker HTML plus `public/` CSS with contemporary SaaS tokens ([product-visual.md](./product-visual.md)). Public HTML is [public-face.md](./public-face.md). Editor canvas TypeScript stays the timeline. `run_worker_first` includes `/favicon.png`, `/og.png`, and `/shell.css`. `/` and `/login` are [public-face.md](./public-face.md).
- [design-system.md](../design-system.md) — this slice composes AppBar `Event Model` href `/app` on App, picker, Team, and Teams admin. The Mark as AppBar logo and Editor `header` link `Event Model` href `/app` are [app-chrome.md](./app-chrome.md). Page tokens, Card, Field, Button primary, editor screen, and sticky-note fills are [product-visual.md](./product-visual.md). Public Page, Marketing header, and Login Button primary colors are [public-face.md](./public-face.md).
