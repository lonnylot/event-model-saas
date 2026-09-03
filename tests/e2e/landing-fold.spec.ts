import { expect, test } from "@playwright/test";

test("GET `/` without a Session shows the text `A Team shares one Event Model: a timeline of slices, not a file you pass around.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "A Team shares one Event Model: a timeline of slices, not a file you pass around.",
    ),
  ).toBeVisible();
});
