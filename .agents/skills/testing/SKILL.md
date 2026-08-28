---
name: testing
description: >
  Use when adding or placing tests, choosing seams, writing unit or
  Playwright tests, mapping acceptance criteria to tests, checking a
  weaker-reading fixture, unit `toContain(">X<")` for a named link or button,
  unit `not.toContain("<li>X</li>")` for a does-not-show listitem,
  Playwright "does not show a control named X" querying only button and link,
  Playwright `/^X/` on a listitem that contains Port descendants,
  Playwright toHaveText on a listitem that has descendant Command port,
  `includes scale(` / `toContain("scale(")` when canvas pan already writes `scale(1)`,
  clicking-appends tested at a function production never calls,
  dragging-appends unit that passes the kind already in the input,
  same-control Name values that never select the other entity
  (Command vs Event / Read Model / Automation; first-click-wins / insert-if-missing),
  fill-after-select or toBeVisible for a Description textbox value
  (empty omitted JSON),
  a "that Slice" or clicked-item / "the first X" / first-vs-last AC with only one item,
  Backspace / selected Slice / one New Slice / always-delete-last / .first() / only-last,
  Backspace after reload when GET listitems have no data-id,
  restating a weaker fixture after production landed (tests-only follow-up),
  copy pinned in tests but not the spec, splitting an "and" (any case) test name,
  an early-return "and" that should stay one criterion,
  a targeting packed "and" (first Slice has X and last is []) that should stay one
  only-on-the-first-Slice criterion,
  copy vs splice (Command drag: first Slice has X vs last is []) that is not targeting,
  a host-path constructor weaker fixture,
  status vs content-type vs body, status vs row vs R2, independent env/branch cases, proving a screen/shows
  criterion (not a source grep), computed CSS proven by stylesheet toContain,
  name vs href packed in one tag toContain, leftover test filename after a
  deleted SUT, leftover test title after a restated AC, empty stub it
  for a checked AC, host
  `run_worker_first` wiring, an architecture adapter constructed only
  under a test flag, injected env.documents, construction parked in Assumptions,
  success status or 409 UI that never asserts a stored
  R2 body, extra store write after a refuse,
  an architecture-named store never constructed in a
  test, each new SQL this slice adds untested, or updating a testing spec.
---

# Testing

The product's testing spec owns layers and coverage bars when that file exists. Tests prove spec criteria through public seams.

## When to use

- New test file or test layer
- "What do we test?" / "Do we need e2e?"
- Coverage of a feature spec

## Default layers

If the product has `docs/specs/testing.md`, use that. Otherwise:

| Layer | Proves | Runner |
|-------|--------|--------|
| Domain | Pure logic at a module interface | Unit (read the product's test script) |
| App | Orchestration with fake adapters | Unit + fakes |
| Flow | A catalogued user path in a real browser | Playwright (`playwright-e2e`) |

A criterion that names a screen, "shows", or "lists" is proven at the app or flow layer that fails if that UI is deleted.

## Steps

1. **Quote the criterion.** Open the spec. Write the test name as the criterion. If that name contains "and" (any case) or independent env/branch cases, split into one `it` each — only when the cases are independently revertible production (status vs content-type vs body; membership 404 vs happy path; status vs heading vs row vs R2; two workflow `on:` events and a `run` step). Do not split an early-return reject (returns 400 and does not insert / does not put / leaves version N) into separate ACs if they share one production path: those are one criterion. A targeting AC that packs "first Slice has X and last Slice is []" (lane click / selected-Slice ⌥⌘2) is one criterion — restate as "only on the first Slice" and keep both assertions in that one `it` so append-to-both and append-to-neither fail. Splitting into two `it`s that each drop one side is the weaker reading. Independently revertible copy vs splice (Command drag: first Slice `commands` is one Command vs last is `[]`) is not targeting — copy/push can land without splice (`logical-commits`). Do not restate that drag as one only-on-the-first-Slice bullet. If the next AC would be green without new production, fold the proof into this commit or do not split the bullet (`logical-commits`). A restated weaker fixture (one-item clicked-item / Backspace) after that AC's production landed is reconstruct into that production commit (`logical-commits`, `receiving-code-review`) — a tests-only follow-up is tests-after even when always-delete-last now fails. The assertion must fail a weaker implementation of those words.

   Weaker readings this step exists to catch:

   | Criterion shape | Weaker fixture that must not stay green |
   |-----------------|-----------------------------------------|
   | OR / two parser arms | One fixture both arms can pass |
   | Tie-break | A single row; no second row sharing the primary key |
   | Uniqueness after remove | Sequential add-twice (length reused as id) |
   | ±N% / band | Only one side of the band |
   | Union member on a Result | A typed const assigned the member and asserted equal to itself |
   | "imported only from X" | A walk that skips a sibling directory or a new file in a claimed directory |
   | "a name the previous state did not list" | A name already on the previous fixture |
   | Non-empty placeholder | `/placeholder=/` on `placeholder=""` |
   | One row's own text | Document-level `toContain` or `[\s\S]*` that can cross a tag |
   | Packed "and" | One `it` covering independent cases (status vs heading vs content-type vs body vs row vs R2; `pull_request` vs `push` vs a `run` step) |
   | Targeting "only on the first Slice" (first has X and last is []) | Packed `and` title (`first Slice … and the last Slice`); two `it`s that each drop one side (append-to-both / append-to-neither stay green) |
   | Independently revertible copy vs splice (Command drag) | One `it` packing first has X **and** last is [] (copy without splice stays green on the first assertion) |
   | Accessible name **is** `X` | Playwright `name: "X"` without `exact: true` (matches `Xyz`) |
   | Listitem visible text **is** `X` | Playwright `/^X/` on the listitem (descendant Port labels / extra suffix stay green) |
   | Listitem visible text / own text node | Playwright `toHaveText("Place Order")` on the listitem (stays green only when `textContent` wipes descendants) |
   | Named link/button/textbox `X` (unit HTML) | `toContain(">X<")` (heading or span named X stays green); `toContain('<a href="/app">X</a>')` packs name vs href |
   | Computed `background-color` / `color` | Unit `toContain` of the stylesheet `<link>` (deleting `body { background-color }` stays green) |
   | Exact script / command value | Unordered `toContain` of each token (`echo playwright test`) |
   | "includes `scale(`" / `toContain("scale(")` | Canvas pan already writes `scale(1)`; deleting the unique ctrl/meta branch stays green |
   | YAML key / workflow event | Prefix match (`/pull_request:/` also hits `pull_request_target:`) |
   | "does not show a control named X" | Querying only `button` and `link` (checkbox/menuitem named X stays green) |
   | "does not show a listitem whose accessible name is X" (unit HTML) | `not.toContain("<li>X</li>")` (exact tag; `<li aria-label="X">` stays green) |
   | "Clicking X on that page appends …" | Unit call of a function production never imports (duplicate click-path object; deleting the module stays green) |
   | "Dragging from X onto Y appends …" | Unit call that passes `fromKind`/`toKind` already in the input and asserts those same values (stays green if `bindEditor` never calls the module) |
   | Same control, two selection sources (Name is `New Slice` vs `Actor`; Command vs Event Happened vs Read Model vs Automation; insert-if-missing presence of `Add Field` / `Field name`) | Tests that never select the other entity in one session (first-click-wins stays green); a "does not show X" that first-clicks only the kind that must hide X (Command then Actor leftover stays green; never clicks `Add Field` then Actor so `unbindFieldName` stays green) |
   | Shared Inspector textbox value after select (Description; empty omitted JSON) | Fill after selecting the other kind (overwrites stale); `toBeVisible` on the textbox (insert-if-missing / never-assign-value stays green) |
   | "that Slice" / "that Actor" / the clicked item / Backspace the selected Slice / "the first X" / first-vs-last (`the first New Slice listitem`) | One-item fixture (`.at(-1)` / `.first()` / always-delete-last / only-last stays green); two default-named Slices cannot use "does not show a listitem named New Slice" — remaining JSON id so last remains; hardcoded `bindName("New Slice")` stays green if the listitem was renamed |
   | Host path (`run_worker_first`, assets routing) | Handler unit test that stays green if that host wiring is deleted |
   | Architecture-named production adapter (D1, Email, R2) | Injected `env.auth` / `env.documents` / handler unit test that stays green if production `fetch` never constructs that adapter |
   | Write R2 current object / stored document body | Success status, version bump, or 409 UI that injects a memory port and never asserts the saved body (deleting `documents.put` stays green) |
   | Checked AC / `it` named as the criterion | Empty body (no assertion); deleting production leaves the test green |
   | Architecture-named production store (D1) | Memory/fake store only; Playwright on `TEST_MAIL=1`; SQL never executed; constructing `insertTeam` while `listTeamsForPerson` is never run |

   When a production module is deleted, rename or delete its dedicated test file in the same change, and restate Seams / architecture.md / product.md Testing (`keeping-specs-current`). When an AC is restated, rename the `it` / `test()` that quoted the old words. Renaming is unfinished until that leftover test's assertions fail a weaker reading of the new words, or the leftover title drops the new words. A restated "does not show X" inverts the assertion (`not.toContain`); dropping `toContain` is not the proof. A checked AC whose `it` has no assertion is unproven — restore the assertion or uncheck the box. Completion: deleting the feature, or swapping in the weaker algorithm, fails this test for that reason.

2. **Pick the layer.** A `readFileSync` of source for an import string or class name is a parse test — it stays green if the mount is deleted and the string remains. A computed-color AC is unproven by unit `toContain` of the stylesheet `<link>` — Playwright `toHaveCSS`, or uncheck. A path criterion for a hosted Worker is unproven by a unit test of the exported handler when host wiring (`run_worker_first`) can be deleted without failing that test — prove GET at the host, or lock the wiring in the same AC. An "only this route" / "no other route shows X" criterion is proven by rendering every other page so a second mount fails. Proving the named route has X, or that one former second surface is gone, is not that proof. Rendering a leaf widget in isolation does not prove a screen "shows" bullet. A FormData/parser test proves a parse criterion only. If Playwright is out of scope, render the composed markup the route mounts, or narrow the spec bullet. Completion: the test does not mount the framework to prove a pure domain function. Deleting the named UI fails a "shows" test.

3. **Confirm the seam.** Fake adapters at the seams the architecture spec (or `codebase-design`) names. A criterion that names clicking on that page is unproven by a unit call production never makes — prove the in-memory document after the click (or the body Save sends) so omitting that field on the click path fails. Either the click path uses the architecture-named module or drop the unused module (`keeping-specs-current`). A criterion that names dragging from a port is unproven by a unit call that passes the kind already in the input — Playwright `dragTo` or the editor mouseup path production calls is the proof. A criterion that names the Name value after selecting Slice vs Actor, or Command vs Event Happened vs Read Model vs Automation, is unproven by tests that never select the other entity in one session — first-click-wins / insert-if-missing stays green; select another of those kinds so the value updates (Command then Actor leftover `Add Field`; `Add Field` then Actor leftover `Field name`). A criterion that names the Description (or other shared Inspector) value after selecting another kind is unproven by fill-after-other-select or `toBeVisible` — read the textbox after select without filling so never-assign-value fails. Parking that value only in Assumptions is unfinished (`keeping-specs-current`). A criterion that names "that Slice" / "that Actor" / the clicked item / Backspace of the selected Slice / "the first X" / first-vs-last (`the first New Slice listitem`) is unproven by a fixture with only one item — a second item so mutating last / `.first()` is not also last fails (always-delete-last / only-last / `.at(-1)` stays green), or restate the AC to "the last Slice" / off “the first” (`keeping-specs-current`). Two default-named Slices cannot use "does not show a listitem named New Slice" as that proof — remaining JSON id so last remains. Hardcoded `bindName("New Slice")` stays green if the test always clicks a default-named listitem. A click handler that requires `data-kind` GET HTML does not emit leaves inspect-after-reload inert — assert click after reload, or narrow inspect to in-session click-created items (`keeping-specs-current`). Backspace / delete that requires `data-id` GET HTML does not emit leaves delete-after-reload inert — assert after reload, or Out of scope names it (inspect-after-reload family). If the criterion names a persistence behavior of a specific adapter, the test constructs that adapter — faking the port only proves the orchestrator called it. A `readFileSync` of wiring for a fake identifier is a parse test. Proof is a call under the test adapter, or a flow that fails if those constructors are unused. Architecture-named adapters are constructed on the production composition root (Worker `fetch`). A test-only flag (`TEST_MAIL=1`) as the only constructor leaves those adapters unproven — tests that inject `env.auth` or `env.documents` stay green if that path is deleted (`codebase-design`). Parking construction only in Assumptions is unfinished (`keeping-specs-current`). Architecture naming D1 (or another production store) is a persistence adapter even when the feature spec names a fake-store seam for unit tests. Construct that adapter in a test so a broken SQL statement fails. Each new statement this slice adds (`insertTeam`, `addMembership`, `listTeamsForPerson`) is executed; one method does not stand in for the adapter. Playwright on the memory fake is not that proof. Completion: no mock of a domain collaborator that is not an adapter. No live third-party in tests.

4. **Independent expected values.** Pull numbers, event names, and catalog fields from the spec tree. Do not reimplement the unit under test inside the assertion. Mail subject, From display name, and other user-visible copy asserted in tests must be sentences in the spec. A test that pins copy the spec does not name is unfinished — add the spec sentence or drop the assertion.

5. **Telemetry contract.** If the product catalogs actions: for each new `action`, assert `capture` was called with that name (fake Telemetry). A property allowlist is proven against the observability catalog, not a handwritten table exercised on one action.

## Commands

Run whatever the product defines. Read scripts from the environment; do not invent npm script names.

## Anti-patterns

- Implementation-coupled (private methods, internal mocks; a class not in the spec)
- Tautological (`expect(fn(x)).toEqual(copyOfFn(x))`; `appendConnection({ fromKind: K })` asserting K when the `it` is titled as a Dragging-from-port AC)
- Horizontal slicing (all tests, then all code) — use `tdd-loop` vertical slices
