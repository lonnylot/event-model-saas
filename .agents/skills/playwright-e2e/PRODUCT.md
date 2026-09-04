# This product (Event Model SaaS)

Load with `playwright-e2e`. Portable procedure is `SKILL.md` (spec-loop). Weaker-reading fixtures: `testing/PRODUCT.md`.

## Locators

If the AC says the accessible name **is** `X`, the locator must fail a heading named `X` plus a suffix (`exact: true` or `/^X$/`). Substring `name: "X"` is a weaker reading.

A listitem **in** the Timeline region is `getByRole("region", { name: "Timeline" }).getByRole("listitem", ...)`. Unit `/aria-label="Timeline"[\s\S]*Actor/` is the weaker reading (`testing`) — Inspector Actor after Timeline stays green.

If the AC says listitem visible text **is** `X`, `/^X/` on the listitem is the weaker reading when Ports are descendants — prove the own text node. `toHaveText` on the listitem stays green only when descendant `Command port` is deleted.

A "does not show a control named X" query that lists only `button` and `link` stays green for a checkbox or menuitem named X — query widget roles, or assert no accessible name X on any control.

A clicked-item / Backspace / first-vs-last / `the first New Slice listitem` flow with one `New Slice` is the weaker reading (`testing/PRODUCT.md`). GET after Create one seeded Actor / one Automation after Add+Save+reload (`json.slices[0].actors[0]` / `[]`) is that weaker reading. One-slice Create-default after ⌥⌘1–5 stays green if shortcut DOM uses `lastLaneList` while JSON uses `selectedSliceIndex` (`testing/PRODUCT.md`).

Playwright `toHaveCSS` of a computed color that is the UA default (`input` background `rgb(255, 255, 255)` / Email Field canvas fill) or inherited from a parent/body AC (Landing heading ink after public-face `body.landing`; editor `Slices` after `body.app-editor` ink) is the weaker reading (`testing`) — it stays green if the unique declaration is deleted.

Playwright `locator.focus()` of `:focus-visible` (`Sign in` box-shadow) is the weaker reading (`testing`) — it stays green if the rule is only `:focus`.

TIME chrome does not pan is unproven by Timeline `style.transform` does not include `translate(` — `.time-chrome` inside `.board` stays green (`testing`). That factor is an AC that asserts `.time-chrome`, or drop the claim (`keeping-specs-current`).

Event → Read Model copy on `.board` is unproven by Command → Event Happened `.board` tests — the second kind-gated drag arm stays sibling (`testing`). That placement is an AC that asserts `.board` contains `Event Happened → Read Model`, or revert that arm (`keeping-specs-current`). GET `connectionCopy` stays the one reload AC.

Leftover unused sibling of `.board` is unproven by after-drag `.board` + undo-rest Timeline-shows — ⇧⌘Z redo `timelineEl.append` stays green (`testing`). Append redo on `.board` so leftover unused holds (`keeping-specs-current`).

## Script

Any script-existence test asserts the exact value `playwright test` (consecutive runner tokens), not `length > 0` and not unordered token inclusion. An AC that says the script "includes the tokens" is a weaker criterion — restate as the script **is** `playwright test` (`keeping-specs-current`).

Changing Playwright `workers` (or other runner isolation) needs a spec sentence first. Checkout-unique wrangler `--port` / `--inspector-port` is runner isolation (portable skill already requires a unique checkout port).

## Waits (Assumptions, not extra chrome)

After click/submit on a control whose handler is async `fetch`, wait for that request (or the user-visible result) before reading `/api/test/last-mail`.

After open, wait for `networkidle` so `bindEditor` is attached before New Slice click.

After click `New Slice`, wait for the New Slice listitem before Add, pointer-down, lane Add, or ⌥⌘1–5, and wait for named lane buttons before asserting, clicking, or pressing those keys.

After Add Command / Event / Read Model, wait for the named Ports before pointer-down, hover, or drag.

Hover a Port with `{ force: true }` when Timeline pan would steal the pointer.

Dragging a Timeline Command / Event / Read Model / Automation listitem onto a Slice uses `sourcePosition` on the title, not the Port — a Port-centered `dragTo` starts a connection drag.

Flow tests use the documented test adapter; they do not prove a production store (`testing`).
