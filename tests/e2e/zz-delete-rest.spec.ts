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
    1;
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(count);
}

async function clickTimelineRegion(page: Page) {
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .click({ position: { x: 1, y: 1 } });
}

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace sets the remaining Actor `id` to the Actor that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const actors = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true });
  await expect(actors).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].actors[1].id;
  await actors.first().click();
  await clickTimelineRegion(page);
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].actors).toHaveLength(1);
  expect(after.slices[0].actors[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Delete sets the remaining Actor `id` to the Actor that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const actors = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true });
  await expect(actors).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].actors[1].id;
  await actors.first().click();
  await clickTimelineRegion(page);
  await page.keyboard.press("Delete");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].actors).toHaveLength(1);
  expect(after.slices[0].actors[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace sets the remaining Event `id` to the Event that was last", async ({
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
  const lastId = before.slices[0].events[1].id;
  await events.first().click();
  await clickTimelineRegion(page);
  await page.keyboard.press("Backspace");
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].events).toHaveLength(1);
  expect(after.slices[0].events[0].id).toBe(lastId);
});
