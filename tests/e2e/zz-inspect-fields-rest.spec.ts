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
        baseURL: `http://127.0.0.1:${process.env.E2E_PORT ?? "8787"}`,
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

test("After clicking `Add Field` on `Command`, selecting `UUID` in Inspector `Field type` sets the last Command `fields[0].type` to `UUID`", async ({
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
    .getByRole("combobox", { name: "Field type", exact: true })
    .selectOption("UUID");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.commands?.at(-1)?.fields?.[0]?.type,
  ).toBe("UUID");
});

test("After clicking `Add Field` on `Command`, checking Inspector `Optional` sets the last Command `fields[0].optional` to `true`", async ({
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
    .getByRole("checkbox", { name: "Optional", exact: true })
    .check();
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.commands?.at(-1)?.fields?.[0]
      ?.optional,
  ).toBe(true);
});

test("After clicking `Add Field` on `Command`, filling Inspector `Example` with `abc` sets the last Command `fields[0].example` to `abc`", async ({
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
    .getByRole("textbox", { name: "Example", exact: true })
    .fill("abc");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.commands?.at(-1)?.fields?.[0]
      ?.example,
  ).toBe("abc");
});

test("After clicking `Add Field` on `Command`, clicking `Delete Field` sets the last Command `fields` to `[]`", async ({
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
    .getByRole("button", { name: "Delete Field", exact: true })
    .click();
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.commands?.at(-1)?.fields,
  ).toEqual([]);
});

test("Clicking `Add Field` after selecting `Event Happened` appends a Field whose `name` is `newField` on the last Event", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.events?.at(-1)?.fields?.[0]?.name,
  ).toBe("newField");
});

test("Clicking `Add Field` after selecting `Read Model` appends a Field whose `name` is `newField` on the last Read Model", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.readModels?.at(-1)?.fields?.[0]?.name,
  ).toBe("newField");
});

test("Clicking `Add Field` after selecting `Automation` appends a Field whose `name` is `newField` on the last Automation", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.processors?.at(-1)?.fields?.[0]?.name,
  ).toBe("newField");
});

test("After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem, clicking `Add Field`, filling `Field name` with `orderId` sets the first Command `fields[0].name` to `orderId`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .first()
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("orderId");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.commands?.[0]?.fields?.[0]?.name,
  ).toBe("orderId");
});

test("After clicking `Add Field` on `Event Happened`, filling Inspector `Field name` with `eventId` sets the last Event `fields[0].name` to `eventId`", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("eventId");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.events?.at(-1)?.fields?.[0]?.name,
  ).toBe("eventId");
});

test("After clicking `Add Field` on `Read Model`, filling Inspector `Field name` with `viewId` sets the last Read Model `fields[0].name` to `viewId`", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("viewId");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.readModels?.at(-1)?.fields?.[0]?.name,
  ).toBe("viewId");
});

test("After clicking `Add Field` on `Automation`, filling Inspector `Field name` with `jobId` sets the last Automation `fields[0].name` to `jobId`", async ({
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
    .getByRole("button", { name: "Add Field", exact: true })
    .click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("jobId");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.[0]?.processors?.at(-1)?.fields?.[0]?.name,
  ).toBe("jobId");
});
