# Hosted app

Status: released

## Problem

Nothing is reachable at event-model.lonnylot.com. This slice puts a Worker and a public placeholder there, with CI, so later slices have a host.

## Acceptance criteria

- [x] GET `/` does not show a control whose accessible name is `Sign up`
- [x] GET an unknown document path returns status 404
- [x] GET an unknown document path shows a heading whose accessible name is `Not found`
- [x] GET `/api` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [x] GET `/api/anything` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [x] `package.json` script `test:e2e` is `playwright test`
- [x] GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request`
- [x] GitHub Actions workflow `.github/workflows/ci.yml` runs on `push` to `main`
- [x] GitHub Actions workflow `.github/workflows/ci.yml` has a step whose `run` is `npm test`
- [x] `wrangler.jsonc` `name` is `event-model-saas`
- [x] `wrangler.jsonc` has a route `{ "pattern": "event-model.lonnylot.com", "custom_domain": true }`
- [x] `package.json` script `deploy` is `wrangler deploy`

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

Magic-link login, email field, D1, R2, teams, editor canvas. GET `/` heading, landing copy, waitlist, and `/login` are [public-face.md](./public-face.md). Favicon, stylesheet, `og:image`, and `og:title` are [visual-shell.md](./visual-shell.md).

## Restates
