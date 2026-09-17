# Inspect after delete parent rest

Status: validated

## Problem

Command Backspace already shows parent Slice Type. Backspace of Actor / Event / Read Model / Automation sets `selected` to null and leaves Inspector Name / Add Field. Mac `deleteSelection` sets `selection` to the parent Slice.

## Acceptance criteria

- [x] After clicking `Add Actor`, clicking the Timeline `Actor` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`
- [ ] After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`
- [ ] After clicking `Add Read Model`, clicking the Timeline `Read Model` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`
- [ ] After clicking `Add Automation`, clicking the Timeline `Automation` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`

## Domain terms

Event Model, Slice, Actor, Event, Read Model, Automation, Team, Person

## Seams

- `bindKeyboard` in `public/editor-keyboard.js` — after Actor / Event / Read Model / Automation Backspace, Inspector shows the parent Slice
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## UI

Screens: Editor. Primitives: Page. Look of Editor is `visual-design` ([ADR 0001](../../adr/0001-look-iteration.md)). Inventory: [design-system.md](../design-system.md).

## Assumptions

- Playwright unique checkout `PORT` / `INSPECTOR_PORT` and `TEST_MAIL=1` `workers` `1` stay [public-face.md](./public-face.md).
- Parent Slice Type after Command Backspace stays [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). TIME / empty `.board` still shows `Nothing Selected` ([inspect-deselect.md](./inspect-deselect.md)). After-delete parent Slice for Actor / Event / Read Model / Automation is this slice.
- Accessibility bar is WCAG 2.2 AA for contrast of locked token pairs and a visible `:focus-visible` affordance ([ADR 0001](../../adr/0001-look-iteration.md)).

## Out of scope

Command after-delete Type is [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md). TIME click empty Inspector. Landing. Mac window chrome. Copy changes.

## Restates

- [inspect-after-delete-parent-slice.md](./inspect-after-delete-parent-slice.md) — Out of scope no longer parks after-delete parent Slice for Actor / Event / Read Model / Automation; those are this slice.
- [inspect-after-delete.md](./inspect-after-delete.md) — Out of scope no longer parks Inspector empty after Actor / Event / Read Model / Automation Backspace; those are this slice (parent Slice Type). Inspector empty after Slice / Connection Backspace stays that file.
- [inspect-deselect.md](./inspect-deselect.md) — TIME / empty `.board` `Nothing Selected` stays that file.
- [product.md](../product.md) — After Actor / Event / Read Model / Automation Backspace, Inspector shows the parent Slice.
- [architecture.md](../architecture.md) — After-delete parent Slice for Actor / Event / Read Model / Automation is this slice.
