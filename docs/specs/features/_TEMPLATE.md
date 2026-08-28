# {Feature name}

Status: draft

## Problem

One paragraph: who, what, why. Do not name later-slice behavior as current (⌥⌘→ while product.md keeps Move slices right later; undo of move / delete while product.md keeps those later).

## Acceptance criteria

Testable bullets. Each becomes one test name. One behavior per bullet; "and" (any case) means split unless the cases share one early return (`testing`). An "includes `scale(`" AC that existing pan already satisfies is unfinished (`testing`). Restating a bullet renames that test. A leftover title that now includes the restated words must assert those words (or drop them from the leftover title).

- [ ] …

## Domain terms

Terms from `CONTEXT.md` this feature uses. New terms are added to `CONTEXT.md` in the same change. Every listed word already exists there, or is added in this change. Forbidding a term as a visible title or field label updates that term's `_Avoid_`.

## Seams

Which architecture seams this feature crosses. Name them when the product has an architecture spec; otherwise name the module interface the tests will call. Seams that name a call path production does not take, or mutations the stack does not record, contradict the ACs. Replacing a released module's arity without restating that spec's Seams is unfinished (`keeping-specs-current`).

## Events

If the product catalogs actions (observability spec): `action` names from that catalog (add rows there if new). Otherwise omit this section.

## UI

If the product inventories screens and primitives (design-system spec): screens and primitives this feature uses. Starting or stopping compose of an existing primitive updates that inventory. Listing a primitive here without an AC that asserts it is leftover (`keeping-specs-current`). Otherwise omit this section.

## Assumptions

Environment facts (hostname, test adapter, platform flags). A shippable operator command or npm script that changes persisted state, or host-path construction of an architecture-named adapter, is an acceptance criterion so `tdd-loop` can name it — do not park it here. Distinguishing behavior existing production does not already do (factor is not the unzoomed pan `1`) is an acceptance criterion — do not park it here. A shared Inspector textbox value after select (Description; empty omitted JSON) is an acceptance criterion — do not park it here. Visible copy / an insert on the source listitem is an acceptance criterion — do not park it here. A mutation key leftover released specs and this HEAD's write path do not implement (by id vs last-of-kind; GET listitems have no `data-id`) is unfinished — restate to match HEAD (`keeping-specs-current`).

## Out of scope

Explicit non-goals. When ACs cover some kinds of a shared family, name the omitted kinds here (Event reload-lists; Event / Read Model same-port copy; Event / Read Model onto Actor / Automation / Slice; Event → Read Model duplicate of a kind-agnostic refuse; Event → Read Model Connection after reload when ACs only cover Command → Event). When ACs are in-session Backspace and GET listitems have no `data-id`, name delete-after-reload (inspect-after-reload family). Unnamed stay later for work a released spec already owns is unfinished — point at that spec (`keeping-specs-current`). Dropping that pointer when rewriting Out of scope is the same miss.

## Restates

A blank line and this `## Restates` heading must survive rewriting the Out of scope paragraph (`keeping-specs-current`). Released specs whose bullets this change rewrites. Search `docs/specs/` for the restated token including packed Out of scope lists (`Inspector Description / Fields / Slice type picker`; `Slice type picker, inspect after reload, Mac window chrome`; `Event / Read Model / Automation reload-lists`; `Canvas move / delete / pan / undo`; `Undo, pan, and moving Slices`) and leftover always-last Name (`Chrome Name still mutates the last Command`), not only `stay later` or the restated bind-by-id words. Checking named Restates files is unfinished until that grep is empty except the restated sentences. After rebase, grep every catalog-released spec on HEAD, not only named Restates. Listing a path without rewriting that file is unfinished. One path per Restates list item — `this slice.- [other.md]` is unfinished (`keeping-specs-current`). A path that is not in this tree (`canvas-rest.md`, `add-on-lane.md`, `delete-blocks.md` not on this HEAD / not in README.md even if released on default / merge-before sibling) or "do not edit if not on the branch" is unfinished — drop it. Do not link files that are not in the tree from Assumptions. After unsplit / dropping an AC onto a released spec, leftover Restates of product.md that still assign the dropped AC to this slice (`pinch pan … are canvas-rest.md`) is unfinished (`keeping-specs-current`). When Restates names a path (system spec or sibling feature), leftover locked claims, leftover Out of scope still listing those words as unowned later (leftover remaining Adds after a comma; packed Undo onto canvas), and leftover stay-later for restated words (`fields stay later` after Out of scope moved Inspector Fields; generic `Dashed Add and keyboard stay later` after Out of scope split ⇧⌘N vs remaining ⌥⌘1–5; generic `Multi-item Name binding stays later` after Out of scope split Command vs Slice / Actor; leftover `stays later` then `are inspect-rest.md` in the same paragraph) are rewritten (`keeping-specs-current`). Rewriting only one sibling word (undo; Command Description / Command Field after reload) is unfinished.
