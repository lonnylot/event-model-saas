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

test("GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Name` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows that `Name` textbox with the value `Untitled`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Name", exact: true }),
  ).toHaveValue("Untitled");
});

test("Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading sets the Event Model `title` to `Library Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Library Checkout");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").title).toBe("Library Checkout");
});

test("Filling the Inspector `Name` textbox with `Library Checkout` after clicking the `Untitled` heading shows a heading whose accessible name is `Library Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Library Checkout");
  await expect(
    page.getByRole("heading", { name: "Library Checkout", exact: true }),
  ).toBeVisible();
});

test("After a member creates a model, opens it, clicks the `Untitled` heading, fills `Name` with `Library Checkout`, and Saves, a reload of that page sets the Event Model `title` to `Library Checkout`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Library Checkout");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").title).toBe("Library Checkout");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, clicking the heading whose accessible name is `Untitled` shows a textbox whose accessible name is `Description` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await expect(
    page
      .getByRole("region", { name: "Inspector", exact: true })
      .getByRole("textbox", { name: "Description", exact: true }),
  ).toBeVisible();
});

test("Filling the Inspector `Description` textbox with `Library checkout blueprint` after clicking the `Untitled` heading sets the Event Model `description` to `Library checkout blueprint`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Library checkout blueprint");
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").description).toBe(
    "Library checkout blueprint",
  );
});

test("After a member creates a model, opens it, clicks the `Untitled` heading, fills `Description` with `Library checkout blueprint`, and Saves, a reload of that page sets the Event Model `description` to `Library checkout blueprint`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("heading", { name: "Untitled", exact: true }).click();
  await page
    .getByRole("region", { name: "Inspector", exact: true })
    .getByRole("textbox", { name: "Description", exact: true })
    .fill("Library checkout blueprint");
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await page.reload();
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").description).toBe(
    "Library checkout blueprint",
  );
});
