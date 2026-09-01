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

test("After clicking `New Slice` twice, dragging the first `New Slice` listitem onto the last `New Slice` listitem sets the first Slice `id` to the Slice that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[1].id;
  const sidebarSlices = page
    .locator("ul")
    .first()
    .getByRole("listitem", { name: "New Slice", exact: true });
  await sidebarSlices.first().dragTo(sidebarSlices.last());
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].id).toBe(lastId);
});

test("After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the first Slice `commands` to one Command", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const command = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true });
  await expect(command).toBeVisible();
  await command.dragTo(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
    { sourcePosition: { x: 12, y: 8 } },
  );
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices[0].commands).toEqual([
    expect.objectContaining({ title: "Command" }),
  ]);
});

test("After clicking `New Slice` twice then `Add Command`, dragging the Timeline `Command` listitem onto the first Slices `New Slice` listitem sets the last Slice `commands` to `[]`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const command = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true });
  await expect(command).toBeVisible();
  await command.dragTo(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
    { sourcePosition: { x: 12, y: 8 } },
  );
  const after = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(after.slices.at(-1).commands).toEqual([]);
});

test("After clicking `New Slice` then `Add Command`, pressing ⌘Z does not show a listitem whose accessible name is `Command`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` then `Add Command`, pressing ⌘Z shows a listitem whose accessible name is `New Slice`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  ).toBeVisible();
});

test("Pressing ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1.25)`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.keyboard.press("ControlOrMeta+Equal");
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await expect.poll(async () => timeline.evaluate((el) => el.style.transform)).toContain(
    "scale(1.25)",
  );
});

test("Pressing ⌘- on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(0.8)`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.keyboard.press("ControlOrMeta+Minus");
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await expect.poll(async () => timeline.evaluate((el) => el.style.transform)).toContain(
    "scale(0.8)",
  );
});

test("Pressing ⌘0 after ⌘+ on the Event Model page sets the Timeline `style.transform` to a value that includes `scale(1)`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.keyboard.press("ControlOrMeta+Equal");
  await page.keyboard.press("ControlOrMeta+Digit0");
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const transform = await timeline.evaluate((el) => el.style.transform);
  expect(transform).toContain("scale(1)");
  expect(transform).not.toContain("1.25");
});
