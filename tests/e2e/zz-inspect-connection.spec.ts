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
    page.getByRole("listitem", { name: "New Slice", exact: true }),
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

async function dragCommandToEvent(page: Page) {
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await dragPort(page, "Command port", "Event Happened port");
}

test("After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `Connection` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await dragCommandToEvent(page);
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await expect(
    inspector.getByText("Connection", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByText("Command → Event Happened", { exact: true })
    .click();
  await expect(
    inspector.getByText("Connection", { exact: true }),
  ).toBeVisible();
});

test("After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `From Command` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await dragCommandToEvent(page);
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await expect(
    inspector.getByText("From Command", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByText("Command → Event Happened", { exact: true })
    .click();
  await expect(
    inspector.getByText("From Command", { exact: true }),
  ).toBeVisible();
});

test("After dragging from `Command port` onto `Event Happened port`, clicking the Timeline text `Command → Event Happened` shows the text `To Event Happened` in the Inspector region", async ({
  page,
}) => {
  await openUntitledModel(page);
  await dragCommandToEvent(page);
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await expect(
    inspector.getByText("To Event Happened", { exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("region", { name: "Timeline", exact: true })
    .getByText("Command → Event Happened", { exact: true })
    .click();
  await expect(
    inspector.getByText("To Event Happened", { exact: true }),
  ).toBeVisible();
});
