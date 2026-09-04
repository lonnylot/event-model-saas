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

async function dragPort(page: Page, fromName: string, toName: string) {
  await expect(
    page.getByRole("button", { name: fromName, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: toName, exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: fromName, exact: true })
    .hover({ force: true });
  await page
    .getByRole("button", { name: fromName, exact: true })
    .dragTo(page.getByRole("button", { name: toName, exact: true }));
}

async function saveReloadCommandEventConnection(page: Page) {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  await expect(page.locator(".board")).toContainText(
    "Command → Event Happened",
  );
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
}

test("After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, the `.board` `Command → Event Happened` node has a non-empty `data-id`", async ({
  page,
}) => {
  await saveReloadCommandEventConnection(page);
  await expect(
    page.locator(".board").getByText("Command → Event Happened", {
      exact: true,
    }),
  ).toHaveAttribute("data-id", /.+/);
});

test("After a member creates a model, opens it, clicks `Add Command`, clicks `Add Event`, drags `Command port` onto `Event Happened port`, and Saves, a reload of that page, clicking `Command → Event Happened` then the Timeline region, pressing Backspace sets Event Model `connections` to `[]`", async ({
  page,
}) => {
  await saveReloadCommandEventConnection(page);
  await page
    .locator(".board")
    .getByText("Command → Event Happened", { exact: true })
    .click();
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Backspace");
  const json = JSON.parse(
    (await page.locator("#event-model-document").textContent()) ?? "{}",
  );
  expect(json.connections).toEqual([]);
});
