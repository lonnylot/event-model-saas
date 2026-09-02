# Design system

Status: released

Tokens and primitives for Event Model SaaS HTML including the editor canvas. [features/product-visual.md](./features/product-visual.md) applies token values. [features/designed-surfaces.md](./features/designed-surfaces.md) applies composed look. [features/landing-depth.md](./features/landing-depth.md) applies Landing depth. [features/landing-saas-shot.md](./features/landing-saas-shot.md) applies the Landing product frame as the hosted Editor. [features/landing-chrome-depth.md](./features/landing-chrome-depth.md) applies Landing chrome depth (no URL bar; nav / band / footer lift). This file does not own feature acceptance criteria.

## Look

Contemporary SaaS on every HTML surface (`/`, `/login`, 404, expired, `/app`, team/admin, editor): light canvas, slate text, teal accent, spaced layout, not a UA-default stack. Paper workshop is leftover unused. Spacing, type, and layout are iterated (`visual-design`, [ADR 0001](../adr/0001-look-iteration.md)); token values stay this file.

## Accessibility

HTML meets WCAG 2.2 AA for contrast of these token pairs (`ink` on `canvas`, `on-accent` on `accent`) and a visible `:focus-visible` affordance. Bar: [ADR 0001](../adr/0001-look-iteration.md).

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
| `type` | `Inter, ui-sans-serif, system-ui, sans-serif` |
| `radius` | `10px` |
| `measure` | `24rem` |

Leftover unused paper tokens (not applied): `paper` `#F7F4EE`, `ink-paper` `#1C1917`, `ochre` `#C0783A`, `terracotta` `#B85C38`. Leftover unused `measure-landing` `36rem` after GET `/` `main` max-width `none` ([designed-surfaces.md](./features/designed-surfaces.md)).

Sticky-note block fills ([features/product-visual.md](./features/product-visual.md)): Actor `#FEF3C7` / `#F59E0B`; Command `#DBEAFE` / `#2563EB`; Event `#FFEDD5` / `#EA580C`; Read Model `#DCFCE7` / `#16A34A`; Automation `#EDE9FE` / `#7C3AED`.

## Primitives

| Primitive | Does |
|-----------|------|
| Page | `body` background `canvas`, color `ink`, font `type` |
| Card | `measure`-wide panel, `line` border, `radius` |
| AppBar | Top bar: Mark (`img` `src` `/favicon.png`) next to the wordmark, then Sign in / Open app or email, optional Teams admin, Sign out. `line` bottom border. Wordmark `/` when signed out, `/app` when signed in. Signed-in admin screens put optional Teams admin in a `nav` landmark ([features/admin-nav.md](./features/admin-nav.md)). Editor AppBar includes that `nav` and the Mark ([features/app-chrome.md](./features/app-chrome.md)) |
| Button primary | Background `accent`, color `on-accent`, `radius` |
| Field | `line` border, `radius` |
| Footer | Landmark on Landing: wordmark, then Sign in when signed out or Open app when signed in |

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

`public/favicon.png` and `public/og.png` are the same two-slice timeline mark in `ink` and `accent` on `canvas` (no letters). Open Graph title and description are HTML meta, not pixels in the PNG. Title is `Event Model`. Description is `Event Modeling for the whole team.` The Mark is also the AppBar logo (`img` `src` `/favicon.png`) on Landing, Login, signed-in shells, and Editor ([features/app-chrome.md](./features/app-chrome.md)).
