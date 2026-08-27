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

test("After clicking `New Slice` then `Add Actor`, pressing ⌘Z does not show a listitem whose accessible name is `Actor`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` then `Add Event`, pressing ⌘Z does not show a listitem whose accessible name is `Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` then `Add Read Model`, pressing ⌘Z does not show a listitem whose accessible name is `Read Model`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` then `Add Automation`, pressing ⌘Z does not show a listitem whose accessible name is `Automation`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` twice, clicking the last `New Slice` listitem, pressing ⌥⌘←, then pressing ⌘Z, the first Slice `id` is the Slice that was first before the move", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].id;
  await page
    .locator("ul")
    .first()
    .getByRole("listitem", { name: "New Slice", exact: true })
    .last()
    .click();
  await page.keyboard.press("Alt+ControlOrMeta+ArrowLeft");
  await page.keyboard.press("ControlOrMeta+z");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].id).toBe(firstId);
});
