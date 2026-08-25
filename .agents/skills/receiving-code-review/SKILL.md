---
name: receiving-code-review
description: >
  Use when a spec-reviewer or human left pull-request comments, before
  implementing review feedback, or when feedback is unclear or looks wrong.
---

# Receiving code review

Verify, then act. Do not performatively agree. Do not implement a comment you have not checked against this repo.

This skill is for the **implementer**. The reviewer is `.agents/agents/spec-reviewer/AGENT.md` via `spec-review-loop`.

## Pattern

1. Read every comment before changing code.
2. Restate each blocking item, or ask if it is unclear.
3. Check the spec, `CONTEXT.md`, and the code.
4. If it is right: `tdd-loop` + one `logical-commits` commit + push. One commit per thread. A commit whose subject names two threads with "and" has not addressed either thread. A reply that names the grouping and does not split independently revertible ACs has not addressed a `logical-commits` thread. A reply that an early-return reject must stay one commit (400 **and** does not create) has not addressed the thread — persist-then-400, then skip the write (`logical-commits`). A reply that refuses to rebase tests-after because folding into a later AC would group two criteria has not addressed the thread — land the production+test slice *before* the dependent AC (`logical-commits`). A follow-up tests-only commit after a tests-after thread is not a fix — rebase; do not add another tests-only commit on top. A follow-up that rewrites tests onto the click path is still a follow-up — rebase so each field AC's test and the production the click uses land together. Folding several tests-after into one sibling production commit is grouping, not a rebase (`logical-commits`).
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
