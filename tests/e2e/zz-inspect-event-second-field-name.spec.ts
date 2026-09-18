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
        baseURL: String(workerInfo.project.use.baseURL ?? "http://127.0.0.1:8787"),
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

test("After a member creates a model, opens it, clicks `Add Event`, clicks the Timeline `Event Happened` listitem, clicks `Add Field`, fills the first `Field name` with `eventId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Event Happened` listitem, filling the second Inspector `Field name` with `sku` sets that Event `fields[1].name` to `sku`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toHaveCount(1);
  await timeline
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("eventId");
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(
    timeline.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toBeVisible();
  await timeline
    .getByRole("listitem", { name: "Event Happened", exact: true })
    .click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .nth(1)
    .fill("sku");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.at(-1)?.events?.at(-1)?.fields?.[1]?.name,
  ).toBe("sku");
});

test("After a member creates a model, opens it, clicks `Add Read Model`, clicks the Timeline `Read Model` listitem, clicks `Add Field`, fills the first `Field name` with `viewId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Read Model` listitem, filling the second Inspector `Field name` with `sku` sets that Read Model `fields[1].name` to `sku`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toHaveCount(1);
  await timeline
    .getByRole("listitem", { name: "Read Model", exact: true })
    .click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("viewId");
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(
    timeline.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toBeVisible();
  await timeline.getByRole("listitem", { name: "Read Model", exact: true }).click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .nth(1)
    .fill("sku");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.at(-1)?.readModels?.at(-1)?.fields?.[1]
      ?.name,
  ).toBe("sku");
});

test("After a member creates a model, opens it, clicks `Add Automation`, clicks the Timeline `Automation` listitem, clicks `Add Field`, fills the first `Field name` with `jobId`, clicks `Add Field`, and Saves, a reload of that page, clicking the Timeline `Automation` listitem, filling the second Inspector `Field name` with `sku` sets that Automation `fields[1].name` to `sku`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Automation", exact: true }),
  ).toHaveCount(1);
  await timeline
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .fill("jobId");
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  await page.waitForLoadState("networkidle");
  await expect(
    timeline.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await timeline
    .getByRole("listitem", { name: "Automation", exact: true })
    .click();
  await inspector
    .getByRole("textbox", { name: "Field name", exact: true })
    .nth(1)
    .fill("sku");
  const json = await page
    .locator("#event-model-document")
    .evaluate((el) => el.textContent);
  expect(
    JSON.parse(json ?? "{}").slices?.at(-1)?.processors?.at(-1)?.fields?.[1]
      ?.name,
  ).toBe("sku");
});
