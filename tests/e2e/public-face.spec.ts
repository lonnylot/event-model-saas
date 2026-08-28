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

test("GET `/` without a Session shows a heading whose accessible name is `Event Modeling for the whole team`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `One Event Model, signed in. No passing files around.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("One Event Model, signed in. No passing files around."),
  ).toBeVisible();
});

test("GET `/` without a Session shows a link whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session, the link `Event Model` has `href` `/`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveAttribute("href", "/");
});

test("GET `/` without a Session shows a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session, a link `Sign in` has `href` `/login`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveAttribute("href", "/login");
});

test("GET `/login` without a Session returns status 200", async ({
  request,
}) => {
  const response = await request.get("/login", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test('GET `/login` without a Session has a `link[rel="stylesheet"]` whose `href` is `/shell.css`', async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
    "href",
    "/shell.css",
  );
});

test('GET `/login` without a Session has a `link[rel="icon"]` whose `href` is `/favicon.png`', async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/favicon.png",
  );
});

test("GET `/login` without a Session shows a heading whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session shows the text `We'll email you a magic link.`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.getByText("We'll email you a magic link.")).toBeVisible();
});

test("GET `/login` without a Session shows a link whose accessible name is `Join the waitlist`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session, the link `Join the waitlist` has `href` `/#waitlist`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toHaveAttribute("href", "/#waitlist");
});

test("GET `/login` without a Session shows a link whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session, the link `Event Model` has `href` `/`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveAttribute("href", "/");
});

test("GET `/` without a Session does not show a button whose accessible name is `Email me a link`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` without a Session does not show a control whose accessible name is `Sign up`", async ({
  page,
}) => {
  await page.goto("/");
  for (const role of [
    "button",
    "link",
    "checkbox",
    "radio",
    "switch",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "tab",
    "combobox",
    "textbox",
    "searchbox",
    "slider",
    "spinbutton",
    "treeitem",
  ] as const) {
    await expect(
      page.getByRole(role, { name: "Sign up", exact: true }),
    ).toHaveCount(0);
  }
});

test("GET `/` without a Session shows a heading whose accessible name is `The model lives with the team`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "The model lives with the team",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Here the Event Model belongs to a Team.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Here the Event Model belongs to a Team."),
  ).toBeVisible();
});

test("GET `/` without a Session shows a heading whose accessible name is `A timeline of slices`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "A timeline of slices",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `a vertical column on the timeline`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("a vertical column on the timeline"),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `intent, then a fact that happened`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("intent, then a fact that happened"),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `a view of state from events`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("a view of state from events")).toBeVisible();
});

test("GET `/` without a Session shows the text `a processor with no human actor`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("a processor with no human actor")).toBeVisible();
});

test("GET `/` without a Session shows the text `Commands connect to events. Events connect to read models.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Commands connect to events. Events connect to read models.",
    ),
  ).toBeVisible();
});

test("GET `/` without a Session shows a heading whose accessible name is `Invite-only, version-checked saves`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Invite-only, version-checked saves",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `The Mac app is local: one person, one .eventmodel file.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("The Mac app is local: one person, one .eventmodel file."),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Magic-link sign-in. No password, no public signup.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Magic-link sign-in. No password, no public signup."),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Site admin creates Teams and sends Invites.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Site admin creates Teams and sends Invites."),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Save is explicit.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("Save is explicit.")).toBeVisible();
});

test("GET `/` without a Session shows a heading whose accessible name is `Join the waitlist`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Join the waitlist", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Leave your email. If you already have access, use Sign in.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Leave your email. If you already have access, use Sign in.",
    ),
  ).toBeVisible();
});

test("GET `/` without a Session shows a link whose accessible name is `Join the waitlist`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session, a link `Join the waitlist` has an `href` that ends with `#waitlist`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toHaveAttribute("href", /#waitlist$/);
});

test("GET `/` without a Session shows a textbox whose accessible name is `Email`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session shows a button whose accessible name is `Join the waitlist`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Join the waitlist", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session does not show a link whose accessible name is `Open app`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Open app", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` with a Session shows a link whose accessible name is `Open app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Open app", exact: true }),
  ).toBeVisible();
});

test("GET `/` with a Session, a link `Open app` has `href` `/app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Open app", exact: true }),
  ).toHaveAttribute("href", "/app");
});

test("GET `/` with a Session does not show a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` with a Session does not show a button whose accessible name is `Sign out`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/` `body` computed `color` is `rgb(15, 23, 42)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(15, 23, 42)");
});

test('GET `/` has a `meta[property="og:description"]` whose `content` is `Event Modeling for the whole team.`', async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    "Event Modeling for the whole team.",
  );
});

test("GET `/login` with a Session returns status 303", async ({ page }) => {
  await page.request.post("/api/test/non-admin-session");
  const response = await page.request.get("/login", { maxRedirects: 0 });
  expect(response.status()).toBe(303);
});

test("GET `/login` with a Session sets `Location` to `/app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  const response = await page.request.get("/login", { maxRedirects: 0 });
  expect(response.headers()["location"]).toBe("/app");
});

test("GET `/login` `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/login` button `Email me a link` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/login` button `Email me a link` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/api/auth/consume` with a used magic-link token `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/api/auth/consume` with a used magic-link token shows a link whose accessible name is `Sign in`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("GET `/api/auth/consume` with a used magic-link token, the link `Sign in` has `href` `/login`", async ({
  page,
  request,
}) => {
  await openUsedMagicLink(page, request);
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveAttribute("href", "/login");
});
