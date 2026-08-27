---
name: receiving-code-review
description: >
  Use when a spec-reviewer or human left pull-request comments, before
  implementing review feedback, when a review strengthens tests for ACs
  whose production already landed, a one-item / clicked-item Backspace /
  always-delete-last tests-only follow-up, a unique assertion restated after
  weaker includes-scale production, a targeting packed "and" split into two weaker
  it titles, a tests-only Playwright wait / wait-after-open helper after production,
  or when feedback is unclear or looks wrong.
---

# Receiving code review

Verify, then act. Do not performatively agree. Do not implement a comment you have not checked against this repo.

This skill is for the **implementer** (`.agents/agents/spec-implementer/AGENT.md`). The orchestrator resumes that agent; it does not apply this skill in its own checkout. The reviewer is `.agents/agents/spec-reviewer/AGENT.md` via `spec-review-loop`.

## Pattern

1. Read every comment before changing code.
2. Restate each blocking item, or ask if it is unclear.
3. Check the spec, `CONTEXT.md`, and the code.
4. If it is right: `tdd-loop` + one `logical-commits` commit + push. One commit per thread. A review that strengthens tests (weaker fixture) for ACs whose production already landed is reconstruct into each AC's production commit — not a tests-only follow-up, and not one commit that rewrites all three (`logical-commits`). A one-item Backspace / always-delete-last thread of an AC whose production already landed is that reconstruct even when the restated two-item proof now fails always-delete-last. A restated unique assertion (factor is not the unzoomed pan `1`) after weaker `includes scale(` / `toContain("scale(")` production landed is that reconstruct — not a tests-only follow-up. A commit whose subject names two threads with "and" has not addressed either thread. A reply that names the grouping and does not split independently revertible ACs has not addressed a `logical-commits` thread. A reply that splits a checkbox with no unique production (reload GET already hydrates) into a tests-only commit has not addressed the thread — fold the proof (`logical-commits`). A review thread that calls that fold grouping is wrong — reply with the GET-hydration evidence. A reply that splits an early-return reject that shares one production path (400 **and** does not create) has not addressed the thread — those packed words are one criterion (`testing`). A reply that splits a targeting packed "and" (first Slice has X and last is []) into two `it`s that each drop one side, or leaves the packed title, has not addressed the thread — restate as "only on the first Slice" and keep both assertions in that one `it` (`testing`). A reply that fromKind and toKind can share a commit, or that the first toKind commit may copy toKind for every target, has not addressed the thread — land EVENT toKind only, then READMODEL (`logical-commits`). A reply that refuses to rebase tests-after because folding into a later AC would group two criteria has not addressed the thread — land the production+test slice *before* the dependent AC (`logical-commits`). A follow-up tests-only commit after a tests-after thread is not a fix — reconstruct into the production commit (`logical-commits`). A tests-only wait-after-open / wait-after-click helper on top of AC commits has not addressed the thread — reconstruct that wait into each AC's production+Playwright commit. Folding the helper onto HEAD does not reconstruct it (`logical-commits`). A follow-up that rewrites tests onto the click path is still a follow-up — rebase so each field AC's test and the production the click uses land together. Folding several tests-after into one sibling production commit is grouping, not a rebase (`logical-commits`).
5. If it is wrong: reply on the **thread** with spec/code evidence. Do not silently skip it.
6. If it conflicts with a user decision or a locked spec: stop and ask the user.

Unclear items block the whole batch. Do not implement 1–3 and 6 while 4–5 are fuzzy.

## Sources

- **User:** implement after you understand; still ask on scope.
- **`spec-reviewer` or other agents:** skeptical. Confirm it matches `docs/specs/` and the locked patterns. Push back when it invents a new stack or a synonym for a `CONTEXT.md` term.

## Order

Clarify first. Then: blocking / security → small fixes → logic. Each fix gets its own test. `verification-before-completion` before you say the thread is done.

## Thread replies

Reply on the inline GitHub thread (`gh` or the harness GitHub API), not as a new top-level PR comment. Include the fixing SHA. Do **not** resolve the thread — the `spec-reviewer` resolves it only after it re-validates the fix.

## Voice

State the requirement or the fix. No "great point" / "absolutely right" / thanks. If you pushed back and were wrong: "Checked X; you were right because Y. Fixing."
