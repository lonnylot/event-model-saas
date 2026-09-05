# {Feature name}

Status: draft

## Problem

One paragraph: who, what, why. Restating an AC is unfinished until this paragraph no longer lists the deleted tell as current (`keeping-specs-current`). A Problem that names only Command when ACs also cover Event / Read Model / Automation is leftover-narrow (`keeping-specs-current`). A Problem that names leftover Type after a Connection when unique production unbinds Type only on `Command → Event Happened` is leftover-narrow (`keeping-specs-current`). A Problem that names only Field name when ACs also drop Field type / Optional / Example / Delete Field is leftover-narrow (`keeping-specs-current`). A Problem that names only Slice leftover Name and Type when ACs also cover Actor leftover Name after empty `.board` is leftover-narrow (`keeping-specs-current`). A Problem that names Inspector Name on Actor and Automation when unique AC is GET Actor Name JSON is leftover-wide (`keeping-specs-current`). A Problem that names leftover Add Field when unique AC is Inspector `Nothing Selected` is leftover-wide (`keeping-specs-current`).

## Acceptance criteria

Testable bullets. Each becomes one test name. One behavior per bullet; "and" (any case) means split unless the cases share one early return (`testing`). Restating a bullet renames that test. A leftover title that now includes the restated words must assert those words (or drop them from the leftover title).

- [ ] …

## Domain terms

Terms from `CONTEXT.md` this feature uses. New terms are added to `CONTEXT.md` in the same change. Every listed word already exists there, or is added in this change. Forbidding a term as a visible title or field label updates that term's `_Avoid_`.

## Seams

Which architecture seams this feature crosses. Name them when the product has an architecture spec; otherwise name the module interface the tests will call.

## Events

If the product catalogs actions (observability spec): `action` names from that catalog (add rows there if new). Otherwise omit this section.

## UI

If the product inventories screens and primitives (design-system spec): screens and primitives this feature uses. Starting or stopping compose of an existing primitive updates that inventory. Otherwise omit this section.

## Assumptions

Environment facts (hostname, test adapter, platform flags). A shippable operator command or npm script that changes persisted state, or host-path construction of an architecture-named adapter, is an acceptance criterion so `tdd-loop` can name it — do not park it here.

## Out of scope

Explicit non-goals.

## Restates

Released specs whose bullets this change rewrites. Listing a path without rewriting that file is unfinished. Restating Out of scope is unfinished until leftover Restates no longer describes the parked behavior (`keeping-specs-current`). UI inventory of `design-system.md` is not a Restates rewrite (`keeping-specs-current`). Rewriting a released spec this HEAD without listing it is unfinished. After rebase, grep leftover paper Page / Page background assigned to visual-shell against every catalog-released spec (`keeping-specs-current`). Grep draft `architecture.md` for leftover token/CSS assignment even when Restates omitted it (`keeping-specs-current`). When Restates names a system spec, leftover locked claims this HEAD does not implement are rewritten or given ACs (`keeping-specs-current`). Restates assigning GET Connection `data-id` when unique production is GET `Command → Event Happened` and Out of scope parks GET `Event Happened → Read Model` is leftover locked claim (`keeping-specs-current`).
