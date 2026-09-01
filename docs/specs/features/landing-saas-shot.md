# Landing SaaS shot

Status: released

## Problem

GET `/` product frame is a Mac window: traffic-light dots and a native title bar. A visitor cannot tell Event Model is the hosted SaaS editor (browser chrome, Save, Export, Sign out, toolbar, Model, Slices, Timeline, Inspector).

## Acceptance criteria

- [x] GET `/` `.product-shot` does not contain `.product-chrome`
- [x] GET `/` `.product-shot` shows the text `event-model.lonnylot.com`
- [x] GET `/` `.product-shot` shows the text `Save`
- [x] GET `/` `.product-shot` shows the text `Export`
- [x] GET `/` `.product-shot` shows the text `Sign out`
- [x] GET `/` `.product-shot` shows the text `New Slice`
- [x] GET `/` `.product-shot` shows the text `Model`
- [x] GET `/` `.product-shot` shows the text `Slices`
- [x] GET `/` `.product-shot` shows the text `Time`
- [x] GET `/` `.product-shot` shows the text `Inspector`
- [x] GET `/` without a Session does not show a button whose accessible name is `Save`
- [x] GET `/` without a Session does not show a button whose accessible name is `Sign out`
- [x] GET `/` `.waitlist-band` computed `background-image` is not `none`

## Domain terms

Event Model, Team, Slice, Command, Event, Read Model, Automation, Session

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/shell.css`, `public/hero-mesh.jpg`, `public/waitlist-silk.jpg`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing. The product frame on Landing is a static picture of the Editor screen, not Mac window chrome. Primitives: Page, AppBar, Button primary. Look of Landing is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- `.product-shot` is the Landing product frame (`role="img"` accessible name `Event Model editor` stays [designed-surfaces.md](./designed-surfaces.md)).
- Decorative editor chrome inside `.product-shot` is `aria-hidden` so it is not a control. GET `/` without a Session still has no `Save` / `Sign out` buttons.
- Product-shot texts `Save`, `Export`, `Sign out`, `New Slice`, `Model`, `Slices`, `Time`, and `Inspector` are the hosted editor chrome from [designed-surfaces.md](./designed-surfaces.md) / [editor-shell.md](./editor-shell.md), not Mac traffic lights.
- `event-model.lonnylot.com` in the product frame is browser address chrome (hosted app), not a native window title.
- `.product-chrome` is leftover unused Mac traffic-light markup.
- These product-frame ACs share one `.product-shot` markup path; Landing look is one `visual-design` pass (not one commit per CSS property).
- **Look may grow:** on Landing, the implementer may add look chrome (Imagine atmosphere in `public/hero-mesh.jpg` or extra public JPEGs, glow, browser bar styling) by appending ACs in the same commit (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate*. Do not ship an Imagine bitmap of labeled editor UI as the product frame — labeled screens are HTML/CSS (`imagine` skill). Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).
- Header / footer `Sign in` / `Open app` locators stay [public-face.md](./public-face.md) / [landing-depth.md](./landing-depth.md).

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Login restyle. Editor restyle (the real `/app/.../models/{mid}` page). Mac window chrome. Editing behavior stays the released editor specs. Product-visual token *values* stay [product-visual.md](./product-visual.md). New product claims (pricing, SLA, "anyone can join").

## Restates

- [landing-depth.md](./landing-depth.md) — Layered fields, overlap, ink waitlist, footer stay that file. Product-shot transform and figure overlap stay that file. Product-shot *contents* are this slice: hosted editor chrome, not `.product-chrome` Mac traffic lights.
- [designed-surfaces.md](./designed-surfaces.md) — GET `/` image accessible name `Event Model editor` stays that file. That image’s contents (hosted editor, not Mac window) are this slice. Real Editor page chrome stays that file.
- [public-face.md](./public-face.md) — Copy, routes, waitlist POST, body `canvas`/`ink` stay that file. Landing product frame is this slice.
- [editor-shell.md](./editor-shell.md) — Real Editor Save / Export / Sign out / New Slice stay that file. The Landing picture of those names is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file. Landing product frame depicts the Editor screen in a browser, not Mac window chrome.
- [product.md](../product.md) — Public HTML is contemporary SaaS; the Landing product frame is the hosted editor, not the Mac app window.
- [architecture.md](../architecture.md) — Landing depth stays [landing-depth.md](./landing-depth.md). Hosted-editor product frame on Landing is this slice.
