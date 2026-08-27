import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

async function consumeAdmin(page: Page, request: APIRequestContext) {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Email", exact: true })
    .fill("lonny@lonnylot.com");
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

async function openUsedMagicLink(page: Page, request: APIRequestContext) {
  await consumeAdmin(page, request);
  const mail = await request.get("/api/test/last-mail");
  const body = (await mail.json()) as { text: string };
  const match = body.text.match(/\/api\/auth\/consume\?token=[^\s]+/);
  expect(match).not.toBeNull();
  await page.goto(match![0]);
}

async function consumeAdminOnTeam(page: Page, request: APIRequestContext) {
  await consumeAdmin(page, request);
  const name = page.getByRole("textbox", { name: "Team name", exact: true });
  if (await name.isVisible()) {
    await name.fill("Library");
    await page.getByRole("button", { name: "Create team", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Library", exact: true }),
    ).toBeVisible();
  }
}

test("GET `/favicon.png` returns status 200", async ({ request }) => {
  const response = await request.get("/favicon.png");
  expect(response.status()).toBe(200);
});


test("GET `/favicon.png` returns content-type `image/png`", async ({
  request,
}) => {
  const response = await request.get("/favicon.png");
  expect(response.headers()["content-type"]).toMatch(/^image\/png\b/);
});


test("GET `/og.png` returns status 200", async ({ request }) => {
  const response = await request.get("/og.png");
  expect(response.status()).toBe(200);
});


test("GET `/og.png` returns content-type `image/png`", async ({ request }) => {
  const response = await request.get("/og.png");
  expect(response.headers()["content-type"]).toMatch(/^image\/png\b/);
});


test("GET `/shell.css` returns status 200", async ({ request }) => {
  const response = await request.get("/shell.css");
  expect(response.status()).toBe(200);
});


test("GET `/shell.css` returns content-type `text/css`", async ({
  request,
}) => {
  const response = await request.get("/shell.css");
  expect(response.headers()["content-type"]).toMatch(/^text\/css\b/);
});


test('GET `/` has a `link[rel="icon"]` whose `href` is `/favicon.png`', async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/favicon.png",
  );
});


test('GET `/` has a `link[rel="stylesheet"]` whose `href` is `/shell.css`', async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
    "href",
    "/shell.css",
  );
});
