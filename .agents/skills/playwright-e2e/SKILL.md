---
name: playwright-e2e
description: >
  Use when adding or changing Playwright tests, a test:e2e script, a
  script-existence guard, an exact `playwright test` script value, a
  browser user flow, an accessible-name locator, a does-not-show
  control assertion, a listitem visible-text `/^X/` when Ports are descendants,
  a listitem toHaveText that pins a Command port wipe,
  the CI job that runs flow tests, Playwright
  webServer env, blanking live API keys, an empty-state flow after a
  mutating spec file, an already-mounted UI re-open, an async form
  fetch before reading last-mail, wait for New Slice after click,
  named Ports before pointer-down, force hover vs Timeline pan,
  wait after open (editor bound) before lane Add or ⌥⌘1–5,
  Playwright `workers` isolation, checkout-unique PORT / INSPECTOR_PORT,
  or a Backspace / clicked-item / first-vs-last / the first New Slice flow with one item (always-delete-last / .first() / only-last).
  Also when updating a Flow row in a testing spec.
---

# Playwright e2e

Flow tests prove the catalogued user path through a real browser. Domain and app unit tests stay on fakes. This skill is how to place and run Playwright. Criteria live in the testing spec (when the product has one) and the feature spec.

## When to use

- New Playwright spec, `test:e2e` script, or CI flow job
- Register / login / a named user journey in a browser
- "Do we need e2e for this?"

## Loop

1. **Quote the criterion.** Open the feature spec and the Flow row in the testing spec if it exists. Test name is that criterion. The Playwright spec lands in the same commit as the production that implements that criterion (`logical-commits`). A clicked-item / Backspace / first-vs-last / `the first New Slice listitem` flow with one `New Slice` is the weaker reading (`testing`); always-delete-last / `.first()` / only-last / `.at(-1)` stays green. Two default-named Slices prove remaining JSON id, not "does not show New Slice". Completion: deleting the flow would fail this test for that reason.

2. **Script and CI.** Read `package.json` (or the product's equivalent). If `test:e2e` is missing, add it (Playwright's documented runner) in the same change. Changing Playwright `workers` (or other runner isolation) needs a spec sentence first (`keeping-specs-current`) — do not silently set `workers: 1` always. Checkout-unique wrangler `--port` / `--inspector-port` is runner isolation. If CI has no job that runs that script, add one on `pull_request` — unit tests + build do not prove a click path. A unit test that only checks `scripts["test:e2e"]` is a non-empty string stays green if the script is `true` or `echo`. Unordered `toContain("playwright")` plus `toContain("test")` stays green for `echo playwright test`. An AC that says the script "includes the tokens" is a weaker criterion — restate as the script **is** `playwright test` (`keeping-specs-current`). Completion: the manifest and the workflow name the same script; any script-existence test asserts the exact value `playwright test` (consecutive runner tokens), not `length > 0` and not unordered token inclusion.

3. **Seams in the test server.** The documented test adapter constructs auth, persistence, and any model/HTTP fakes **once per Node process** so register, login, and later requests in the same test still see that state (`codebase-design` composition root). Keep that process-global state **inside one test** so a multi-step flow still sees the account. Reset the fake store/mail **between files** so an empty-state spec still passes after a mutating file has run. Playwright's webServer env blanks live API keys so the suite cannot reach third-party hosts. Point any file database at a temp path. Flow tests use that documented test adapter; they do not prove a production store (`testing`). Completion: a second request in the same test still sees the registered account; empty-state still passes after a mutating file ran (file order does not matter); `workers: 1` is not that proof; the spec does not call the live vendor. A leftover identifier in wiring source is not this proof (`testing`).

4. **Drive the UI the user sees.** Prefer role + accessible name (the same label the screen already has). If the AC says the accessible name **is** `X`, the locator must fail a heading named `X` plus a suffix (`{ exact: true }` or `/^X$/`) — substring `name: "X"` is a weaker reading (`testing`). If the AC says listitem visible text **is** `X`, `/^X/` on the listitem is the weaker reading when Ports are descendants — prove the own text node so extra suffix fails (`testing`). If the AC is the listitem's own visible text, Playwright `toHaveText` on the listitem is the weaker reading (`testing`) — it stays green only when descendant `Command port` is deleted; assert the own text node and that `Command port` remains. A "does not show a control named X" query that lists only `button` and `link` stays green for a checkbox or menuitem named X (`testing`) — query widget roles, or assert no accessible name X on any control. Add `data-testid` only when no accessible name exists, and only in the same change as the screen. One flow per test. A re-open after a panel is already mounted is close, then follow-up submit, then assert open without clicking the trigger — first-paint `data-state="open"` is not this proof (`testing`). After click/submit on a control whose handler is async `fetch`, wait for that request (or the user-visible result) before reading `/api/test/last-mail` or any side effect the fetch produces — Playwright's click does not wait for that handler. After open, wait for `networkidle` so `bindEditor` is attached before New Slice click — otherwise the click is a no-op and `toHaveCount` stays 0. After click `New Slice`, wait for the New Slice listitem before Add, pointer-down, lane Add, ⌥⌘1–5, or asserting named lane buttons, and wait for the named lane buttons before asserting, clicking them, or pressing ⌥⌘1–5. After Add Command / Event / Read Model, wait for the named Ports before pointer-down, hover, or drag — otherwise CI times out waiting for `Command port`. Hover a Port with `{ force: true }` when Timeline pan would steal the pointer. Those waits are Assumptions, not extra chrome (`keeping-specs-current`). Completion: the test fails if that button or heading is removed, and fails if the accessible name is `X` plus more characters; pointer-down and Port drag wait for the New Slice listitem and named Ports; lane Add and ⌥⌘1–5 wait after open for editor bound, then for the New Slice listitem and named lane buttons; Port hover uses `force` when Timeline pan exists.

5. **Session.** Register (or login) through the UI in the test. Do not mint a session cookie in the spec unless a documented test-only helper exists. Completion: an unauthenticated visit still redirects to the login route (or the product's documented unauthenticated path).

6. **Prove it.** Run the `test:e2e` script fresh (`verification-before-completion`). Completion: exit 0, or you have a failing log.

## Rationalizations

| Excuse | Reality |
|--------|---------|
| "Unit tests already click the action" | App tests fake the browser. Flow is Playwright. |
| "We'll add the CI job later" | Local green is not the shared gate. |
| "Hit the real vendor, it's more realistic" | Live third-parties in CI are nondeterministic and leak keys. Fake the seam. |
