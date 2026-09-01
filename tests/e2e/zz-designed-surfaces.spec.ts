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

test("GET `/app/teams/{id}/models/{mid}` as a member `header` computed `display` is `flex`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/app/teams/{id}/models/{mid}` as a member `header` computed `padding-top` is not `0px`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("header")).not.toHaveCSS("padding-top", "0px");
});

test("GET `/app/teams/{id}/models/{mid}` as a member `main` computed `display` is `grid`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("main")).toHaveCSS("display", "grid");
});

test("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Inspector`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("heading", { name: "Inspector", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Model`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("heading", { name: "Model", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member with no Slices shows a heading whose accessible name is `Start the timeline`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("heading", { name: "Start the timeline", exact: true }),
  ).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member shows the text `Time`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.getByText("Time", { exact: true })).toBeVisible();
});

test("GET `/app/teams/{id}/models/{mid}` as a member with no local edits shows the text `Nothing Selected`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByText("Nothing Selected", { exact: true }),
  ).toBeVisible();
});
