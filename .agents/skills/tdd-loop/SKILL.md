---
name: tdd-loop
description: >
  Use when implementing any feature or bugfix, before writing production
  code, when adding an operator CLI or npm script that changes persisted
  state, a host-path constructor, the orchestrator is about to write
  production code, when constructing an architecture adapter only under a test
  flag, when a Playwright locator uses `name: X` without exact: true,
  when a unit assertion uses `toContain(">X<")` for a named control,
  when a unit `not.toContain("<li>X</li>")` for a does-not-show listitem,
  when `toContain("scale(")` stays green because canvas pan already writes `scale(1)`,
  when clicking-appends tests call a function production never imports,
  when dragging-appends tests pass the kind already in the input,
  when pointer-down or Port hover skips wait for New Slice or named Ports,
  when Port hover omits force and Timeline pan exists,
  when lane Add or ⌥⌘1–5 skips wait after open (editor bound) or for the New Slice listitem,
  when two Name-value ACs never select the other entity
  (Command vs Event / Read Model / Automation),
  when fill-after-select or toBeVisible stands in for a Description textbox value,
  when a targeting packed "and" (first Slice has X and last is []) should stay one
  only-on-the-first-Slice it,
  when a "that Slice" AC uses only one item,
  when Backspace / clicked-item uses one New Slice (always-delete-last),
  when restating a weaker fixture after production landed,
  when restating a unique factor-not-1 assertion after includes-scale production landed,
  when a checked AC's it has no assertion,
  when adding a document title or heading or form or link or extra nav the AC does not name,
  when Inspector Name shows for Command or Event,
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

If this session is the orchestrator (`releasing-a-spec` dispatching agents), do not run this loop here — dispatch `.agents/agents/spec-implementer/AGENT.md`.

## Loop

1. **Criterion.** One independent behavior from a `validated` spec bullet (or `draft` only while exploring a test that you will throw away). If the bullet contains "and" (any case) or independent env/branch cases, split — one `it` per case — unless they share one early return (`testing`) or are one targeting "only on the first Slice" criterion (first has X and last is []; keep both assertions in that one `it`). Completion: independently revertible cases are one `it` each; a shared early-return or targeting title stays one `it` (those packed words are that one behavior).

2. **RED.** Load `testing`. Write one failing test at the seam the testing spec (or this pack's default layers) names. An empty `it` (setup, no assertion) is not RED — it stays green if production is deleted. If the criterion is a browser flow, that test is Playwright (`playwright-e2e`) and lands with that production (`logical-commits`). After an AC that names an architecture-named production adapter, the RED test must fail if the documented composition root (host `fetch` / `listen` / equivalent) never constructs that adapter. Injecting the runtime is not that proof (`testing`). Copying the constructor identifier into source is a parse test (`testing`). A Playwright locator for accessible name **is** `X` without `exact: true` is the weaker reading (`testing`, `playwright-e2e`). A unit `toContain(">X<")` for a named link, button, or textbox is the weaker reading (`testing`). A unit `not.toContain("<li>X</li>")` for a “does not show a listitem whose accessible name is X” is the weaker reading (`testing`) — it stays green for `<li aria-label="X">`. A Playwright `toContain("scale(")` when canvas pan already writes `scale(1)` is the weaker reading (`testing`) — it stays green if the unique ctrl/meta branch is deleted. A hosted path criterion (`GET /app`) is unproven by a handler unit test (`testing`); adding the path to `run_worker_first` restates architecture (`keeping-specs-current`). A “Clicking X on that page appends …” criterion is unproven by a unit call production never makes (`testing`). A “Dragging from X onto Y appends …” criterion is unproven by a unit call that passes the kind already in the input (`testing`); Playwright `dragTo` or the editor mouseup path is the proof. A pointer-down or Port hover that does not wait for the New Slice listitem after click and the named Ports before pointer-down or drag, or that hovers a Port without `{ force: true }` when Timeline pan exists, races in CI waiting for `Command port` (`playwright-e2e`). Lane Add or ⌥⌘1–5 that does not wait after open for editor bound (`networkidle`), then for the New Slice listitem after click and named lane buttons before asserting, clicking, or pressing keys, races in CI (`playwright-e2e`). Two ACs that set the same control from different selections (Name is `New Slice` vs `Actor`; Command vs Event Happened vs Read Model vs Automation) are unproven by tests that never select the other entity (`testing`); first-click-wins stays green. A Description (or other shared Inspector) value after select is unproven by fill-after-other-select or `toBeVisible` (`testing`); never-assign-value stays green because empty omitted JSON hides a stale previous fill. A “that Slice” / clicked-item / Backspace-the-selected-Slice criterion is unproven by a one-item fixture (`testing`); `.at(-1)` / always-delete-last stays green. Two default-named Slices prove remaining JSON id, not "does not show New Slice". Run it. Completion: it fails because the behavior is missing, not because of a typo; the assertion would also fail a weaker reading of the criterion (that skill); deleting the host-path constructor would fail this test. If it passes, or if swapping in the weaker algorithm would still pass, you tested existing behavior — fix the test.

3. **GREEN.** Smallest code that passes that test. No extra branches, events, or UI. Extra chrome without an AC is `keeping-specs-current`. Inspector Name on a kind Out of scope names inspecting (Command / Event) is extra chrome. Extra persistence (R2 `put`) without an AC that asserts the stored body is the same miss (`testing`). A 303/redirect AC contradicts every "shows" bullet on that path (`keeping-specs-current`). A leftover POST that skips the new path is an extra branch — delete it or name it Out of scope (`keeping-specs-current`). Architecture-named adapters (D1, Email, R2) are constructed on the production composition root, not only behind a test flag (`testing`, `codebase-design`). Parking that path in Assumptions is unfinished (`keeping-specs-current`). Run the test (and neighbors you touched). Completion: the test passes; no extra `<title>`, heading, form, link, or nav the AC does not name on that route (`keeping-specs-current`).

4. **Sync.** If the slice taught a tighter rule, update the spec in the same tree (`keeping-specs-current`). A tighter fake / test-double parse is a tighter rule.

5. **Commit.** One logical commit for this criterion (`logical-commits`). When restating a weaker fixture after production landed (one-item Backspace → two-item remaining JSON id; `includes scale(` → factor is not the unzoomed pan `1`), reconstruct into that production commit — do not commit tests-only on top (`receiving-code-review`). Then the next criterion — do not batch. Grouping by screen is batching.

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
