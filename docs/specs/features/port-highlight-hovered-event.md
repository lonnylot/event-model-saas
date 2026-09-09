# Port highlight hovered Event

Status: released

## Problem

Pointer-down on `Command port` sets `aria-current` on `querySelector('[data-kind="EVENT"]')` — the first Event in the document. Mac lights every legal Event target. A member dragging toward the last of two Events sees only the first Event lit.

## Acceptance criteria

- [x] After clicking `Add Event` twice, pointer-down on `Command port`, the last `Event Happened port` has `aria-current` `true`

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `bindPointer` in `public/editor-pointer.js` — legal Event port highlight
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- With one Event, pointer-down on `Command port` still lights that `Event Happened port` ([connection-feedback.md](./connection-feedback.md)). Two Events, last port lit, is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Hovered Read Model port among two. Event → Command copy. Connection redo. TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [connection-feedback.md](./connection-feedback.md) — One Event port highlight stays that file. Last of two Event ports lit is this slice.
- [product.md](../product.md) — Legal target highlight of the last of two Events is this slice.
- [connection-event-issue-copy.md](./connection-event-issue-copy.md) — Out of scope no longer parks Port highlight of the hovered Event; last of two Event ports lit is this slice.
- [chrome.md](./chrome.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
- [connections.md](./connections.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
- [canvas.md](./canvas.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
- [connection-refusals.md](./connection-refusals.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
- [delete-event-read.md](./delete-event-read.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
- [add-on-lane.md](./add-on-lane.md) — Highlighting legal targets of one Event stays [connection-feedback.md](./connection-feedback.md). Last of two Event ports lit is this slice.
