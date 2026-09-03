import { expect, test } from "@playwright/test";

test("GET `/` at viewport `1440x900`, `.hero` computed `display` is `grid`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveCSS("display", "grid");
});
