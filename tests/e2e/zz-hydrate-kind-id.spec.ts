import {
  expect,
  test as base,
  type Page,
  type APIRequestContext,
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
        baseURL: String(workerInfo.project.use.baseURL ?? "http://127.0.0.1:8787"),
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

async function clickTimelineRegion(page: Page) {
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .click({ position: { x: 1, y: 1 } });
}

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline `Actor` listitem has a non-empty `data-id`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveAttribute("data-id", /.+/);
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, clicking the Timeline `Actor` listitem, filling Inspector `Name` with `Shopper` sets that Actor `name` to `Shopper`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Shopper");
  const json = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(json.slices[0].actors[0].name).toBe("Shopper");
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, clicking the Timeline `Actor` listitem then the Timeline region, pressing Backspace sets that Slice `actors` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .click();
  await clickTimelineRegion(page);
  await page.keyboard.press("Backspace");
  const json = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(json.slices[0].actors).toEqual([]);
});

test("After a member creates a model, opens it, clicks `Add Automation`, and Saves, a reload of that page, the Timeline `Automation` listitem has a non-empty `data-id`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveAttribute("data-id", /.+/);
});

test("After a member creates a model, opens it, clicks `Add Automation`, and Saves, a reload of that page, clicking the Timeline `Automation` listitem then the Timeline region, pressing Backspace sets that Slice `processors` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await clickTimelineRegion(page);
  await page.keyboard.press("Backspace");
  const json = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(json.slices[0].processors).toEqual([]);
});
