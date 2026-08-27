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
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }).first(),
  ).toBeVisible();
}

async function dragPort(page: Page, fromName: string, toName: string) {
  await expect(
    page.getByRole("button", { name: fromName, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: toName, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: fromName, exact: true })
    .dragTo(page.getByRole("button", { name: toName, exact: true }));
}

test("After clicking `New Slice` then `Add Command` on that page, the Command listitem shows a button whose accessible name is `Command port`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
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
  await clickNewSlice(page);
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
  await clickNewSlice(page);
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
  await clickNewSlice(page);
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
  await clickNewSlice(page);
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
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.fromKind).toBe("COMMAND");
});

test("Dragging from `Command port` onto `Event Happened port` appends a Connection whose `toKind` is `EVENT`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.toKind).toBe("EVENT");
});

test("Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `fromKind` is `EVENT`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Event Happened port", "Read Model port");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.fromKind).toBe("EVENT");
});

test("Dragging from `Event Happened port` onto `Read Model port` appends a Connection whose `toKind` is `READMODEL`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Event Happened port", "Read Model port");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections[0]?.toKind).toBe("READMODEL");
});

test("Dragging from `Command port` onto `Read Model port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Command port", "Read Model port");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto `Read Model port` shows the text `A command can't write a read model.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Command port", "Read Model port");
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("A command can't write a read model.");
});

test("After dragging from `Command port` onto `Event Happened port`, the Timeline region shows the text `Command → Event Happened`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByText("Command → Event Happened"),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks `New Slice`, adds a Command and an Event, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page shows the text `Command → Event Happened` in the Timeline region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByText("Command → Event Happened"),
  ).toBeVisible();
});
