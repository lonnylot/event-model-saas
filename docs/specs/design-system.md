# Design system

Status: released

Tokens and primitives for Event Model SaaS HTML that is not the editor canvas. [features/visual-shell.md](./features/visual-shell.md) applies them. This file does not own feature acceptance criteria.

## Look

Paper workshop. Off-white page, ink text, hairline rules. Not a gray SaaS dashboard and not a dark studio.

## Tokens

| Token | Value |
|-------|--------|
| `paper` | `#F7F4EE` |
| `ink` | `#1C1917` |
| `muted` | `#78716C` |
| `hairline` | `#E7E0D4` |
| `ochre` | `#C0783A` |
| `terracotta` | `#B85C38` |
| `type` | `ui-sans-serif, system-ui, sans-serif` |
| `radius` | `8px` |
| `measure` | `24rem` |

`ochre` and `terracotta` are the mark on `favicon.png` and `og.png`. Sticky-note lane colors on the canvas stay later.

## Primitives

| Primitive | Does |
|-----------|------|
| Page | `body` background `paper`, color `ink`, font `type` |
| Card | Login form in a `measure`-wide panel, `hairline` border, `radius`, padding |
| AppBar | Signed-in top bar: link `Event Model` to `/app`, then email, optional Teams admin, Sign out |
| Button primary | Background `ink`, color `paper`, `radius` |
| Field | `paper` fill, `hairline` border, `radius` |

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

Editor canvas (`/app/teams/{id}/models/{mid}`) is not a screen in this file.

## Mark

`public/favicon.png` and `public/og.png` are the same two-slice paper mark (no letters). Open Graph title and description are HTML meta, not pixels in the PNG.
