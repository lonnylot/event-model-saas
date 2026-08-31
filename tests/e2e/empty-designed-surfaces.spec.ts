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

test("GET `/app` as site admin with no teams `header` computed `display` is `flex`", async ({
  page,
  request,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdmin(page, request);
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/app` as site admin with no teams `header` computed `padding-top` is not `0px`", async ({
  page,
  request,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdmin(page, request);
  await expect(page.locator("header")).not.toHaveCSS("padding-top", "0px");
});
