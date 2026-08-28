import { expect, test } from "@playwright/test";

test("GET `/` shows the text `Access is by invite.`", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Access is by invite.")).toBeVisible();
});

test("GET `/` does not show a control whose accessible name is `Sign up`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Sign up" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Sign up" })).toHaveCount(0);
});

test("GET an unknown document path returns status 404", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
});

test("GET an unknown document path shows a heading whose accessible name is `Not found`", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(
    page.getByRole("heading", { name: "Not found", exact: true, level: 1 }),
  ).toBeVisible();
});
