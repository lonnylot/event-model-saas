# This product (Event Model SaaS)

Load with `keeping-specs-current`. Portable procedure is `SKILL.md` (spec-loop).

## Which file owns the fact (extra row)

| Fact | File |
|------|------|
| Locked v1 product decisions | `docs/specs/product.md` |

## Chrome, persistence, host

Look of **named screens** is `visual-design` ([ADR 0001](../../../docs/adr/0001-look-iteration.md)). Spacing, type, density, and layout of those screens are not extra chrome. A new heading, image, landmark, or static public page on a named screen is unfinished until its AC lands in the **same commit** as the production — do not halt for a new human *validate*. Look-may-grow is not skip review (`spec-review-loop` after the first green commit). Viewport meta copied onto login / expired / guest `/app` / `shell` / editor without extra ACs is the look shell those screens mount (`visual-design`) — unique proof is GET `/`; not extra chrome. Still extra chrome: new persistence, new capability (signup, billing), copy that asserts a new product claim, or chrome on a screen this spec does not own.

Extra visible chrome without an AC is unfinished — add the AC or omit it. Here that includes:

- Document title, extra nav, extra form, extra link, extra heading on a route
- Stylesheet on an Out of scope route; global CSS restyle of existing controls
- Hardcoded create-title Name after fill heading
- Extra Delete key when ACs or `product.md` name only Backspace (canvas: Delete is the same path — name it)
- Inspector Name (or other inspect chrome) on a kind Out of scope names inspecting (Command / Event / Read Model / Automation)
- Leftover Add Field / Field name / Field type / Optional / Example / Delete Field after a narrower unbind
- GET-rendered Description / Add Field when ACs only name Name
- UI / Restates that claim compose of primitives (Card, Field, Page `type`, Button `radius`) this HEAD does not ship; leftover Field `canvas` fill after dropped Email fill AC; leftover Card `padding` with no AC; leftover Button primary `radius` on `Send invite`; leftover design-system Page on every listed screen; leftover AppBar / `header` flex on picker / team / Teams admin while lead is `<p><a href="/app">Event Model</a></p>` (`visual-design/PRODUCT.md`)
- Page ink on Login/404/expired without color ACs; leftover paper `ink-paper` on `body.login` after restating Page (public) ink; leftover signed-in Page `ink`/`type` on guest/picker/team/Teams admin/editor without body ACs; leftover visual-shell background and color when this slice only proves `ink` on one route
- Assigning a listitem's `textContent` so a released nested control (`Command port`) disappears

Extra persistence (R2 `put`, D1 insert, store write after a refuse) without an AC that asserts the stored body is the same miss.

A leftover success arm after a refuse still running (timeline insert / undo record) is extra behavior.

Mail subject / From display name pinned in tests or production without a spec sentence is extra copy.

Extra host `observability`, unused bindings, extra Playwright `workers`, or checkout-unique `PORT` / `INSPECTOR_PORT` without a spec sentence is extra host config. Playwright waits after open (`networkidle` / editor bound), New Slice, named Ports, and force hover are Assumptions, not extra chrome.

Architecture-named adapters (D1, Email, R2) constructed only under a test flag contradict architecture. Parking Worker `fetch` construction in Assumptions is unfinished.

A `run_worker_first` list that includes a path architecture does not name cannot both hold — restate the Compute row.

A 303/redirect AC on a path contradicts every "shows" bullet on that same path until those bullets are qualified.

Do not write specs or plans under `docs/superpowers/` or any tree other than `docs/specs/` and `docs/adr/`.

## "that Slice" and targeting

A “that Slice” / “that Actor” / clicked-item / Backspace-the-selected-Slice / “the first X” / first-vs-last AC is unfinished until a second item makes last-item mutation / `.first()` is not also last fail, or the bullet is restated to “the last Slice” / off “the first”.

Two default-named Slices cannot use “does not show a listitem named New Slice” as that proof.

A targeting packed "and" (first Slice has X and last is []) stays one “only on the first Slice” bullet. Independently revertible copy vs splice (Command drag) is not that bullet — split (`logical-commits`).

Inspect/delete after reload that requires `data-kind` / `data-id` GET HTML does not emit: add that AC, or Out of scope (inspect-after-reload family). Assumptions that claim Name JSON mutates by id when leftover last-of-kind / GET listitems have no `data-id` cannot both hold.

## Restates and `product.md`

When Restates names `product.md`, re-read Document flow, Editor (Mac parity), Error handling, Save, Persistence, and Testing. Leftover locked sentences this HEAD does not implement become ACs with tests, or those sentences are rewritten so this slice does not own them.

Copying a schema file into Assumptions is not a rewrite. Deleting Spec slices, Architecture sketch, or CI is not a rewrite. Dropping `product.md` from Restates so leftover words would not have to be rewritten is unfinished.

Restating one phrase in a `product.md` bullet is unfinished until you re-read the **entire** touched bullet and rewrite every other locked phrase that bullet still contains which HEAD does not implement (later-slice Playwright `add a slice`, leftover `team list` / `model list`, leftover `highlighting` / `snap-back` / `reason on the source`, leftover Next slice that still names a released slug).

Two-dot vs current default deleting a catalog-released spec, Playwright file, or catalog row is blocking — three-dot from a stale merge-base hides that drop.

After rebase onto default, grep leftover paper Page / Page background assigned to visual-shell against every catalog-released spec on HEAD, not only Restates already listed — files that landed in the rebase are the usual omit (`teams-and-invites.md` / `magic-link-auth.md`). Listing `teams-and-invites.md` in Restates without rewriting leftover Page background still assigned to visual-shell, leftover paper Page on expired in `magic-link-auth.md`, or product-visual Restates that omits those files, is unfinished.

Grep draft `architecture.md` for leftover token/CSS assignment to restated slices even when Restates omitted it — public-face / product-visual apply type/Card/Field/Page/editor CSS after composed look moved to designed-surfaces is that omit. Draft is not a skip.

Restating landing heading `56px` / `main` max-width `none` is unfinished until leftover Assumptions in the same `product-visual.md` file no longer say `36px` / `576px`. Look-may-grow restated ACs still grep leftover Assumptions (`visual-design`).

Restating the landing-saas-shot URL-bar AC (`.product-shot` does not show `event-model.lonnylot.com`; `.browser-bar` leftover unused) is unfinished until leftover Problem no longer lists “browser chrome” as a hosted-editor tell.

GET Inspector heading / empty copy vs leftover `editor-shell.md` “empty named region” when designed-surfaces Restates omits that file is leftover Restates. Filling a region another released spec still calls empty is unfinished until Restates that spec.

Leftover unused `measure-landing` `36rem` after restated `main` max-width `none` — mark leftover unused or drop (same as leftover unused paper tokens).

An AC "includes the tokens" rather than **is** the exact command, or "includes `scale(`" when canvas pan already writes `scale(1)`, is a weaker criterion (`testing`). An AC of a computed color that is the user-agent default (`input` background `rgb(255, 255, 255)` / Email Field canvas fill) is unproven — drop it unless deleting the unique declaration fails (`testing`). An AC of a computed color that inherits from a parent/body AC this slice or another spec already owns (Landing heading ink after public-face `body.landing`; editor `Slices` heading after this slice's body ink) is extra — drop it; do not fold into waitlist-form border, muted lead-copy, or body-ink (`logical-commits`).

Parking a distinguishing factor (factor is not the unzoomed pan `1`; mark pixels ink/accent vs ochre) or a shared-control Description value only in Assumptions is unfinished.
