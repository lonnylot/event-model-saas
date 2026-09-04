# This product (Event Model SaaS)

Load with `writing-for-agents`. Portable procedure is `SKILL.md` (spec-loop).

## Homes here

- Specs: `docs/specs/` (system) and `docs/specs/features/` (slices). ADRs: `docs/adr/`
- Product catalogs for a portable skill: `.agents/skills/<name>/PRODUCT.md` (agents: `.agents/agents/<name>/PRODUCT.md`)
- Do not add a parallel vendor directory (`docs/superpowers/` or any other spec/plan tree)

## Spec-loop vs this product

Portable `SKILL.md` / `AGENT.md` files are spec-loop. Do not add Event Model catalogs, host names, or weaker-reading *instances* to those files.

- A miss that is a **new general rule** missing from spec-loop: contribute it upstream, or one portable sentence if you must ship it this HEAD (it will need re-fold on the next spec-loop copy).
- A miss that is a **product instance** (that Slice, fromKind/toKind, R2/D1 stored body, Inspector Name, leftover `product.md` phrases): the matching `PRODUCT.md`.
- `post-merge-improver`: product-instance harvest → `PRODUCT.md`. Do not add a second copy of a spec-loop rule.
- Next spec-loop sync: copy `SKILL.md` / `AGENT.md` from spec-loop; leave `PRODUCT.md` in place. Spec-loop wins where a `PRODUCT.md` sentence *conflicts* with the portable skill.

## When a spec moves a skill (this product)

| Spec change | Skill + `PRODUCT.md` |
|-------------|----------------------|
| Extra visible chrome without an AC; extra R2/D1 without stored-body AC; 303 vs shows; `run_worker_first` vs Compute row | `keeping-specs-current` |
| Look / spacing / type / layout of named screens; look may grow | `visual-design` |
| Google Fonts Inter / type token vs type scale / Out of scope webfont files | `visual-design` |
| Look-may-grow skip-validate vs skip-review | `visual-design`, `spec-review-loop`, `releasing-a-spec` |
| Wrapping picker / team / Teams admin / guest `/app` leads in `header`; leftover Unique look still saying `<p><a href="/app">Event Model</a></p>` | `visual-design`, `keeping-specs-current` |
| Viewport meta copied onto sibling named-screen HTML without extra ACs (login / expired / guest `/app` / `shell` / editor; unique proof GET `/`) | `visual-design`, `keeping-specs-current`, `logical-commits` |
| UI / Restates compose of primitives without ACs (signed-in Page `ink`/`type` on guest/picker/team/Teams admin/editor; Send invite radius; leftover Field `canvas` fill / Card `padding`; leftover waitlist Card lift vs `.waitlist-band`; leftover visual-shell background when this slice only proves `ink`) | `keeping-specs-current` |
| Leftover paper Page / Page background assigned to visual-shell after restating signed-in Page (`teams-and-invites.md` / `magic-link-auth.md`; product-visual Restates omits those files) | `keeping-specs-current` |
| Restates omitting draft `architecture.md` that still assigns token/CSS to restated slices (public-face / product-visual apply type/Card/Field/Page/editor CSS after composed look moved to designed-surfaces) | `keeping-specs-current` |
| Leftover Assumptions 576px/36px after restated landing heading 56px / main max-width none | `keeping-specs-current` |
| Leftover landing-saas-shot Problem “browser chrome” after restated URL bar leftover unused | `keeping-specs-current` |
| Leftover landing-fold Problem “three bento cards” / caption-strip after restated stacked product-image rows | `keeping-specs-current` |
| Restates omitting released `editor-shell.md` leftover empty named Inspector after GET Inspector chrome | `keeping-specs-current` |
| Restates omitting public-face leftover unused `.bento` fill/lift after this HEAD rewrote that Out of scope | `keeping-specs-current` |
| Restates omitting released `hydrate-board.md` leftover Out of scope covering TIME chrome after this slice took covering TIME chrome | `keeping-specs-current` |
| Restates listing design-system.md Tokens stay that file when UI inventory is not a rewrite (timeline-clip inventories without listing) | `keeping-specs-current` |
| Leftover unused `measure-landing` 36rem after restated main max-width none | `keeping-specs-current` |
| Accessible name **is** X / Playwright substring; unit `toContain(">X<")` | `testing`, `playwright-e2e` |
| Listitem **in** the Timeline region (unit HTML Timeline `[\s\S]*` Actor; Inspector after Timeline stays green) | `testing`, `tdd-loop`, `playwright-e2e` |
| TIME chrome does not pan parked in Assumptions (no `.time-chrome` AC; Timeline no-translate stays green if TIME chrome is inside `.board`) | `keeping-specs-current`, `testing`, `tdd-loop`, `playwright-e2e` |
| Event → Read Model copy parent parked in Assumptions (follows the same parent; unique kind-gated drag arm; Command → Event Happened `.board` stays green) | `keeping-specs-current`, `testing`, `tdd-loop`, `playwright-e2e`, `logical-commits` |
| Restates leftover unused sibling of `.board` vs remaining ⇧⌘Z redo `timelineEl.append`; undo-rest Timeline-shows stays green | `keeping-specs-current`, `testing`, `tdd-loop`, `playwright-e2e`, `logical-commits` |
| Extra Zoom in `includes scale(1.25)` when restated editor-shell already owns exact `.board` `scale(1.25)` | `logical-commits`, `keeping-specs-current` |
| Leftover Out of scope GET ports after reload vs in-memory title-only shortcut listitems (toolbar Add still mounts `Command port`) | `keeping-specs-current` |
| Unused cargo-cult Out of scope GET ports after reload on a slice with no new in-memory listitem path (hydrate-add-field Inspector Add Field); leftover-narrow is title-only in-memory | `keeping-specs-current` |
| Leftover Out of scope targeting vs JSON `selectedSliceIndex` / DOM `lastLaneList`; one-slice Create-default stays green | `keeping-specs-current`, `testing`, `tdd-loop`, `playwright-e2e` |
| Leftover Out of scope inspect-after-reload vs in-memory omit `data-id` / `data-kind` | `keeping-specs-current`, `testing` |
| Playwright `toHaveCSS` of a computed color that is the UA default (Email Field canvas fill) or inherited from a parent/body AC (Landing heading ink after public-face `body.landing`; editor `Slices` heading after `body.app-editor` ink) | `testing`, `keeping-specs-current`, `tdd-loop`, `playwright-e2e`, `logical-commits` |
| Playwright `locator.focus()` of `:focus-visible` (`Sign in` box-shadow) stays green for a `:focus` rule | `testing`, `tdd-loop`, `playwright-e2e` |
| Spec tree location / vendor plan dirs / `docs/superpowers/` | this skill, `keeping-specs-current` |
| Architecture adapter constructed only under a test flag / injected `env.documents` | `testing`, `codebase-design`, `keeping-specs-current` |
| Independently revertible fromKind vs toKind / GET already hydrates | `logical-commits` |
| Restates leftover rewrite with a production restore of a different path (leftover Restates public-face Field / Page `canvas`/`ink` / design-system Page `type`/`canvas`/`ink` vs unique Send invite radius) | `logical-commits` |
