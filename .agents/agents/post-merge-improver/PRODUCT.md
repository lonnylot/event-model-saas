# This product (Event Model SaaS)

Load with `post-merge-improver`. Portable procedure is `AGENT.md` (spec-loop).

Product-instance harvest lands in `.agents/skills/<name>/PRODUCT.md` (or `.agents/agents/<name>/PRODUCT.md`), not in the portable `SKILL.md` / `AGENT.md`.

Discovery: `AGENTS.md` load rule + the portable skill's `description` still points at that skill. Ask: would an agent that read `AGENTS.md` + the pointed skill + its `PRODUCT.md` still make this miss?

Do not add a second copy of a spec-loop rule into `PRODUCT.md`. If the portable rule is wrong, that is a spec-loop change (or a one-line portable patch that must be re-folded on the next copy).
