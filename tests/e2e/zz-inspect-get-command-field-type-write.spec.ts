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

test("After a member creates a model, opens it, clicks `Add Command`, clicks the Timeline `Command` listitem, clicks `Add Field`, selects `UUID` in `Field type`, fills `Name` with `Place Order`, clicks `Add Command`, clicks the last Timeline `Command` listitem, clicks `Add Field`, selects `Boolean` in `Field type`, fills `Name` with `Cancel Order`, and Saves, a reload of that page, clicking the Timeline `Place Order` listitem, selecting `String` in `Field type`, clicking the Timeline `Cancel Order` listitem shows Inspector `Field type` with the value `Boolean`", async ({
  page,
}) => {
  await openUntitledModel(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(1);
  await timeline.getByRole("listitem", { name: "Command", exact: true }).click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector
    .getByRole("combobox", { name: "Field type", exact: true })
    .selectOption("UUID");
  await inspector
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Place Order");
  await expect(
    timeline.getByRole("listitem", { name: "Place Order", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Command", exact: true }),
  ).toHaveCount(1);
  await timeline
    .getByRole("listitem", { name: "Command", exact: true })
    .last()
    .click();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await inspector
    .getByRole("combobox", { name: "Field type", exact: true })
    .selectOption("Boolean");
  await inspector
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Cancel Order");
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
    timeline.getByRole("listitem", { name: "Place Order", exact: true }),
  ).toBeVisible();
  await timeline
    .getByRole("listitem", { name: "Place Order", exact: true })
    .click();
  await inspector
    .getByRole("combobox", { name: "Field type", exact: true })
    .selectOption("String");
  await timeline
    .getByRole("listitem", { name: "Cancel Order", exact: true })
    .click();
  await expect(
    inspector.getByRole("combobox", { name: "Field type", exact: true }),
  ).toHaveValue("Boolean");
});
