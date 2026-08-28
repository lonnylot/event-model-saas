# Architecture

Status: draft

Product design (decisions, flows, editor parity, spec slices): [product.md](./product.md).

This file owns stack, modules, and seams. It does not own feature acceptance criteria.

## Spec tree

Specs live in `docs/specs/` (this file, `product.md`, `design-system.md`, and other system specs at that root; features in `docs/specs/features/`). ADRs live in `docs/adr/`. The repo has no `docs/superpowers/` directory. Feature implementation is `releasing-a-spec` on a `feat/<slug>` or `fix/<slug>` branch. There is no parallel implementation-plan directory. Tokens live in `design-system.md`. [features/public-face.md](./features/public-face.md) applies public tokens on `/`, `/login`, 404, and expired. [features/visual-shell.md](./features/visual-shell.md) applies paper tokens on signed-in team/admin HTML. Editor canvas styling stays later.

## Outcome

A Cloudflare Worker serves signed-out and team/admin HTML, the editor canvas page, and `/api` for Event Model SaaS at `event-model.lonnylot.com`.

## Stack

| Piece | Choice |
|-------|--------|
| Compute | One Worker (`event-model-saas`), `nodejs_compat`, static assets + `run_worker_first` for `/`, `/login`, `/api`, `/api/*`, `/app`, `/app/*`, `/favicon.png`, `/og.png`, `/shell.css` |
| Domain | Custom domain `event-model.lonnylot.com` on zone `lonnylot.com` |
| Metadata | D1 |
| Document body | R2 object `models/{id}.eventmodel` (current JSON only) |
| Mail | Cloudflare Email binding. From `auth@event-model.lonnylot.com` (display name `Event Model`). Admin notify to `SITE_ADMIN_EMAIL` (unknown login and waitlist). |
| Front end | Worker HTML plus `public/` CSS for Landing (`/`), Login (`/login`), 404, expired link, and signed-in team/admin screens. Editor canvas is custom timeline TypeScript (no xyflow/React Flow) matching the Mac layout; canvas styling stays later. |
| Document language | `.eventmodel` schema v1, same as the Mac app |
| Tests | Vitest (unit) + Playwright (flows) + GitHub Actions |
| Auth session | httpOnly Secure SameSite=Lax cookie on `event-model.lonnylot.com` |

`SITE_ADMIN_EMAIL` is an environment value. First magic-link login for that address creates the site-admin Person without an invite.

## Modules

| Module | Does | Depends on |
|--------|------|------------|
| `document` | Parse/validate schema, legal edges, mutations on an Event Model | Schema file only |
| `auth` | Magic-link issue/consume, session cookie, unknown-email notify, waitlist join, rate limit, site-admin bootstrap | D1, Email, env |
| `teams` | Create team (site admin), invite, membership, list teams for a Person | D1, Email |
| `models` | Create/list/get/import/export/save with version check | D1, R2, `document` |
| `api` | HTTP routes, 404 for non-members, 409 on version mismatch | `auth`, `teams`, `models` |
| `web` | Landing, Login, waitlist form, team picker, model list, editor shell | `api` |

Tests call `document`, `auth`, `teams`, and `models` at those module seams. Playwright drives `web` against a test Worker with fake Email and isolated D1/R2.

## Persistence

**D1** holds: people, sessions, magic-link tokens, teams, memberships, invites, waitlist emails, event-model metadata (`id`, `team_id`, `title`, `version`, `r2_key`).

**R2** holds only the current document body. Version is the integer on the D1 row. A successful save writes R2 then increments `version` in the same logical operation; a failed write must not increment.

## Out of this file

Live collaboration, billing, public signup, R2 version history, per-model ACLs. Waitlist is not public signup. Feature slices and their ACs live under `docs/specs/features/`.
