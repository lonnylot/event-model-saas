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

test("After clicking `New Slice` then `Add Actor`, clicking the first Timeline `Actor` listitem on the last Slice, pressing Backspace sets the remaining Actor `id` on the last Slice to the Actor that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const actors = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true });
  await expect(actors).toHaveCount(3);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices.at(-1).actors[1].id;
  await actors.nth(1).click();
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).actors).toHaveLength(1);
  expect(after.slices.at(-1).actors[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Actor`, clicking the first Timeline `Actor` listitem on the last Slice, pressing Delete sets the remaining Actor `id` on the last Slice to the Actor that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const actors = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true });
  await expect(actors).toHaveCount(3);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices.at(-1).actors[1].id;
  await actors.nth(1).click();
  await page.keyboard.press("Delete");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).actors).toHaveLength(1);
  expect(after.slices.at(-1).actors[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem, pressing Backspace sets the remaining Event `id` to the Event that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const events = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true });
  await expect(events).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices.at(-1).events[1].id;
  await events.first().click();
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).events).toHaveLength(1);
  expect(after.slices.at(-1).events[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem, pressing Backspace sets the remaining Read Model `id` to the Read Model that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const readModels = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true });
  await expect(readModels).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices.at(-1).readModels[1].id;
  await readModels.first().click();
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).readModels).toHaveLength(1);
  expect(after.slices.at(-1).readModels[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem, pressing Backspace sets the remaining Automation `id` to the Automation that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  const automations = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true });
  await expect(automations).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices.at(-1).processors[1].id;
  await automations.first().click();
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).processors).toHaveLength(1);
  expect(after.slices.at(-1).processors[0].id).toBe(lastId);
});
