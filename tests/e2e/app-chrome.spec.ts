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

async function openUntitledModel(page: Page, request: APIRequestContext) {
  await consumeAdminOnTeam(page, request);
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

test("GET `/` `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/login` `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app/teams/{id}` as a member `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app/admin/teams` as site admin `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app` as site admin with no teams `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
  request,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdmin(page, request);
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app` as a Person with two Teams `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.request.post("/api/test/picker-session");
  await page.goto("/app");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app` as a Person who is not site admin with no teams `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/app");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app/teams/{id}/models/{mid}` as a member `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/app/teams/{id}` as a member shows a heading whose accessible name is `Event Models`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("heading", { name: "Event Models", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}` as a member with no Event Models shows the text `Create a model to start the timeline.`", async ({
  page,
  request,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByText("Create a model to start the timeline.", { exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}` as a member with an Event Model titled `Untitled`, the link `Untitled` is inside an `article`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  const untitled = page.getByRole("link", { name: "Untitled", exact: true });
  if ((await untitled.count()) === 0) {
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/models") &&
          response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Create model", exact: true }).click(),
    ]);
  }
  await expect(
    page
      .locator("article")
      .filter({
        has: page.getByRole("link", { name: "Untitled", exact: true }),
      })
      .first(),
  ).toBeVisible();
});

test("GET `/app/teams/{id}` as a member with an Event Model titled `Untitled`, that `article` computed `box-shadow` is not `none`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  const untitled = page.getByRole("link", { name: "Untitled", exact: true });
  if ((await untitled.count()) === 0) {
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.url().includes("/models") &&
          response.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Create model", exact: true }).click(),
    ]);
  }
  await expect(
    page
      .locator("article")
      .filter({
        has: page.getByRole("link", { name: "Untitled", exact: true }),
      })
      .first(),
  ).not.toHaveCSS("box-shadow", "none");
});

test("GET `/app/teams/{id}/models/{mid}` as a member shows a navigation landmark", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.getByRole("navigation")).toHaveCount(1);
});

test("GET `/app/teams/{id}/models/{mid}` as a member, `header` shows a link whose accessible name is `Event Model`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.locator("header").getByRole("link", {
      name: "Event Model",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the `header` link `Event Model` has `href` `/app`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.locator("header").getByRole("link", {
      name: "Event Model",
      exact: true,
    }),
  ).toHaveAttribute("href", "/app");
});

test("GET `/app/teams/{id}/models/{mid}` as site admin, `nav` shows a link whose accessible name is `Teams admin`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("navigation").getByRole("link", {
      name: "Teams admin",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as site admin, the `nav` link `Teams admin` has `href` `/app/admin/teams`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("navigation").getByRole("link", {
      name: "Teams admin",
      exact: true,
    }),
  ).toHaveAttribute("href", "/app/admin/teams");
});

test("GET `/app/teams/{id}/models/{mid}` as a Person who is not site admin does not show a link whose accessible name is `Teams admin`", async ({
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
  await Promise.all([
    teammate.waitForResponse(
      (response) =>
        response.url().includes("/models") &&
        response.request().method() === "POST",
    ),
    teammate.getByRole("button", { name: "Create model", exact: true }).click(),
  ]);
  await teammate.goto("/app");
  await teammate
    .getByRole("link", { name: "Untitled", exact: true })
    .last()
    .click();
  await expect(
    teammate.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
  await expect(
    teammate.getByRole("link", { name: "Teams admin", exact: true }),
  ).toHaveCount(0);
  await teammate.close();
});

test("GET `/app/teams/{id}/models/{mid}` as a member, a link whose accessible name is the Team name has `href` `/app/teams/{id}`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  const match = new URL(page.url()).pathname.match(
    /^\/app\/teams\/([^/]+)\/models\//,
  );
  expect(match).not.toBeNull();
  await expect(
    page.getByRole("link", { name: "Library", exact: true }),
  ).toHaveAttribute("href", `/app/teams/${match![1]}`);
});
