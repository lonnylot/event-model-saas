# Event Model SaaS

Teams sign in, own Event Models together, and edit one model as a group on event-model.lonnylot.com.

This file and `.agents/` are the only project agent instructions. They are harness-agnostic.

## New agents — start here

1. Read this file, then `CONTEXT.md`, then `docs/specs/README.md`.
2. Treat specs as the product. Code is an implementation of a spec. A change that is not in a spec is unfinished.
3. Load the skill for the work you are doing **before** you edit code (table below). Skills live in `.agents/skills/`. Named agents live in `.agents/agents/`. If `.agents/skills/<name>/PRODUCT.md` exists, load it with that skill. Same for `.agents/agents/<name>/PRODUCT.md`.
4. If you cannot name the spec file you are implementing or updating, stop and write or find it under `docs/specs/` (or `docs/adr/`). Do not write `docs/superpowers/` or any other vendor spec/plan tree.

After ten minutes you should be able to answer: what outcome this app exists for; which spec is source of truth for the current task; what must never ship (unspecced behavior, untested behavior, silent actions).

## Spec-first (iron law)

```
NO BEHAVIOR WITHOUT A SPEC.
NO CODE CHANGE WITHOUT THE MATCHING SPEC UPDATE IN THE SAME COMMIT.
NO FEATURE WORK ON THE DEFAULT BRANCH.
NO SHIP UNTIL CI IS GREEN, A SEPARATE REVIEWER APPROVES THIS HEAD, AND THE RELEASE GATE IS CLEAN.
```

- Write or update the spec **before** production code.
- Keep the spec **current**: if implementation teaching contradicts the spec, fix the spec in the same logical commit (or revert the code).
- A stale spec is a defect. Discovering drift and leaving it is a failed task.
- Status lives on the spec: `draft` → `validated` → `released`. Only `validated` specs may be implemented. Only `released` specs may be called done.
- A spec change that changes **how work is done** updates the matching skill in the same change (`writing-for-agents`). Event Model instances of that procedure go in that skill's `PRODUCT.md`, not in the portable `SKILL.md`.

**REQUIRED:** `keeping-specs-current` on every behavior change. **REQUIRED:** `releasing-a-spec` when taking a spec from idea to ship (orchestrator: validate, dispatch `spec-implementer`, review, dispatch `release-manager`). **REQUIRED:** `verification-before-completion` before any done/green/released claim. The orchestrator session does not write production code. Look-may-grow skips a new *validate* of look chrome, not `spec-review-loop` or `release-manager`. Screenshot-and-iterate is `spec-implementer`.

### Where truth lives

| Kind | Path | Owns |
|------|------|------|
| Ubiquitous language | `CONTEXT.md` | Domain terms only. No implementation. |
| Spec catalog | `docs/specs/README.md` | Index + status of every spec. |
| Architecture | `docs/specs/architecture.md` | Stack, modules, seams. |
| Product | `docs/specs/product.md` | Locked v1 decisions and spec slices. |
| Feature specs | `docs/specs/features/<slug>.md` | One vertical slice. Template: `docs/specs/features/_TEMPLATE.md`. |
| Design system | `docs/specs/design-system.md` | Tokens and primitives. |
| Hard decisions | `docs/adr/NNNN-slug.md` | Irreversible trade-offs only. |
| Procedures | `.agents/skills/*/SKILL.md` | How to write, test, review, and release (spec-loop). |
| This product | `.agents/skills/*/PRODUCT.md` | Event Model catalogs for that skill. Load with the skill. Same for `.agents/agents/*/PRODUCT.md`. |
| Named agents | `.agents/agents/*/AGENT.md` | Roles: `spec-implementer` (resume per spec), `spec-reviewer` (fresh each dispatch), `release-manager` (merge), `post-merge-improver`. |

Add product-owned system specs (architecture, business, testing, design, observability) to this table when those files exist. Environment (`package.json`, configs, CI workflows) owns installed versions, scripts, and CI. Specs do not cache that.

## Skills

Load the matching skill **before** the work. Do not re-derive the procedure from this file. Load that skill's `PRODUCT.md` when the file exists.

| Skill | Reach for it when |
|-------|-------------------|
| `keeping-specs-current` | Any behavior change; suspected spec drift; leftover sections after restating an AC; leftover inspect-rest Type AC after restating GET Type of one Slice / first of two (Create + New Slice + the New Slice listitem vs one Slice); leftover Problem after restating an AC; leftover Restates after restating Out of scope; leftover Assumptions after restating Out of scope Connection delete stay delete-blocks; leftover locked claims in a restated system spec; leftover `product.md`; that Slice; GET after Create one seeded Actor / one Automation after Add+Save+reload; extra R2/D1; 303 vs shows; `run_worker_first`; `docs/superpowers/`; leftover merge marker / `<<<<<<<` in catalog; UA-default / inherited computed color; leftover signed-in Page ink/type / Send invite radius / Field fill / Card padding; leftover waitlist Card vs waitlist-band; leftover paper Page assigned to visual-shell; Restates omits draft architecture CSS assignment; leftover Unique look picker lead `<p>` after header wrap; extra viewport on sibling HTML is look shell; leftover Assumptions 576px/36px after restated 56px/none; leftover editor-shell empty Inspector; Restates omits public-face leftover unused `.bento` fill/lift; leftover Restates design-system.md Tokens stay that file / UI inventory is not a rewrite; Restates lists inspect-connection / inspect-rest / slice-type / inspect-fields without rewriting leftover unused after a Connection click; Restates lists port-fit.md / connections.md without rewriting wrapping / same-row; Restates lists hydrate-board / inspect-after-reload / name-binding-rest / delete-rest / model-defaults without rewriting leftover GET Actor Name JSON / data-id / Backspace / last-of-kind; leftover unused measure-landing; leftover Problem browser chrome after restated URL bar; leftover Problem three bento cards after restated stacked rows; leftover Problem names only Command vs ACs Event / Read Model / Automation; leftover Problem names Connection leftover Type vs unique production Command → Event Happened only; leftover Problem names only Field name vs ACs Field type / Optional / Example / Delete Field; leftover Problem names leftover Add Field vs unique Nothing Selected (`:has(label)` empty copy); leftover Problem leftover Inspector Name / Add Field vs unique Type after Actor / Event / Read Model / Automation Backspace; nameInput remove / unbindFieldChrome extra; leftover Problem names Event → Read Model Backspace JSON and caption vs unique `connections` []; extra `.board` caption `node?.remove()` without caption AC; leftover Problem names only Slice leftover Name/Type vs ACs Actor leftover Name after empty `.board`; leftover Problem names Automation rename vs unique GET Actor Name JSON; leftover Restates Name JSON on those GET listitems vs Out of scope GET Automation Name JSON; leftover Restates GET Connection data-id / Backspace vs unique Command → Event Happened / parked Event Happened → Read Model; leftover Add Field after that Backspace after inserting after-delete parent Slice for Actor / Event / Read Model / Automation (inspect-after-delete owns Command only); leftover product.md the selected Connection (Backspace) / leftover Delete Connection are delete-blocks vs unique Event → Read Model Backspace; leftover architecture Inspector unbind on selection change vs leftover Type after a Connection click; leftover To Read Model after From-only remove; leftover Field name after narrower unbindAddField; TIME chrome / `.time-chrome` parked in Assumptions; Event → Read Model parent parked in Assumptions; leftover unused sibling of `.board` vs ⇧⌘Z redo `timelineEl.append`; leftover unused wrap vs deleted flex-wrap: nowrap; Restates omits hydrate-board leftover Out of scope covering TIME chrome; Restates omits editor-bind-split leftover Out of scope ⌘S Save; Restates omits editor-shell leftover Out of scope unqualified Slice type after reload / Description after reload parked on inspect-rest; Restates omits inspect-after-reload leftover Description after reload parked on inspect-rest; Restates omits inspect-after-reload leftover unqualified Command Description after reload / Command Field after reload parked on inspect-rest; Restates omits rewritten model-defaults.md first-of-two Automation Description / cargo-cult park of GET first-of-two Automation Description on Create's seeded-Actor spec (inspect-get-read-model did not rewrite that file); Restates omits port-wrap / inspect-switch leftover Out of scope Narrow viewport; Restates omits inspect-connection-live-titles / port-highlight leftover Out of scope Connection redo of a selected pair; leftover Restates Timeline clip overlapping timeline-clip.md pan/zoom clip; leftover Zoom in `includes scale(1.25)` overlapping restated editor-shell exact `.board` `scale(1.25)`; extra Timeline `toBeVisible` overlapping editor-shell GET Timeline; leftover Out of scope GET ports after reload vs in-memory title-only listitems; leftover unused GET ports after reload vs no new in-memory listitem path (hydrate-add-field; port-wrap CSS restyle of existing Add Event listitems; shortcut-target retarget existing ⌥⌘2 listitem); leftover unused cargo-cult Out of scope Inspector leftover Type vs inspect-switch / Leftover Add Field after Event Happened → Read Model vs inspect-event-read (hydrate-connection-id / hydrate-event-read-id hydrate data-id; shortcut-target retarget existing ⌥⌘2 listitem); leftover Out of scope targeting vs lastLaneList vs selectedSliceIndex; leftover Out of scope Changing which Slice dropped lastLaneList parenthetical vs shortcut-shows / same-file Assumptions; leftover Out of scope inspect-after-reload vs in-memory omit data-kind; leftover GET `.slice-stack` vs later-sibling Assumptions; leftover Restates editor-bind-split GET Field of first of two Read Models twice in the same paragraph; leftover Restates inspect-blocks.md / inspect-fields.md already park Example after reload of one Event vs inspect-get-event-optional / hydrate-add-field.md same prior park |
| `writing-for-agents` | Editing AGENTS.md, skills, or agents; spec changed a procedure; harvest into `PRODUCT.md` vs portable `SKILL.md` |
| `domain-modeling` | New or conflicting domain term; CONTEXT.md; ADR |
| `codebase-design` | Module shape, seam, adapter, depth; architecture adapter only under a test flag; injected `env.documents` |
| `testing` | Test placement, seams, mapping criteria, weaker-reading fixtures, early-return "and" that should stay one criterion; Playwright `exact: true`; R2/D1 stored body; that Slice; GET after Create one seeded Actor / one Automation after Add+Save+reload; fromKind vs toKind; UA-default / inherited `toHaveCSS`; `:focus-visible` `locator.focus()`; Timeline `[\s\S]*` Actor; TIME chrome / `.time-chrome` Timeline no-translate; Event → Read Model `.board` vs Command → Event Happened `.board`; leftover unused sibling vs redo Timeline-shows; lastLaneList vs selectedSliceIndex one-slice Create-default; leftover Out of scope inspect-after-reload vs in-memory omit data-kind; Timeline `toBeVisible` at 390 / below the fold; Nothing Selected / `:has(label)` leftover Add Field button; leftover Name / Add Field vs unique Type after Actor / Event / Read Model / Automation Backspace; leftover GET `.slice-stack` vs later-sibling Assumptions; wrap CSS is GET caption production; Event → Read Model Backspace JSON `connections` [] vs `.board` caption packed "and" |
| `tdd-loop` | Implementing or fixing; before production code; host-path constructor; orchestrator about to write production code; empty stub `it`; UA-default / inherited `toHaveCSS`; `:focus-visible` `locator.focus()`; Timeline `[\s\S]*` Actor; TIME chrome / `.time-chrome` Timeline no-translate; Event → Read Model `.board` vs Command → Event Happened `.board`; leftover unused sibling vs redo Timeline-shows; leftover Out of scope GET ports after reload vs in-memory title-only listitems; leftover unused GET ports after reload vs no new in-memory listitem path (hydrate-add-field; port-wrap CSS restyle of existing Add Event listitems; shortcut-target retarget existing ⌥⌘2 listitem); leftover unused cargo-cult Out of scope Inspector leftover Type vs inspect-switch / Leftover Add Field after Event Happened → Read Model vs inspect-event-read (hydrate-connection-id / hydrate-event-read-id hydrate data-id; shortcut-target retarget existing ⌥⌘2 listitem); leftover Name / Add Field vs unique Type after Actor / Event / Read Model / Automation Backspace; GET after Create one seeded Actor / one Automation after Add+Save+reload; lastLaneList vs selectedSliceIndex one-slice Create-default; leftover Out of scope inspect-after-reload vs in-memory omit data-kind; Timeline `toBeVisible` at 390 / below the fold; Nothing Selected / `:has(label)` leftover Add Field button; leftover GET `.slice-stack` vs later-sibling Assumptions; wrap CSS is GET caption production; Event → Read Model Backspace JSON `connections` [] vs `.board` caption packed "and" |
| `logical-commits` | A criterion is green; deciding whether / what to commit; reconstruct after tests-after in the TDD slice; review-thread commit; unsplit leftover checkboxes; fromKind vs toKind; leftover-hide From Event Happened vs To Read Model; leftover-hide unbindAddField vs unbindFieldName; leftover-hide unbindFieldChrome vs Nothing Selected (`:has(label)` empty copy); leftover-hide nameInput / unbindFieldChrome vs Type insert after Actor / Event / Read Model / Automation Backspace; tests-only after review of leftover-hide; Event → Read Model Backspace JSON `connections` [] vs `.board` caption `node?.remove()` persist-then analog; leftover-hide From Command vs To Event Happened vs Connection; Event → Read Model parent vs Command → Event Happened parent; leftover unused sibling vs unique redo parent; GET already hydrates; GET /editor.js lock vs bindInspect extract; extra ACs folded into sibling unique production (UA-default fill / inherited heading); leftover Restates vs unique Send invite radius; extra viewport on sibling HTML is look shell; leftover Zoom in `includes scale(1.25)` overlapping restated editor-shell exact `.board` `scale(1.25)`; extra Timeline `toBeVisible` overlapping editor-shell GET Timeline; GET Command vs GET Event caption wrapping; wrap CSS is GET caption production |
| `github-ci-loop` | Starting work; branching; opening a PR; waiting on CI; checks never started; unmergeable PR; rebase onto default |
| `spec-review-loop` | PR exists; merge/release; resume after context compaction; rebase voids Approve |
| `post-merge-improvement` | PR just merged; learn from review into skills/docs; product-instance harvest into `PRODUCT.md` |
| `receiving-code-review` | Implementing or pushing back on review comments; extra ACs folded into sibling unique production (UA-default fill / inherited heading); leftover Restates vs unique Send invite radius; `:focus-visible` `locator.focus()`; Timeline `[\s\S]*` Actor; leftover Zoom in `includes scale(1.25)` overlapping restated editor-shell exact `.board` `scale(1.25)`; extra Timeline `toBeVisible` overlapping editor-shell GET Timeline; leftover-hide unbindFieldChrome vs Nothing Selected tests-only after review; GET Command vs GET Event caption wrapping citing one HTML string; wrap CSS tests-after of GET Command `it`; Event → Read Model Backspace JSON vs caption `node?.remove()` tests-only after review |
| `verification-before-completion` | About to claim done, green, fixed, or released |
| `releasing-a-spec` | Given a spec to implement; iterating; validating; shipping; dispatch spec-implementer |
| `parallel-feature-work` | Two or more feature specs at once; separate implementer agents; next-in-line integrate |
| `using-git-worktrees` | Dispatch spec-implementer; isolated checkout for a feat/ branch; parallel agents |
| `playwright-e2e` | Browser user flows; flow CI job; test-server fakes; empty-state reset between files; unique checkout port for flow tests; accessible name **is** X (`exact: true`); UA-default / inherited `toHaveCSS`; `:focus-visible` `locator.focus()`; Timeline `[\s\S]*` Actor; TIME chrome / `.time-chrome` Timeline no-translate; Event → Read Model `.board` vs Command → Event Happened `.board`; leftover unused sibling vs redo Timeline-shows; GET after Create one seeded Actor / one Automation after Add+Save+reload; lastLaneList vs selectedSliceIndex one-slice Create-default; Timeline `toBeVisible` at 390 / below the fold; Nothing Selected / `:has(label)` leftover Add Field button; leftover Name / Add Field vs unique Type after Actor / Event / Read Model / Automation Backspace; leftover GET `.slice-stack` vs later-sibling Assumptions; wrap CSS is GET caption production; Event → Read Model Backspace JSON `connections` [] vs `.board` caption packed "and" |
| `visual-design` | Restyling named screens; look may grow (heading/image/static page ACs in the same commit — still `spec-implementer` then `spec-review-loop`); padding/type/layout without a computed-CSS catalog; wrapping signed-in AppBar leads in `header` (Unique look); leftover Unique look picker lead `<p>`; extra viewport on sibling HTML is look shell; webfont / type token vs type scale / Google Fonts Inter |

Handed a spec, or asked to implement/ship: `releasing-a-spec` (orchestrator). Two or more specs this session, or next-in-line integrate: `parallel-feature-work` first. Implementing any slice, including look / screenshot-and-iterate: dispatch `.agents/agents/spec-implementer/AGENT.md` (`tdd-loop` and `visual-design` live there). Isolated tree: `using-git-worktrees` for every implementer. After the first green commit: `spec-review-loop` (fresh `spec-reviewer` every dispatch; resume the implementer on Changes requested). Ready to merge: dispatch `.agents/agents/release-manager/AGENT.md`. After merge: `post-merge-improvement`. Browser flow tests: `playwright-e2e`. Spec changed a procedure: `writing-for-agents`.

## GitHub loop (summary)

Full procedure is in the skills above. The always-on rule:

1. Orchestrator: validate the spec with the user. Stay on the default branch.
2. Worktree + `feat/<slug>` or `fix/<slug>` (`using-git-worktrees`). Dispatch `spec-implementer` there. Resume that conversation for this spec.
3. Implementer: one logical commit per green criterion (spec + tests + code). Open a PR after the first green commit so CI runs on every push. Look-may-grow and screenshot-and-iterate are this step, not the orchestrator session.
4. Orchestrator: dispatch a **separate** `spec-reviewer` on a **fresh** context every time, including look PRs after the first green commit. Same-session self-review does not count. Changes requested → resume the implementer (`receiving-code-review`).
5. Repeat until **Approve** on this HEAD + green checks. Approve is incomplete until leftover review threads are GitHub-resolved (`is_resolved: true`), not just replied.
6. Dispatch `release-manager` to merge, write review-cycle count, and set the spec `released`. Unmergeable: resume `spec-implementer` to rebase onto default, then a fresh `spec-reviewer` (Approve is this HEAD). Then `post-merge-improvement`.

## Invariants

- Specs stay current. Drift is a bug.
- Tests and callers share the same seam.
- Feature work is never committed on the default branch.
- The orchestrator session does not write production code. Dispatch `spec-implementer`.
- Release requires green GitHub CI, a separate reviewer Approve on HEAD, and a clean release gate. Merge is `release-manager`.

## Anti-patterns

| Excuse | Reality |
|--------|---------|
| "Tiny change, skip the spec" | Tiny changes rot the catalog. Update the spec. |
| "I'll document after it works" | After-the-fact docs describe what you built, not what you meant. Spec first. |
| "Tests after is the same" | Tests-after confirm memory. Tests-first specify. Delete untested production code and start RED. |
| "I'll commit once at the end" | One blob cannot be reviewed per criterion. |
| "Work on main, PR later" | No branch, no CI loop. |
| "I'll just implement in this session" | Dispatch `spec-implementer`. The orchestrator does not write production code. |
| "Look-may-grow / screenshot-and-iterate here" | Look-may-grow skips a new *validate*, not the reviewer. Dispatch `spec-implementer`, then `spec-review-loop`. |
| "I'll review my own PR" | Dispatch `spec-reviewer`. Same context is not a review. |
| "I'll merge it myself" | Dispatch `release-manager`. |
| "I'll just resolve the conflict here" | Resume `spec-implementer`. Rebase is coding. |
| "Local is green, skip CI" | GitHub checks on the PR are the shared gate. |
