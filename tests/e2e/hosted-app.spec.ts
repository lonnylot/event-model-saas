import { expect, test } from "@playwright/test";

test("GET `/` shows a heading whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Event Model", level: 1 }),
  ).toBeVisible();
});
