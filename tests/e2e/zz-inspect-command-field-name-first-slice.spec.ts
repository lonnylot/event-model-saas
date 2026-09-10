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

test("After a member creates a model, opens it, clicks `New Slice`, clicks the first `New Slice` listitem in the Slices region, clicks `Add Command on lane` on that Slice, clicks the Timeline `Command` listitem of the first Slice, clicks `Add Field`, fills `Name` with `Place Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, filling Inspector `Field name` with `orderId` sets that Command `fields[0].name` to `orderId`", async ({
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
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  const firstSlice = timeline.locator(".slice-col").first();
  const lastSlice = timeline.locator(".slice-col").last();
  await expect(
    firstSlice.getByRole("button", { name: "Add Command on lane", exact: true }),
  ).toBeVisible();
  await firstSlice
    .getByRole("button", { name: "Add Command on lane", exact: true })
    .click();
  await expect(
    firstSlice.getByRole("listitem", { name: "Command", exact: true }),
  ).toBeVisible();
  await firstSlice
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector.getByRole("textbox", { name: "Name", exact: true }).fill(
    "Place Order",
  );
  await expect(
    firstSlice.getByRole("listitem", { name: "Place Order", exact: true }),
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
    timeline.getByRole("listitem", { name: "Place Order", exact: true }),
  ).toBeVisible();
  await timeline
    .getByRole("listitem", { name: "Place Order", exact: true })
    .click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("orderId");
  const json = await page.locator("#event-model-document").textContent();
  const model = JSON.parse(json ?? "{}");
  expect(model.slices[0].commands[0].fields[0].name).toBe("orderId");
  expect(model.slices.at(-1).commands ?? []).toEqual([]);
  await expect(
    lastSlice.getByRole("listitem", { name: "Place Order", exact: true }),
  ).toHaveCount(0);
});
