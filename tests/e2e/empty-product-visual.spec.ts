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
