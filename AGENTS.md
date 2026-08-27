# Event Model SaaS

Teams sign in, own Event Models together, and edit one model as a group on event-model.lonnylot.com.

This file and `.agents/` are the only project agent instructions. They are harness-agnostic.

## New agents — start here

1. Read this file, then `CONTEXT.md`, then `docs/specs/README.md`.
2. Treat specs as the product. Code is an implementation of a spec. A change that is not in a spec is unfinished.
3. Load the skill for the work you are doing **before** you edit code (table below). Skills live in `.agents/skills/`. Named agents live in `.agents/agents/`.
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
- A spec change that changes **how work is done** updates the matching skill in the same change (`writing-for-agents`).

**REQUIRED:** `keeping-specs-current` on every behavior change. **REQUIRED:** `releasing-a-spec` when taking a spec from idea to ship (orchestrator: validate, dispatch `spec-implementer`, review, dispatch `release-manager`). **REQUIRED:** `verification-before-completion` before any done/green/released claim. The orchestrator session does not write production code.

### Where truth lives

| Kind | Path | Owns |
|------|------|------|
| Ubiquitous language | `CONTEXT.md` | Domain terms only. No implementation. |
| Spec catalog | `docs/specs/README.md` | Index + status of every spec. |
| Architecture | `docs/specs/architecture.md` | Stack, modules, seams. |
| Product | `docs/specs/product.md` | Locked v1 decisions and spec slices. |
| Feature specs | `docs/specs/features/<slug>.md` | One vertical slice. Template: `docs/specs/features/_TEMPLATE.md`. |
| Hard decisions | `docs/adr/NNNN-slug.md` | Irreversible trade-offs only. |
| Procedures | `.agents/skills/*/SKILL.md` | How to write, test, review, and release. |
| Named agents | `.agents/agents/*/AGENT.md` | Roles: `spec-implementer` (resume per spec), `spec-reviewer` (fresh each dispatch), `release-manager` (merge), `post-merge-improver`. |

Add product-owned system specs (architecture, business, testing, design, observability) to this table when those files exist. Environment (`package.json`, configs, CI workflows) owns installed versions, scripts, and CI. Specs do not cache that.

## Skills

Load the matching skill **before** the work. Do not re-derive the procedure from this file.

| Skill | Reach for it when |
|-------|-------------------|
| `keeping-specs-current` | Any behavior change; suspected spec drift; leftover sections after restating an AC (Assumptions after Out of scope); omitted sibling kinds (Event reload-lists); in-session visible text when AC is accessible name; leftover Seams after deleting a named module; leftover Seams that name a path production does not call (scroll path / undo those mutations); leftover Seams that name five kinds (chosen-Slice Actor/Command/Event/Read Model/Automation) when ACs only prove Command / ⌥⌘2; Assumptions that park selected-Slice ⌥⌘1–5; Restates omits architecture.md; Restates names a path not in the tree (`canvas-rest.md` / do not edit if not on the branch); leftover Out of scope still unowned later after Restates (delete, drag, pan, moving Slices); leftover locked claims in a restated system spec; Problem names later keyboard zoom as current (⌘+/⌘-/⌘0); 303 vs shows on the same path; packed "and" AC bullets; targeting packed "and" (first Slice has X and last is []) / only-on-the-first-Slice; extra `<title>` or heading or form or link or extra nav or host config; extra inspect of Out of scope kinds (Name on Command / Event); a "that Slice" / Backspace / clicked-item AC with only one item (always-delete-last); extra R2 put without an AC; Playwright workers; Playwright wait for New Slice / named Ports / force hover vs extra chrome; `run_worker_first` vs architecture Compute row; leftover product.md locked words (later-slice `add a slice`, Document flow schema-reject, Restates quoting old Playwright, leftover Editor/Error handling after restating Testing, leftover Editor drag/delete/undo, Document flow Mac-like undo, Testing Unit mutations); copying a schema file instead of restating; host-path construction parked in Assumptions; distinguishing factor parked in Assumptions (factor is not unzoomed pan `1`); `includes scale(` already true of pan `scale(1)`; removing product.md from Restates |
| `writing-for-agents` | Editing AGENTS.md, skills, or agents; spec changed a procedure |
| `domain-modeling` | New or conflicting domain term; CONTEXT.md; ADR |
| `codebase-design` | Module shape, seam, adapter, depth; architecture adapter constructed only under a test flag (R2 / `env.documents`); construction parked in Assumptions |
| `testing` | Test placement, seams, mapping criteria, weaker-reading fixtures (unit `toContain(">X<")` for a named control; unit `not.toContain("<li>X</li>")` for a does-not-show listitem; `includes scale(` / `toContain("scale(")` when canvas pan already writes `scale(1)`); clicking-appends at a function production never calls; dragging-appends unit that passes the kind already in the input; same-control Name values that never select the other entity (Command vs Event / Read Model / Automation); a "that Slice" / Backspace / clicked-item AC with only one item (always-delete-last); packed "and" (status vs content-type vs body vs row vs R2); an early-return "and" that should stay one criterion; a targeting packed "and" (first Slice has X and last is []) / only-on-the-first-Slice; architecture adapter constructed only under a test flag (R2 / `env.documents`); construction parked in Assumptions; architecture-named store untested (each new SQL); success status that never asserts a stored R2 body; empty stub `it` |
| `tdd-loop` | Implementing or fixing; before production code; host-path constructor; orchestrator about to write production code; Playwright `name: X` without exact: true; unit `toContain(">X<")` for a named control; unit `not.toContain("<li>X</li>")` for a does-not-show listitem; `toContain("scale(")` when pan already writes `scale(1)`; clicking-appends at a function production never calls; dragging-appends unit that passes the kind already in the input; pointer-down / Port hover without wait for New Slice or named Ports; force hover vs Timeline pan; lane Add or ⌥⌘1–5 without wait after open (editor bound) or after New Slice; two Name-value ACs that never select the other entity (Command vs Event); targeting packed "and" (first Slice has X and last is []) / only-on-the-first-Slice; a "that Slice" / Backspace / clicked-item AC with only one item (always-delete-last); extra `<title>` or heading or extra nav; Inspector Name on Command / Event; empty stub `it` |
| `logical-commits` | A criterion is green; deciding whether / what to commit; grouping by screen; independently revertible ACs; spec-only; subject with "and"; reconstruct after tests-after; tests-only commit on top; review-strengthened tests after production landed; one-item Backspace tests-only follow-up; unique assertion after weaker `includes scale(` production; folding tests-after into sibling production; click-path production after field tests; follow-up rewrite onto click path; review-thread batch; fromKind vs toKind; copy toKind for every target; fold reload when GET already hydrates |
| `github-ci-loop` | Starting work; branching; opening a PR; waiting on CI; workflow `on:` events; checks never started; unmergeable PR; rebase onto default |
| `spec-review-loop` | PR exists; merge/release; resume after context compaction; rebase voids Approve |
| `post-merge-improvement` | PR just merged; learn from review into skills/docs |
| `receiving-code-review` | Implementing or pushing back on review comments; tests-only follow-up after a weaker-fixture / one-item Backspace thread; unique assertion after weaker `includes scale(` production; targeting packed "and" split into two weaker `it`s |
| `verification-before-completion` | About to claim done, green, fixed, or released |
| `releasing-a-spec` | Given a spec to implement; iterating; validating; shipping; dispatch spec-implementer |
| `parallel-feature-work` | Two or more feature specs at once; separate implementer agents |
| `using-git-worktrees` | Dispatch spec-implementer; isolated checkout for a feat/ branch; parallel agents |
| `playwright-e2e` | Browser user flows; flow CI job; test-server fakes; exact accessible name; exact `test:e2e` script; async fetch wait / last-mail race; wait for New Slice after click; named Ports before pointer-down; force hover vs Timeline pan; lane Add or ⌥⌘1–5 wait after open and after click; empty-state reset between files; Backspace / clicked-item one New Slice (always-delete-last) |

Handed a spec, or asked to implement/ship: `releasing-a-spec` (orchestrator). Two or more specs this session: `parallel-feature-work` first. Implementing any slice: dispatch `.agents/agents/spec-implementer/AGENT.md` (`tdd-loop` lives there). Isolated tree: `using-git-worktrees` for every implementer. Ready to review: `spec-review-loop` (fresh `spec-reviewer` every dispatch; resume the implementer on Changes requested). Ready to merge: dispatch `.agents/agents/release-manager/AGENT.md`. After merge: `post-merge-improvement`. Browser flow tests: `playwright-e2e`. Spec changed a procedure: `writing-for-agents`.

## GitHub loop (summary)

Full procedure is in the skills above. The always-on rule:

1. Orchestrator: validate the spec with the user. Stay on the default branch.
2. Worktree + `feat/<slug>` or `fix/<slug>` (`using-git-worktrees`). Dispatch `spec-implementer` there. Resume that conversation for this spec.
3. Implementer: one logical commit per green criterion (spec + tests + code). Open a PR after the first green commit so CI runs on every push.
4. Orchestrator: dispatch a **separate** `spec-reviewer` on a **fresh** context every time. Same-session self-review does not count. Changes requested → resume the implementer (`receiving-code-review`).
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
| "I'll review my own PR" | Dispatch `spec-reviewer`. Same context is not a review. |
| "I'll merge it myself" | Dispatch `release-manager`. |
| "I'll just resolve the conflict here" | Resume `spec-implementer`. Rebase is coding. |
| "Local is green, skip CI" | GitHub checks on the PR are the shared gate. |
