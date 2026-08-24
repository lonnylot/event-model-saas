# Hosted-app Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve a public placeholder at event-model.lonnylot.com from a Cloudflare Worker with static assets and GitHub Actions CI.

**Architecture:** One Worker (`event-model-saas`) with `assets` bound as `ASSETS`. `handleRequest` sends `/api` and `/api/*` to a JSON 404 and every other path to `env.ASSETS.fetch`. The SPA placeholder is `public/index.html`; unknown pages use `public/404.html`. No D1, R2, email, or session yet.

**Tech Stack:** TypeScript, Wrangler 4, Vitest, Playwright, GitHub Actions.

## Global Constraints

- Worker name is `event-model-saas`.
- Custom domain is `event-model.lonnylot.com` on zone `lonnylot.com`.
- Homepage heading text is exactly `Event Model`.
- Homepage invite copy is exactly `Access is by invite.`
- No sign-up control on the homepage (auth is a later spec).
- JSON 404 body is exactly `{"error":"not found"}` with status 404 and `content-type: application/json; charset=utf-8`.
- HTML 404 heading is exactly `Not found`.
- Tests never call live Cloudflare APIs or a live inbox.
- `compatibility_date` is `2026-08-24`. Enable `nodejs_compat`. Enable `observability`.
- Feature spec path is `docs/specs/features/hosted-app.md`. Branch is `feat/hosted-app` from default `main` (merge PR #1 first if architecture is not on `main`).
- Scripts: `test` runs `check`, `test:unit`, and `test:e2e`; `test:e2e` is `playwright test`; `deploy` is `wrangler deploy`.
- Do not add D1, R2, Email, magic links, teams, or the editor.

**Start:** `git checkout main && git pull && git checkout -b feat/hosted-app`

**Spec to implement:** after Task 1, `docs/specs/features/hosted-app.md`. Product design: `docs/superpowers/specs/2026-08-24-event-model-saas-design.md` (slice 1 only). Architecture: `docs/specs/architecture.md`.

## File map

| Path | Responsibility |
|------|----------------|
| `docs/specs/features/hosted-app.md` | Feature spec (ACs) |
| `docs/specs/README.md` | Catalog row |
| `package.json` | Scripts and pinned deps |
| `package-lock.json` | Lockfile from `npm install` |
| `tsconfig.json` | Strict TypeScript for `src/**/*.ts` |
| `vitest.config.ts` | Unit runner, `tests/unit` |
| `playwright.config.ts` | Chromium + `wrangler dev` on 127.0.0.1:8787 |
| `wrangler.jsonc` | Worker name, assets, custom domain, observability |
| `src/index.ts` | `handleRequest` + default `fetch` |
| `public/index.html` | Homepage placeholder |
| `public/404.html` | HTML 404 page |
| `tests/unit/handle-request.test.ts` | API 404 + ASSETS delegation |
| `tests/e2e/hosted-app.spec.ts` | Browser: homepage copy, HTML 404 |
| `.github/workflows/ci.yml` | PR + `main`: `npm ci`, Playwright browsers, `npm test` |

---

### Task 1: Feature spec `hosted-app`

**Files:**
- Create: `docs/specs/features/hosted-app.md`
- Modify: `docs/specs/README.md` (feature catalog table)

**Interfaces:**
- Consumes: product design slice 1; architecture stack table
- Produces: ACs quoted by later test titles

- [ ] **Step 1: Write the spec file**

```markdown
# Hosted app

Status: draft

## Problem

Nothing is reachable at event-model.lonnylot.com. Slice 1 puts a Worker and a public placeholder there, with CI, so later slices have a host.

## Acceptance criteria

- [ ] GET `/` shows a heading whose accessible name is `Event Model`
- [ ] GET `/` shows the text `Access is by invite.`
- [ ] GET `/` does not show a control whose accessible name is `Sign up`
- [ ] GET an unknown document path returns status 404 and a heading whose accessible name is `Not found`
- [ ] GET `/api` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [ ] GET `/api/anything` returns status 404, content-type `application/json; charset=utf-8`, and body `{"error":"not found"}`
- [ ] `package.json` script `test:e2e` includes the tokens `playwright` and `test`
- [ ] GitHub Actions workflow `.github/workflows/ci.yml` runs on `pull_request` and on `push` to `main` and has a step whose `run` is `npm test`
- [ ] `wrangler.jsonc` `name` is `event-model-saas`
- [ ] `wrangler.jsonc` has a route `{ "pattern": "event-model.lonnylot.com", "custom_domain": true }`
- [ ] `package.json` script `deploy` is `wrangler deploy`

## Domain terms

Event Model (the product name on the heading, not a document instance)

## Seams

- `handleRequest(request, env)` in `src/index.ts` — unit tests pass a fake `env.ASSETS.fetch`
- `env.ASSETS.fetch` — static files in `public/`
- Browser — Playwright against `wrangler dev`

## Assumptions

- Cloudflare account is the one already serving `lonnylot.com` (wrangler OAuth).
- Custom domain provisioning happens on `npm run deploy` via Wrangler.

## Out of scope

Magic-link login, email field, D1, R2, teams, editor canvas.

## Restates
```

- [ ] **Step 2: Add the catalog row**

In `docs/specs/README.md`, replace the empty feature table with:

```markdown
| Feature | Path | Status |
|---------|------|--------|
| Hosted app | [features/hosted-app.md](./features/hosted-app.md) | draft |
```

- [ ] **Step 3: Commit**

```bash
git add docs/specs/features/hosted-app.md docs/specs/README.md
git commit -m "docs: add hosted-app feature spec"
```

---

### Task 2: JSON 404 for `/api` and `/api/*`

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `src/index.ts`
- Create: `tests/unit/handle-request.test.ts`
- Create: `wrangler.jsonc` (minimal; domain route is Task 6)

**Interfaces:**
- Consumes: ACs for GET `/api` and GET `/api/anything`
- Produces: `export async function handleRequest(request: Request, env: { ASSETS: { fetch: (request: Request) => Promise<Response> } }): Promise<Response>`
- Produces: `export default { fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> }`

- [ ] **Step 1: Scaffold Node files and install**

`package.json`:

```json
{
  "name": "event-model-saas",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "types": "wrangler types",
    "check": "tsc --noEmit",
    "test": "npm run check && npm run test:unit && npm run test:e2e",
    "test:unit": "vitest run",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250726.2",
    "@playwright/test": "^1.54.2",
    "typescript": "^5.9.2",
    "vitest": "^3.2.4",
    "wrangler": "^4.120.0"
  }
}
```

If that `@cloudflare/workers-types` tag does not exist on npm, install `@cloudflare/workers-types@latest` and keep the resolved version in the lockfile. Do not hand-write `Env`.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.ts", "tests/unit/**/*.ts"]
}
```

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

`wrangler.jsonc` (no custom domain yet):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "event-model-saas",
  "main": "src/index.ts",
  "compatibility_date": "2026-08-24",
  "compatibility_flags": ["nodejs_compat"],
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  },
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "not_found_handling": "404-page",
    "run_worker_first": ["/api", "/api/*"]
  }
}
```

```bash
npm install
```

- [ ] **Step 2: Write the failing unit tests**

`tests/unit/handle-request.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { handleRequest } from "../../src/index.ts";

function envWithAssets(
  fetchImpl: (request: Request) => Promise<Response>,
): { ASSETS: { fetch: (request: Request) => Promise<Response> } } {
  return { ASSETS: { fetch: fetchImpl } };
}

describe("handleRequest", () => {
  it("GET `/api` returns status 404, content-type `application/json; charset=utf-8`, and body `{\"error\":\"not found\"}`", async () => {
    const assetsFetch = vi.fn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api"),
      envWithAssets(assetsFetch),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe('{"error":"not found"}');
    expect(assetsFetch).not.toHaveBeenCalled();
  });

  it("GET `/api/anything` returns status 404, content-type `application/json; charset=utf-8`, and body `{\"error\":\"not found\"}`", async () => {
    const assetsFetch = vi.fn();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/anything"),
      envWithAssets(assetsFetch),
    );
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
    expect(await response.text()).toBe('{"error":"not found"}');
    expect(assetsFetch).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run tests/unit/handle-request.test.ts
```

Expected: FAIL resolving `../../src/index.ts` or `handleRequest` is not exported.

- [ ] **Step 4: Minimal implementation**

`src/index.ts`:

```ts
export type AssetEnv = {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
};

const JSON_NOT_FOUND_BODY = '{"error":"not found"}';

export function jsonNotFound(): Response {
  return new Response(JSON_NOT_FOUND_BODY, {
    status: 404,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export async function handleRequest(
  request: Request,
  env: AssetEnv,
): Promise<Response> {
  const path = new URL(request.url).pathname;
  if (path === "/api" || path.startsWith("/api/")) {
    return jsonNotFound();
  }
  return env.ASSETS.fetch(request);
}

export default {
  fetch(request: Request, env: AssetEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npx vitest run tests/unit/handle-request.test.ts
npx tsc --noEmit
```

Expected: PASS, `tsc` exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts wrangler.jsonc src/index.ts tests/unit/handle-request.test.ts
git commit -m "feat: return JSON 404 for /api routes"
```

---

### Task 3: Non-API paths delegate to ASSETS

**Files:**
- Modify: `tests/unit/handle-request.test.ts`
- Modify: `src/index.ts` only if the Task 2 handler does not already call `env.ASSETS.fetch` for other paths

**Interfaces:**
- Consumes: `handleRequest` from Task 2
- Produces: same `handleRequest` signature; ASSETS receives the original `Request`

- [ ] **Step 1: Write the failing test**

Append to `tests/unit/handle-request.test.ts`:

```ts
  it("GET `/` delegates the request to env.ASSETS.fetch", async () => {
    const incoming = new Request("https://event-model.lonnylot.com/");
    const assetResponse = new Response("<h1>Event Model</h1>", {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
    const assetsFetch = vi.fn(async () => assetResponse);
    const response = await handleRequest(incoming, envWithAssets(assetsFetch));
    expect(assetsFetch).toHaveBeenCalledTimes(1);
    expect(assetsFetch.mock.calls[0][0]).toBe(incoming);
    expect(response).toBe(assetResponse);
  });
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/handle-request.test.ts
```

Expected: FAIL if `handleRequest` does not yet call `env.ASSETS.fetch` with the original request. If Task 2 already implemented delegation, this test PASSES — do not change production; continue to Step 4.

- [ ] **Step 3: Implement delegation if the test failed**

In `handleRequest`, after the `/api` branch:

```ts
  return env.ASSETS.fetch(request);
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/handle-request.test.ts
```

Expected: PASS (three tests).

- [ ] **Step 5: Commit**

```bash
git add tests/unit/handle-request.test.ts src/index.ts
git commit -m "feat: delegate non-API paths to ASSETS"
```

If `src/index.ts` is unchanged, commit the test only with the same message.

---

### Task 4: Placeholder pages and Playwright flows

**Files:**
- Create: `public/index.html`
- Create: `public/404.html`
- Create: `playwright.config.ts`
- Create: `tests/e2e/hosted-app.spec.ts`

**Interfaces:**
- Consumes: Wrangler `assets.directory` `./public`, `not_found_handling` `404-page`
- Produces: homepage and HTML 404 that Playwright can open at `http://127.0.0.1:8787`

- [ ] **Step 1: Write Playwright tests (they fail until pages and webServer exist)**

`playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = 8787;
const BASE = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: BASE,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npx wrangler dev --ip 127.0.0.1 --port ${PORT}`,
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

`tests/e2e/hosted-app.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("GET `/` shows a heading whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Event Model", level: 1 }),
  ).toBeVisible();
});

test("GET `/` shows the text `Access is by invite.`", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Access is by invite.")).toBeVisible();
});

test("GET `/` does not show a control whose accessible name is `Sign up`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Sign up" }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign up" })).toHaveCount(0);
});

test("GET an unknown document path returns status 404 and a heading whose accessible name is `Not found`", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Not found", level: 1 }),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run e2e to verify failure**

```bash
npx playwright install chromium
npx playwright test tests/e2e/hosted-app.spec.ts
```

Expected: FAIL (missing `public/index.html` and/or heading not found).

- [ ] **Step 3: Write the pages**

`public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Event Model</title>
  </head>
  <body>
    <main>
      <h1>Event Model</h1>
      <p>Access is by invite.</p>
    </main>
  </body>
</html>
```

`public/404.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Not found</title>
  </head>
  <body>
    <main>
      <h1>Not found</h1>
    </main>
  </body>
</html>
```

- [ ] **Step 4: Run e2e to verify they pass**

```bash
npx playwright test tests/e2e/hosted-app.spec.ts
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add public/index.html public/404.html playwright.config.ts tests/e2e/hosted-app.spec.ts
git commit -m "feat: serve Event Model placeholder and HTML 404"
```

---

### Task 5: CI runs `npm test` including Playwright

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json` only if `test:e2e` is not already `playwright test`

**Interfaces:**
- Consumes: `package.json` scripts `test`, `test:unit`, `test:e2e`, `check` from Task 2
- Produces: workflow file path `.github/workflows/ci.yml`

- [ ] **Step 1: Write a unit test that `test:e2e` names Playwright**

Create `tests/unit/package-scripts.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("package.json scripts", () => {
  it("`package.json` script `test:e2e` includes the tokens `playwright` and `test`", () => {
    const script = pkg.scripts["test:e2e"];
    expect(script).toBeDefined();
    const tokens = script.split(/\s+/);
    expect(tokens).toContain("playwright");
    expect(tokens).toContain("test");
  });
});
```

This is a parse test for the script-existence AC (`playwright-e2e`). The flow tests in Task 4 prove the browser path.

- [ ] **Step 2: Run it**

```bash
npx vitest run tests/unit/package-scripts.test.ts
```

Expected: PASS if Task 2 already set `"test:e2e": "playwright test"`. If FAIL, set that script, then re-run.

- [ ] **Step 3: Add the workflow**

`.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
```

- [ ] **Step 4: Confirm the workflow YAML contains the AC strings**

```bash
python3 - <<'PY'
from pathlib import Path
text = Path(".github/workflows/ci.yml").read_text()
assert "pull_request:" in text
assert "push:" in text
assert "main" in text
assert "npm test" in text
print("workflow AC strings present")
PY
```

Expected: prints `workflow AC strings present`.

- [ ] **Step 5: Run the full local gate**

```bash
npm test
```

Expected: typecheck, unit, and e2e all exit 0.

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ci.yml tests/unit/package-scripts.test.ts package.json
git commit -m "ci: run typecheck, unit, and Playwright on pull_request"
```

- [ ] **Step 7: Open the PR so CI runs**

```bash
git push -u origin HEAD
gh pr create --title "feat: hosted-app Worker and placeholder" --body "$(cat <<'EOF'
## Spec

`docs/specs/features/hosted-app.md` (draft → validate after CI green)

## Task

Worker + static placeholder at event-model.lonnylot.com, JSON 404 for `/api`, GitHub Actions CI.

## Tests

```
npm test
```

(`check` + `test:unit` + `test:e2e`)
EOF
)"
```

Watch checks. If CI is red, treat it as a failing test, fix, commit, push.

---

### Task 6: Custom domain and deploy script

**Files:**
- Modify: `wrangler.jsonc` (add `routes`)
- Modify: `tests/unit/wrangler-config.test.ts` (new)
- Modify: `package.json` only if `deploy` is not `wrangler deploy`

**Interfaces:**
- Consumes: Cloudflare zone `lonnylot.com` already in this account
- Produces: Wrangler custom domain `event-model.lonnylot.com`

- [ ] **Step 1: Write failing config tests**

`tests/unit/wrangler-config.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const wrangler = JSON.parse(
  readFileSync("wrangler.jsonc", "utf8").replace(/^\s*\/\/.*$/gm, ""),
) as {
  name: string;
  routes?: { pattern: string; custom_domain: boolean }[];
};

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
  scripts: Record<string, string>;
};

describe("wrangler and deploy", () => {
  it("`wrangler.jsonc` `name` is `event-model-saas`", () => {
    expect(wrangler.name).toBe("event-model-saas");
  });

  it('`wrangler.jsonc` has a route `{ "pattern": "event-model.lonnylot.com", "custom_domain": true }`', () => {
    expect(wrangler.routes).toEqual(
      expect.arrayContaining([
        { pattern: "event-model.lonnylot.com", custom_domain: true },
      ]),
    );
  });

  it("`package.json` script `deploy` is `wrangler deploy`", () => {
    expect(pkg.scripts.deploy).toBe("wrangler deploy");
  });
});
```

JSON.parse on jsonc: if `$schema` is the only extra and there are no comments, `JSON.parse` of the raw file works. If parse fails because of comments, keep the comment-strip above.

- [ ] **Step 2: Run to verify fail on missing route**

```bash
npx vitest run tests/unit/wrangler-config.test.ts
```

Expected: FAIL on the route assertion (`routes` undefined). Name and deploy script may already pass.

- [ ] **Step 3: Add the route**

In `wrangler.jsonc`, add:

```jsonc
  "workers_dev": true,
  "preview_urls": true,
  "routes": [
    { "pattern": "event-model.lonnylot.com", "custom_domain": true }
  ]
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/wrangler-config.test.ts
```

Expected: PASS.

- [ ] **Step 5: Dry-run deploy, then deploy**

```bash
npx wrangler deploy --dry-run
npx wrangler deploy
```

Expected: dry-run exit 0; deploy creates/updates Worker `event-model-saas` and attaches `event-model.lonnylot.com`. Then:

```bash
curl -sS -D - -o /tmp/em-home.html https://event-model.lonnylot.com/
```

Expected: HTTP 200 and the HTML contains `<h1>Event Model</h1>` and `Access is by invite.`

If DNS/custom domain is still propagating, wait and retry curl. Do not skip the live curl.

- [ ] **Step 6: Commit**

```bash
git add wrangler.jsonc tests/unit/wrangler-config.test.ts
git commit -m "feat: bind event-model.lonnylot.com custom domain"
git push
```

- [ ] **Step 7: Flip spec status only after CI is green on this HEAD**

When GitHub checks are green, set `docs/specs/features/hosted-app.md` status to `validated` is **not** enough to merge. Merge waits for `spec-review-loop`. After review Approve + green CI, set catalog status to `released` in the merge commit per `releasing-a-spec`. Until then leave status `draft` or `validated` if you completed the completeness checklist in that skill.

---

## Self-review

**Spec coverage (hosted-app ACs → tasks):**

| AC | Task |
|----|------|
| Heading `Event Model` | 4 |
| Text `Access is by invite.` | 4 |
| No Sign up control | 4 |
| HTML 404 `Not found` | 4 |
| GET `/api` JSON 404 | 2 |
| GET `/api/anything` JSON 404 | 2 |
| `test:e2e` playwright tokens | 5 |
| CI `npm test` on PR and main | 5 |
| wrangler name | 2 + 6 |
| custom domain route | 6 |
| `deploy` script | 2 + 6 |
| Live host after deploy | 6 |

Out of scope in the feature spec is not implemented: magic link, email field, D1, R2, teams, editor.

**Placeholders:** none.

**Types:** `handleRequest(request: Request, env: AssetEnv): Promise<Response>` is the only production function later tasks call. `AssetEnv.ASSETS.fetch` takes the original `Request`.
