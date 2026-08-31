import { expect, test, type Page, type APIRequestContext } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  const response = await request.post("/api/test/reset-store");
  expect(response.status()).toBe(204);
});

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

test("GET `/app` as site admin with no teams shows a textbox whose accessible name is `Team name`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("textbox", { name: "Team name", exact: true }),
  ).toBeVisible();
});

test("After a site admin creates Team `Library` and invites `teammate@example.com`, that Person's signed-in page shows a heading whose accessible name is `Library`", async ({
  page,
  request,
  browser,
}) => {
  await consumeAdmin(page, request);
  await page.getByRole("textbox", { name: "Team name", exact: true }).fill(
    "Library",
  );
  await page.getByRole("button", { name: "Create team", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Library", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Teams admin", exact: true }).click();
  await page.getByRole("textbox", { name: "Invite email", exact: true }).fill(
    "teammate@example.com",
  );
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/invites") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Send invite", exact: true }).click(),
  ]);
  const mail = await request.get("/api/test/last-mail");
  const body = (await mail.json()) as { text: string };
  const match = body.text.match(/\/api\/auth\/consume\?token=[^\s]+/);
  expect(match).not.toBeNull();
  const teammate = await browser.newPage();
  await teammate.goto(match![0]);
  await expect(
    teammate.getByRole("heading", { name: "Library", exact: true }),
  ).toBeVisible();
  await teammate.close();
});
