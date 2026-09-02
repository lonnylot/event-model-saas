# App chrome

Status: validated

## Problem

The two-slice mark exists only as favicon and Open Graph pixels. The Mac app ships an empty AppIcon set, so there is no desktop logo to copy. The Team page is a heading, one button, and a stack of title links. The Editor AppBar has Save and Sign out but not the signed-in `nav` (Event Model, Teams admin), so a Person in a model cannot reach Teams or Teams admin without the browser back button.

## Acceptance criteria

- [x] GET `/` `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/login` `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app/teams/{id}` as a member `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app/admin/teams` as site admin `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app` as site admin with no teams `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app` as a Person with two Teams `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app` as a Person who is not site admin with no teams `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app/teams/{id}/models/{mid}` as a member `header` has an `img` whose `src` is `/favicon.png`
- [x] GET `/app/teams/{id}` as a member shows a heading whose accessible name is `Event Models`
- [x] GET `/app/teams/{id}` as a member with no Event Models shows the text `Create a model to start the timeline.`
- [ ] GET `/app/teams/{id}` as a member with an Event Model titled `Untitled`, the link `Untitled` is inside an `article`
- [ ] GET `/app/teams/{id}` as a member with an Event Model titled `Untitled`, that `article` computed `box-shadow` is not `none`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member shows a navigation landmark
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, `header` shows a link whose accessible name is `Event Model`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, the `header` link `Event Model` has `href` `/app`
- [ ] GET `/app/teams/{id}/models/{mid}` as site admin, `nav` shows a link whose accessible name is `Teams admin`
- [ ] GET `/app/teams/{id}/models/{mid}` as site admin, the `nav` link `Teams admin` has `href` `/app/admin/teams`
- [ ] GET `/app/teams/{id}/models/{mid}` as a Person who is not site admin does not show a link whose accessible name is `Teams admin`
- [ ] GET `/app/teams/{id}/models/{mid}` as a member, a link whose accessible name is the Team name has `href` `/app/teams/{id}`

## Domain terms

Event Model, Person, Site admin, Team, Session

## Seams

- `env.ASSETS.fetch` — `public/favicon.png`, `public/index.html`, `public/login.html`, `public/shell.css`
- `shell` / `teamPageHtml` / `adminTeamsHtml` / `modelPageHtml` in `src/teams/pages.ts`
- Guest `/app` HTML in `src/auth/session.ts`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing, Login, App, Team picker, Team, Teams admin, Editor. Primitives: Page, AppBar, Card, Button primary. The Mark (`/favicon.png`) is composed next to the AppBar wordmark. Editor AppBar includes the same `nav` as [admin-nav.md](./admin-nav.md). Look of those screens is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- The Mac `AppIcon.appiconset` has no PNG files. The SaaS logo is the existing two-slice mark in `public/favicon.png` (ink, accent, canvas; no letters) from [public-face.md](./public-face.md) / [design-system.md](../design-system.md). Do not invent a second mark.
- Header mark `img` is decorative (`alt=""`) so it does not compete with the wordmark `Event Model` or the Landing image `Event Model editor`.
- GET `/app/teams/{id}` Create model and Untitled title links stay [model-persistence.md](./model-persistence.md). Team heading stays [teams-and-invites.md](./teams-and-invites.md).
- Editor Save, Export, Sign out, New Slice, zoom stay [editor-shell.md](./editor-shell.md) / [model-persistence.md](./model-persistence.md).
- Editor `nav` Teams admin follows [admin-nav.md](./admin-nav.md): site admin only.
- GET `/app/teams/{id}/models/{mid}` as a member shows the Team name stays [editor-shell.md](./editor-shell.md); this slice makes that name a link to the Team page.
- Article proof uses the first `article` that contains the Untitled link.
- **Look may grow:** on Team and Editor, the implementer may add look chrome (card density, AppBar alignment) by appending ACs in the same commit (`visual-design`). Do not add persistence, public signup, Import button, or claims Out of scope names. Do not halt for a new *validate* of that chrome after this spec is validated. Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. A new drawn mark (Imagine or otherwise). Mac window chrome. Import button on the Team page. Per-model ACLs. Landing hero restyle. Login form restyle beyond the header mark. Editor canvas restyle. New product claims (pricing, SLA, "anyone can join"). Product-visual token *values* stay [product-visual.md](./product-visual.md).

## Restates

- [design-system.md](../design-system.md) — Mark pixels stay that file. The Mark is also the AppBar logo (`img` `src` `/favicon.png`) on Landing, Login, signed-in shells, and Editor.
- [public-face.md](./public-face.md) — Favicon and OG pixel rules stay that file. Landing and Login header compose the Mark next to the wordmark.
- [visual-shell.md](./visual-shell.md) — AppBar `Event Model` href `/app` on App, picker, Team, Teams admin stays that file. Editor `header` link `Event Model` href `/app` is this slice.
- [admin-nav.md](./admin-nav.md) — `nav` on App, picker, Team, Teams admin stays that file. Editor `nav` (and Teams admin on Editor for site admin) is this slice. Out of scope no longer parks Editor AppBar `nav`.
- [editor-shell.md](./editor-shell.md) — Team name, New Slice, Timeline, Inspector, zoom stay that file. Team name is a link to `/app/teams/{id}`. Editor `nav` is this slice.
- [model-persistence.md](./model-persistence.md) — Create model and Untitled links stay that file. Team page Event Models heading, empty copy, and model `article` lift are this slice.
- [product.md](../product.md) — Team page is still the Event Model list. AppBar logo is the Mark. Editor AppBar includes signed-in `nav`.
- [architecture.md](../architecture.md) — `web` still serves team list and editor. AppBar Mark and Editor `nav` are this slice.
