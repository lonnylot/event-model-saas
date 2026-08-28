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
