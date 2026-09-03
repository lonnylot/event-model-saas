import {
  expect,
  test as base,
  type Page,
  type APIRequestContext,
  type Locator,
} from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

async function consumeAdmin(page: Page, request: APIRequestContext) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(
    "lonny@lonnylot.com",
  );
  await page
    .getByRole("button", { name: "Email me a link", exact: true })
    .click();
  await expect(
    page.getByText("If you have access, check your inbox."),
  ).toBeVisible();
  const mail = await request.get("/api/test/last-mail");
  const body = (await mail.json()) as { text: string };
  const match = body.text.match(/\/api\/auth\/consume\?token=[^\s]+/);
  expect(match).not.toBeNull();
  await page.goto(match![0]);
}

const test = base.extend<object, { adminState: string }>({
  adminState: [
    async ({ browser }, use, workerInfo) => {
      const page = await browser.newPage({
        baseURL: `http://127.0.0.1:${process.env.E2E_PORT ?? 8787}`,
      });
      const request = page.context().request;
      await consumeAdmin(page, request);
      const path = join(
        mkdtempSync(join(tmpdir(), "em-")),
        `state-${workerInfo.workerIndex}.json`,
      );
      await page.context().storageState({ path });
      await page.close();
      await use(path);
    },
    { scope: "worker" },
  ],
  storageState: async ({ adminState }, use) => {
    await use(adminState);
  },
});

test.describe.configure({ mode: "serial" });

async function openUntitledModel(page: Page) {
  await page.goto("/app");
  const createTeam = page.getByRole("textbox", {
    name: "Team name",
    exact: true,
  });
  if (await createTeam.isVisible()) {
    await createTeam.fill("Library");
    await page.getByRole("button", { name: "Create team", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Library", exact: true }),
    ).toBeVisible();
  }
  const untitledBefore = await page
    .getByRole("link", { name: "Untitled", exact: true })
    .count();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/models") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Create model", exact: true }).click(),
  ]);
  await expect(
    page.getByRole("link", { name: "Untitled", exact: true }),
  ).toHaveCount(untitledBefore + 1);
  await page.goto("/app");
  await page.getByRole("link", { name: "Untitled", exact: true }).last().click();
  await expect(
    page.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
}

async function clientRect(locator: Locator) {
  return locator.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  });
}

function intersects(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number },
) {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
}

test("After scrolling the Timeline region, `section[aria-label=\"Timeline\"]` `getBoundingClientRect` does not intersect `.slice-rail`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.hover();
  await page.mouse.wheel(500, 0);
  await expect
    .poll(async () =>
      intersects(
        await clientRect(timeline),
        await clientRect(page.locator(".slice-rail")),
      ),
    )
    .toBe(false);
});

test("After scrolling the Timeline region, `section[aria-label=\"Timeline\"]` `getBoundingClientRect` does not intersect `section[aria-label=\"Inspector\"]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.hover();
  await page.mouse.wheel(-500, 0);
  await expect
    .poll(async () =>
      intersects(
        await clientRect(timeline),
        await clientRect(
          page.getByRole("region", { name: "Inspector", exact: true }),
        ),
      ),
    )
    .toBe(false);
});

test("Scrolling the Timeline region sets `.board` `style.transform` to a value that includes `translate(`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.hover();
  await page.mouse.wheel(0, 80);
  await expect
    .poll(async () => page.locator(".board").evaluate((el) => el.style.transform))
    .toContain("translate(");
});

test("After scrolling the Timeline region, `section[aria-label=\"Timeline\"]` `style.transform` does not include `translate(`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.hover();
  await page.mouse.wheel(0, 80);
  await expect
    .poll(async () => timeline.evaluate((el) => el.style.transform))
    .not.toContain("translate(");
});

test("Clicking `Zoom in` on that page sets `.board` `style.transform` to a value that includes `scale(1.25)`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect
    .poll(async () => page.locator(".board").evaluate((el) => el.style.transform))
    .toContain("scale(1.25)");
});

test("After clicking `Zoom in` on that page, `section[aria-label=\"Timeline\"]` `style.transform` does not include `scale(`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await expect
    .poll(async () => timeline.evaluate((el) => el.style.transform))
    .not.toContain("scale(");
});
