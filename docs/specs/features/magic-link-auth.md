# Magic-link auth

Status: validated

## Problem

The host is public and invite-only, but nobody can sign in. This slice lets a Person request a magic link, consumes it into a Session, bootstraps the site admin, and notifies the site admin when an unknown address tries to log in.

## Acceptance criteria

- [x] GET `/` shows a textbox whose accessible name is `Email`
- [x] GET `/` shows a button whose accessible name is `Email me a link`
- [x] POST `/api/auth/request-link` returns status 200
- [x] POST `/api/auth/request-link` returns content-type `application/json; charset=utf-8`
- [x] POST `/api/auth/request-link` returns body `{"ok":true,"message":"If you have access, check your inbox."}`
- [x] POST `/api/auth/request-link` with `SITE_ADMIN_EMAIL` when no Person exists creates the site admin Person
- [x] POST `/api/auth/request-link` with `SITE_ADMIN_EMAIL` sends a magic-link mail to that address
- [x] POST `/api/auth/request-link` with an existing Person email sends a magic-link mail to that address
- [x] POST `/api/auth/request-link` with an unknown email does not send a magic-link mail to that address
- [x] POST `/api/auth/request-link` with an unknown email sends a notify mail to `SITE_ADMIN_EMAIL` whose text includes that address
- [x] The sixth POST `/api/auth/request-link` for the same email within one hour does not send mail
- [x] The twenty-first POST `/api/auth/request-link` from the same client IP within one hour does not send mail
- [x] GET `/api/auth/consume` with a valid unused magic-link token returns status 303
- [x] GET `/api/auth/consume` with a valid unused magic-link token sets `Location` to `/app`
- [x] GET `/api/auth/consume` with a valid unused magic-link token sets a Session cookie named `session` that includes `HttpOnly`
- [x] GET `/api/auth/consume` with a valid unused magic-link token over https sets a Session cookie that includes `Secure`
- [x] GET `/api/auth/consume` with a valid unused magic-link token sets a Session cookie that includes `SameSite=Lax`
- [x] GET `/api/auth/consume` with a used magic-link token returns status 200
- [x] GET `/api/auth/consume` with a used magic-link token shows a heading whose accessible name is `This link is expired or already used.`
- [x] GET `/api/auth/consume` with an expired magic-link token returns status 200
- [x] GET `/api/auth/consume` with an expired magic-link token shows a heading whose accessible name is `This link is expired or already used.`
- [x] GET `/api/auth/consume` with a used magic-link token does not set a Session cookie
- [x] GET `/app` without a Session returns status 303
- [x] GET `/app` without a Session sets `Location` to `/`
- [x] GET `/app` with a Session shows the Person's email
- [x] GET `/app` with a Session shows a button whose accessible name is `Sign out`
- [x] POST `/api/auth/sign-out` with a Session returns status 303
- [x] POST `/api/auth/sign-out` with a Session sets `Location` to `/`
- [x] POST `/api/auth/sign-out` clears the Session cookie
- [x] Submitting `Email me a link` on `/` with `SITE_ADMIN_EMAIL` shows the text `If you have access, check your inbox.`
- [x] After consuming the magic-link from that submission, `/app` shows `SITE_ADMIN_EMAIL`

## Domain terms

Person, Site admin, Session, Magic link

## Seams

- `requestLink` and `consumeLink` in `src/auth/` — unit tests pass a fake store and fake mail
- `handleRequest` — HTTP routing
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1` (fake mail, never live inbox)

## Assumptions

- `SITE_ADMIN_EMAIL` is `lonny@lonnylot.com` in production wrangler vars.
- `AUTH_FROM` is `auth@event-model.lonnylot.com`.
- Playwright `webServer` env sets `TEST_MAIL` to `1` and `SITE_ADMIN_EMAIL` to `lonny@lonnylot.com`.
- GET `/api/test/last-mail` exists only when `TEST_MAIL` is `1` (test adapter). When `TEST_MAIL` is not `1`, that path is JSON 404 like any other unknown `/api` path.
- Magic-link TTL is 15 minutes. Session TTL is 7 days.
- Email is trimmed and lowercased before lookup.

## Out of scope

Teams, Invites, Event Model persistence, editor canvas. Signed-in `/app` shows the Person's email and Sign out only.

## Restates
