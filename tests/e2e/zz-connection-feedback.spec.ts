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

async function addCommandEventAndReadModel(page: Page) {
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
}

test("After pointer-down on `Command port`, the `Event Happened port` has `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await addCommandEventAndReadModel(page);
  await page.getByRole("button", { name: "Command port", exact: true }).hover();
  await page.mouse.down();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toHaveAttribute("aria-current", "true");
});

test("After pointer-down on `Command port`, the `Read Model port` does not have `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await addCommandEventAndReadModel(page);
  await page.getByRole("button", { name: "Command port", exact: true }).hover();
  await page.mouse.down();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).not.toHaveAttribute("aria-current", "true");
});

test("After pointer-down on `Event Happened port`, the `Read Model port` has `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await addCommandEventAndReadModel(page);
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .hover();
  await page.mouse.down();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toHaveAttribute("aria-current", "true");
});

test("After pointer-down on `Event Happened port`, the `Command port` does not have `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await addCommandEventAndReadModel(page);
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .hover();
  await page.mouse.down();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).not.toHaveAttribute("aria-current", "true");
});

test("After dragging from `Command port` onto `Read Model port`, the `Event Happened port` does not have `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await addCommandEventAndReadModel(page);
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("button", { name: "Read Model port", exact: true }));
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).not.toHaveAttribute("aria-current", "true");
});
