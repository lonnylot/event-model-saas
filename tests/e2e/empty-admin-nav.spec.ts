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

test("GET `/app` as site admin with no teams shows a navigation landmark", async ({
  page,
  request,
}) => {
  await request.post("/api/test/reset-store");
  await consumeAdmin(page, request);
  await expect(page.getByRole("navigation")).toHaveCount(1);
});

test("GET `/app` as a Person who is not site admin with no teams shows a navigation landmark", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/app");
  await expect(page.getByRole("navigation")).toHaveCount(1);
});
