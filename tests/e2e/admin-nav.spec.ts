import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

async function consumeAdmin(page: Page, request: APIRequestContext) {
  await page.goto("/login");
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

test("GET `/app` as a Person with two Teams shows a navigation landmark", async ({
  page,
}) => {
  await page.request.post("/api/test/picker-session");
  await page.goto("/app");
  await expect(page.getByRole("navigation")).toHaveCount(1);
});

test("GET `/app/teams/{id}` as a member shows a navigation landmark", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(page.getByRole("navigation")).toHaveCount(1);
});

test("GET `/app/admin/teams` as site admin shows a navigation landmark", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(page.getByRole("navigation")).toHaveCount(1);
});
