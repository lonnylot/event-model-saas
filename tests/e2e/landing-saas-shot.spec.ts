import { expect, test } from "@playwright/test";

test("GET `/` `.product-shot` does not contain `.product-chrome`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-shot .product-chrome")).toHaveCount(0);
});

test("GET `/` `.product-shot` shows the text `event-model.lonnylot.com`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("event-model.lonnylot.com", {
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Save`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Save", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Export`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Export", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Sign out`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Sign out", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `New Slice`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("New Slice", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Model`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Model", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Slices`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Slices", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Time`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Time", { exact: true }),
  ).toBeVisible();
});

test("GET `/` `.product-shot` shows the text `Inspector`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Inspector", { exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session does not show a button whose accessible name is `Save`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` without a Session does not show a button whose accessible name is `Sign out`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Sign out", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` `.waitlist-band` computed `background-image` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".waitlist-band")).not.toHaveCSS(
    "background-image",
    "none",
  );
});
