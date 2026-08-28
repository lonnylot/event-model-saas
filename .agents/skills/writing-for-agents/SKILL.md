---
name: writing-for-agents
description: >
  Use when creating or editing AGENTS.md, a skill under .agents/skills,
  an agent under .agents/agents, when a spec change requires updating
  those procedures, or when specs or plans would land under docs/superpowers
  or another vendor spec/plan tree.
---

# Writing for agents

A spec change that changes **how work is done** is unfinished until the matching skill (or `AGENTS.md` pointer) is updated in the same change.

The packaging differs (AGENTS.md vs skill vs AGENT.md); the writing does not: the agent should take the same *process* every run.

When the file is a skill, also read [SKILL-MECHANICS.md](SKILL-MECHANICS.md).

## When a spec moves a skill

| Spec change | Skill that must move with it |
|-------------|------------------------------|
| Domain terms, CONTEXT.md, ADR, duplicate CONTEXT.md heading | `domain-modeling` |
| Test layers or seams | `testing`, `tdd-loop` |
| Commit / branch / PR / CI / fetch current default before branching | `logical-commits`, `github-ci-loop` |
| YAML event prefix / `pull_request_target` | `testing`, `github-ci-loop` |
| Review or release gate | `spec-review-loop`, `releasing-a-spec`, `spec-reviewer`, `release-manager` |
| Orchestrator vs implementer / no production code in the main session | `releasing-a-spec`, `spec-implementer` |
| Unmergeable PR / rebase onto default / merge conflict | `spec-implementer` (algorithm); `github-ci-loop` and `release-manager` fail closed |
| After merge, learn from review | `post-merge-improvement`, `post-merge-improver` |
| Two or more feat/ PRs at once | `parallel-feature-work`, `using-git-worktrees`, `releasing-a-spec` |
| Playwright / flow CI | `playwright-e2e`, `testing` |
| Async form fetch / last-mail before the invite POST | `playwright-e2e` |
| Wait after open (editor bound / networkidle) and after New Slice click / named Ports before pointer-down / force hover vs Timeline pan / lane Add or ⌥⌘1–5 | `playwright-e2e`, `tdd-loop` |
| Accessible name **is** X / Playwright substring | `testing`, `playwright-e2e` |
| Listitem visible text **is** X / Playwright `/^X/` with Port descendants | `testing`, `playwright-e2e`, `tdd-loop` |
| Unit `toContain(">X<")` for a named link/button/textbox / name vs href packed in one tag `toContain` | `testing` |
| Computed CSS proven by stylesheet `toContain` | `testing`, `tdd-loop` |
| `includes scale(` / `toContain("scale(")` when canvas pan already writes `scale(1)` | `testing`, `keeping-specs-current`, `tdd-loop` |
| Unit `not.toContain("<li>X</li>")` for a does-not-show listitem | `testing` |
| "does not show a control named X" / Playwright button+link only | `testing`, `playwright-e2e`, `tdd-loop` |
| Playwright `toHaveText` on a listitem that has descendant `Command port` | `testing`, `playwright-e2e` |
| Clicking-appends tested at a function production never calls | `testing` |
| Dragging-appends unit that passes the kind already in the input | `testing` |
| Same-control Name values that never select the other entity (Command vs Event / Read Model / Automation; first-click-wins / insert-if-missing) | `testing` |
| "that Slice" / clicked-item / Backspace / "the first X" / first-vs-last AC with only one item / always-delete-last / `.first()` / only-last / one New Slice | `testing`, `keeping-specs-current`, `playwright-e2e` |
| Empty stub `it` / checked AC with no assertion | `testing`, `tdd-loop` |
| Module / seam / adapter vocabulary | `codebase-design` |
| Architecture adapter constructed only under a test flag / injected `env.documents` / construction parked in Assumptions | `testing`, `codebase-design`, `keeping-specs-current` |
| Architecture-named store never constructed in a test / each new SQL untested | `testing` |
| Packed "and" AC / independent env/branch cases | `testing`, `keeping-specs-current` |
| Targeting packed "and" (first Slice has X and last is []) / only-on-the-first-Slice stays one criterion | `testing`, `keeping-specs-current`, `tdd-loop` |
| Copy vs splice (Command drag: first Slice has X vs last is []) is not targeting | `testing`, `logical-commits`, `keeping-specs-current` |
| Assumption vs acceptance criterion | `keeping-specs-current` |
| Distinguishing factor parked in Assumptions (factor is not unzoomed pan `1`; mark pixels ink/accent vs ochre) | `keeping-specs-current` |
| Shared-control displayed value parked in Assumptions (Description after select; empty omitted JSON) | `keeping-specs-current`, `testing` |
| Visible copy / insert on the source listitem parked in Assumptions | `keeping-specs-current` |
| Assumptions claim by-id Name JSON when leftover last-of-kind / GET listitems have no data-id; Backspace after reload inert because GET listitems have no data-id | `keeping-specs-current`, `testing` |
| Fill-after-select / `toBeVisible` standing in for a shared Inspector textbox value (Description; empty omitted JSON) | `testing`, `tdd-loop` |
| Restated AC with leftover sections / leftover Assumptions after Out of scope (this slice claims in-session Add Field append / Field type picker after Add that inspect-fields-rest already owns) / rewriting Out of scope swallowed the Restates heading / leftover broader assignment (all Command Field name) after Out of scope narrowed to Last-Command / leftover sibling Out of scope assigning stay-later Card/Field to this slice / leftover public Button primary after ACs narrowed to Login Email me a link / after rebase leftover grep skipped catalog-released specs that just landed / leftover Assumptions `Add targets the last Slice` after Restates moved lane Add (Toolbar Add) / leftover Seams after deleting a named module / leftover Seams replacing a released last-Command arity with by-id without restating that spec / leftover Seams that name a path or mutation production does not call (scroll path / undo those mutations) / leftover Seams that name five kinds when ACs only prove Command / ⌥⌘2 / Assumptions that park selected-Slice ⌥⌘1–5 / leftover test title / leftover Restates / leftover Restates that still says keyboard shortcuts stay later after Out of scope moved ⌥⌘1–5 or generic Dashed Add and keyboard stay later after Out of scope split ⇧⌘N vs remaining ⌥⌘1–5 or generic Multi-item Name binding stays later after Out of scope split Command vs Slice / Actor or fields stay later after Out of scope moved Inspector Fields or leftover inspect-description GET-rendered inspect of Description stays later or generic inspect after reload assigned to this slice and inspect-after-reload.md / Restates omits a released spec that still describes deleted behavior (packed Inspector Description / Fields / Slice type picker stay later; packed Slice type picker, inspect after reload, Mac window chrome; Event / Read Model / Automation reload-lists; packed Canvas move / delete / pan / undo still lists Delete as canvas.md; leftover Chrome Name still mutates the last Command; moving Slices / canvas move still assigned wholly to canvas.md) / two-dot vs default deletes a released spec / Playwright / catalog row (three-dot from a stale merge-base hides it) / Restates names a path not in the tree (`canvas-rest.md` / `add-on-lane.md` / `delete-blocks.md` not on this HEAD / do not edit if not on the branch) / Assumptions link files not in the tree / leftover Out of scope still unowned later after Restates (delete, drag, pan, moving Slices; leftover remaining Adds after a comma; packed Undo onto canvas; Command Description / Command Field after rewriting only that sibling; appending is inspect-rest.md after stays later) / Out of scope unnamed stay later for a released spec (`Description and Fields stay later` vs inspect-description / inspect-fields; dropping inspect-connection.md / inspect-after-reload.md so Click-created Command → Event inspect / Name after reload is unnamed later) / leftover locked claims in a restated system spec (Tokens ochre/terracotta are the mark while Mark restated to ink/accent) | `keeping-specs-current` |
| 303/redirect AC vs a shows bullet on the same path | `keeping-specs-current` |
| product.md leftover locked words / later-slice Playwright `add a slice` / leftover sibling Playwright paths dropped when appending this slice's paths (concatenated locked bullets `stay later- Move slices`) / leftover released `Inspect a Slice; edit Slice type` in the stay-later list / leftover dashed-add clicks / selected-Slice keys other than ⌥⌘2 after Restates claims dashed Add / ⌥⌘1–5 / leftover Showing dashed lane buttons stay later when HEAD creates those named buttons / leftover `reason on the source stay later` when HEAD shows leftover Mac pairs' copy in the source listitem / leftover Restates quoting old product.md Playwright / leftover Restates of product.md after unsplit (pinch pan … are canvas-rest.md) / jammed Restates (`this slice.- [other.md]`) / leftover Document flow schema-reject (Export `{title}` / GET heading / team-list as JSON title when persist is `#event-model-document` only) / leftover Editor (Mac parity) after restating Testing highlighting / leftover Editor drag/delete/undo / leftover Document flow Mac-like undo / leftover Testing Unit mutations / leftover Testing Unit Playwright assignment that omits this slice / copying a schema file instead of restating / Next slice still names a released slug / removing product.md from Restates | `keeping-specs-current` |
| Problem names later-slice as current (⌘+/⌘-/⌘0; Backspace Command/Connection; Command drag / sidebar reorder while product.md keeps those later) | `keeping-specs-current` |
| Domain terms line without a `CONTEXT.md` entry / adding a CONTEXT.md heading | `keeping-specs-current` (load `domain-modeling`), `domain-modeling` |
| Independently revertible ACs / grouping by screen / spec-only / fromKind vs toKind / copy vs splice (Command drag push then last is []) / reconstruct after tests-after / kind-gated if-arms (COMMAND vs EVENT alreadyConnected) / shared helper to keep two checkboxes / withhold unique production (status already sending content-type; stylesheet already applying paper; shared helper landing later route ACs) | `logical-commits` |
| Tests-after / production that landed as a dependency / tests-only commit on top / review-strengthened tests after production landed / one-item Backspace tests-only follow-up / unique assertion after weaker `includes scale(` production / folding tests-after into sibling production / click-path production after field tests / follow-up rewrite onto click path / fold reload when GET already hydrates / tests-only wait-after-open helper / sibling locator / fixture wait after a second matching New Slice as tests-only / sibling-kind copy of a kind-agnostic insert as tests-only / extra ACs another spec already owns (horizontal wheel / pinch pan when canvas already owns Timeline wheel deltaX) / follow-up reply is not a rebase | `logical-commits`, `receiving-code-review` |
| Review-thread batch / commit subject names two threads with "and" (leftover-hide unbindAddField vs unbindFieldName; Restates leftover docs with a production restore; Card/Field Restates leftover vs PNG mark) | `logical-commits` |
| Extra visible chrome / document title / extra form or link or extra nav on a route / extra stylesheet on an Out of scope route / global CSS restyle of existing controls / UI that claims compose of primitives without ACs (Page ink on Login/404/expired; leftover paper ink-paper on body.login) / extra inspect of Out of scope kinds (leftover Add Field / Field name after insert-if-missing switch; leftover Field type / Optional / Example / Delete Field after unbindFieldName-only; leftover Actor / Slice Field chrome after dropped sibling unbind; GET-rendered Description / Add Field when ACs only name Name) / hardcoded create-title Name after fill heading / extra Delete key when AC names only Backspace / `textContent` wipe of released nested `Command port` / extra host observability without an AC | `keeping-specs-current` |
| Playwright wait after open (editor bound / networkidle) / New Slice / named Ports / force hover flagged as extra chrome | `keeping-specs-current`, `playwright-e2e` |
| Omitted sibling kinds (Event reload-lists; Event / Read Model same-port copy; Event / Read Model onto Actor / Automation / Slice; Event → Read Model duplicate of a kind-agnostic refuse; Event → Read Model Connection after reload when ACs only cover Command → Event) | `keeping-specs-current` |
| In-session visible text when the AC is accessible name | `keeping-specs-current` |
| Extra R2 put / D1 insert / store write after a refuse without an AC that asserts the stored body | `keeping-specs-current`, `testing` |
| Leftover success-arm after a refuse | `keeping-specs-current` |
| Playwright workers / test-runner isolation without a spec sentence / checkout-unique PORT / INSPECTOR_PORT | `keeping-specs-current`, `playwright-e2e` |
| Mail subject / From display name without a spec sentence | `keeping-specs-current`, `testing` |
| `run_worker_first` path list vs architecture Compute row | `keeping-specs-current`, `testing` |
| How agents write docs | this skill |
| Spec tree location / vendor plan dirs / `docs/superpowers/` | this skill, `keeping-specs-current` |
| Product architecture / UI kit / telemetry / domain rules | the product skill that owns that fact — add a row here when you add that skill |

Completion: `git diff` shows spec + skill together when the procedure changed.

## Pointers

A **context pointer** (skill `description`, or an `AGENTS.md` line) names out-of-context material and the **branches** that should load it.

- Front-load the leading word.
- One trigger per distinct branch. Collapse synonyms.
- Do not repeat identity the body already carries.

## Two loads

- **Context load** — always-on: `AGENTS.md`, every skill description.
- **Cognitive load** — the human must remember a doc that has no pointer.

Put procedure behind a skill. Keep `AGENTS.md` as iron laws + pointers.

## Hierarchy

1. In-file steps (what to do, in order), each with a **completion criterion** (done vs not-done, exhaustive).
2. In-file reference (rules consulted on demand).
3. Disclosed reference (sibling file, loaded only when that branch fires).

Inline what every branch needs. Disclose what only some branches need.

## Levers

- **Leading words** already in the model (`seam`, `red`, `released`) beat coined jargon.
- **One home per fact.** Specs own product facts. Skills own procedures. `AGENTS.md` points.
- **Environment is truth** for scripts and versions (`package.json`). Do not cache them here.
- **Positive instructions.** State the target behaviour. A ban earns its place only as a hard guardrail, paired with the target.
- **Prune** no-ops and sediment. If a sentence does not change behaviour versus the default, delete the sentence.

## This pack's homes

- Skills: `.agents/skills/<name>/SKILL.md`
- Named agents: `.agents/agents/<name>/AGENT.md`
- Always-on: `AGENTS.md`
- Specs: `docs/specs/` (system) and `docs/specs/features/` (slices). ADRs: `docs/adr/`
- Do not add a parallel vendor directory (`docs/superpowers/` or any other spec/plan tree). Feature work is `releasing-a-spec`. The feature spec is the work list.
