# Landing fold

Status: released

## Problem

GET `/` spends the first viewport on a tall empty hero. The product frame is cut off. The mock shows a personal email and no Connection. The waitlist form is a stacked login card. Mobile crops the mock. Sign in lives only in the header. The footer repeats the header. Three-card bento / caption-strip composition is leftover unused ([landing-modern.md](./landing-modern.md)).

## Acceptance criteria

- [x] GET `/` at viewport `1440x900`, `.product-shot` `getBoundingClientRect().bottom` is less than or equal to `window.innerHeight`
- [x] GET `/` without a Session shows the text `A Team shares one Event Model: a timeline of slices, not a file you pass around.`
- [x] GET `/` without a Session, `.hero` shows a link whose accessible name is `Sign in`
- [x] GET `/` without a Session, the `.hero` link `Sign in` has `href` `/login`
- [x] GET `/` with a Session, `.hero` shows a link whose accessible name is `Open app`
- [x] GET `/` with a Session, the `.hero` link `Open app` has `href` `/app`
- [x] GET `/` `.product-shot` does not show the text `lonny@lonnylot.com`
- [x] GET `/` `.product-shot` shows the text `Command → Event Happened`
- [x] GET `/` without a Session shows the text `Every Event Model belongs to one Team. Every Person on that Team may edit it.`
- [x] GET `/` without a Session shows the text `Each Slice is one vertical feature: Actor, Command, Event, Read Model, Automation.`
- [x] GET `/` without a Session shows the text `Magic-link sign-in. No public signup. Site admin sends Invites. Save is explicit.`
- [x] GET `/` without a Session does not show the text `Here the Event Model belongs to a Team.`
- [x] GET `/` without a Session does not show the text `a vertical column on the timeline`
- [x] GET `/` without a Session does not show the text `The Mac app is local: one person, one .eventmodel file.`
- [x] GET `/` `.bento article` first article has exactly one `p`
- [x] GET `/` `.bento article` second article has exactly one `p`
- [x] GET `/` `.bento article` third article has exactly one `p`
- [x] GET `/` at viewport `1440x900`, `#waitlist-form` computed `flex-direction` is `row`
- [x] GET `/` at viewport `390x844`, `#waitlist-form` computed `flex-direction` is `column`
- [x] GET `/` at viewport `390x844`, `.product-shot` shows the text `Checkout`
- [x] GET `/` at viewport `390x844`, `.product-shot` does not show the text `Fulfillment`
- [x] GET `/` `footer` has an `img` whose `src` is `/favicon.png`
- [x] GET `/` without a Session, `footer` does not show a link whose accessible name is `Sign in`
- [x] GET `/` with a Session, `footer` does not show a link whose accessible name is `Open app`

## Domain terms

Event Model, Team, Person, Slice, Actor, Command, Event, Read Model, Automation, Site admin, Invite, Magic link, Waitlist, Session, Connection

## Seams

- `env.ASSETS.fetch` — `public/index.html`, `public/shell.css`
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Landing. Primitives: Page, AppBar, Card, Button primary, Field, Footer. Look of Landing is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- First-screen proof uses Playwright viewport `1440x900`. Waitlist row/column and mobile mock proofs use `1440x900` and `390x844`.
- Header `Sign in` / `Open app` locators stay [public-face.md](./public-face.md). Extra `.hero` Sign in / Open app are this slice. GET `/` with a Session still does not show a link `Sign in` (header and hero both show `Open app`).
- Join the waitlist link `#waitlist`, waitlist heading, Email field, and waitlist button stay [public-face.md](./public-face.md).
- Bento headings `The model lives with the team`, `A timeline of slices`, and `Invite-only, version-checked saves` stay [public-face.md](./public-face.md).
- Footer `Event Model` href `/` stays [landing-depth.md](./landing-depth.md). Footer Sign in / Open app are leftover unused.
- `.product-shot` hosted editor names stay [landing-saas-shot.md](./landing-saas-shot.md). Decorative chrome stays `aria-hidden`. `Command → Event Happened` in the shot is decorative Connection copy, not a real control.
- `lonny@lonnylot.com` in `.product-shot` is leftover unused. Do not replace it with another personal mailbox.
- `#waitlist-form` is `id="waitlist-form"`. Landing desktop row layout does not change Login `#login`.
- GET `/` `.hero` computed `min-height` is not `0px` is leftover unused after the first-screen proof ([landing-depth.md](./landing-depth.md)).
- GET `/` the text `One Event Model, signed in. No passing files around.` is leftover unused. Muted color on the new hero sentence stays [product-visual.md](./product-visual.md) restated to that sentence.
- Waitlist silk (`/waitlist-silk.jpg`) stays. Do not cover it with an opaque ink overlay.
- **Look may grow:** on Landing, the implementer may add look chrome (hero density, waitlist overlay, one-slice mobile crop) by appending ACs in the same commit (`visual-design`). Do not add persistence, public signup, or claims Out of scope names. Do not halt for a new *validate* of that chrome after this spec is validated. Look-may-grow is not skip review.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)). `muted` on `canvas` and `canvas` on `ink` stay.

## Out of scope

Dark mode. Public signup. Site admin waitlist table UI. Login restyle. Editor restyle. Mac window chrome. New product claims (pricing, SLA, "anyone can join"). Product-visual token *values* stay [product-visual.md](./product-visual.md). A second hero heading. Import button. Stacked bento rows with product images, and leftover unused three-card / caption-strip composition, are [landing-modern.md](./landing-modern.md).

## Restates

- [public-face.md](./public-face.md) — Hero heading, Join the waitlist, Email, waitlist button, header Sign in / Open app, no Sign up stay that file. Hero sentence is `A Team shares one Event Model: a timeline of slices, not a file you pass around.` Bento bodies are the three one-paragraph sentences in this slice. Leftover unused: `One Event Model, signed in. No passing files around.`; `Here the Event Model belongs to a Team.`; `a vertical column on the timeline`; `intent, then a fact that happened`; `a view of state from events`; `a processor with no human actor`; `Commands connect to events. Events connect to read models.`; `The Mac app is local: one person, one .eventmodel file.`; `Magic-link sign-in. No password, no public signup.`; `Site admin creates Teams and sends Invites.`; `Save is explicit.` as separate bullets (those facts fold into the three paragraphs). `.hero` Sign in / Open app are this slice.
- [product-visual.md](./product-visual.md) — Muted color applies to the new hero sentence, not `One Event Model, signed in. No passing files around.`
- [landing-depth.md](./landing-depth.md) — Overlap, ink waitlist, footer landmark, footer Event Model href stay that file. `.bento` `canvas-subtle` fill is leftover unused ([landing-modern.md](./landing-modern.md)). Hero `min-height` not `0px` is leftover unused; first-screen product-shot visibility is this slice. Footer Sign in / Open app are leftover unused.
- [landing-chrome-depth.md](./landing-chrome-depth.md) — Header / waitlist / footer lift stay that file. `.bento` lift is leftover unused ([landing-modern.md](./landing-modern.md)). Footer mark `img` is this slice (with [app-chrome.md](./app-chrome.md) Mark).
- [landing-saas-shot.md](./landing-saas-shot.md) — Hosted editor names stay that file. Shot Connection copy and no personal email are this slice. Waitlist silk URL stays that file.
- [app-chrome.md](./app-chrome.md) — Header Mark stays that file. Footer Mark is this slice.
- [design-system.md](../design-system.md) — Tokens stay that file. Footer on Landing is mark + wordmark (no Sign in).
- [product.md](../product.md) — GET `/` is still the marketing landing. Hero copy, bento bodies, first-screen product frame, and footer are this slice.
- [architecture.md](../architecture.md) — Public-face still applies public tokens. Landing fold (first screen, bento bodies, waitlist row, footer) is this slice.
