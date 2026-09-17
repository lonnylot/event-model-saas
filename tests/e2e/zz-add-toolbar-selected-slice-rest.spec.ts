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

async function clickNewSlice(page: Page) {
  const count =
    (await page.getByRole("listitem", { name: "New Slice", exact: true }).count()) +
    2;
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(count);
}

test("After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, and clicks `Add Actor`, the Timeline region of the first Slice shows 2 listitem whose accessible name is `Actor`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  const slices = page
    .getByRole("heading", { name: "Slices", exact: true })
    .locator("xpath=following-sibling::ul[1]");
  await expect(
    slices.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(2);
  await slices
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const firstSlice = timeline.locator(".slice-col").first();
  const lastSlice = timeline.locator(".slice-col").last();
  await expect(
    firstSlice.getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(2);
  await expect(
    lastSlice.getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(1);
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, and clicks `Add Event`, the Timeline region of the first Slice shows a listitem whose accessible name is `Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  const slices = page
    .getByRole("heading", { name: "Slices", exact: true })
    .locator("xpath=following-sibling::ul[1]");
  await expect(
    slices.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(2);
  await slices
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const firstSlice = timeline.locator(".slice-col").first();
  const lastSlice = timeline.locator(".slice-col").last();
  await expect(
    firstSlice.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toBeVisible();
  await expect(
    lastSlice.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(0);
});
