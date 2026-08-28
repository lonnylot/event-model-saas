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

test("After clicking `New Slice` then `Add Actor`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Actor`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
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

test("After clicking `New Slice` then `Add Event`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toBeVisible();
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

test("After clicking `New Slice` then `Add Read Model`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Read Model`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toBeVisible();
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

test("After clicking `New Slice` then `Add Automation`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Automation`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
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

test("After clicking `New Slice` twice, clicking the last `New Slice` listitem, pressing ⌥⌘←, pressing ⌘Z, then pressing ⇧⌘Z, the first Slice `id` is the Slice that was last before the undo", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[1].id;
  await page
    .locator("ul")
    .first()
    .getByRole("listitem", { name: "New Slice", exact: true })
    .last()
    .click();
  await page.keyboard.press("Alt+ControlOrMeta+ArrowLeft");
  const afterMove = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterMove.slices[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].id).toBe(lastId);
});

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Slice `id` is the Slice that was last and the first Slice `id` is the Slice that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].id;
  const lastId = before.slices[1].id;
  await page
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page.getByRole("region", { name: "Timeline", exact: true }).click();
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices).toHaveLength(1);
  expect(afterDelete.slices[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].id).toBe(firstId);
});

test("After clicking `New Slice` twice, clicking the first `New Slice` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Slice `id` is the Slice that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[1].id;
  await page
    .getByRole("listitem", { name: "New Slice", exact: true })
    .first()
    .click();
  await page.getByRole("region", { name: "Timeline", exact: true }).click();
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices).toHaveLength(1);
  expect(afterRedo.slices[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Command`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows a listitem whose accessible name is `Command`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Command `id` is the Command that was last and the first Command `id` is the Command that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].commands[0].id;
  const lastId = before.slices[0].commands[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .first()
    .click();
  await page.getByRole("region", { name: "Timeline", exact: true }).click({
    position: { x: 1, y: 1 },
  });
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices[0].commands).toHaveLength(1);
  expect(afterDelete.slices[0].commands[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].commands[0].id).toBe(firstId);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(2);
});

test("After clicking `New Slice` then `Add Command` twice, clicking the first Timeline `Command` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Command `id` is the Command that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].commands[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Command", exact: true })
    .first()
    .click();
  await page.getByRole("region", { name: "Timeline", exact: true }).click({
    position: { x: 1, y: 1 },
  });
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].commands).toHaveLength(1);
  expect(afterRedo.slices[0].commands[0].id).toBe(lastId);
});

test("After dragging from `Command port` onto `Event Happened port` twice, clicking the first Timeline text `Command → Event Happened` then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining connection `id` is the connection that was last and the first connection `id` is the connection that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .first()
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }).first(),
    );
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .last()
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }).last(),
    );
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.connections[0].id;
  const lastId = before.connections[1].id;
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.locator("p").filter({ hasText: "Command → Event Happened" }).first().click();
  await timeline.click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.connections).toHaveLength(1);
  expect(afterDelete.connections[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.connections[0].id).toBe(firstId);
  await expect(
    timeline.locator("p").filter({ hasText: "Command → Event Happened" }),
  ).toHaveCount(2);
});

test("After dragging from `Command port` onto `Event Happened port` twice, clicking the first Timeline text `Command → Event Happened` then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining connection `id` is the connection that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .first()
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }).first(),
    );
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .last()
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }).last(),
    );
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.connections[1].id;
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.locator("p").filter({ hasText: "Command → Event Happened" }).first().click();
  await timeline.click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.connections).toHaveLength(1);
  expect(afterRedo.connections[0].id).toBe(lastId);
});

async function clickTimelineAwayFromItems(page: Page) {
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await timeline.click({ position: { x: 1, y: 1 } });
}

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Actor `id` is the Actor that was last and the first Actor `id` is the Actor that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].actors[0].id;
  const lastId = before.slices[0].actors[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices[0].actors).toHaveLength(1);
  expect(afterDelete.slices[0].actors[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].actors[0].id).toBe(firstId);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(2);
});

test("After clicking `New Slice` then `Add Actor` twice, clicking the first Timeline `Actor` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Actor `id` is the Actor that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].actors[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Actor", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].actors).toHaveLength(1);
  expect(afterRedo.slices[0].actors[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Event `id` is the Event that was last and the first Event `id` is the Event that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].events[0].id;
  const lastId = before.slices[0].events[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices[0].events).toHaveLength(1);
  expect(afterDelete.slices[0].events[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].events[0].id).toBe(firstId);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(2);
});

test("After clicking `New Slice` then `Add Event` twice, clicking the first Timeline `Event Happened` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Event `id` is the Event that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].events[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].events).toHaveLength(1);
  expect(afterRedo.slices[0].events[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Read Model `id` is the Read Model that was last and the first Read Model `id` is the Read Model that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].readModels[0].id;
  const lastId = before.slices[0].readModels[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices[0].readModels).toHaveLength(1);
  expect(afterDelete.slices[0].readModels[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].readModels[0].id).toBe(firstId);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(2);
});

test("After clicking `New Slice` then `Add Read Model` twice, clicking the first Timeline `Read Model` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Read Model `id` is the Read Model that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].readModels[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Read Model", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].readModels).toHaveLength(1);
  expect(afterRedo.slices[0].readModels[0].id).toBe(lastId);
});

test("After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace, then pressing ⌘Z, the remaining Automation `id` is the Automation that was last and the first Automation `id` is the Automation that was first", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const firstId = before.slices[0].processors[0].id;
  const lastId = before.slices[0].processors[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  const afterDelete = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterDelete.slices[0].processors).toHaveLength(1);
  expect(afterDelete.slices[0].processors[0].id).toBe(lastId);
  await page.keyboard.press("ControlOrMeta+z");
  const afterUndo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterUndo.slices[0].processors[0].id).toBe(firstId);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(2);
});

test("After clicking `New Slice` then `Add Automation` twice, clicking the first Timeline `Automation` listitem then the Timeline region, pressing Backspace, pressing ⌘Z, then pressing ⇧⌘Z, the remaining Automation `id` is the Automation that was last", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  const before = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  const lastId = before.slices[0].processors[1].id;
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "Automation", exact: true })
    .first()
    .click();
  await clickTimelineAwayFromItems(page);
  await page.keyboard.press("Backspace");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("Shift+ControlOrMeta+z");
  const afterRedo = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(afterRedo.slices[0].processors).toHaveLength(1);
  expect(afterRedo.slices[0].processors[0].id).toBe(lastId);
});

test("After clicking `New Slice`, pressing ⌘Z, then pressing ⇧⌘Z, a listitem whose accessible name is `New Slice` is shown", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  const timelineSlice = page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByRole("listitem", { name: "New Slice", exact: true });
  await expect(timelineSlice).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(timelineSlice).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(timelineSlice).toBeVisible();
});

test("After dragging from `Command port` onto `Event Happened port`, pressing ⌘Z, then pressing ⇧⌘Z, the Timeline region shows the text `Command → Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Event Happened port", exact: true }));
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  await expect(timeline.getByText("Command → Event Happened", { exact: true })).toBeVisible();
  await page.keyboard.press("ControlOrMeta+z");
  await expect(timeline.getByText("Command → Event Happened", { exact: true })).toHaveCount(0);
  await page.keyboard.press("Shift+ControlOrMeta+z");
  await expect(timeline.getByText("Command → Event Happened", { exact: true })).toBeVisible();
});
