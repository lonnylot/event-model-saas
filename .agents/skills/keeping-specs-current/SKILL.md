---
name: keeping-specs-current
description: >
  Use when adding a feature, changing behavior, fixing a bug, writing or
  reviewing a pull request, when two spec bullets can conflict, when a
  303/redirect AC leaves a shows bullet on that path, when an
  AC bullet contains "and" or independent env/branch cases, when
  a "that Slice" AC has only one item with no last-Slice restatement, when
  Backspace / clicked-item uses one New Slice (always-delete-last), when
  packing status and content-type and body, when
  a targeting packed "and" (first Slice has X and last is []) should stay one
  only-on-the-first-Slice bullet, when
  restating an AC while UI/Events/Assumptions still describe the old
  behavior, leftover Assumptions after restating Out of scope,
  leftover Assumptions `Add targets the last Slice` after Restates moved lane Add
  (Toolbar Add),
  omitted sibling kinds (Event / Read Model / Automation reload-lists),
  in-session visible text when the AC is accessible name,
  leftover Seams after deleting a named module,
  leftover Seams that name a path or mutation production does not call (scroll path / undo those mutations),
  leftover Seams that name five kinds (Actor/Command/Event/Read Model/Automation
  chosen-Slice) when ACs only prove Command / ⌥⌘2,
  Assumptions that park selected-Slice ⌥⌘1–5 when only ⌥⌘2 is an AC,
  Restates omits architecture.md after dropping a module path,
  leftover locked claims in a restated system spec,
  Problem that names later-slice keyboard zoom as current (⌘+/⌘-/⌘0),
  leftover product.md locked words a slice did not implement,
  leftover later-slice Playwright add a slice in a restated Testing bullet,
  leftover dashed-add clicks / selected-Slice keys other than ⌥⌘2 after Restates
  claims dashed Add / ⌥⌘1–5 (silent drop of stay-later), leftover Showing
  dashed lane buttons stay later when HEAD creates Add Actor/Event/Read Model/Automation on lane,
  leftover Restates in a released spec that still quotes the old product.md Playwright path,
  leftover Restates that still says keyboard shortcuts stay later after Out of
  scope moved ⌥⌘1–5 or fields stay later after Out of scope moved Inspector Fields,
  leftover Document flow or Error handling after Restates names product.md,
  leftover Editor (Mac parity) or Error handling highlighting after restating Testing,
  leftover Editor drag blocks / delete selection / undo structural edits,
  leftover Document flow Mac-like undo, leftover Testing Unit mutations,
  copying a schema file instead of rewriting reject-if-schema-fails,
  when removing product.md from Restates instead of rewriting leftovers,
  when Restates omits a released spec that still describes
  deleted behavior (packed Inspector Description / Fields / Slice type picker),
  when Restates names leftover files whose bullets
  were not rewritten, when Restates names a path not in the tree
  (canvas-rest.md / add-on-lane.md not on this HEAD / do not edit if not on the branch), leftover Out of scope still unowned later after Restates
  (delete, drag, pan, moving Slices), when leftover action POST remains after a deleted
  control, when a leftover test title still quotes a restated AC, when
  a Domain terms line names a word CONTEXT.md does not define, when
  tightening a fake or test-double parse, when adding an operator CLI,
  extra document title or form or link or extra nav or host observability without an AC, extra
  inspect of Out of scope kinds (Name on Command / Event; leftover Add Field / Field name after insert-if-missing switch), extra
  R2 put or D1 insert without an AC that asserts the stored body, extra
  Playwright workers without a spec sentence,
  Playwright wait after open (editor bound / networkidle) or New Slice or named Ports or force hover flagged as extra chrome, mail
  subject or From display name without a spec sentence, an
  architecture adapter constructed only under a test flag,
  host-path construction of an architecture-named adapter parked in Assumptions,
  distinguishing factor parked in Assumptions (factor is not unzoomed pan 1),
  shared-control Description value parked in Assumptions (empty omitted JSON),
  an AC that includes scale( when canvas pan already writes scale(1), a
  `run_worker_first` path list that is longer than the architecture
  Compute row, when specs
  or plans would land under docs/superpowers, or whenever CONTEXT.md,
  docs/specs, or docs/adr may be missing or stale.
---

# Keeping specs current

Specs are the product. Code implements them. A change with no matching spec update is unfinished.

## When to use

- Any behavior change, including "tiny" ones
- New feature, bug, or refactor that alters what the system does
- Suspected drift between code and `docs/specs/`

## Iron law

```
NO BEHAVIOR WITHOUT A SPEC.
NO CODE CHANGE WITHOUT THE MATCHING SPEC UPDATE IN THE SAME CHANGE.
```

Status on every spec: `draft` → `validated` → `released`.

## Steps

1. **Name the spec.** Open `docs/specs/README.md`. Identify the system spec and/or `docs/specs/features/<slug>.md` this change implements. Completion: you can point at a path. If none exists, create it from `docs/specs/features/_TEMPLATE.md` and add a catalog row **before** code.

2. **Read before edit.** Read that spec, `CONTEXT.md` (terms), and any linked system spec. When the change adds a caller, npm script, or CLI that reuses a constructor, search other feature specs for exclusive "only X" / "constructed only" bullets the new caller would falsify. Completion: you can quote the criterion you are implementing and every exclusive bound the new caller touches.

3. **Edit the spec first.** New or changed rules, events, primitives, seams, or terms go into the spec (and `CONTEXT.md` / other system specs they belong in). An AC bullet that contains "and" (any case) or independent env/branch cases is unfinished — split into one bullet each unless the cases share one early return (`testing`). A “that Slice” / “that Actor” / “the clicked item” / Backspace-the-selected-Slice AC is unfinished until a second item makes last-item mutation fail (always-delete-last stays green on one `New Slice`), or the bullet is restated to “the last Slice” (Assumptions that this slice is one in-session item). Two default-named Slices cannot use “does not show a listitem named New Slice” as that proof — remaining JSON id so last remains (`testing`). Inspect that requires a `data-kind` GET HTML does not emit is unfinished until click-after-reload is an AC, or Assumptions say inspect is in-session on click-created items. Status vs content-type vs body vs row vs R2 are independent even when they describe one JSON success. Do not split an early-return reject (returns 400 and does not insert / does not put / leaves version N) into separate ACs if they share one production path: those are one criterion (`testing`). A targeting AC that packs first-Slice has X and last-Slice is [] (lane click / selected-Slice ⌥⌘2) is unfinished until restated as one "only on the first Slice" bullet — keep both assertions in that one `it`; do not split into two bullets that each drop one side (`testing`). Do not copy a packed plan sentence into the spec. Extra visible chrome without an AC is a behavior change — add an AC first or omit it. Document title (`<title>`), extra nav, extra headings, extra forms, extra textboxes, extra buttons, and extra links are chrome. Inspector Name (or other inspect chrome) on a kind Out of scope names inspecting (Command / Event / Read Model / Automation; leftover `Add Field` / `Field name` after insert-if-missing switch) is extra chrome — omit it, even when the same Name textbox is already an AC for Slice or Actor. When ACs cover a behavior for some kinds of a shared family (Command reload-lists) and not the siblings (Event / Read Model / Automation reload-lists), Out of scope names those omitted kinds — silent omit is leftover scope. An accessible-name Name-fill AC does not own visible listitem textContent; if the Add default remains until GET, Out of scope names in-session visible text. A “shows the Team name” AC is that text (for example `<p>`); wrapping it in `<a>` or wrapping Slices in `<nav>` is extra chrome unless the AC names the link or landmark. Extra persistence (R2 `put`, D1 insert) without an AC that asserts the stored body is the same miss — add the AC and test, or omit the write. Chrome that only renders after a Team exists still needs an AC on that route, or omit it. User-visible copy that tests or production pin (mail subject, From display name) without a spec sentence is the same miss. Extra production host config the spec and architecture do not name (Worker `observability`, unused bindings) is the same miss — add an AC (or architecture row) first or omit it. Extra Playwright `workers` (or other runner isolation) the spec does not name is the same miss — add an Assumptions sentence (or Testing bullet) first, or keep the CI-only default. Playwright waits after open for `networkidle` so `bindEditor` is attached, then for the New Slice listitem after click and named lane buttons before lane Add or ⌥⌘1–5, named Ports before pointer-down or drag, and `{ force: true }` hover so Timeline pan does not move the Port, are Assumptions (test setup), not extra product chrome — put them in Assumptions when the test uses them; do not add an AC for the wait. Wait after click is not wait after open. Architecture-named adapters (D1, Email, R2) that production constructs only under a test flag contradict architecture — construct them on the production path or restate architecture in the same change. Parking that construction only in Assumptions is unfinished — a shippable Worker `fetch` composition path is an AC (`testing`). A `run_worker_first` list that includes a path architecture does not name is two bullets that cannot both hold — restate the Compute row in the same change. Proving the path at the host (`testing`) does not update architecture. Scaffold (`$schema`, `compatibility_date`) and operator scripts that do not change persisted state (`dev`) are not chrome. A feature Domain terms line that names a word `CONTEXT.md` does not define is unfinished. When a spec forbids using a term as a visible title or field label, that term's `_Avoid_` lists title / field label. Do not add a Changelog section — the commit message is the history. If two bullets cannot both hold, write the resolution in the spec before `tdd-loop`. Silent drop is not a resolution. A Problem that names later-slice behavior as current (⌘+/⌘-/⌘0 change Timeline scale while product.md keeps keyboard zoom later) is unfinished — restate Problem to the current gap. A new 303/redirect AC on a path contradicts every "shows" bullet on that same path (this spec and leftover released specs) until those bullets are qualified for the case that still holds (not redirected / no teams / two Teams).

   Deleting or moving a production module named in Seams is unfinished until Seams, architecture.md (even when draft), and product.md Testing no longer describe the deleted path — or the click path still uses that module. Restates includes architecture.md when the module row would be leftover. Listing architecture.md in Restates without rewriting the document-module row is unfinished. Seams that name a call path production does not take (scroll path calls `document` when pan is CSS `translate`) or mutations the undo stack does not record (undo those mutations when the stack is New Slice + Connection only) contradict the ACs — restate Seams to the functions the editor actually calls (`moveSliceLeft` / `moveActorToSlice` / `deleteSlice` / `undoConnection` on the key and drag path). Seams that name chosen-Slice append for Actor, Command, Event, Read Model, and Automation when ACs only prove Command / ⌥⌘2 contradict the ACs — restate Seams to the proven kind and key, or add ACs. Assumptions that park selected-Slice targeting for ⌥⌘1–5 when only ⌥⌘2 is an AC are unfinished — move those keys to Acceptance criteria or Out of scope.

   Restating or deleting an AC is unfinished until UI, Events, Assumptions, Used by, every spec that AC restates, and the `it` / `test()` titles that quoted the old words no longer describe the deleted behavior. Search `docs/specs/` and `it("` / `test("` titles for the deleted words. Grep the restated token (`Fields`), including packed Out of scope lists (`Inspector Description / Fields / Slice type picker`), not only the phrase `Fields stay later`. Add every spec hit to Restates and rewrite the leftover bullets. Rename leftover test titles (`testing`). A leftover title that now includes the restated words must prove those words or drop them (`testing`). Listing a path in Restates without rewriting that file is unfinished. When Out of scope sends keyboard ⌥⌘1–5 to another slice, Restates that still says `Keyboard shortcuts … stay later` is leftover — rewrite so ⌥⌘1–5 are that slice and only moving Slices (and shortcuts other than those) stay later (`fields stay later` / `Inspector fields other than Name stay later` after Out of scope moved Inspector Fields is the same leftover). Restates names a path that is not in this tree (`canvas-rest.md`, `add-on-lane.md` not on this HEAD / not in README.md even if released on default) is unfinished — drop the line. "Do not edit this file if it is not on the branch" is listing without rewriting. Assumptions that link files not in the tree are the same miss. When Restates names a path (system spec or sibling feature), rewriting one phrase is unfinished until you grep that entire file for (a) phrases this slice's Out of scope names, (b) later-slice names still listed as current work, (c) locked claims in the restated sentences this HEAD does not implement, (d) leftover Out of scope still listing Restated words as unowned later (delete, drag blocks between Slices, pan, moving Slices after canvas Restates connections.md), (e) leftover stay-later for named chrome this HEAD's ACs already prove (`Showing dashed lane buttons` when click ACs name `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane`). Rewriting only undo is not a rewrite of that file. Rewrite each leftover locked claim, or add ACs that implement it.

   Rewriting Out of scope is unfinished until Assumptions of that Restates path no longer say the deleted ownership (`persistence is a later spec`). When Out of scope sends dashed Add on a lane to another slice, Assumptions that still say `Add targets the last Slice` are leftover — say `Toolbar Add still targets the last Slice` so the two files do not disagree on the word Add. A feature that ships a `product.md` locked flow must add `docs/specs/product.md` to Restates and rewrite leftover words HEAD does not implement. Deleting or omitting that Restates line does not make leftover words hold. When Restates names `product.md`, re-read Document flow, Editor (Mac parity), Error handling, Save, Persistence, and Testing Unit — leftover locked sentences this slice ships (`reject if it fails the schema`, write R2 current object, legal targets highlight, snap-back, reason on the source, drag blocks between slices, delete selection, undo structural edits, Mac-like undo, mutations (add/move/delete slice and blocks)) become ACs with tests, or those sentences are rewritten so this slice does not own them (Actor drag, Slice Backspace, undo New Slice, undo Command → Event if that is all the ACs prove). Copying a schema file into Assumptions is not a rewrite. Deleting Spec slices, Architecture sketch, or CI is not a rewrite (`Silent drop is not a resolution`). Restating one phrase in a `product.md` bullet (for example `sliding on use` or Playwright `land on team list`) is unfinished until you re-read the **entire** touched bullet and rewrite every other locked phrase that bullet still contains which HEAD does not implement (for example leftover heading copy, leftover later-slice flow `add a slice`). When Restates claims dashed Add on a lane and keyboard ⌥⌘1–5, leftover click-append from `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` and selected-Slice keys other than ⌥⌘2 stay later unless this HEAD has ACs for them — removing "stay later" without those ACs is silent drop. When this HEAD's ACs click-append from those four named buttons, leftover `Showing dashed lane buttons … stay later` in restated `product.md` Editor / Testing and sibling Out of scope / Restates cannot both hold — rewrite so showing `Add Actor on lane` / `Add Event on lane` / `Add Read Model on lane` / `Add Automation on lane` is this slice (click ACs already fail if those buttons are deleted; do not add new shows checkboxes). Leave `Add Command on lane`, last-Slice ⌥⌘1–5, and selected-Slice ⌥⌘2 as later. Then grep the rest of `product.md` (Testing, slice list, Editor, Error handling, every section) for the same leftover locked phrase (`team list`, `model list`, `add a slice`, `highlighting`, `snap-back`, `reason on the source`, `drag blocks`, `delete selection`, `Mac-like undo`, `mutations (add/move/delete`). After restating a `product.md` Testing / Playwright bullet, grep other specs' Restates for the old words of that bullet (`thin open/Save/Export`, not “add a slice”) and rewrite those leftover Restates so they name the slice that now owns the flow. After restating Testing so leftover words stay later, grep Editor (Mac parity) and Error handling for those leftover locked phrases still as current (`highlighting`, `snap-back`, `reason on the source`). When flipping a slice to `released`, restate the product.md slice list and Next slice if they still name this slug as the work. Completion of that search: grep for the deleted phrase is empty except the restated sentences; the restated system spec has no leftover locked claim this HEAD does not implement; the restated `product.md` bullet has no leftover locked phrase HEAD does not implement; grep of the rest of `product.md` has no leftover locked phrase HEAD does not implement; every Restates path now uses the new words; no leftover `it` / `test()` still quotes the old words.

   Deleting a visible control is unfinished until the action no longer accepts that POST, or Out of scope names the leftover branch. Restate an exclusive script-name bound as the constructor file (and the scripts allowed to run it) so both specs still hold. A shippable operator command or npm script that changes persisted state, or host-path construction of an architecture-named adapter, is an acceptance criterion — Assumptions are environment facts, not a place to park the command or the wiring. A shippable production composition path (Worker `fetch` constructs D1 / R2 when `TEST_MAIL` is not `1`) is the same miss — move it to Acceptance criteria. Parking the distinguishing factor of an AC in Assumptions (factor is not the unzoomed pan `1` while the AC is `includes scale(`) is unfinished — that factor is the AC. Parking "selecting another kind updates that Description value" in Assumptions when no AC reads that textbox is unfinished — that value is an AC (`testing`) or drop the claim and name it Out of scope. Empty omitted JSON hides a stale previous fill; a show-exists AC and a fill-JSON AC are not that proof. A script AC that "includes the tokens" rather than **is** the exact command is a weaker criterion (`playwright-e2e`, `testing`). An AC that "includes `scale(`" when existing production already writes `scale(1)` (canvas pan) is the same miss — restate as a `scale(` whose factor is not the unzoomed pan `1` so deleting the unique ctrl/meta branch fails (`testing`). Completion: the spec describes the intended behavior, including clash cases; leftover sections of the same file agree; status is at least `draft`.

4. **Implement via `tdd-loop`.** Do not start production code until step 3 is done and, for ship work, `releasing-a-spec` has marked the spec `validated`.

5. **Sync on the way out.** If implementation taught a tighter rule, update the spec in the same logical commit (`logical-commits`). A tighter fake adapter / test-double parse is a behavior change — restate that bullet in the same commit, or revert. Flip catalog status only through `releasing-a-spec`. Completion: the commit that lands the behavior also lands the spec hunk.

6. **Move the procedure.** If the spec change alters *how* work is done (folders, seams, events, review, terms, exclusive "constructed only" sentences), update the matching skill in the same change (`writing-for-agents`). The spec→skill map lives in that skill. Completion: no skill still teaches the old procedure.

## Which file owns the fact

| Fact | File |
|------|------|
| Term | `CONTEXT.md` |
| Feature slice | `docs/specs/features/<slug>.md` |
| Hard-to-reverse trade-off | `docs/adr/NNNN-slug.md` (only if hard to reverse, surprising, and a real trade-off) |
| Agent procedure | `.agents/skills/<name>/SKILL.md` — same change as the spec, via `writing-for-agents` |
| Stack, module, seam | `docs/specs/architecture.md` when the product has one |
| Domain rule | `docs/specs/business.md` when the product has one |
| Test layer, seam list | `docs/specs/testing.md` when the product has one |
| Primitive, token | `docs/specs/design-system.md` when the product has one |
| Event or span name | `docs/specs/observability.md` when the product has one |
| Locked v1 product decisions | `docs/specs/product.md` |

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Tiny change, skip the spec" | Tiny changes rot the catalog. Update the spec. |
| "I'll document after it works" | After-the-fact docs describe memory, not intent. Spec first. |
| "The test is the spec" | Tests prove a criterion. The criterion lives in `docs/specs/`. |
| "ADR for this rename" | Easy reversals are a commit message, not ADRs. |

## Red flags

- About to write production code and cannot name the spec path
- Spec still says something the code will no longer do
- New synonym for a `CONTEXT.md` term
- A Domain terms line names a word `CONTEXT.md` does not define
- Catalog has no row for a new feature file
- A new operator CLI or npm script lives only under Assumptions
- Host-path construction of an architecture-named adapter lives only under Assumptions
- A shippable Worker `fetch` constructor path (D1, R2) lives only under Assumptions
- Distinguishing factor of an AC lives only under Assumptions (factor is not the unzoomed pan `1`)
- Shared-control displayed value after select lives only under Assumptions (Description; empty omitted JSON)
- A script AC "includes the tokens" instead of **is** the exact command
- An AC "includes `scale(`" when canvas pan already writes `scale(1)`
- Exclusive "only script X" wording still stands after a second script calls the same constructor
- An AC is restated but UI / Events / Assumptions still describe the deleted behavior
- Out of scope restated but Assumptions of that file still say the deleted ownership (`persistence is a later spec`)
- Leftover Assumptions `Add targets the last Slice` after Restates moved lane Add (say `Toolbar Add still targets the last Slice`)
- Restates omits a released spec that still describes the deleted behavior (packed Out of scope `Inspector Description / Fields / Slice type picker` still lists Fields as later)
- Leftover Seams after deleting a named module; Restates omits architecture.md (draft) or product.md Testing still names the deleted module
- Leftover Seams that name a path production does not take (scroll path) or mutations the undo stack does not record (undo those mutations)
- Leftover Seams that name chosen-Slice append for Actor/Command/Event/Read Model/Automation when ACs only prove Command / ⌥⌘2; Assumptions that park selected-Slice ⌥⌘1–5 when only ⌥⌘2 is an AC
- Restates names a leftover file whose bullets still use the deleted words
- Restates that still says `Keyboard shortcuts … stay later` after Out of scope moved ⌥⌘1–5 to this slice, or `fields stay later` / `Inspector fields other than Name stay later` after Out of scope moved Inspector Fields
- Restates names a path that is not in this tree (`canvas-rest.md`, `add-on-lane.md` not on this HEAD) or says do not edit if not on the branch; Assumptions link files not in the tree
- Restates names a path whose Out of scope still lists Restated words as unowned later (delete, drag, pan, moving Slices after rewriting only undo)
- Restates names a system spec that still contains locked claims this HEAD does not implement
- `product.md` leftover locked words the slice did not implement, including a sibling phrase left in a bullet after rewriting only the example (`sliding on use`), leftover later-slice Playwright (`add a slice`) left after rewriting only `land on team list`, leftover dashed-add clicks / selected-Slice keys other than ⌥⌘2 after Restates claims dashed Add / ⌥⌘1–5 (silent drop of stay-later), leftover Showing dashed lane buttons stay later when HEAD creates those named buttons, a leftover phrase in another section (`team list` in Testing), leftover Document flow / Error handling / Save (`reject if it fails the schema`, write R2) after Restates names `product.md`, leftover Editor (Mac parity) / Error handling (`highlighting`, `snap-back`, `reason on the source`) after restating Testing so those stay later, leftover Editor drag blocks / delete selection / undo structural edits, leftover Document flow Mac-like undo, leftover Testing Unit mutations (add/move/delete slice and blocks) after Restates names `product.md` when this HEAD only proves Actor drag, Slice Backspace, undo New Slice, undo Command → Event, a released spec's Restates that still quotes the old `product.md` Playwright path (`thin open/Save/Export`) after this slice restated that bullet, or a Next slice that still names a released slug
- Copying a schema file into Assumptions, or deleting Spec slices / Architecture sketch / CI, instead of rewriting leftover `product.md` sentences
- `product.md` dropped from Restates so leftover locked words would not have to be rewritten
- A deleted control still has an action POST the spec does not name
- An AC is restated but a `test()` title still quotes the old words
- An AC bullet contains "and" or two independent env/branch cases that do not share one early return
- A targeting packed "and" (first Slice has X and last is []) split into two bullets that each drop one side, or left packed instead of restated as "only on the first Slice"
- A "that Slice" / clicked-item / Backspace-the-selected-Slice AC with only one item (always-delete-last on one `New Slice`) and no last-Slice restatement; two default-named Slices using "does not show a listitem named New Slice"; inspect that requires a `data-kind` GET HTML does not emit
- Two numbered rules in the same spec cannot both hold
- Problem names later-slice behavior as current (⌘+/⌘-/⌘0 change Timeline scale while product.md keeps keyboard zoom later)
- A fake / test-double parse tightened with a new unit test and no spec hunk
- Extra visible chrome with no AC (`<title>`, extra nav, extra form, extra link on a route)
- Extra inspect of Out of scope kinds (Inspector Name on Command / Event / Read Model / Automation; leftover Add Field / Field name after insert-if-missing switch)
- Out of scope omits sibling kinds this slice did not implement (Event / Read Model / Automation reload-lists)
- Out of scope omits in-session visible text when the AC is accessible name
- Extra persistence (R2 `put`, D1 insert) with no AC that asserts the stored body
- Mail subject or From display name pinned in tests or production with no spec sentence
- Extra host `observability` or unused binding with no AC and no architecture row
- Extra Playwright `workers` (always-on isolation) with no spec sentence
- Flagging a Playwright wait after open (editor bound / `networkidle`) / New Slice / named Ports / force hover as extra chrome (those are Assumptions)
- wrangler `run_worker_first` lists a path architecture still describes as `/api/*` only
- Production composition root constructs architecture adapters only under a test flag
- A spec or plan under `docs/superpowers/` (or any tree other than `docs/specs/` and `docs/adr/`)

**All of these mean: stop coding. Update the spec.**
