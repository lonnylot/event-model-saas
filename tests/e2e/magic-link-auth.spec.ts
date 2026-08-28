import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("GET `/login` shows a textbox whose accessible name is `Email`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("textbox", { name: "Email", exact: true }),
  ).toBeVisible();
});

test("GET `/` shows a button whose accessible name is `Email me a link`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toBeVisible();
});

test("Submitting `Email me a link` on `/` with `SITE_ADMIN_EMAIL` shows the text `If you have access, check your inbox.`", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("lonny@lonnylot.com");
  await page.getByRole("button", { name: "Email me a link", exact: true }).click();
  await expect(
    page.getByText("If you have access, check your inbox."),
  ).toBeVisible();
});

test("GET `/app` without a Session returns status 303", async ({ request }) => {
  const response = await request.get("/app", { maxRedirects: 0 });
  expect(response.status()).toBe(303);
});

test("GET `/app` without a Session sets `Location` to `/`", async ({
  request,
}) => {
  const response = await request.get("/app", { maxRedirects: 0 });
  expect(response.headers()["location"]).toBe("/");
});

test("After consuming the magic-link from that submission, `/app` shows `SITE_ADMIN_EMAIL`", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill("lonny@lonnylot.com");
  await page.getByRole("button", { name: "Email me a link", exact: true }).click();
  await expect(
    page.getByText("If you have access, check your inbox."),
  ).toBeVisible();
  const mail = await request.get("/api/test/last-mail");
  const body = (await mail.json()) as { text: string };
  const match = body.text.match(/\/api\/auth\/consume\?token=[^\s]+/);
  expect(match).not.toBeNull();
  await page.goto(match![0]);
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByText("lonny@lonnylot.com")).toBeVisible();
});
