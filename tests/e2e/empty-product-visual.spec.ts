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

test("GET `/app` as site admin with no teams `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app` as site admin with no teams `body` computed `color` is `rgb(15, 23, 42)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator("body")).toHaveCSS("color", "rgb(15, 23, 42)");
});

test("GET `/app` as site admin with no teams `body` computed `font-family` includes `system-ui`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/app` as site admin with no teams `header` computed `border-bottom-color` is `rgb(226, 232, 240)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(page.locator("header")).toHaveCSS(
    "border-bottom-color",
    "rgb(226, 232, 240)",
  );
});

test("GET `/app` as site admin with no teams, the link `Event Model` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET `/app` as site admin with no teams, the button `Create team` computed `background-color` is `rgb(15, 118, 110)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("button", { name: "Create team", exact: true }),
  ).toHaveCSS("background-color", "rgb(15, 118, 110)");
});

test("GET `/app` as site admin with no teams, the button `Create team` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("button", { name: "Create team", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/app` as site admin with no teams, the button `Create team` computed `border-radius` is `10px`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("button", { name: "Create team", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/app` as site admin with no teams, the textbox `Team name` computed `border-top-color` is `rgb(226, 232, 240)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("textbox", { name: "Team name", exact: true }),
  ).toHaveCSS("border-top-color", "rgb(226, 232, 240)");
});

test("GET `/app` as site admin with no teams, the textbox `Team name` computed `border-radius` is `10px`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("textbox", { name: "Team name", exact: true }),
  ).toHaveCSS("border-radius", "10px");
});

test("GET `/app` as site admin with no teams, the button `Sign out` computed `background-color` is `rgba(0, 0, 0, 0)`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
});

test("GET `/app` as a Person who is not site admin with no teams `body` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/app");
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/app` as a Person who is not site admin with no teams `body` computed `color` is `rgb(15, 23, 42)`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/app");
  await expect(page.locator("body")).toHaveCSS("color", "rgb(15, 23, 42)");
});

test("GET `/app` as a Person who is not site admin with no teams `body` computed `font-family` includes `system-ui`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/app");
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});
