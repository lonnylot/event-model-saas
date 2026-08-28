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

test("After clicking `New Slice` twice then `Add Event`, dragging the Timeline `Event Happened` listitem onto the first Slices `New Slice` listitem sets the first Slice `events` to one Event and the last Slice `events` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const eventItem = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true });
  await expect(eventItem).toBeVisible();
  await eventItem.dragTo(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  );
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].events).toEqual([
    expect.objectContaining({ title: "Event Happened" }),
  ]);
  expect(after.slices.at(-1).events).toEqual([]);
});

test("After clicking `New Slice` twice then `Add Read Model`, dragging the Timeline `Read Model` listitem onto the first Slices `New Slice` listitem sets the first Slice `readModels` to one Read Model and the last Slice `readModels` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const readModel = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true });
  await expect(readModel).toBeVisible();
  await readModel.dragTo(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  );
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].readModels).toEqual([
    expect.objectContaining({ title: "Read Model" }),
  ]);
  expect(after.slices.at(-1).readModels).toEqual([]);
});

test("After clicking `New Slice` twice then `Add Automation`, dragging the Timeline `Automation` listitem onto the first Slices `New Slice` listitem sets the first Slice `processors` to one Automation and the last Slice `processors` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  const automation = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true });
  await expect(automation).toBeVisible();
  await automation.dragTo(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  );
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].processors).toEqual([
    expect.objectContaining({ title: "Automation" }),
  ]);
  expect(after.slices.at(-1).processors).toEqual([]);
});

test("After clicking `New Slice` twice, dragging the first Timeline `New Slice` listitem onto the last Timeline `New Slice` listitem sets the first Slice `id` to the Slice that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const timelineSlices = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "New Slice", exact: true });
  await expect(timelineSlices).toHaveCount(2);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[1].id;
  await timelineSlices.first().dragTo(timelineSlices.last());
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].id).toBe(lastId);
});
