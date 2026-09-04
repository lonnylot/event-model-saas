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

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a listitem whose accessible name is `New Slice`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "New Slice", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Actor on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Command on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Command on lane", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Event on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Event on lane", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Read Model on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Read Model on lane", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Automation on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Automation on lane", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `Add Command`, and Saves, a reload of that page, the Timeline region shows a button whose accessible name is `Command port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
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
      .getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `Add Event`, and Saves, a reload of that page, the Timeline region shows a button whose accessible name is `Event Happened port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
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
      .getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
});
