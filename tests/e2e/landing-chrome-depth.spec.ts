import { expect, test } from "@playwright/test";

test("GET `/` `.product-shot` does not show the text `event-model.lonnylot.com`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-shot")).not.toContainText(
    "event-model.lonnylot.com",
  );
});

test("GET `/` `.product-shot` does not contain `.browser-bar`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-shot .browser-bar")).toHaveCount(0);
});

test("GET `/` `header` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header")).not.toHaveCSS("box-shadow", "none");
});

test("GET `/` `.bento` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento")).not.toHaveCSS("box-shadow", "none");
});

test("GET `/` `.waitlist-band` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".waitlist-band")).not.toHaveCSS(
    "box-shadow",
    "none",
  );
});

test("GET `/` `footer` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("footer")).not.toHaveCSS("box-shadow", "none");
});
