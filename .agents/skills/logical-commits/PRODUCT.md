# This product (Event Model SaaS)

Load with `logical-commits`. Portable procedure is `SKILL.md` (spec-loop).

Spec-loop owns **after the PR is open**: a missing or weaker test found in review or CI is one review/CI commit on HEAD. Do not reconstruct it into an earlier AC. Rows below that say reconstruct apply only in the **TDD slice** (before the PR is the review unit).

## Look pass

A `visual-design` look pass is one slice per named screen (or one stylesheet several named screens mount, plus the shell it left). Viewport meta copied onto login / expired / guest `/app` / `shell` / editor is that shell — unique proof is GET `/`; not a commit or AC per HTML file. Not one commit per CSS property. Look-may-grow ACs (new heading/image/static page) land in that screen's look-pass commit.

## Independently revertible here

- fromKind vs toKind (or any copied field): land EVENT `toKind` only, then READMODEL with its test. The first commit must not already copy that field for every target.
- Copy vs splice (Command drag onto another Slice): land copy/push first (last still lists it), then splice so last is `[]`. Packing both is grouping. Restating that drag as one targeting "only on the first Slice" bullet is the weaker packing (`testing`).
- Two kind-gated `if (port.dataset.kind === …)` alreadyConnected arms: unique production per AC, not one kind-agnostic early return. Event → Read Model drag parent vs Command → Event Happened drag parent is the same split — the first AC must not already move every target's parent. ⇧⌘Z redo Connection copy parent vs drag Connection copy parent is unique production — Restates leftover unused sibling is false until that arm moves.
- Status vs heading vs row vs R2; two workflow `on:` events vs a `run` step.
- Four independently revertible ACs on GET `/app` (Team name, Create team, Sign out, Teams admin) are four commits. Five ACs on GET `/app/teams/{id}/models/{mid}` (heading, email, Save, Export, Sign out) are five.
- Leftover-hide `unbindAddField` vs `unbindFieldName` is the same split.
- Client `fetch` in `public/*.js` that a Playwright flow needs is that flow's production.
- Restates leftover rewrite vs unique production restore of a different path are two commits: Card/Field stay later vs PNG mark pixels; leftover Restates public-face Field not-canvas-fill / public Page `canvas`/`ink` / design-system Page `type`/`canvas`/`ink` vs unique Send invite radius. A subject that names two review threads with "and" has not addressed either.

Do not introduce a shared helper (`shell()`) only to keep two checkboxes in one commit. A stylesheet commit must not already apply paper (Login-only selector, not global `body { background-color }`). When splitting status vs content-type, the status commit must not already send that header.

## No unique production — fold or unsplit

If the next checkbox stays green with no new production, fold the proof into the commit that wrote the field, or do not split the bullet.

- GET already hydrates Slice `title` as the Slices listitem / Actor `name` as the Timeline listitem — a dedicated reload commit is tests-after.
- GET `connectionCopy` is one HTML string — Command → Event Happened after reload is that AC; do not split Event → Read Model after reload.
- Waitlist `does not create a Person` / `does not set a Session cookie` on a POST that never created those — fold into the insert / status-200 commit (TDD slice), not a unique-production regex commit.
- Invalid-email status 200 when success 200 already landed is tests-after, not an early-return pack (`testing`).
- Unknown-login waitlist proof when `request-link` never calls `insertWaitlist` — fold into the waitlist insert commit, or unsplit.
- Extra ACs that stay green because another spec already owns that production (horizontal wheel / pinch pan when canvas Timeline `wheel` already does `panX -= event.deltaX`; Landing heading ink when public-face already owns `body.landing` color; Timeline-clip Zoom in `includes scale(1.25)` when restated editor-shell already owns exact `.board` `scale(1.25)`) — drop the AC and restore Out of scope; do not fold those tests into a sibling unique-production commit (muted lead-copy). Same production path is not an excuse to keep the overlapping checkbox. Unique zoom proof is Timeline `style.transform` does not include `scale(`. A computed-color checkbox whose proof stays green because the UA default already paints it (Email Field canvas fill `rgb(255, 255, 255)` on `input`) or because a parent/body AC this slice already owns already paints it (editor `Slices` heading after `body.app-editor` ink) is that drop — do not fold into waitlist-form border or body-ink.

## TDD slice only (before the PR is open)

Click-path production that lands after field AC tests of an unused module is tests-after — rebase so each field AC's test and the production the click uses land together.

A restated weaker fixture after that AC's production landed (one-item Backspace → two-item; `includes scale(` → factor is not pan `1`; widget-role Sign up after a checked AC with no `it`) reconstructs into that production commit. A tests-only follow-up is tests-after.

A tests-only wait-after-open helper, or tests-only locator/fixture after production added a second matching `New Slice`, reconstructs into the production that needed it — not a tests-only commit on HEAD *in this slice*.
