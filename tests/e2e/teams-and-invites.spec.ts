import { expect, test, type Page, type APIRequestContext } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function consumeAdmin(page: Page, request: APIRequestContext) {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(
    "lonny@lonnylot.com",
  );
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

test("GET `/app` as site admin with no teams shows a textbox whose accessible name is `Team name`", async ({
  page,
  request,
}) => {
  await consumeAdmin(page, request);
  await expect(
    page.getByRole("textbox", { name: "Team name", exact: true }),
  ).toBeVisible();
});

