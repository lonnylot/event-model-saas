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

test("After dragging `Command port` onto `Event Happened port`, `Command → Event Happened` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Command` `getBoundingClientRect.bottom`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
  const caption = page.locator(".board").getByText("Command → Event Happened", {
    exact: true,
  });
  await expect(caption).toBeVisible();
  const sliceCol = page.locator(".slice-col").filter({
    has: page.getByRole("listitem", { name: "Command", exact: true }),
  });
  const captionTop = await caption.evaluate((el) =>
    el.getBoundingClientRect().top,
  );
  const colBottom = await sliceCol.evaluate((el) =>
    el.getBoundingClientRect().bottom,
  );
  expect(captionTop).toBeGreaterThanOrEqual(colBottom);
});

test("After dragging `Event Happened port` onto `Read Model port`, `Event Happened → Read Model` `getBoundingClientRect.top` is greater than or equal to the `.slice-col` that contains `Read Model` `getBoundingClientRect.bottom`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Event Happened port", "Read Model port");
  const caption = page.locator(".board").getByText(
    "Event Happened → Read Model",
    { exact: true },
  );
  await expect(caption).toBeVisible();
  const sliceCol = page.locator(".slice-col").filter({
    has: page.getByRole("listitem", { name: "Read Model", exact: true }),
  });
  const captionTop = await caption.evaluate((el) =>
    el.getBoundingClientRect().top,
  );
  const colBottom = await sliceCol.evaluate((el) =>
    el.getBoundingClientRect().bottom,
  );
  expect(captionTop).toBeGreaterThanOrEqual(colBottom);
});
