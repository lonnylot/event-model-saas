# Connection event issue copy

Status: validated

## Problem

Mac Event → Command refusal is `An event can't issue a command.` Web locked `An event can't trigger a command.` A member who knows the Mac copy sees a different reason on the Event.

## Acceptance criteria

- [x] Dragging from `Event Happened port` onto `Command port` shows the text `An event can't issue a command.` in the Event Happened listitem

## Domain terms

Event Model, Slice, Command, Event, Connection, Team, Person, Version

## Seams

- `bindPointer` in `public/editor-pointer.js` — Event → Command refusal copy
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Event → Command still does not append a Connection ([connection-feedback.md](./connection-feedback.md)). The refusal sentence is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Other refusal sentences. Port highlight of the hovered Event. Live Connection titles. TIME click empty Inspector. Landing. Mac window chrome.

## Restates

- [connection-feedback.md](./connection-feedback.md) — Event → Command still does not append. Copy `An event can't trigger a command.` and the leftover `test()` title that quotes those words are this slice (`An event can't issue a command.`).
- [product.md](../product.md) — Event → Command copy is `An event can't issue a command.` Highlighting legal targets, snap-back, Command → Read Model copy, and Event → Command (no edge) stay [connection-feedback.md](./connection-feedback.md).
- [connection-refusals.md](./connection-refusals.md) — Leftover `trigger` copy is this slice (`An event can't issue a command.`). Event → Command no-append stays [connection-feedback.md](./connection-feedback.md). Other refusal sentences stay this file.
