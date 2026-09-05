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

async function addFieldOnCommandThenClickEventRead(page: Page) {
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const inspector = page.getByRole("region", {
    name: "Inspector",
    exact: true,
  });
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    timeline.getByRole("listitem", { name: "Command", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await dragPort(page, "Event Happened port", "Read Model port");
  await expect(
    timeline.getByText("Event Happened → Read Model", { exact: true }),
  ).toBeVisible();
  await timeline
    .getByRole("listitem", { name: "Command", exact: true })
    .click();
  await expect(
    inspector.getByRole("button", { name: "Add Field", exact: true }),
  ).toBeVisible();
  await inspector.getByRole("button", { name: "Add Field", exact: true }).click();
  await expect(
    inspector.getByRole("button", { name: "Add Field", exact: true }),
  ).toBeVisible();
  await expect(
    inspector.getByRole("textbox", { name: "Field name", exact: true }),
  ).toBeVisible();
  await timeline
    .getByText("Event Happened → Read Model", { exact: true })
    .click();
  return { timeline, inspector };
}

test("After clicking the Timeline `Command` listitem, clicking `Add Field`, dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, the Inspector region does not show a button whose accessible name is `Add Field`", async ({
  page,
}) => {
  const { inspector } = await addFieldOnCommandThenClickEventRead(page);
  await expect(
    inspector.getByRole("button", { name: "Add Field", exact: true }),
  ).toHaveCount(0);
});

test("After clicking the Timeline `Command` listitem, clicking `Add Field`, dragging `Event Happened port` onto `Read Model port`, clicking `Event Happened → Read Model`, the Inspector region does not show a textbox whose accessible name is `Field name`", async ({
  page,
}) => {
  const { inspector } = await addFieldOnCommandThenClickEventRead(page);
  await expect(
    inspector.getByRole("textbox", { name: "Field name", exact: true }),
  ).toHaveCount(0);
});
