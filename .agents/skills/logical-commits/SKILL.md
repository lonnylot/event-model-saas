---
name: logical-commits
description: >
  Use when a spec criterion goes green, when finishing a slice, before
  opening or updating a pull request, when deciding whether to commit,
  when grouping by screen, when independently revertible ACs share a
  commit, when a spec-only commit lists every AC, reconstruct after
  tests-after already landed, when production
  landed as a dependency of another AC, when several review threads
  share a commit (leftover-hide unbindAddField vs unbindFieldName),
  when a commit subject names two threads with "and",
  when folding tests-after into a sibling production commit,
  when adding a tests-only commit on top after review,
  when a review strengthens tests for ACs whose production already landed,
  when a one-item Backspace / weaker-fixture review lands tests-only after production,
  when a unique assertion (factor is not 1) is restated after weaker includes scale( production landed,
  when click-path production lands after field AC tests,
  when a follow-up rewrites tests onto the click path,
  when fromKind and toKind share a commit,
  when a toKind commit already copies toKind for every target,
  when a reload-lists AC would be green without new production,
  when GET already hydrates that field,
  when a tests-only Playwright wait / wait-after-open helper lands on top of
  AC commits,
  or when a dedicated
  test or Playwright flow would land after its production.
---

# Logical commits

One commit is one finished thought: one spec criterion (or one review/CI fix) with its spec, tests, and code together. Independently revertible production hunks are separate commits even on one screen. A spec-only commit that lists every AC is not a slice.

## When to commit

- A `tdd-loop` criterion is GREEN and the spec matches the code
- A single review thread or a single CI cause is fixed and green
- Spec status flip (`validated` / `released`) after the gate that allows it
- One production change several named screens mount, plus the shell it left — splitting those routes is empty / tests-after
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
3. Commit spec + tests + production code together. Completion: `git show --stat` lists all three when all three changed. A later test-only commit for a criterion whose production already landed is tests-after — not a logical slice. A later production-only hunk for a criterion whose tests already landed (click-path object in a reload commit while field ACs tested an unused module) is the same miss. Independently revertible production hunks belong in that AC's commit. A Playwright flow (or any dedicated test) in a later commit than the production that implemented that criterion is the same miss, even after the PR is open. A later tests-only helper that adds wait after open / wait after click for ACs whose Playwright already landed is tests-after — reconstruct that wait into each AC's production+Playwright commit. Folding the helper onto HEAD does not reconstruct it. When splitting status vs content-type, the status commit must not already send that header — otherwise the content-type commit is test-only (land 201 without the header, then the content-type commit adds it with its test, same as 303 then Location). Do not split an early-return reject (returns 400 and does not insert / does not put / leaves version N) into two commits if they share one production path — those packed words are one criterion (`testing`). When splitting fromKind vs toKind (or any copied field), the first commit must not already copy that field for every target — land EVENT `toKind` only, then READMODEL with its test, same as 201 without the header. fromKind EVENT and toKind READMODEL are independently revertible — two commits, not one drag. Client `fetch` in `public/*.js` that a Playwright flow needs is that flow's production; landing it under a mail-subject (or other sibling) commit makes the flow commit Playwright-only.

   If tests-after already landed, do not add another test-only commit. If the test commit is already the next commit, fixup onto the production commit. If it is not consecutive, do not cherry-pick the old patch (end-of-file `it()` context will conflict): from current HEAD, append that `it()` onto the production commit, then drop the later test-only commit. A subject that names two ACs with "and" is two commits; each still needs its production hunk. Completion: `git log -p` shows that criterion's test in the same commit as its production; no follow-up on top of HEAD "folds" tests-after.

Prefer conventional prefixes (`feat`, `fix`, `docs`, `test`, `refactor`, `chore`). The subject (and body if needed) states what changed. Specs do not keep a Changelog section.

When a later checkbox's proof stays green with no new production (GET already hydrates Slice `title` as the Slices listitem from editor-shell; Actor `name` as the Timeline listitem from blocks), that checkbox is not independently revertible — fold the proof into the commit that wrote the field, or do not split the bullet. A dedicated reload commit is tests-after. When a production hunk must exist so a later AC can run (Worker `name` so assets serve), that hunk is its own criterion: spec checkbox + test + production in one commit **before** the dependent AC. Do not wait and add the test later. A follow-up that rewrites those tests onto the click path is still a follow-up — rebase so each field AC's test and the production the click uses land together. Folding several tests-after into one sibling production commit is grouping, not one slice — each test moves into the production that made **that** bullet true. A lock that exists in the tree is not a logical slice.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll commit once at the end" | One blob cannot be reviewed or reverted per criterion. |
| "I'll add the test now, rebase later" | A tests-only commit on top is still tests-after. Reconstruct now. |
| "I'll fix the click path in a follow-up" | A follow-up cannot un-do tests-after. Rebase so each field AC lands with that production. |
| "Checkpoint before I forget" | Unfinished slices are not logical. Finish GREEN, then commit. |
| "Spec in a follow-up commit" | Same-commit spec update is the iron law. |
| "One screen is one commit" | Grouping by screen is the miss. Split independently revertible ACs. |
| "One drag is one commit" | fromKind vs toKind are two checkboxes. Land EVENT toKind only, then READMODEL. Leftover-hide `unbindAddField` vs `unbindFieldName` is the same split. |
| "Reload is a second checkbox so a second commit" | GET already hydrates that field. Fold the proof or unsplit the bullet. |
| "Spec first, then one feat" | Spec hunk lands with the first production that implements it. |
| "I'll fold tests-after in a follow-up on top of HEAD" | Reconstruct into the production commit. A follow-up cannot un-do tests-after. |
| "I'll add the wait helper now, reconstruct later" | A tests-only wait-after-open helper on HEAD is tests-after. Reconstruct now. |

## Red flags

Empty or "WIP" messages on a PR. Default-branch commits for a feature. Code committed without the spec hunk that describes it. Dedicated tests in a follow-up commit after the production that needed them. A follow-up on top of HEAD to "fold" tests-after. Production that landed early as a dependency, then a later test-only commit for that criterion. One commit that ships several independent ACs together. One commit that batches several review-thread fixes (leftover-hide `unbindAddField` vs `unbindFieldName`). A commit subject that names two new ACs or two review threads with "and". Spec-only then one feat. Grouped by screen. fromKind and toKind in one commit. A toKind commit that already copies toKind for every target, so the next toKind AC is test-only. A tests-only reload commit when GET already hydrates that field. A tests-only commit added after review is still tests-after. A tests-only wait-after-open helper on HEAD is tests-after. Folding that helper onto HEAD does not reconstruct it. A follow-up that rewrites tests onto the click path is still a follow-up. Folding several tests-after into one production commit is still grouping. Folding a no-unique-production proof into the commit that wrote the field is not grouping.
