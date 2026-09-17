# Port highlight hovered Read Model

Status: released

## Problem

Pointer-down on `Event Happened port` sets `aria-current` on `querySelector('[data-kind="READMODEL"]')` — the first Read Model. Mac lights every legal Read Model target. A member dragging toward the last of two Read Models sees only the first Read Model lit.

## Acceptance criteria

- [x] After clicking `Add Read Model` twice, pointer-down on `Event Happened port`, the last `Read Model port` has `aria-current` `true`

## Domain terms

Event Model, Slice, Event, Read Model, Connection, Team, Person, Version

## Seams

- `bindPointer` in `public/editor-pointer.js` — legal Read Model port highlight
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Last of two Event ports lit stays [port-highlight-hovered-event.md](./port-highlight-hovered-event.md). With one Read Model, pointer-down on `Event Happened port` still lights that `Read Model port` ([connection-feedback.md](./connection-feedback.md)). Two Read Models, last port lit, is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Hovered Event port among two is [port-highlight-hovered-event.md](./port-highlight-hovered-event.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [port-highlight-hovered-event.md](./port-highlight-hovered-event.md) — Out of scope no longer parks hovered Read Model port among two; last of two Read Model ports lit is this slice.
- [connection-feedback.md](./connection-feedback.md) — One Read Model port highlight stays that file. Last of two Read Model ports lit is this slice.
- [connection-refusals.md](./connection-refusals.md) — Event → Read Model highlight of one Read Model stays [connection-feedback.md](./connection-feedback.md). Last of two Read Model ports lit is this slice.
- [product.md](../product.md) — Legal target highlight of the last of two Read Models is this slice.
- [architecture.md](../architecture.md) — Last of two Read Model ports lit is this slice.
