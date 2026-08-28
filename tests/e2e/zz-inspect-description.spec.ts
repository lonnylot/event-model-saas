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
        baseURL: `http://127.0.0.1:${process.env.E2E_PORT || 8787}`,
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
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  ).toBeVisible();
}

test("After clicking `New Slice` on that page, clicking the `New Slice` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).first().click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Checkout flow` after selecting `New Slice` sets the last Slice `description` to `Checkout flow`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).first().click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Checkout flow");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).description).toBe(
    "Checkout flow",
  );
});

test("After clicking `New Slice` then `Add Actor` on that page, clicking the Timeline `Actor` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Shopper persona` after selecting `Actor` sets the last Actor `description` to `Shopper persona`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).first().click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Shopper persona");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).actors.at(-1).description).toBe(
    "Shopper persona",
  );
});

test("After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Customer submits cart` after selecting `Command` sets the last Command `description` to `Customer submits cart`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).first().click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Customer submits cart");
  const json = await page.locator("#event-model-document").textContent();
  expect(
    JSON.parse(json ?? "{}").slices.at(-1).commands.at(-1).description,
  ).toBe("Customer submits cart");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Description` with `Customer submits cart`, and Saves, a reload of that page sets the last Command `description` to `Customer submits cart`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Customer submits cart");
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
  expect(
    JSON.parse(json ?? "{}").slices.at(-1).commands.at(-1).description,
  ).toBe("Customer submits cart");
});

test("After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Cart was submitted` after selecting `Event Happened` sets the last Event `description` to `Cart was submitted`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Cart was submitted");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).events.at(-1).description).toBe(
    "Cart was submitted",
  );
});

test("After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Orders the shopper can see` after selecting `Read Model` sets the last Read Model `description` to `Orders the shopper can see`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Orders the shopper can see");
  const json = await page.locator("#event-model-document").textContent();
  expect(
    JSON.parse(json ?? "{}").slices.at(-1).readModels.at(-1).description,
  ).toBe("Orders the shopper can see");
});

test("After clicking `New Slice` then `Add Automation` on that page, clicking the Timeline `Automation` listitem shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Email when paid` after selecting `Automation` sets the last Automation `description` to `Email when paid`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Email when paid");
  const json = await page.locator("#event-model-document").textContent();
  expect(
    JSON.parse(json ?? "{}").slices.at(-1).processors.at(-1).description,
  ).toBe("Email when paid");
});
