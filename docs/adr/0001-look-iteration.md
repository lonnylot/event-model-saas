# Look is iterated; tokens and accessibility are locked

Named HTML screens may change spacing, type, and layout without a catalog of computed-CSS acceptance criteria. Brand tokens in `docs/specs/design-system.md` and WCAG 2.2 AA are locked. Look chrome on those screens (headings, images, landmarks, static public pages) is appended as ACs in the same commit as production; do not halt for a new *validate* of that chrome. The feat/ PR is still the review gate (`spec-review-loop`); merge is still `release-manager`. Look-may-grow is not skip review. New persistence, new capabilities, and Out of scope still require a user decision. Procedure: `visual-design` inside `spec-implementer`.

Status: accepted
