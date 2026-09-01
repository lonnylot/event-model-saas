---
name: visual-design
description: >
  Use when restyling HTML, iterating look, spacing, type, or layout of
  named screens, when a computed-color AC would stand in for a composed
  page, when extra chrome is look not capability, when applying design
  tokens, when adding a heading, image, landmark, or static public page
  during a look pass, when a look selector would miss markup that is not
  that element, when viewport meta is copied onto sibling HTML of named
  screens, when a webfont import would change the type token, when
  look-may-grow would contradict Out of scope webfonts, or when a
  reviewer would block padding without an AC.
---

# Visual design

Look of **named screens** is iterated. Brand tokens and accessibility are locked. New **capability** still needs a spec decision.

This skill is the loop. Tokens live in the design-system spec when the product has one. The accessibility bar lives in an ADR or that design-system spec — do not cache the bar here.

## When to use

- Restyle an existing route or HTML surface
- "Make it look like a designed product"
- A checkbox would only name `font-size`, `padding`, or `border-*-color`
- Adding visual structure (heading, image, landmark, static public page) on a screen the spec already names

Do **not** use this skill to add persistence, public signup, billing, or copy that asserts a new product claim. Those are `keeping-specs-current` + user decision.

## Locked vs iterated

| Locked (spec or ADR) | Iterated (this skill) |
|----------------------|------------------------|
| Screens, routes that do work, copy that claims, controls that persist or submit | Spacing, type scale (font-size/weight/line-height, not the `type` token font-family), density, how primitives compose |
| Brand tokens | Hover/focus styling that does not add a control |
| Accessibility bar (contrast, names, keyboard, focus visible) | Layout of the same screens |
| Out of scope | — |

A feature spec does **not** catalog computed CSS per property. It names screens, tokens used, a11y, and the controls/copy that must remain.

## Look may grow (no mid-slice halt)

On a **validated** spec that already names the screens:

The **implementer** (`spec-implementer`) may add look chrome — section heading, product image of existing UI, landmark, decorative control, static public page that does not persist — by **appending the AC, then the production, in the same commit**. Do not stop for a new human *validate* of that chrome. Look-may-grow is not skip review: the feat/ PR still enters `spec-review-loop` after the first green commit, and merge is still `release-manager`. The orchestrator does not screenshot-and-iterate in this session.

Still stop and return `need-user` when the addition:

- Persists or calls a new API
- Adds a capability (signup, billing, a new authenticated flow)
- Asserts a new product claim (pricing, SLA, "anyone can join")
- Contradicts Out of scope or the accessibility bar
- Changes a brand token (the `type` font-family stack is not type scale)
- Ships a webfont `@import` (Out of scope webfont files)

## Loop

1. **Quote locked constraints.** Feature spec ACs, design-system tokens, accessibility bar. Completion: you can name the screens and the bar.

2. **Prove locked.** `tdd-loop` + `testing` for names, flows, token *use* (deleting the unique token declaration fails), and a11y. Do not add a computed-rgb `it` for each spacing or type rule. One proof that unique look rules exist (composed layout that is not the UA default) is enough for "not unstyled." Unique-look proof is a screen whose markup matches the selector — a `header` rule is not proof on a lead that is not `header`. Completion: those tests fail a weaker reading (`testing`).

3. **Iterate look in the browser.** Change CSS and structure of named screens. Check desktop and a narrow viewport. This step runs in `spec-implementer`, not the orchestrator session. Completion: tokens hold; a11y holds; existing named controls/copy remain; the composed page is not UA-default stack.

4. **Grow.** If a heading, image, landmark, or static public page is needed, append its AC and ship it in this look pass (`Look may grow`). Completion: `git show` lists the new AC with the production.

5. **Commit.** One look pass per named screen (or one stylesheet pass that several named screens mount, plus the shell it left). Viewport meta copied onto sibling HTML of those screens is that shell, not extra chrome — unique AC on one route is enough. Not one commit per CSS property (`logical-commits`). Then the next screen.

## Reviewer

Blocking: new control/copy/route **without** an AC on this HEAD; token contradiction; a11y miss; capability sneak-in; leftover product behavior chrome (`keeping-specs-current`).

Not blocking: padding, type, density, composition of existing primitives on named screens when tokens and a11y hold. Do not demand a prior human *validate* for look chrome whose AC landed in the same commit. Still require `spec-review-loop` Approve on this HEAD before `release-manager`.

## Pack mates (upstream)

When this skill is copied into spec-loop, these portable sentences move with it:

| Skill | Sentence |
|-------|----------|
| `keeping-specs-current` | Look of named screens is `visual-design`. Extra chrome is new capability, persistence, or a screen this spec does not own — not spacing/type/layout. Look chrome on named screens is an AC in the same commit (`visual-design` Look may grow). Viewport meta copied onto sibling HTML of named screens is the look shell, not extra chrome. |
| `tdd-loop` GREEN | Extra look on named screens is `visual-design`, not extra UI. |
| `testing` | Do not prove look as a pile of computed rgb() ACs. Prove names, flows, token use, a11y, and that unique look rules exist. |
| `logical-commits` | A look pass is one slice per named screen (`visual-design`). Viewport meta copied onto sibling HTML is that shell. |
| `spec-reviewer` | Do not block look iteration that has ACs on this HEAD. Do not require reconstructing a look AC into a prior human validate. Look-may-grow is not skip this review. |
| `spec-review-loop` | Look-may-grow PRs enter this loop after the first green commit. |
| `releasing-a-spec` | Screenshot-and-iterate is `spec-implementer`. Look-may-grow is not skip review. |
| `writing-for-agents` map | Look / spacing / type / layout of named screens → `visual-design` |
| `AGENTS.md` table | `visual-design` — restyling named screens; look may grow (not skip review); webfont / type token is need-user |

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Every padding needs a checkbox" | Tokens and a11y are locked. Spacing is this loop. |
| "New heading: stop for the user" | Append the AC. Do not halt for a new validate. The implementer still pushes the feat/ PR into `spec-review-loop`. |
| "I'll screenshot and iterate here" | Dispatch `spec-implementer`. The orchestrator does not write production code. |
| "Look-may-grow skips the reviewer" | It skips a new validate. `spec-review-loop` still runs. |
| "I'll add Sign up while I'm here" | Capability. `need-user`. |
| "A webfont @import is just type look-may-grow" | Type scale is font-size. The `type` token and a webfont `@import` are locked / Out of scope. `need-user`. |
| "toHaveCSS of every color is the look proof" | That is a token catalog, not a composed page. |
