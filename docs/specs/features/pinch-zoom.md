# Pinch zoom

Status: validated

## Problem

Toolbar zoom and ⌘+/⌘-/⌘0 change Timeline scale. Ctrl+wheel (trackpad pinch-zoom stand-in) does not, so Mac pinch zoom has no web counterpart.

## Acceptance criteria

- [x] A ctrl+wheel on the Timeline region sets the Timeline `style.transform` to a `scale(` whose factor is not the unzoomed pan `1`

## Domain terms

Event Model, Team, Person, Version

## Seams

- Browser — Playwright against `wrangler dev` with `TEST_MAIL=1`

## Assumptions

- Playwright `mouse.wheel({ deltaY: 80 })` with `ControlOrMeta` held on the Timeline is the pinch-zoom stand-in. Horizontal wheel pan stays [canvas.md](./canvas.md). Vertical scroll pan stays [canvas.md](./canvas.md). Toolbar zoom stays [editor-shell.md](./editor-shell.md). Keyboard zoom stays [product.md](../product.md) later.
- After this wheel, exact factor is not asserted (Mac pinch is continuous).
- Extra Mac zoom menu stops (50% / 75% / 150%) are not ported; toolbar and ⌘ zoom factors stay 1.25 / 0.8 / 1.
- The `TEST_MAIL=1` memory adapter does not count login attempts, so Playwright files can share one Worker without the production 5-per-hour cap.

## Out of scope

Extra zoom percentages. Mac window chrome. Toolbar zoom, keyboard zoom, scroll pan, and pinch pan stay those specs.

## Restates

- [product.md](../product.md) — Zoom / pan includes pinch zoom. Playwright path for this slice adds: ctrl+wheel on Timeline sets a `scale(` whose factor is not the unzoomed pan `1`.
