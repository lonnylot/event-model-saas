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
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toBeVisible();
}

async function dragPort(page: Page, fromName: string, toName: string) {
  await expect(
    page.getByRole("button", { name: fromName, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: toName, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: fromName, exact: true })
    .dragTo(page.getByRole("button", { name: toName, exact: true }));
}

async function dragEventToReadModel(page: Page) {
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Event Happened port", "Read Model port");
}

test("After dragging from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Event Happened → Read Model` shows the text `From Event Happened` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await dragEventToReadModel(page);
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await expect(
    inspector.getByText("From Event Happened", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByText("Event Happened → Read Model", { exact: true })
    .click();
  await expect(
    inspector.getByText("From Event Happened", { exact: true }),
  ).toBeVisible();
});

test("After dragging from `Event Happened port` onto `Read Model port`, clicking the Timeline text `Event Happened → Read Model` shows the text `To Read Model` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await dragEventToReadModel(page);
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await expect(
    inspector.getByText("To Read Model", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByText("Event Happened → Read Model", { exact: true })
    .click();
  await expect(
    inspector.getByText("To Read Model", { exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, fills `Description` with `Customer submits cart`, and Saves, a reload of that page, clicking the Timeline `Command` listitem shows the Inspector `Description` textbox with the value `Customer submits cart`", async ({
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
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toHaveValue("Customer submits cart");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, selects `State View` in `Type`, and Saves, a reload of that page, clicking the `New Slice` listitem shows Inspector `Type` with the value `State View`", async ({
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
  await page.getByRole("listitem", { name: "New Slice", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("combobox", { name: "Type", exact: true }),
  ).toHaveValue("State View");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, fills `Field name` with `orderId`, and Saves, a reload of that page, clicking the Timeline `Command` listitem shows Inspector `Field name` with the value `orderId`", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("orderId");
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
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Field name", exact: true }),
  ).toHaveValue("orderId");
});

test("After a member creates a model, opens it, clicks `New Slice`, clicks the `New Slice` listitem, fills `Name` with `Checkout`, and Saves, a reload of that page, clicking the `Checkout` listitem shows the Inspector `Name` textbox with the value `Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
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
  await page.getByRole("listitem", { name: "Checkout", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Checkout");
});


