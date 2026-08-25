---
name: tdd-loop
description: >
  Use when implementing any feature or bugfix, before writing production
  code, when adding an operator CLI or npm script that changes persisted
  state, when constructing an architecture adapter only under a test
  flag, when a Playwright locator uses `name: X` without exact: true,
  when a unit assertion uses `toContain(">X<")` for a named control,
  when a checked AC's it has no assertion,
  when adding a document title or heading or form or link the AC does not name,
  or when the user mentions TDD, red-green-refactor, the build
  loop, or looping.
---

# TDD loop

The build/test loop. Spec criterion first. Then red. Then green. Then one logical commit.

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over. Do not keep it as reference. Do not adapt it.

## When to use

Always for features, fixes, and behavior changes. Exceptions only if the human says so: throwaway prototypes, generated code, config-only files. An operator CLI or npm script that changes persisted state is production code, not config-only.

## Loop

1. **Criterion.** One independent behavior from a `validated` spec bullet (or `draft` only while exploring a test that you will throw away). If the bullet contains "and" (any case) or independent env/branch cases, split — one `it` per case (`testing`). Status vs does-not-create is two cases even when production uses one early return (`logical-commits`: persist-then-400). Completion: test title is that one behavior, not the packed paragraph.

2. **RED.** Load `testing`. Write one failing test at the seam the testing spec (or this pack's default layers) names. An empty `it` (setup, no assertion) is not RED — it stays green if production is deleted. If the criterion is a browser flow, that test is Playwright (`playwright-e2e`) and lands with that production (`logical-commits`). A Playwright locator for accessible name **is** `X` without `exact: true` is the weaker reading (`testing`, `playwright-e2e`). A unit `toContain(">X<")` for a named link, button, or textbox is the weaker reading (`testing`). A hosted path criterion (`GET /app`) is unproven by a handler unit test (`testing`); adding the path to `run_worker_first` restates architecture (`keeping-specs-current`). Run it. Completion: it fails because the behavior is missing, not because of a typo; the assertion would also fail a weaker reading of the criterion (that skill). If it passes, or if swapping in the weaker algorithm would still pass, you tested existing behavior — fix the test.

3. **GREEN.** Smallest code that passes that test. No extra branches, events, or UI. Extra chrome without an AC is `keeping-specs-current`. Extra persistence (R2 `put`) without an AC that asserts the stored body is the same miss (`testing`). A 303/redirect AC contradicts every "shows" bullet on that path (`keeping-specs-current`). A leftover POST that skips the new path is an extra branch — delete it or name it Out of scope (`keeping-specs-current`). Architecture-named adapters (D1, Email, R2) are constructed on the production composition root, not only behind a test flag (`testing`, `codebase-design`). Parking that path in Assumptions is unfinished (`keeping-specs-current`). Run the test (and neighbors you touched). Completion: the test passes; no extra `<title>`, heading, form, or link the AC does not name on that route (`keeping-specs-current`).

4. **Sync.** If the slice taught a tighter rule, update the spec in the same tree (`keeping-specs-current`). A tighter fake / test-double parse is a tighter rule.

5. **Commit.** One logical commit for this criterion (`logical-commits`). Then the next criterion — do not batch. Grouping by screen is batching.

Bugs: write the failing reproduction first, then fix.

Work sits on a feature branch (`github-ci-loop`). After the first green commit, the PR is open so CI runs on every push.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Too simple to test" | The test is shorter than the debug cycle. |
| "I'll test after" | Tests-after describe memory. Delete the code. RED first. |
| "I already clicked through it" | Manual is not replayable. Automate the criterion. |
| "Keep this as reference" | You will adapt it. That is tests-after. Delete. |
| "TDD will slow me down" | Untested behavior ships wrong. |
| "Operator CLI is just a chore script" | It changes persisted state. RED first. |

## Red flags

Code before test. Test passes on first run. Empty `it` for a checked AC. Cannot explain the red. "Just this once."

**All of these mean: delete production code. Start at RED.**
