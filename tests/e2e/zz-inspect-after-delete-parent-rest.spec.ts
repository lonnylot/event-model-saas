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

test("After clicking `Add Actor`, clicking the Timeline `Actor` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const actor = timeline.getByRole("listitem", {
    name: "Actor",
    exact: true,
  });
  await expect(actor).toHaveCount(2);
  await actor.last().click();
  await expect(
    inspector.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Backspace");
  await expect(
    inspector.getByRole("combobox", { name: "Type", exact: true }),
  ).toBeVisible();
});

test("After clicking `Add Event`, clicking the Timeline `Event Happened` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const eventItem = timeline.getByRole("listitem", {
    name: "Event Happened",
    exact: true,
  });
  await expect(eventItem).toBeVisible();
  await eventItem.click();
  await expect(
    inspector.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Backspace");
  await expect(
    inspector.getByRole("combobox", { name: "Type", exact: true }),
  ).toBeVisible();
});

test("After clicking `Add Read Model`, clicking the Timeline `Read Model` listitem, pressing Backspace, the Inspector region shows a combobox whose accessible name is `Type`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const readModel = timeline.getByRole("listitem", {
    name: "Read Model",
    exact: true,
  });
  await expect(readModel).toBeVisible();
  await readModel.click();
  await expect(
    inspector.getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Backspace");
  await expect(
    inspector.getByRole("combobox", { name: "Type", exact: true }),
  ).toBeVisible();
});
