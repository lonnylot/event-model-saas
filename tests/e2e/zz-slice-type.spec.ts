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
  await page.goto("/");
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
        baseURL: "http://127.0.0.1:8787",
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

async function clickNewSlice(page: Page) {
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toBeVisible();
}

test("After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a combobox whose accessible name is `Type` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("combobox", { name: "Type", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Type` combobox with the value `State Change`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("combobox", { name: "Type", exact: true }),
  ).toHaveValue("State Change");
});

test("Selecting `State View` in Inspector `Type` after selecting `New Slice` sets the last Slice `sliceType` to `STATE_VIEW`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("combobox", { name: "Type", exact: true })
    .selectOption("State View");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).sliceType).toBe("STATE_VIEW");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, selects `State View` in `Type`, and Saves, a reload of that page sets the last Slice `sliceType` to `STATE_VIEW`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("combobox", { name: "Type", exact: true })
    .selectOption("State View");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).sliceType).toBe("STATE_VIEW");
});
