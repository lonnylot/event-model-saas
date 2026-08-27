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

async function addTwoSlicesClickFirstFillCheckout(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Checkout");
}

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the first Slice `title` to `Checkout`", async ({
  page,
}) => {
  await addTwoSlicesClickFirstFillCheckout(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.title).toBe("Checkout");
});

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Name` with `Checkout` sets the last Slice `title` to `New Slice`", async ({
  page,
}) => {
  await addTwoSlicesClickFirstFillCheckout(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.at(-1)?.title).toBe("New Slice");
});

test("Filling the Inspector `Name` textbox with `Checkout` after selecting the first of two `New Slice` listitems sets that listitem visible text to `Checkout`", async ({
  page,
}) => {
  await addTwoSlicesClickFirstFillCheckout(page);
  await expect(
    page.getByRole("listitem", { name: "Checkout", exact: true }),
  ).toHaveText("Checkout");
});

async function addTwoActorsClickFirstFillShopper(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Shopper");
}

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Name` with `Shopper` sets the first Actor `name` to `Shopper`", async ({
  page,
}) => {
  await addTwoActorsClickFirstFillShopper(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.actors?.[0]?.name).toBe(
    "Shopper",
  );
});

test("Filling the Inspector `Name` textbox with `Shopper` after selecting the first Timeline `Actor` sets that listitem visible text to `Shopper`", async ({
  page,
}) => {
  await addTwoActorsClickFirstFillShopper(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Shopper", exact: true }),
  ).toHaveText("Shopper");
});

async function addTwoEventsClickFirstFillOrderPlaced(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
}

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Name` with `Order Placed` sets the first Event `title` to `Order Placed`", async ({
  page,
}) => {
  await addTwoEventsClickFirstFillOrderPlaced(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.events?.[0]?.title).toBe(
    "Order Placed",
  );
});

test("Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` sets the Timeline `Order Placed` listitem visible text to `Order Placed`", async ({
  page,
}) => {
  await addTwoEventsClickFirstFillOrderPlaced(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Order Placed", exact: true }),
  ).toHaveText(/^Order Placed/);
});

async function addTwoReadModelsClickFirstFillOrders(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Orders");
}

test("After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Name` with `Orders` sets the first Read Model `title` to `Orders`", async ({
  page,
}) => {
  await addTwoReadModelsClickFirstFillOrders(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.readModels?.[0]?.title).toBe(
    "Orders",
  );
});

async function addTwoAutomationsClickFirstFillSendEmail(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Send Email");
}

test("After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Name` with `Send Email` sets the first Automation `title` to `Send Email`", async ({
  page,
}) => {
  await addTwoAutomationsClickFirstFillSendEmail(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.processors?.[0]?.title).toBe(
    "Send Email",
  );
});

test("After clicking `New Slice` then `Add Command` then `Save` on that page, filling the Inspector `Name` textbox with `Place Order` after selecting `Command` shows the text `Unsaved changes.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(page.getByText("Unsaved changes.")).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Place Order");
  await expect(page.getByText("Unsaved changes.")).toBeVisible();
});

test("After clicking `New Slice` then `Add Event` then `Save` on that page, filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` shows the text `Unsaved changes.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(page.getByText("Unsaved changes.")).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
  await expect(page.getByText("Unsaved changes.")).toBeVisible();
});

test("After clicking `New Slice` then `Add Read Model` then `Save` on that page, filling the Inspector `Name` textbox with `Orders` after selecting `Read Model` shows the text `Unsaved changes.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(page.getByText("Unsaved changes.")).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Orders");
  await expect(page.getByText("Unsaved changes.")).toBeVisible();
});

test("After clicking `New Slice` then `Add Automation` then `Save` on that page, filling the Inspector `Name` textbox with `Send Email` after selecting `Automation` shows the text `Unsaved changes.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(page.getByText("Unsaved changes.")).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Send Email");
  await expect(page.getByText("Unsaved changes.")).toBeVisible();
});

async function addTwoSlicesClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("First column");
}

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem, filling Inspector `Description` with `First column` sets the first Slice `description` to `First column`", async ({
  page,
}) => {
  await addTwoSlicesClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.description).toBe("First column");
});

async function addTwoCommandsClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Submit cart");
}

test("After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, filling Inspector `Description` with `Submit cart` sets the first Command `description` to `Submit cart`", async ({
  page,
}) => {
  await addTwoCommandsClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.commands?.[0]?.description).toBe(
    "Submit cart",
  );
});

async function addTwoActorsClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Librarian", { timeout: 5000 });
}

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem, filling Inspector `Description` with `Librarian` sets the first Actor `description` to `Librarian`", async ({
  page,
}) => {
  await addTwoActorsClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.actors?.[0]?.description).toBe(
    "Librarian",
  );
});

async function addTwoEventsClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("It happened", { timeout: 5000 });
}

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, filling Inspector `Description` with `It happened` sets the first Event `description` to `It happened`", async ({
  page,
}) => {
  await addTwoEventsClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(JSON.parse(json ?? "{}").slices?.[0]?.events?.[0]?.description).toBe(
    "It happened",
  );
});

async function addTwoReadModelsClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("List view", { timeout: 5000 });
}

test("After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, filling Inspector `Description` with `List view` sets the first Read Model `description` to `List view`", async ({
  page,
}) => {
  await addTwoReadModelsClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.readModels?.[0]?.description,
  ).toBe("List view");
});

async function addTwoAutomationsClickFirstFillDescription(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(2);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("When paid", { timeout: 5000 });
}

test("After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, filling Inspector `Description` with `When paid` sets the first Automation `description` to `When paid`", async ({
  page,
}) => {
  await addTwoAutomationsClickFirstFillDescription(page);
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.processors?.[0]?.description,
  ).toBe("When paid");
});
