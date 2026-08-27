# New Slice shortcut

Status: validated

## Problem

New Slice exists as a toolbar button. ⇧⌘N does not append a Slice, so the Mac keyboard equivalent is missing.

## Acceptance criteria

- [x] Pressing ⇧⌘N on the Event Model page appends a Slice whose `title` is `New Slice`
- [ ] Pressing ⇧⌘N on the Event Model page shows a listitem whose accessible name is `New Slice`

## Domain terms

Event Model, Slice, Team, Person, Version

## Seams

- `document` module — append Slice; the editor ⇧⌘N path calls `appendSlice` (same as the toolbar)
- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- ⇧⌘N is Playwright `Shift+ControlOrMeta+KeyN`. Toolbar `New Slice` stays [editor-shell.md](./editor-shell.md). Empty Slice JSON stays that file.
- New Slice is in-memory until Save. Save still uses the version check from model-persistence.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

⌥⌘1–5, dashed Add on a lane, Description, Fields, Slice type picker, Mac window chrome. Toolbar New Slice stays [editor-shell.md](./editor-shell.md).

## Restates

- [editor-shell.md](./editor-shell.md) — Out of scope no longer owns ⇧⌘N; this slice owns those. Toolbar New Slice stays this file. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [product.md](../product.md) — New Slice (⇧⌘N / toolbar). Playwright path for this slice adds: ⇧⌘N appends New Slice and shows that listitem.
- [model-persistence.md](./model-persistence.md) — Out of scope no longer owns ⇧⌘N; this slice owns those. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [connections.md](./connections.md) — Out of scope no longer owns ⇧⌘N; this slice owns those. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [inspect-blocks.md](./inspect-blocks.md) — Out of scope no longer owns ⇧⌘N; this slice owns those. Keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [inspect-after-reload.md](./inspect-after-reload.md) — leftover keyboard shortcuts rewritten; ⇧⌘N is this file. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [inspect-connection.md](./inspect-connection.md) — leftover keyboard shortcuts rewritten; ⇧⌘N is this file. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [model-inspector.md](./model-inspector.md) — leftover keyboard shortcuts rewritten; ⇧⌘N is this file. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [slice-type.md](./slice-type.md) — leftover keyboard shortcuts rewritten; ⇧⌘N is this file. Dashed Add on a lane and keyboard ⌥⌘1–5 are [add-on-lane.md](./add-on-lane.md).
- [add-on-lane.md](./add-on-lane.md) — Restates no longer owns ⇧⌘N as keyboard shortcuts; this slice owns ⇧⌘N. Keyboard ⌥⌘1–5 stay that file.
