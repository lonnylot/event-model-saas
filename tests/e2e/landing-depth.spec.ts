import { expect, test } from "@playwright/test";

test("GET `/` `.product-shot` computed `transform` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-shot")).not.toHaveCSS("transform", "none");
});

test("GET `/` `.hero figure` computed `margin-bottom` is a negative value", async ({
  page,
}) => {
  await page.goto("/");
  const marginBottom = await page
    .locator(".hero figure")
    .evaluate((el) => getComputedStyle(el).marginBottom);
  expect(parseFloat(marginBottom)).toBeLessThan(0);
});

test("GET `/` `.bento article` computed `background-color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento article").first()).toHaveCSS(
    "background-color",
    "rgb(255, 255, 255)",
  );
});

test("GET `/` `.bento article` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento article").first()).not.toHaveCSS(
    "box-shadow",
    "none",
  );
});

test("GET `/` `.waitlist-band` computed `background-color` is `rgb(15, 23, 42)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".waitlist-band")).toHaveCSS(
    "background-color",
    "rgb(15, 23, 42)",
  );
});

test("GET `/` heading `Join the waitlist` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Join the waitlist", exact: true }),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/` the text `Leave your email. If you already have access, use Sign in.` computed `color` is `rgb(255, 255, 255)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Leave your email. If you already have access, use Sign in.",
    ),
  ).toHaveCSS("color", "rgb(255, 255, 255)");
});

test("GET `/` has a `footer`", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("footer")).toBeVisible();
});

test("GET `/` without a Session, `footer` shows a link whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Event Model",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session, the `footer` link `Event Model` has `href` `/`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Event Model",
      exact: true,
    }),
  ).toHaveAttribute("href", "/");
});

test("GET `/` without a Session, `footer` does not show a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("GET `/` with a Session, `footer` does not show a link whose accessible name is `Open app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).toHaveCount(0);
});
