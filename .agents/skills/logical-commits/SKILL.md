---
name: logical-commits
description: >
  Use when a spec criterion goes green, when finishing a slice, before
  opening or updating a pull request, when deciding whether to commit,
  when grouping by screen, when independently revertible ACs share a
  commit, when a spec-only commit lists every AC, when production
  landed as a dependency of another AC, when several review threads
  share a commit, when a commit subject names two threads with "and",
  when folding tests-after into a sibling production commit,
  when adding a tests-only commit on top after review,
  when click-path production lands after field AC tests,
  when a follow-up rewrites tests onto the click path,
  when an early-return 400 and does not create share a commit,
  when fromKind and toKind share a commit,
  when a toKind commit already copies toKind for every target,
  or when a dedicated test or
  Playwright flow would land after its production.
---

# Logical commits

One commit is one finished thought: one spec criterion (or one review/CI fix) with its spec, tests, and code together. Independently revertible production hunks are separate commits even on one screen. A spec-only commit that lists every AC is not a slice.

## When to commit

- A `tdd-loop` criterion is GREEN and the spec matches the code
- A single review thread or a single CI cause is fixed and green
- Spec status flip (`validated` / `released`) after the gate that allows it
- A dependency production hunk (Worker `name` so assets serve) with its test — see below. Not every AC on one HTML page: four independently revertible ACs on one GET `/app` (Team name, Create team, Sign out, Teams admin) are four commits. Five ACs on GET `/app/teams/{id}/models/{mid}` (heading, email, Save, Export, Sign out) are five.

## When not to commit

- Tests are red (except a human-requested WIP, which is not a release commit)
- Two unrelated criteria in one tree
- One screen commit that lands multiple independent ACs
- Grouping by screen
- Several review threads in one tree
- A spec-only commit that lists every AC
- Secrets, `.env`, or credentials
- On the default branch for feature work — branch first (`github-ci-loop`)

## How

1. `git status` and `git diff`. Stage only this slice.
2. Message names the criterion or review thread: `feat(orders): total stays within ±5%`. A subject that names two new ACs or two review threads with "and" is two commits.
3. Commit spec + tests + production code together. Completion: `git show --stat` lists all three when all three changed. A later test-only commit for a criterion whose production already landed is tests-after — not a logical slice. A later production-only hunk for a criterion whose tests already landed (click-path object in a reload commit while field ACs tested an unused module) is the same miss. Independently revertible production hunks belong in that AC's commit. A Playwright flow (or any dedicated test) in a later commit than the production that implemented that criterion is the same miss, even after the PR is open. When splitting status vs content-type, the status commit must not already send that header — otherwise the content-type commit is test-only (land 201 without the header, then the content-type commit adds it with its test, same as 303 then Location). When splitting status vs side-effect (400 vs does not create, 400 vs leaves version `1`, 400 vs leaves R2 unchanged), the 400 commit must not already skip the write — persist-then-400 (insert, then return 400), then the side-effect commit skips the write. An early-return reject is not one commit when the spec has two checkboxes. When splitting fromKind vs toKind (or any copied field), the first commit must not already copy that field for every target — land EVENT `toKind` only, then READMODEL with its test, same as 201 without the header. fromKind EVENT and toKind READMODEL are independently revertible — two commits, not one drag. Client `fetch` in `public/*.js` that a Playwright flow needs is that flow's production; landing it under a mail-subject (or other sibling) commit makes the flow commit Playwright-only.

Prefer conventional prefixes (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`). The subject (and body if needed) states what changed. Specs do not keep a Changelog section.

When a production hunk must exist so a later AC can run (Worker `name` so assets serve), that hunk is its own criterion: spec checkbox + test + production in one commit **before** the dependent AC. Do not wait and add the test later. If tests-after already landed, rebase so the test moves into that production commit; a follow-up commit on top cannot un-do tests-after. A follow-up that rewrites those tests onto the click path is still a follow-up — rebase so each field AC's test and the production the click uses land together. Do not add another tests-only commit on top. Folding several tests-after into one sibling production commit is grouping, not one slice — each test moves into the production that made **that** bullet true. A lock that exists in the tree is not a logical slice.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll commit once at the end" | One blob cannot be reviewed or reverted per criterion. |
| "I'll add the test now, rebase later" | A tests-only commit on top is still tests-after. Rebase now. |
| "I'll fix the click path in a follow-up" | A follow-up cannot un-do tests-after. Rebase so each field AC lands with that production. |
| "Checkpoint before I forget" | Unfinished slices are not logical. Finish GREEN, then commit. |
| "Spec in a follow-up commit" | Same-commit spec update is the iron law. |
| "One screen is one commit" | Grouping by screen is the miss. Split independently revertible ACs. |
| "Early-return 400 is one commit" | Two checkboxes (400 vs does not create) are two commits. Persist-then-400, then skip the write. |
| "One drag is one commit" | fromKind vs toKind are two checkboxes. Land EVENT toKind only, then READMODEL. |
| "Spec first, then one feat" | Spec hunk lands with the first production that implements it. |

## Red flags

Empty or "WIP" messages on a PR. Default-branch commits for a feature. Code committed without the spec hunk that describes it. Dedicated tests in a follow-up commit after the production that needed them. Production that landed early as a dependency, then a later test-only commit for that criterion. One commit that ships several independent ACs together. One commit that batches several review-thread fixes. A commit subject that names two new ACs or two review threads with "and". Spec-only then one feat. Grouped by screen. fromKind and toKind in one commit. A toKind commit that already copies toKind for every target, so the next toKind AC is test-only. A follow-up cannot un-do tests-after or a review-thread batch — rebase so each AC (and each thread) is one commit. A tests-only commit added after review is still tests-after. A follow-up that rewrites tests onto the click path is still a follow-up. Folding several tests-after into one production commit is still grouping.
