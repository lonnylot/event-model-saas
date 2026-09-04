# This product (Event Model SaaS)

Load with `tdd-loop`. Portable procedure is `SKILL.md` (spec-loop).

Product weaker readings: `testing/PRODUCT.md`. Product chrome / Restates: `keeping-specs-current/PRODUCT.md`. Commit grouping: `logical-commits/PRODUCT.md`.

## RED

An empty `it` (setup, no assertion) is not RED — it stays green if production is deleted.

A Playwright locator or unit fixture listed in `testing/PRODUCT.md` is the weaker reading — fix the test before writing production. Playwright `toHaveCSS` of UA-default Email Field canvas fill or inherited heading ink stays green if the unique declaration is deleted. Playwright `locator.focus()` of `:focus-visible` stays green if the rule is only `:focus`. Unit `/aria-label="Timeline"[\s\S]*Actor/` of an in-region AC stays green if Actor is in Inspector. Timeline `style.transform` does not include `translate(` of TIME chrome does not pan stays green if TIME chrome is inside `.board`. Command → Event Happened `.board` after drag stays green if the Event → Read Model kind-gated arm is still a sibling of `.board`. Command → Event Happened after-drag `.board` and undo-rest Timeline-shows stay green if ⇧⌘Z redo still `timelineEl.append`s as a sibling of `.board`. GET after Create one seeded Actor / one Automation after Add+Save+reload (`json.slices[0].actors[0]` / `[]`) stays green for `.at(-1)` / `[0]`. One-slice Create-default after ⌥⌘ stays green if DOM `lastLaneList` while JSON uses `selectedSliceIndex`.

A targeting "only on the first Slice" packed "and" stays one `it`. Copy vs splice is not targeting — one `it` each.

## GREEN

Look of named screens is `visual-design`, not extra UI. Padding, type, and composition of existing primitives on those screens do not need a new AC per property. New heading/image/static page: append the AC in this commit (`visual-design` Look may grow). That skip is a new validate, not `spec-review-loop`.

No extra **capability** chrome the AC does not name (`keeping-specs-current/PRODUCT.md`): no Inspector Name on Out of scope kinds; no extra stylesheet on an Out of scope route; no leftover paper `ink-paper` on public `body.login`; no `textContent` wipe of `Command port`; no leftover Type after `Event Happened → Read Model` when `unbindType` is gated on `Command → Event Happened`; no leftover To Read Model after a From-only remove; no leftover Field name after `unbindAddField()` only. Title-only shortcut Command / Event Happened / Read Model while toolbar Add mounts those ports is a tighter contract — Out of scope must name **in-memory** ports, not only GET after reload (`keeping-specs-current/PRODUCT.md`). Out of scope "GET ports after reload" on a slice with no new in-memory listitem path (`hydrate-add-field` Inspector `Add Field`; `port-wrap` restyles existing toolbar `Add Event` listitems) is unused cargo-cult — drop it or point at `hydrate-board.md`. Omitting `data-id` / `data-kind` on those listitems when toolbar Add emits them is the same tighter contract for inspect/delete — Out of scope must name inspect/delete on those listitems, not only GET / inspect-after-reload.

No extra R2/D1 write without a stored-body AC. Architecture adapters constructed on Worker `fetch`, not only behind `TEST_MAIL=1`.

## TDD slice

When restating a weaker fixture after production landed, reconstruct into that production commit (`logical-commits/PRODUCT.md`). After the PR is open, spec-loop owns the slice: one review/CI commit on HEAD.
