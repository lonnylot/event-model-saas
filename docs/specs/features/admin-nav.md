# Admin nav

Status: validated

## Problem

The Team page (models list) and the rest of signed-in admin (Create team, Your teams, Teams admin) dump email, Teams admin, and Sign out into `main`. There is no `nav`. A Person cannot move between their Event Models and Teams admin the way the AppBar already implies.

## Acceptance criteria

- [x] GET `/app` as site admin with no teams shows a navigation landmark
- [x] GET `/app` as a Person who is not site admin with no teams shows a navigation landmark
- [x] GET `/app` as a Person with two Teams shows a navigation landmark
- [x] GET `/app/teams/{id}` as a member shows a navigation landmark
- [x] GET `/app/admin/teams` as site admin shows a navigation landmark
- [x] GET `/app` as a Person who is not site admin with no teams `header` computed `display` is `flex`
- [x] GET `/app` as a Person with two Teams `header` computed `display` is `flex`
- [x] GET `/app/teams/{id}` as a member `header` computed `display` is `flex`
- [x] GET `/app/admin/teams` as site admin `header` computed `display` is `flex`
- [x] GET `/app/teams/{id}` as a member `header` computed `box-shadow` is not `none`
- [x] GET `/app/admin/teams` as site admin `header` computed `box-shadow` is not `none`
- [x] GET `/app` as site admin with no teams, `nav` shows a link whose accessible name is `Teams admin`
- [x] GET `/app` as site admin with no teams, the `nav` link `Teams admin` has `href` `/app/admin/teams`
- [x] GET `/app` as site admin with two Teams, `nav` shows a link whose accessible name is `Teams admin`
- [x] GET `/app/teams/{id}` as site admin, `nav` shows a link whose accessible name is `Teams admin`
- [x] GET `/app/teams/{id}` as site admin, the `nav` link `Teams admin` has `href` `/app/admin/teams`
- [ ] GET `/app/admin/teams` as site admin, `nav` shows a link whose accessible name is `Teams admin`
- [ ] GET `/app/admin/teams` as site admin, the `nav` link `Teams admin` has `href` `/app/admin/teams`
- [x] GET `/app/teams/{id}` as a Person who is not site admin does not show a link whose accessible name is `Teams admin`

## Domain terms

Event Model, Person, Site admin, Team, Session

## Seams

- `shell` / `noTeamsAdminHtml` / `pickerHtml` / `teamPageHtml` / `adminTeamsHtml` in `src/teams/pages.ts`
- Guest `/app` HTML in `src/auth/session.ts`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: App, Team picker, Team, Teams admin. Primitives: Page, AppBar, Card, Button primary, Field. AppBar contains a `nav` landmark (Event Model wordmark stays [visual-shell.md](./visual-shell.md); optional Teams admin lives in `nav`). Look of those screens is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- AppBar `Event Model` href `/app` stays [visual-shell.md](./visual-shell.md). Email and Sign out stay existing controls; they move into `header` with the nav.
- GET `/app` as site admin with no teams `header` flex / padding stay [designed-surfaces.md](./designed-surfaces.md). This slice adds `header` flex on guest `/app`, picker, Team, and Teams admin.
- Create team, Create model, Send invite, picker Team name links, and Team heading stay [teams-and-invites.md](./teams-and-invites.md) / [model-persistence.md](./model-persistence.md).
- Navigation landmark is one `nav` per signed-in shell page (not the Editor).
- These ACs share one signed-in AppBar pass; look is one `visual-design` pass (not one commit per CSS property). Header `box-shadow` proofs use Team and Teams admin as the two shells that already list models vs invites.
- **Look may grow:** on App, Team picker, Team, and Teams admin, the implementer may add look chrome (card lift, denser AppBar matching the Team models list) by appending ACs in the same commit (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate*. Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Landing restyle. Login restyle. Editor restyle. Mac window chrome. Non-admin team creation. Per-model ACLs. New product claims (pricing, SLA, "anyone can join"). Product-visual token *values* stay [product-visual.md](./product-visual.md).

## Restates

- [teams-and-invites.md](./teams-and-invites.md) — Create team, Team heading, picker Team links, Invite email / Send invite stay that file. GET `/app` as site admin (no teams / two Teams) and GET `/app/teams/{id}` as site admin show `Teams admin` in `nav`, not a stray `main` paragraph. Href `/app/admin/teams` is this slice. GET `/app/admin/teams` `nav` `Teams admin` is this slice. A member does not see `Teams admin`.
- [visual-shell.md](./visual-shell.md) — AppBar `Event Model` href `/app` on App, picker, Team, and Teams admin stays that file. AppBar `nav` and moving email / Sign out / Teams admin into `header` is this slice.
- [designed-surfaces.md](./designed-surfaces.md) — GET `/app` as site admin with no teams `header` flex / padding stay that file. `header` flex on guest `/app`, picker, Team, and Teams admin is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file. AppBar on signed-in admin screens includes a `nav` landmark; optional Teams admin is in that `nav`.
- [product.md](../product.md) — Site admin still sees Teams admin (invite). That control lives in the signed-in AppBar `nav`. Team page remains the Event Model list.
- [architecture.md](../architecture.md) — `web` still serves team picker, model list, Teams admin. Signed-in AppBar `nav` is this slice.
