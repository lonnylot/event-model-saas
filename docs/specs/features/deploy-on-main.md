# Deploy on main

Status: validated

## Problem

GitHub Actions runs `npm test` on `push` to `main` and stops. Merge does not update event-model.lonnylot.com. Production stays whatever last ran `wrangler deploy` by hand.

## Acceptance criteria

- [x] GitHub Actions workflow `.github/workflows/ci.yml` has a job named `deploy` whose `needs` includes `test`
- [x] GitHub Actions workflow `.github/workflows/ci.yml` job `deploy` `if` includes `github.event_name == 'push'`
- [x] GitHub Actions workflow `.github/workflows/ci.yml` job `deploy` `if` includes `github.ref == 'refs/heads/main'`
- [ ] GitHub Actions workflow `.github/workflows/ci.yml` job `deploy` has a step whose `run` is `npx wrangler deploy --keep-vars`

## Domain terms

Event Model

## Seams

- GitHub Actions workflow `.github/workflows/ci.yml`
- `package.json` script `deploy` — still `wrangler deploy` ([hosted-app.md](./hosted-app.md)); CI calls `npx wrangler deploy --keep-vars`

## Assumptions

- GitHub Actions secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set on the repo. They are environment facts, not acceptance criteria.
- Production Worker name is `event-model-saas` at `event-model.lonnylot.com`.
- `--keep-vars` keeps dashboard-set vars and secrets (including `SITE_ADMIN_EMAIL`) instead of replacing them from `wrangler.jsonc` alone.
- How merge-to-main deploy is done is `.agents/skills/github-ci-loop/PRODUCT.md` (`writing-for-agents`).

## Out of scope

Deploy from `pull_request`. Preview Workers. Staging environment. GitHub Releases or git tags. Changing `package.json` script `deploy` (stays `wrangler deploy`). `pull_request_target`. D1 remote migrations as a separate job.

## Restates

- [hosted-app.md](./hosted-app.md) — `package.json` script `deploy` stays `wrangler deploy`. GitHub Actions running that deploy on `push` to `main` after `test` is this slice. Assumptions still: custom domain provisioning happens when Wrangler deploy runs (now also from CI).
- [architecture.md](../architecture.md) — Tests stay Vitest + Playwright + GitHub Actions. GitHub Actions on `push` to `main` also runs `npx wrangler deploy --keep-vars` after `test`.
