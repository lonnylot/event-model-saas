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
- Leftover Add Field / Field name / Field type / Optional / Example / Delete Field after a narrower unbind. Nothing Selected / `:has(label)` empty copy does not prove leftover Add Field — Add Field is a `button`
- Leftover To Read Model after a narrower From Event Happened remove
- GET-rendered Description / Add Field when ACs only name Name
- UI / Restates that claim compose of primitives (Card, Field, Page `type`, Button `radius`) this HEAD does not ship; leftover Field `canvas` fill after dropped Email fill AC; leftover Card `padding` with no AC; leftover Button primary `radius` on `Send invite`; leftover design-system waitlist Card lift when ACs lift `.waitlist-band`; leftover design-system Page on every listed screen; leftover Unique look picker / team / Teams admin / guest `/app` lead `<p><a href="/app">Event Model</a></p>` after those screens wrap wordmark in `header` (`visual-design/PRODUCT.md`)
- Page ink on Login/404/expired without color ACs; leftover paper `ink-paper` on `body.login` after restating Page (public) ink; leftover signed-in Page `ink`/`type` on guest/picker/team/Teams admin/editor without body ACs; leftover visual-shell background and color when this slice only proves `ink` on one route
- Assigning a listitem's `textContent` so a released nested control (`Command port`) disappears

A new in-memory listitem path that ships title-only while sibling toolbar Add still mounts `Command port` / `Event Happened port` / `Read Model port` is unfinished until Out of scope names **in-memory** ports, or those ports are ACs. Out of scope "GET ports after reload" is leftover-narrow — that names GET, not in-memory. Out of scope "GET ports after reload" on a slice with no new in-memory listitem path (`hydrate-add-field` Inspector `Add Field`; `port-wrap` restyles existing toolbar `Add Event` listitems) is unused cargo-cult — drop it or point at `hydrate-board.md`. Leftover-narrow is only when this HEAD ships title-only in-memory listitems. Out of scope “Inspector leftover Type” on a slice that does not touch Type (`hydrate-connection-id` hydrates `data-id`) is unused cargo-cult — drop it or point at `inspect-switch.md`. Leftover-narrow is unique production Command → Event Happened vs both Connection kinds; cargo-cult is parking Type this slice does not unbind.

Extra persistence (R2 `put`, D1 insert, store write after a refuse) without an AC that asserts the stored body is the same miss.

A leftover success arm after a refuse still running (timeline insert / undo record) is extra behavior.

Mail subject / From display name pinned in tests or production without a spec sentence is extra copy.

Extra host `observability`, unused bindings, extra Playwright `workers`, or checkout-unique `PORT` / `INSPECTOR_PORT` without a spec sentence is extra host config. Playwright waits after open (`networkidle` / editor bound), New Slice, named Ports, and force hover are Assumptions, not extra chrome.

Architecture-named adapters (D1, Email, R2) constructed only under a test flag contradict architecture. Parking Worker `fetch` construction in Assumptions is unfinished.

A `run_worker_first` list that includes a path architecture does not name cannot both hold — restate the Compute row.

A 303/redirect AC on a path contradicts every "shows" bullet on that same path until those bullets are qualified.

Do not write specs or plans under `docs/superpowers/` or any tree other than `docs/specs/` and `docs/adr/`.

## "that Slice" and targeting

A “that Slice” / “that Actor” / clicked-item / Backspace-the-selected-Slice / “the first X” / first-vs-last AC is unfinished until a second item makes last-item mutation / `.first()` is not also last fail, or the bullet is restated to “the last Slice” / off “the first”. GET after Create one seeded Actor / one Automation after Add+Save+reload is that one-item fixture — `json.slices[0].actors[0]` and `[]` stay green for `.at(-1)` / `[0]`.

Two default-named Slices cannot use “does not show a listitem named New Slice” as that proof.

A targeting packed "and" (first Slice has X and last is []) stays one “only on the first Slice” bullet. Independently revertible copy vs splice (Command drag) is not that bullet — split (`logical-commits`).

Out of scope "Changing which Slice the shortcut targets" is leftover-narrow when JSON uses `selectedSliceIndex` and this HEAD's DOM uses `lastLaneList` — restate last-column DOM, or AC the same index. One-slice Create-default stays green (`testing`). Dropping the last-column `lastLaneList` parenthetical because shortcut-shows.md already restated it, or because Assumptions / Restates in this file name last-column, is leftover-narrow — Out of scope itself must name last-column DOM (`shortcut-kind`).

Inspect/delete after reload that requires `data-kind` / `data-id` GET HTML does not emit: add that AC, or Out of scope (inspect-after-reload family). A new in-memory listitem path that omits `data-id` / `data-kind` when sibling toolbar Add emits them is the same miss for inspect/delete without reload — add that AC, or Out of scope inspect/delete on those listitems. Out of scope GET / inspect-after-reload is leftover-narrow. Assumptions that claim Name JSON mutates by id when leftover last-of-kind / GET listitems have no `data-id` cannot both hold.

## Restates and `product.md`

When Restates names `product.md`, re-read Document flow, Editor (Mac parity), Error handling, Save, Persistence, and Testing. Leftover locked sentences this HEAD does not implement become ACs with tests, or those sentences are rewritten so this slice does not own them.

Copying a schema file into Assumptions is not a rewrite. Deleting Spec slices, Architecture sketch, or CI is not a rewrite. Dropping `product.md` from Restates so leftover words would not have to be rewritten is unfinished.

Restating one phrase in a `product.md` bullet is unfinished until you re-read the **entire** touched bullet and rewrite every other locked phrase that bullet still contains which HEAD does not implement (later-slice Playwright `add a slice`, leftover `team list` / `model list`, leftover `highlighting` / `snap-back` / `reason on the source`, leftover Next slice that still names a released slug).

Two-dot vs current default deleting a catalog-released spec, Playwright file, or catalog row is blocking — three-dot from a stale merge-base hides that drop.

Leftover `<<<<<<<` in `docs/specs/README.md` is not a feature row — a new catalog row at the bottom while `<<<<<<< Updated upstream` remains in the table is unfinished (Inspect event read after Inspect switch / Port wrap; Connection caption after Editor bind split). The catalog conflict-marker unit test is architecture Spec tree (same home as no `docs/superpowers/`).

After rebase onto default, grep leftover paper Page / Page background assigned to visual-shell against every catalog-released spec on HEAD, not only Restates already listed — files that landed in the rebase are the usual omit (`teams-and-invites.md` / `magic-link-auth.md`). Listing `teams-and-invites.md` in Restates without rewriting leftover Page background still assigned to visual-shell, leftover paper Page on expired in `magic-link-auth.md`, or product-visual Restates that omits those files, is unfinished.

Grep draft `architecture.md` for leftover token/CSS assignment to restated slices even when Restates omitted it — public-face / product-visual apply type/Card/Field/Page/editor CSS after composed look moved to designed-surfaces is that omit. Draft is not a skip.

Restating landing heading `56px` / `main` max-width `none` is unfinished until leftover Assumptions in the same `product-visual.md` file no longer say `36px` / `576px`. Look-may-grow restated ACs still grep leftover Assumptions (`visual-design`).

Restating the landing-saas-shot URL-bar AC (`.product-shot` does not show `event-model.lonnylot.com`; `.browser-bar` leftover unused) is unfinished until leftover Problem no longer lists “browser chrome” as a hosted-editor tell.

Restating stacked bento rows (`landing-fold.md`) is unfinished until leftover Problem no longer lists “The three bento cards are unbalanced glossary” / caption-strip as a current tell. Rewriting landing-depth Problem for leftover unused card/band fills is not that rewrite. Look-may-grow restated composition still greps leftover Problem on every Restates path (`visual-design`).

A new-spec Problem that names only Command when ACs also cover Event / Read Model / Automation is leftover-narrow Problem — name those kinds (`inspect-after-reload` / `inspect-fields` / `shortcut-shows` name every kind). The Command-only tell is incomplete, not a leftover deleted tell after restating.

A Problem / Assumptions that name leftover Type after a Connection / switching selection when unique production unbinds Type only on `Command → Event Happened` is leftover-narrow — leftover Type after `Event Happened → Read Model` is extra chrome. Name both Connection kinds, or Out of scope leftover Type after `Event Happened → Read Model`.

A Problem that names only Field name when ACs also drop Field type / Optional / Example / Delete Field is leftover-narrow Problem — name those leftover Field controls.

A Problem that names only Slice leftover Name and Type when ACs also cover Actor leftover Name after empty `.board` is leftover-narrow Problem — name leftover Inspector Name after Timeline `Actor` then empty `.board`, as well as leftover Name and Type after Timeline `New Slice` then TIME chrome. Empty `.board` is not a Slice-only tell (`inspect-deselect`).

A Problem that names Inspector Name on Actor and Automation when unique AC is GET Actor Name JSON is leftover-wide Problem — Out of scope GET Automation Name JSON, or add that AC.

A Problem that names leftover Add Field when unique AC is Inspector `Nothing Selected` is leftover-wide Problem — Add Field is a `button`; `:has(label)` empty copy stays green if `unbindFieldChrome()` is deleted. Add the does-not-show-button AC (`inspect-switch.md` leftover Add Field), or drop Add Field from Problem.

Restates inspect-after-reload “Name JSON and Backspace on those GET listitems” (Actor / Automation) while Out of scope parks GET Automation Name JSON cannot both hold — narrow Restates to GET Actor Name JSON and GET Actor / Automation Backspace.

Restates / architecture / Assumptions assigning GET Connection `data-id` / GET Connection Backspace / GET `data-id` on that node when unique production is GET `Command → Event Happened` and Out of scope parks GET `Event Happened → Read Model` cannot both hold — `CONTEXT.md` Connection is both legal edges. Qualify to GET `Command → Event Happened`, or add the Event Happened → Read Model AC. “that node” after an Event Happened → Read Model sentence is that leftover locked claim.

Restating architecture Front end as “Inspector unbind on selection change” when unique production is leftover Type after a Connection click / leftover From Event Happened after `Command → Event Happened` is leftover locked claim — restate to the ACs, or add ACs that unbind on the other selection changes that sentence names.

GET Inspector heading / empty copy vs leftover `editor-shell.md` “empty named region” when designed-surfaces Restates omits that file is leftover Restates. Filling a region another released spec still calls empty is unfinished until Restates that spec.

Restates omitting `public-face.md` leftover unused `.bento` fill/lift when this HEAD rewrote that Out of scope is leftover Restates — listing without rewriting is the other direction.

Restates omitting released `hydrate-board.md` leftover Out of scope “Pan and Zoom covering TIME chrome” when this HEAD took covering TIME chrome (listed timeline-clip / canvas / editor-shell / architecture / design-system) is leftover Restates. Grep covering TIME chrome even when Restates already lists timeline-clip.

Restates omitting released `port-wrap.md` leftover Out of scope “Narrow viewport” / `inspect-switch.md` leftover Out of scope “Narrow viewport layout” when this HEAD took narrow Editor layout (listed designed-surfaces / visual-shell / architecture) is leftover Restates. Grep Narrow viewport / Narrow viewport layout even when Restates already lists designed-surfaces.

Restates “Narrow AppBar / Timeline clip” when released `timeline-clip.md` owns pan/zoom clip is leftover Restates — restate to “narrow Slice-inside-Timeline layout” so the two clips do not read as one owner.

Restates listing `design-system.md` (“Tokens stay that file”) when this HEAD does not rewrite that file is leftover Restates. UI inventory of `design-system.md` is not a rewrite (`timeline-clip.md` inventories it and does not list it; `create-model-border.md` listed it and rewrote Button primary inventory). Drop the Restates row, or rewrite a sentence in `design-system.md` that assigns this slice’s look and keep the row.

Restates listing inspect-connection / inspect-rest / slice-type / inspect-fields without rewriting leftover unused Type / From Event Happened / Add Field after a Connection click is leftover Restates.

Restates listing `port-fit.md` / `connections.md` without rewriting wrapping / same-row as this slice is leftover Restates.

Restates listing hydrate-board / inspect-after-reload / name-binding-rest / delete-rest / model-defaults without rewriting leftover GET Actor / Automation `data-id`, GET Actor Name JSON, GET Actor / Automation Backspace, leftover “Name JSON mutates the last of that kind” is leftover Restates.

Leftover unused `measure-landing` `36rem` after restated `main` max-width `none` — mark leftover unused or drop (same as leftover unused paper tokens).

Restating leftover unused sibling of `.board` is unfinished until remaining Connection copy appends (⇧⌘Z redo `timelineEl.append`) no longer use the Timeline region. Undo-rest Timeline-shows stays green if redo still appends as a sibling. That remaining arm is unique production — add an AC + `it` named as that criterion so leftover unused holds, or the leftover-unused sentence is false.

Calling wrap leftover unused after this HEAD deleted wrap (`flex-wrap: nowrap`) is leftover unused false — wrap production does not remain. Do not call wrap leftover unused unless wrap production remains.

Restating sitting beside the Slice as leftover unused / wrapping below as this slice is unfinished until leftover GET `.slice-stack` markup and CSS are gone. Assumptions later sibling of `.slice-col` on `.board-pan` (undo `insertBefore`) cannot both hold with GET wrapping captions in `.slice-stack`. Do not restate Assumptions to allow `.slice-stack` while claiming `.board-pan` `insertBefore` still holds. Live `board.append` later-sibling wrap is not GET proof.

An AC "includes the tokens" rather than **is** the exact command, or "includes `scale(`" when canvas pan already writes `scale(1)`, is a weaker criterion (`testing`). A new AC `includes scale(1.25)` on `.board` when Restates already moved editor-shell Zoom in to exact `.board` `scale(1.25)` is extra — drop it (`logical-commits`); unique zoom proof is Timeline `style.transform` does not include `scale(`. A new AC Timeline region `toBeVisible` at 390 when released editor-shell already owns GET Timeline is extra — drop it (`logical-commits`); `toBeVisible` stays green if this HEAD's CSS is deleted and stays green if Timeline is below the fold / stacked under `.slice-rail`. An AC of a computed color that is the user-agent default (`input` background `rgb(255, 255, 255)` / Email Field canvas fill) is unproven — drop it unless deleting the unique declaration fails (`testing`). An AC of a computed color that inherits from a parent/body AC this slice or another spec already owns (Landing heading ink after public-face `body.landing`; editor `Slices` heading after this slice's body ink) is extra — drop it; do not fold into waitlist-form border, muted lead-copy, or body-ink (`logical-commits`).

Parking a distinguishing factor (factor is not the unzoomed pan `1`; mark pixels ink/accent vs ochre; TIME chrome does not pan / `.time-chrome`; Event → Read Model copy parent / follows the same parent) or a shared-control Description value only in Assumptions is unfinished. Assumptions that say TIME chrome does not pan with no AC that asserts `.time-chrome` itself is that park — Timeline `style.transform` does not include `translate(` stays green if TIME chrome is inside `.board`. Assumptions that say `Event Happened → Read Model` copy follows the same parent as `Command → Event Happened` while a unique `if (port.dataset.kind === …)` drag arm moves that copy onto `.board` is that park — Command → Event Happened `.board` tests stay green if that arm is still a sibling. Extra visible chrome without an AC. GET `connectionCopy` stays the one reload AC (`testing` unsplit).
