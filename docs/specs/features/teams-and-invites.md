# Teams and invites

Status: validated

## Problem

A signed-in Person has no Team. The site admin cannot create a Team or Invite anyone, so nobody can share an Event Model later.

## Acceptance criteria

- [x] POST `/api/teams` as site admin returns status 201
- [x] POST `/api/teams` as site admin returns content-type `application/json; charset=utf-8`
- [x] POST `/api/teams` as a Person who is not site admin returns status 403
- [x] POST `/api/teams` as site admin with name `Library` creates a Team named `Library`
- [ ] POST `/api/teams` as site admin adds a membership for that site admin on the new Team
- [ ] GET `/app` as site admin with no teams shows a textbox whose accessible name is `Team name`
- [ ] GET `/app` as site admin with no teams shows a button whose accessible name is `Create team`
- [ ] GET `/app` as site admin with no teams shows a button whose accessible name is `Sign out`
- [ ] GET `/app` as site admin with one Team returns status 303
- [ ] GET `/app` as site admin with one Team sets `Location` to `/app/teams/{id}`
- [ ] GET `/app/teams/{id}` as a member shows a heading whose accessible name is the Team name
- [ ] GET `/app/teams/{id}` as a member shows the Person's email
- [ ] GET `/app/teams/{id}` as a member shows a button whose accessible name is `Sign out`
- [ ] GET `/app/teams/{id}` as site admin shows a link whose accessible name is `Teams admin`
- [ ] GET `/app/teams/{id}` as a Person who is not a member returns status 404
- [ ] GET `/app` as a Person with two Teams shows a heading whose accessible name is `Your teams`
- [ ] GET `/app` as a Person with two Teams shows a link whose accessible name is the first Team name
- [ ] GET `/app` as a Person with two Teams shows a link whose accessible name is the second Team name
- [ ] GET `/app` as site admin with no teams shows a link whose accessible name is `Teams admin`
- [ ] GET `/app` as site admin with two Teams shows a link whose accessible name is `Teams admin`
- [ ] GET `/app/admin/teams` as a Person who is not site admin returns status 303
- [ ] GET `/app/admin/teams` as a Person who is not site admin sets `Location` to `/app`
- [ ] GET `/app/admin/teams` as site admin shows the Person's email
- [ ] GET `/app/admin/teams` as site admin shows a button whose accessible name is `Sign out`
- [ ] GET `/app/admin/teams` as site admin with a Team named `Library` shows a heading whose accessible name is `Library`
- [ ] GET `/app/admin/teams` as site admin with a Team shows a textbox whose accessible name is `Invite email`
- [ ] GET `/app/admin/teams` as site admin with a Team shows a button whose accessible name is `Send invite`
- [ ] POST `/api/teams/{id}/invites` as site admin returns status 201
- [ ] POST `/api/teams/{id}/invites` as a Person who is not site admin returns status 403
- [ ] POST `/api/teams/{id}/invites` with an unknown email creates a Person with that email
- [ ] POST `/api/teams/{id}/invites` adds a membership for that Person on that Team
- [ ] POST `/api/teams/{id}/invites` sends a magic-link mail to that email
- [ ] Invite magic-link mail subject is `You are invited to Event Model`
- [ ] After a site admin creates Team `Library` and invites `teammate@example.com`, that Person's signed-in page shows a heading whose accessible name is `Library`
- [x] `createD1Store` `insertTeam` with name `Library` returns that Team from `getTeam`
- [ ] `createD1Store` `addMembership` then `isMember` returns true

## Domain terms

Person, Site admin, Team, Invite, Membership, Session, Magic link

## Seams

- `createTeam` and `inviteToTeam` in `src/teams/` — unit tests pass a fake store and fake mail
- `createD1Store` in `src/auth/d1-store.ts` — unit tests construct it so a broken teams or memberships statement fails
- `handleRequest` — HTTP routing
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Team name and invite email are JSON fields `name` and `email`.
- Invite email is trimmed and lowercased.
- Creating a Team does not create Event Models (persistence is a later spec).
- `run_worker_first` includes `/app` and `/app/*`.

## Out of scope

Event Model create/import/save/export, editor canvas, per-model ACLs, non-admin team creation.

## Restates


