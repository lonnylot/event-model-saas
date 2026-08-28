import { expect, test } from "@playwright/test";

test("GET `/` `body` computed `font-family` includes `system-ui`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("body")).toHaveCSS("font-family", /system-ui/);
});

test("GET `/` `header` computed `border-bottom-color` is `rgb(226, 232, 240)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS(
    "border-bottom-color",
    "rgb(226, 232, 240)",
  );
});
