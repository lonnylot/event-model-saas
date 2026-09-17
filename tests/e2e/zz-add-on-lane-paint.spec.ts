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

async function clickNewSlice(page: Page) {
  const slices =
    (await page.getByRole("listitem", { name: "New Slice", exact: true }).count()) +
    2;
  const lanes =
    (await page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true })
      .count()) + 1;
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(slices);
  await expect(
    page
      .getByRole("region", { name: "Timeline", exact: true })
      .getByRole("button", { name: "Add Actor on lane", exact: true }),
  ).toHaveCount(lanes);
}

async function openImportedEmptyModel(page: Page) {
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
  const teamId = new URL(page.url()).pathname.split("/")[3];
  const response = await page.request.post(`/api/teams/${teamId}/imports`, {
    data: {
      document: {
        format: "eventmodel",
        schemaVersion: 1,
        id: crypto.randomUUID(),
        title: "Empty Import",
        slices: [],
      },
    },
  });
  expect(response.status()).toBe(201);
  await page.goto("/app");
  await page.getByRole("link", { name: "Empty Import", exact: true }).last().click();
  await expect(
    page.getByRole("heading", { name: "Empty Import", exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
}

test("After clicking `New Slice` twice, clicking the first `Add Actor on lane`, the first Slice Timeline region shows 2 listitem whose accessible name is `Actor`", async ({
  page,
}) => {
  await openImportedEmptyModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  const timeline = page.getByRole("region", { name: "Timeline", exact: true });
  const firstSlice = timeline.locator(".slice-col").first();
  await firstSlice
    .getByRole("button", { name: "Add Actor on lane", exact: true })
    .click();
  await expect(
    firstSlice.getByRole("listitem", { name: "Actor", exact: true }),
  ).toHaveCount(2);
});
