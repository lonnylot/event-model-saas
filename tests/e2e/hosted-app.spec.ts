import { expect, test } from "@playwright/test";

test("GET `/` shows a heading whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Event Model", level: 1 }),
  ).toBeVisible();
});

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

test("GET an unknown document path returns status 404 and a heading whose accessible name is `Not found`", async ({
  page,
}) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Not found", level: 1 }),
  ).toBeVisible();
});
