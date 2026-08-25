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
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/models") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Create model", exact: true }).click(),
  ]);
  await page.goto("/app");
  await page.getByRole("link", { name: "Untitled", exact: true }).last().click();
  await expect(
    page.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
}

test("After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a textbox whose accessible name is `Name` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, clicking the `New Slice` listitem shows that `Name` textbox with the value `New Slice`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("New Slice");
});

test("Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` sets that Slice `title` to `Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Checkout");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices[0].title).toBe("Checkout");
});

test("Filling the Inspector `Name` textbox with `Checkout` after selecting `New Slice` shows a listitem whose accessible name is `Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Checkout");
  await expect(
    page.getByRole("listitem", { name: "Checkout", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice`, Saving, then filling the Inspector `Name` textbox with `Checkout`, the page shows the text `Unsaved changes.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(page.getByText("Unsaved changes.")).toHaveCount(0);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Checkout");
  await expect(page.getByText("Unsaved changes.")).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Name` with `Checkout`, and Saves, a reload of that page shows a listitem whose accessible name is `Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Checkout");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await expect(
    page.getByRole("listitem", { name: "Checkout", exact: true }),
  ).toBeVisible();
});

