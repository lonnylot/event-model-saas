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

test('GET `/app` as site admin with no teams has a `link[rel="stylesheet"]` whose `href` is `/shell.css`', async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
    "href",
    "/shell.css",
  );
});


test("GET `/app` as site admin with no teams `body` computed `background-color` is `rgb(247, 244, 238)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(247, 244, 238)",
  );
});


test("GET `/app` as site admin with no teams shows a link whose accessible name is `Event Model`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toBeVisible();
});
