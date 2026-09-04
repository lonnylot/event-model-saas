# This product (Event Model SaaS)

Load with `testing`. Portable procedure is `SKILL.md` (spec-loop).

## Weaker readings

| Criterion shape | Weaker fixture that must not stay green |
|-----------------|-----------------------------------------|
| Packed "and" | One `it` covering independent cases (status vs heading vs content-type vs body vs row vs R2; `pull_request` vs `push` vs a `run` step) |
| Targeting "only on the first Slice" (first has X and last is []) | Packed `and` title; two `it`s that each drop one side (append-to-both / append-to-neither stay green) |
| Independently revertible copy vs splice (Command drag) | One `it` packing first has X **and** last is [] (copy without splice stays green on the first assertion). Not targeting. |
| Accessible name **is** `X` | Playwright `name: "X"` without `exact: true` (matches `Xyz`) |
| Listitem visible text **is** `X` | Playwright `/^X/` on the listitem (descendant Port labels / extra suffix stay green) |
| Listitem own text node | Playwright `toHaveText("Place Order")` on the listitem (stays green only when `textContent` wipes descendants / `Command port`) |
| Named link/button/textbox `X` (unit HTML) | `toContain(">X<")` (heading or span named X stays green); `toContain('<a href="/app">X</a>')` packs name vs href |
| Computed `background-color` / `color` | Unit `toContain` of the stylesheet `<link>`; UA-default `toHaveCSS` (`input` white / Email Field canvas fill) that stays green if the unique declaration is deleted; inherited heading ink after a parent/body AC (Landing heading after public-face `body.landing`; editor `Slices` after `body.app-editor` ink) |
| `:focus-visible` computed style | Playwright `locator.focus()` / programmatic focus (`Sign in` box-shadow) — a `:focus` rule stays green |
| Exact script / command value | Unordered `toContain` of each token (`echo playwright test`) |
| "includes `scale(`" / `toContain("scale(")` | Canvas pan already writes `scale(1)`; deleting the unique ctrl/meta branch stays green |
| YAML key / workflow event | Prefix match (`/pull_request:/` also hits `pull_request_target:`) |
| "does not show a control named X" | Querying only `button` and `link` (checkbox/menuitem named X stays green) |
| "does not show a listitem whose accessible name is X" (unit HTML) | `not.toContain("<li>X</li>")` (`<li aria-label="X">` stays green) |
| Listitem **in** the Timeline region (unit HTML) | `/aria-label="Timeline"[\s\S]*<li...Actor/` (Inspector Actor after Timeline stays green) |
| TIME chrome does not pan / `.time-chrome` | Timeline `style.transform` does not include `translate(` (TIME chrome inside `.board` stays green) |
| Event → Read Model copy on `.board` | Command → Event Happened `.board` tests (second kind-gated drag arm stays sibling) |
| leftover unused sibling of `.board` / redo Connection copy | after-drag `.board` tests + undo-rest Timeline-shows (⇧⌘Z redo `timelineEl.append` stays green) |
| "Clicking X on that page appends …" | Unit call of a function production never imports (duplicate click-path object) |
| "Dragging from X onto Y appends …" | Unit that passes `fromKind`/`toKind` already in the input and asserts those same values (`bindEditor` unused stays green) |
| Same control, two selection sources (Name is `New Slice` vs `Actor`; Command vs Event / Read Model / Automation) | Tests that never select the other entity (first-click-wins / insert-if-missing stays green) |
| Shared Inspector textbox value after select (Description; empty omitted JSON) | Fill after selecting the other kind; `toBeVisible` (never-assign-value stays green) |
| "that Slice" / "that Actor" / the clicked item / Backspace the selected Slice / "the first X" / first-vs-last | One-item fixture (`.at(-1)` / `.first()` / always-delete-last / only-last stays green). GET after Create one seeded Actor / one Automation after Add+Save+reload (`json.slices[0].actors[0]` / `[]`). Two default-named Slices cannot use "does not show a listitem named New Slice" — remaining JSON id so last remains |
| Shortcut-shown listitem after ⌥⌘ (JSON already `selectedSliceIndex`) | One-slice Create-default (DOM `lastLaneList` / last column stays green if selected-slice JSON and DOM diverge). Out of scope targeting does not license that split unless it names last-column DOM |
| Host path (`run_worker_first`, assets routing) | Handler unit test that stays green if that host wiring is deleted |
| Architecture-named production adapter (D1, Email, R2) | Injected `env.auth` / `env.documents` / handler unit that stays green if production `fetch` never constructs that adapter |
| Write R2 current object / stored document body | Success status, version bump, or 409 UI that never asserts the saved body (deleting `documents.put` stays green) |
| Extra store write after a refuse | Status asserted; the write still happens |
| Checked AC / `it` named as the criterion | Empty body (no assertion) |
| Architecture-named production store (D1) | Memory/fake store only; Playwright on `TEST_MAIL=1`; SQL never executed; constructing `insertTeam` while `listTeamsForPerson` is never run |

A restated "does not show X" inverts the assertion (`not.toContain`); dropping `toContain` is not the proof. A checked AC whose `it` has no assertion is unproven.

## Split vs unsplit

Independently revertible here includes status vs heading vs row vs R2, and two workflow `on:` events vs a `run` step.

Returning the same success status (200) as the happy path is not an early-return pack — invalid-email 200 when success 200 already landed is tests-after (`logical-commits` `PRODUCT.md`).

Waitlist `does not create a Person` / `does not set a Session cookie` on a POST that never created those has no unique production — fold into the insert / status-200 commit (TDD slice) or unsplit the bullet. Do not fold them into a unique-production regex commit.

## Seams

A listitem **in** the Timeline region is unproven by `/aria-label="Timeline"[\s\S]*Actor/` — Inspector after Timeline stays green. Playwright region+listitem, or a unit slice of the Timeline `section`.

TIME chrome does not pan is unproven by Timeline `style.transform` does not include `translate(` — `.time-chrome` inside `.board` stays green. That factor is an AC that asserts `.time-chrome`, or drop the claim (`keeping-specs-current`).

Event → Read Model copy on `.board` is unproven by Command → Event Happened `.board` tests — the second kind-gated drag arm stays sibling. That placement is an AC that asserts `.board` contains `Event Happened → Read Model`, or revert that arm (`keeping-specs-current`). GET `connectionCopy` stays the one reload AC.

Leftover unused sibling of `.board` is unproven by after-drag `.board` + undo-rest Timeline-shows — ⇧⌘Z redo `timelineEl.append` stays green. Append redo on `.board` and name that criterion, or the leftover-unused sentence is false (`keeping-specs-current`).

A computed-color AC is unproven by stylesheet `toContain` — Playwright `toHaveCSS` of the unique declaration, or uncheck. Playwright `toHaveCSS` of a UA default (`input` white / Email Field canvas fill) or a color inherited from a parent/body AC (Landing heading ink after public-face `body.landing`; editor `Slices` after this slice's `body.app-editor` ink) is existing behavior — drop the bullet (`keeping-specs-current`).

Look of named screens is `visual-design`. Do not prove look as a pile of computed rgb() ACs. Prove names, flows, token *use*, a11y, and that unique look rules exist (composed layout that is not the UA default: `display` flex, `padding-top` not `0px`). A `:focus-visible` AC is unproven by `locator.focus()` — that stays green if the rule is only `:focus`. Keyboard Tab, or a fixture that fails for `:focus` only.

A hosted Worker path is unproven by a handler unit test when `run_worker_first` can be deleted without failing that test.

Click/drag criteria are unproven by a unit call production never makes — prove the in-memory document after the click, or Playwright `dragTo` / the editor mouseup path.

Inspect/delete after reload that requires `data-kind` / `data-id` GET HTML does not emit is unproven until that click after reload is an AC, or Out of scope names it. Inspect/delete on a new in-memory listitem path that omits `data-id` / `data-kind` when sibling toolbar Add emits them is unproven until that click is an AC, or Out of scope names inspect/delete on those listitems — GET after reload is leftover-narrow (`keeping-specs-current`).

Mail subject, From display name, and other user-visible copy asserted in tests must be sentences in the spec.

## Anti-pattern

`appendConnection({ fromKind: K })` asserting K when the `it` is titled as a dragging-from-port AC.
