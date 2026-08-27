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

test("After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows a textbox whose accessible name is `Name` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Command` on that page, clicking the Timeline `Command` listitem shows that `Name` textbox with the value `Command`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Command");
});

test("Filling the Inspector `Name` textbox with `Place Order` after selecting `Command` sets the last Command `title` to `Place Order`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Place Order");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices[0].commands.at(-1).title).toBe(
    "Place Order",
  );
});

test("Filling the Inspector `Name` textbox with `Place Order` after selecting `Command` shows a Timeline listitem whose accessible name is `Place Order`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Place Order");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Place Order", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows a textbox whose accessible name is `Name` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Event` on that page, clicking the Timeline `Event Happened` listitem shows that `Name` textbox with the value `Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
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
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Event Happened");
});

test("Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` sets the last Event `title` to `Order Placed`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices[0].events.at(-1).title).toBe(
    "Order Placed",
  );
});

test("Filling the Inspector `Name` textbox with `Order Placed` after selecting `Event Happened` shows a Timeline listitem whose accessible name is `Order Placed`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Order Placed");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Order Placed", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows a textbox whose accessible name is `Name` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Read Model` on that page, clicking the Timeline `Read Model` listitem shows that `Name` textbox with the value `Read Model`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
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
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Read Model");
});
