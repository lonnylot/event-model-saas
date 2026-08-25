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

test("After clicking `New Slice` then `Add Command` on that page, the Command listitem shows a button whose accessible name is `Command port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page
      .getByRole("listitem", { name: "Command", exact: true })
      .getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Event` on that page, the Event Happened listitem shows a button whose accessible name is `Event Happened port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page
      .getByRole("listitem", { name: "Event Happened", exact: true })
      .getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Read Model` on that page, the Read Model listitem shows a button whose accessible name is `Read Model port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    page
      .getByRole("listitem", { name: "Read Model", exact: true })
      .getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
});

test("After clicking `New Slice` then `Add Actor` on that page, the Actor listitem does not show a button whose accessible name is `Actor port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page
      .getByRole("listitem", { name: "Actor", exact: true })
      .getByRole("button", { name: "Actor port", exact: true }),
  ).toHaveCount(0);
});

test("After clicking `New Slice` then `Add Automation` on that page, the Automation listitem does not show a button whose accessible name is `Automation port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page
      .getByRole("listitem", { name: "Automation", exact: true })
      .getByRole("button", { name: "Automation port", exact: true }),
  ).toHaveCount(0);
});

test("Dragging from `Command port` onto `Event Happened port` appends a Connection whose `fromKind` is `COMMAND`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Event Happened port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.fromKind).toBe("COMMAND");
});

test("Dragging from `Command port` onto `Event Happened port` appends a Connection whose `toKind` is `EVENT`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Event Happened port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.toKind).toBe("EVENT");
});

test("Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `fromKind` is `EVENT`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .dragTo(page.getByRole("button", { name: "Read Model port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.fromKind).toBe("EVENT");
});

test("Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `toKind` is `READMODEL`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .dragTo(page.getByRole("button", { name: "Read Model port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.toKind).toBe("READMODEL");
});

test("Dragging from `Command port` onto `Read Model port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Read Model port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto `Read Model port` shows the text `A command can't write a read model.`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Read Model port", exact: true }));
  await expect(
    page.getByText("A command can't write a read model."),
  ).toBeVisible();
});
