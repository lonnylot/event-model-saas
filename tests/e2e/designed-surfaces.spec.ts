import { expect, test } from "@playwright/test";

test('GET `/` has a `meta[name="viewport"]` whose `content` includes `width=device-width`', async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
    "content",
    /width=device-width/,
  );
});
