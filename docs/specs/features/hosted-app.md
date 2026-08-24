# Hosted app

Status: validated

## Problem

Nothing is reachable at event-model.lonnylot.com. This slice puts a Worker and a public placeholder there, with CI, so later slices have a host.

## Acceptance criteria

- [ ] GET `/` shows a heading whose accessible name is `Event Model`
- [ ] GET `/` shows the text `Access is by invite.`
- [ ] GET `/` does not show a control whose accessible name is `Sign up`
- [ ] GET an unknown document path returns status 404 and a heading whose accessible name is `Not found`
- [x] GET `/api` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [x] GET `/api/anything` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [ ] `package.json` script `test:e2e` includes the tokens `playwright` and `test`
- [ ] GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request` and on `push` to `main` and has a step whose `run` is `npm test`
- [x] `wrangler.jsonc` `name` is `event-model-saas`
- [ ] `wrangler.jsonc` has a route `{ "pattern": "event-model.lonnylot.com", "custom_domain": true }`
- [ ] `package.json` script `deploy` is `wrangler deploy`

## Domain terms

Event Model

## Seams

- `handleRequest(request, env)` in `src/index.ts` — unit tests pass a fake `env.ASSETS.fetch`
- `env.ASSETS.fetch` — static files in `public/`
- Browser — Playwright against `wrangler dev`

## Assumptions

- Cloudflare account is the one already serving `lonnylot.com` (wrangler OAuth).
- Custom domain provisioning happens when the `deploy` script runs via Wrangler.

## Out of scope

Magic-link login, email field, D1, R2, teams, editor canvas.

## Restates
