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

async function clickNewSlice(page: Page) {
  const count =
    (await page.getByRole("listitem", { name: "New Slice", exact: true }).count()) +
    2;
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(count);
}

async function expectGetRenderedInspectOmitsAddField(page: Page) {
  const inspector = page.getByRole("region", { name: "Inspector", exact: true });
  await expect(
    inspector.getByRole("button", { name: "Add Field", exact: true }),
  ).toHaveCount(0);
}

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Name` with `Place Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem shows the Inspector `Name` textbox with the value `Place Order`", async ({
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
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Place Order");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Place Order", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Place Order");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Actor`, clicks the Timeline `Actor` listitem, fills `Name` with `Shopper`, and Saves, a reload of that page, clicking the Timeline `Shopper` listitem shows the Inspector `Name` textbox with the value `Shopper`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .last()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Shopper");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Shopper", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Shopper");
  await expectGetRenderedInspectOmitsAddField(page);
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page shows a listitem whose accessible name is `Order Placed` in the Timeline region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
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
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Order Placed", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, fills `Name` with `Order Placed`, and Saves, a reload of that page, clicking the Timeline `Order Placed` listitem shows the Inspector `Name` textbox with the value `Order Placed`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Order Placed", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Order Placed");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page shows a listitem whose accessible name is `Orders` in the Timeline region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Orders");
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
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Orders", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, fills `Name` with `Orders`, and Saves, a reload of that page, clicking the Timeline `Orders` listitem shows the Inspector `Name` textbox with the value `Orders`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Orders");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Orders", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Orders");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page shows a listitem whose accessible name is `Send Email` in the Timeline region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Send Email");
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
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Send Email", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Automation`, clicks the Timeline `Automation` listitem, fills `Name` with `Send Email`, and Saves, a reload of that page, clicking the Timeline `Send Email` listitem shows the Inspector `Name` textbox with the value `Send Email`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Send Email");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Send Email", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Send Email");
});
