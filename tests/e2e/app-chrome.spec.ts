import { expect, test } from "@playwright/test";

test("GET `/` `header` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});
