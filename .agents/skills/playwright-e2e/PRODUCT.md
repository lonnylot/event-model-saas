# This product (Event Model SaaS)

Load with `playwright-e2e`. Portable procedure is `SKILL.md` (spec-loop). Weaker-reading fixtures: `testing/PRODUCT.md`.

## Locators

If the AC says the accessible name **is** `X`, the locator must fail a heading named `X` plus a suffix (`exact: true` or `/^X$/`). Substring `name: "X"` is a weaker reading.

If the AC says listitem visible text **is** `X`, `/^X/` on the listitem is the weaker reading when Ports are descendants — prove the own text node. `toHaveText` on the listitem stays green only when descendant `Command port` is deleted.

A "does not show a control named X" query that lists only `button` and `link` stays green for a checkbox or menuitem named X — query widget roles, or assert no accessible name X on any control.

A clicked-item / Backspace / first-vs-last / `the first New Slice listitem` flow with one `New Slice` is the weaker reading (`testing/PRODUCT.md`).

## Script

Any script-existence test asserts the exact value `playwright test` (consecutive runner tokens), not `length > 0` and not unordered token inclusion. An AC that says the script "includes the tokens" is a weaker criterion — restate as the script **is** `playwright test` (`keeping-specs-current`).

Changing Playwright `workers` (or other runner isolation) needs a spec sentence first. Checkout-unique wrangler `--port` / `--inspector-port` is runner isolation (portable skill already requires a unique checkout port).

## Waits (Assumptions, not extra chrome)

After click/submit on a control whose handler is async `fetch`, wait for that request (or the user-visible result) before reading `/api/test/last-mail`.

After open, wait for `networkidle` so `bindEditor` is attached before New Slice click.

After click `New Slice`, wait for the New Slice listitem before Add, pointer-down, lane Add, or ⌥⌘1–5, and wait for named lane buttons before asserting, clicking, or pressing those keys.

After Add Command / Event / Read Model, wait for the named Ports before pointer-down, hover, or drag.

Hover a Port with `{ force: true }` when Timeline pan would steal the pointer.

Flow tests use the documented test adapter; they do not prove a production store (`testing`).
