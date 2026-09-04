import {
  expect,
  test as base,
  type Page,
  type APIRequestContext,
  type Locator,
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

function overflows(
  inner: { left: number; right: number; top: number; bottom: number },
  outer: { left: number; right: number; top: number; bottom: number },
) {
  return (
    inner.left < outer.left ||
    inner.right > outer.right ||
    inner.top < outer.top ||
    inner.bottom > outer.bottom
  );
}

function intersects(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number },
) {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
}

async function portVsTitleText(port: Locator) {
  return port.evaluate((el) => {
    const item = el.closest("li");
    const text = [...(item?.childNodes ?? [])].find(
      (node) => node.nodeType === Node.TEXT_NODE,
    );
    if (!item || !text) {
      throw new Error("port listitem has no title text node");
    }
    const range = item.ownerDocument.createRange();
    range.selectNodeContents(text);
    const titleRect = range.getBoundingClientRect();
    const portRect = el.getBoundingClientRect();
    return {
      inner: {
        left: portRect.left,
        right: portRect.right,
        top: portRect.top,
        bottom: portRect.bottom,
      },
      title: {
        left: titleRect.left,
        right: titleRect.right,
        top: titleRect.top,
        bottom: titleRect.bottom,
      },
    };
  });
}

async function portVsContainingSliceCol(port: Locator) {
  return port.evaluate((el) => {
    const col = el.closest(".slice-col");
    if (!col) {
      throw new Error("port is not inside .slice-col");
    }
    const portRect = el.getBoundingClientRect();
    const colRect = col.getBoundingClientRect();
    return {
      inner: {
        left: portRect.left,
        right: portRect.right,
        top: portRect.top,
        bottom: portRect.bottom,
      },
      outer: {
        left: colRect.left,
        right: colRect.right,
        top: colRect.top,
        bottom: colRect.bottom,
      },
    };
  });
}

test("After clicking `Add Event` on that page, `Event Happened port` `getBoundingClientRect` does not overflow the `.slice-col` that contains it", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(port).toBeVisible();
  const { inner, outer } = await portVsContainingSliceCol(port);
  expect(overflows(inner, outer)).toBe(false);
});

test("After clicking `Add Event` on that page, `Event Happened port` `getBoundingClientRect` does not intersect the Event Happened listitem title text node `getBoundingClientRect`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(port).toBeVisible();
  const { inner, title } = await portVsTitleText(port);
  expect(intersects(inner, title)).toBe(false);
});
