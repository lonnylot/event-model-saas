# Design system

Status: released

Tokens and primitives for Event Model SaaS HTML including the editor canvas. [features/product-visual.md](./features/product-visual.md) applies them. This file does not own feature acceptance criteria.

## Look

Contemporary SaaS on every HTML surface (`/`, `/login`, 404, expired, `/app`, team/admin, editor): light canvas, slate text, teal accent. Paper workshop is leftover unused.

## Tokens

| Token | Value |
|-------|--------|
| `canvas` | `#FFFFFF` |
| `canvas-subtle` | `#F8FAFC` |
| `ink` | `#0F172A` |
| `muted` | `#64748B` |
| `line` | `#E2E8F0` |
| `accent` | `#0F766E` |
| `on-accent` | `#FFFFFF` |
| `type` | `ui-sans-serif, system-ui, sans-serif` |
| `radius` | `10px` |
| `measure` | `24rem` |
| `measure-landing` | `36rem` |

Leftover unused paper tokens (not applied): `paper` `#F7F4EE`, `ink-paper` `#1C1917`, `ochre` `#C0783A`, `terracotta` `#B85C38`.

Sticky-note block fills ([features/product-visual.md](./features/product-visual.md)): Actor `#FEF3C7` / `#F59E0B`; Command `#DBEAFE` / `#2563EB`; Event `#FFEDD5` / `#EA580C`; Read Model `#DCFCE7` / `#16A34A`; Automation `#EDE9FE` / `#7C3AED`.

## Primitives

| Primitive | Does |
|-----------|------|
| Page | `body` background `canvas`, color `ink`, font `type` |
| Card | `measure`-wide panel, `line` border, `radius` |
| AppBar | Top bar: wordmark, then Sign in / Open app or email, optional Teams admin, Sign out. `line` bottom border. Wordmark `/` when signed out, `/app` when signed in |
| Button primary | Background `accent`, color `on-accent`, `radius` |
| Field | `line` border, `radius` |

## Screens

| Screen | Path |
|--------|------|
| Landing | GET `/` |
| Login | GET `/login` |
| Not found | GET unknown document path |
| Expired link | GET `/api/auth/consume` used or expired |
| App | GET `/app` when not redirected |
| Team picker | GET `/app` with two Teams |
| Team | GET `/app/teams/{id}` |
| Teams admin | GET `/app/admin/teams` |
| Editor | GET `/app/teams/{id}/models/{mid}` |

## Mark

`public/favicon.png` and `public/og.png` are the same two-slice timeline mark in `ink` and `accent` on `canvas` (no letters). Open Graph title and description are HTML meta, not pixels in the PNG. Title is `Event Model`. Description is `Event Modeling for the whole team.`
