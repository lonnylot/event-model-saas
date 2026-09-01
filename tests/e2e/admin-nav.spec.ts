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

test("GET `/app` as a Person with two Teams `header` computed `display` is `flex`", async ({
  page,
}) => {
  await page.request.post("/api/test/picker-session");
  await page.goto("/app");
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/app/teams/{id}` as a member `header` computed `display` is `flex`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/app/admin/teams` as site admin `header` computed `display` is `flex`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/app/teams/{id}` as a member `header` computed `box-shadow` is not `none`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(page.locator("header")).not.toHaveCSS("box-shadow", "none");
});

test("GET `/app/admin/teams` as site admin `header` computed `box-shadow` is not `none`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(page.locator("header")).not.toHaveCSS("box-shadow", "none");
});

test("GET `/app` as site admin with two Teams, `nav` shows a link whose accessible name is `Teams admin`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await page.request.post("/api/teams", { data: { name: "Alpha" } });
  await page.request.post("/api/teams", { data: { name: "Beta" } });
  await page.goto("/app");
  await expect(
    page.getByRole("navigation").getByRole("link", {
      name: "Teams admin",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}` as site admin, `nav` shows a link whose accessible name is `Teams admin`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("navigation").getByRole("link", {
      name: "Teams admin",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}` as site admin, the `nav` link `Teams admin` has `href` `/app/admin/teams`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("navigation").getByRole("link", {
      name: "Teams admin",
      exact: true,
    }),
  ).toHaveAttribute("href", "/app/admin/teams");
});

test("GET `/app/teams/{id}` as a Person who is not site admin does not show a link whose accessible name is `Teams admin`", async ({
  page,
  request,
  browser,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
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
    teammate.getByRole("link", { name: "Teams admin", exact: true }),
  ).toHaveCount(0);
  await teammate.close();
});
