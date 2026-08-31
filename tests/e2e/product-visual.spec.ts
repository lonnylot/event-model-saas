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
}

test("GET `/` `body` computed `font-family` includes `system-ui`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/` `header` computed `border-bottom-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS(
    "border-bottom-color",
    "rgb(226, 232, 240)",
  );
});

test("GET `/` link `Sign in` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET `/` heading `Event Modeling for the whole team` computed `font-size` is `36px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("font-size", "36px");
});

test("GET `/` the text `One Event Model, signed in. No passing files around.` computed `color` is `rgb(100, 116, 139)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("One Event Model, signed in. No passing files around."),
  ).toHaveCSS("color", "rgb(100, 116, 139)");
});

test("GET `/` `main` computed `max-width` is `576px`", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveCSS("max-width", "576px");
});

test("GET `/` button `Join the waitlist` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Join the waitlist", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/` button `Join the waitlist` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Join the waitlist", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/` button `Join the waitlist` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Join the waitlist", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/` textbox `Email` computed `border-top-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toHaveCSS("border-top-color", "rgb(226, 232, 240)");
});

test("GET `/` textbox `Email` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/` form `waitlist-form` computed `border-top-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("form#waitlist-form")).toHaveCSS(
    "border-top-color",
    "rgb(226, 232, 240)",
  );
});

test("GET `/` form `waitlist-form` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("form#waitlist-form")).toHaveCSS(
    "border-radius",
    "10px",
  );
});

test("GET `/` form `waitlist-form` computed `max-width` is `384px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("form#waitlist-form")).toHaveCSS(
    "max-width",
    "384px",
  );
});

test("GET `/login` `body` computed `font-family` includes `system-ui`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/login` `header` computed `border-bottom-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("header")).toHaveCSS(
    "border-bottom-color",
    "rgb(226, 232, 240)",
  );
});

test("GET `/login` link `Event Model` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET `/login` textbox `Email` computed `border-top-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toHaveCSS("border-top-color", "rgb(226, 232, 240)");
});

test("GET `/login` textbox `Email` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/login` form `login` computed `max-width` is `384px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("form#login")).toHaveCSS("max-width", "384px");
});

test("GET `/login` form `login` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("form#login")).toHaveCSS("border-radius", "10px");
});

test("GET `/login` button `Email me a link` computed `border-radius` is `10px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/login` link `Join the waitlist` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET an unknown document path `body` computed `font-family` includes `system-ui`", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET an unknown document path heading `Not found` computed `font-size` is `36px`", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(
    page.getByRole("heading", { name: "Not found", exact: true }),
  ).toHaveCSS("font-size", "36px");
});

test("GET `/api/auth/consume` with a used magic-link token `body` computed `font-family` includes `system-ui`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/api/auth/consume` with a used magic-link token, the link `Sign in` computed `border-radius` is `10px`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/app` as a Person with two Teams `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.request.post("/api/test/picker-session");
  await page.goto("/app");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app` as a Person with two Teams, a link whose accessible name is the first Team name computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.request.post("/api/test/picker-session");
  await page.goto("/app");
  const firstTeamName = await page
    .locator('a[href^="/app/teams/"]')
    .first()
    .innerText();
  await expect(
    page.getByRole("link", { name: firstTeamName, exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET `/app/teams/{id}` as a member `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app/teams/{id}` as a member, the button `Create model` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("button", { name: "Create model", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/app/teams/{id}` as a member, the button `Create model` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("button", { name: "Create model", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/app/teams/{id}` as a member, the button `Create model` computed `border-radius` is `10px`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await expect(
    page.getByRole("button", { name: "Create model", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/app/admin/teams` as site admin `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app/admin/teams` as site admin, the button `Send invite` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(
    page.getByRole("button", { name: "Send invite", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/app/admin/teams` as site admin, the button `Send invite` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(
    page.getByRole("button", { name: "Send invite", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/app/admin/teams` as site admin, the textbox `Invite email` computed `border-top-color` is `rgb(226, 232, 240)`", async ({
  page,
  request,
}) => {
  await consumeAdminOnTeam(page, request);
  await page.goto("/app/admin/teams");
  await expect(
    page.getByRole("textbox", { name: "Invite email", exact: true }),
  ).toHaveCSS("border-top-color", "rgb(226, 232, 240)");
});

test('GET `/app/teams/{id}/models/{mid}` as a member has a `link[rel="stylesheet"]` whose `href` is `/shell.css`', async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
    "href",
    "/shell.css",
  );
});

test("GET `/app/teams/{id}/models/{mid}` as a member `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app/teams/{id}/models/{mid}` as a member `body` computed `font-family` includes `system-ui`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/app/teams/{id}/models/{mid}` as a member `header` computed `border-bottom-color` is `rgb(226, 232, 240)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(page.locator("header")).toHaveCSS(
    "border-bottom-color",
    "rgb(226, 232, 240)",
  );
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the button `Save` computed `border-radius` is `10px`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the button `Export` computed `background-color` is `rgba(0, 0, 0, 0)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("button", { name: "Export", exact: true }),
  ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the button `Sign out` computed `background-color` is `rgba(0, 0, 0, 0)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the region `Timeline` computed `background-color` is `rgb(248, 250, 252)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("region", { name: "Timeline", exact: true }),
  ).toHaveCSS("background-color", "rgb(248, 250, 252)");
});

test("GET `/app/teams/{id}/models/{mid}` as a member, the region `Inspector` computed `border-left-color` is `rgb(226, 232, 240)`", async ({
  page,
  request,
}) => {
  await openUntitledModel(page, request);
  await expect(
    page.getByRole("region", { name: "Inspector", exact: true }),
  ).toHaveCSS("border-left-color", "rgb(226, 232, 240)");
});
