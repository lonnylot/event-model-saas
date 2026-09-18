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
  const slices =
    (await page.getByRole("listitem", { name: "New Slice", exact: true }).count()) +
    2;
  const lanes =
    (await page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true })
      .count()) + 1;
  await page
    .locator(".editor-toolbar")
    .getByRole("button", { name: "New Slice", exact: true })
    .click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(slices);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true }),
  ).toHaveCount(lanes);
}

async function openImportedEmptyModel(page: Page) {
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
  const teamId = new URL(page.url()).pathname.split("/")[3];
  const response = await page.request.post(`/api/teams/${teamId}/imports`, {
    data: {
      document: {
        format: "eventmodel",
        schemaVersion: 1,
        id: crypto.randomUUID(),
        title: "Empty Import",
        slices: [],
      },
    },
  });
  expect(response.status()).toBe(201);
  await page.goto("/app");
  await page.getByRole("link", { name: "Empty Import", exact: true }).last().click();
  await expect(
    page.getByRole("heading", { name: "Empty Import", exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
}

test("After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Actor on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true })
      .first(),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Command on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Command on lane", exact: true })
      .first(),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Event on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Event on lane", exact: true })
      .first(),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Read Model on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Read Model on lane", exact: true })
      .first(),
  ).toBeVisible();
});

test("After clicking `New Slice` on that page, the Timeline region shows a button whose accessible name is `Add Automation on lane`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Automation on lane", exact: true })
      .first(),
  ).toBeVisible();
});

test("After clicking `New Slice` twice, clicking the first `Add Command on lane` appends a Command only on the first Slice", async ({
  page,
}) => {
  await openImportedEmptyModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("button", { name: "Add Command on lane", exact: true })
    .first()
    .click();
  const json = await page.locator("#event-model-document").textContent();
  const slices = JSON.parse(json ?? "{}").slices;
  expect(slices[0].commands).toHaveLength(1);
  expect(slices.at(-1).commands).toEqual([]);
});

test("After clicking `New Slice`, pressing ⌥⌘1 appends an Actor whose `name` is `Actor`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.keyboard.press("Alt+ControlOrMeta+Digit1");
  const json = await page.locator("#event-model-document").textContent();
  const actors = JSON.parse(json ?? "{}").slices.at(-1).actors;
  expect(actors).toHaveLength(2);
  expect(actors.at(-1).name).toBe("Actor");
});

test("After clicking `New Slice`, pressing ⌥⌘2 appends a Command whose `title` is `Command`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.keyboard.press("Alt+ControlOrMeta+Digit2");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).commands[0].title).toBe("Command");
});

test("After clicking `New Slice`, pressing ⌥⌘3 appends an Event whose `title` is `Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.keyboard.press("Alt+ControlOrMeta+Digit3");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).events[0].title).toBe(
    "Event Happened",
  );
});

test("After clicking `New Slice`, pressing ⌥⌘4 appends a Read Model whose `title` is `Read Model`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.keyboard.press("Alt+ControlOrMeta+Digit4");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).readModels[0].title).toBe(
    "Read Model",
  );
});

test("After clicking `New Slice`, pressing ⌥⌘5 appends an Automation whose `title` is `Automation`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.keyboard.press("Alt+ControlOrMeta+Digit5");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").slices.at(-1).processors[0].title).toBe(
    "Automation",
  );
});

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem, pressing ⌥⌘2 appends a Command only on the first Slice", async ({
  page,
}) => {
  await openImportedEmptyModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("listitem", { name: "New Slice", exact: true }).first().click();
  await page.keyboard.press("Alt+ControlOrMeta+Digit2");
  const json = await page.locator("#event-model-document").textContent();
  const slices = JSON.parse(json ?? "{}").slices;
  expect(slices[0].commands).toHaveLength(1);
  expect(slices.at(-1).commands).toEqual([]);
});
