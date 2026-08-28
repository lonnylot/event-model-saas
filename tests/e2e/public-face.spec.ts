import { expect, test } from "@playwright/test";

test("GET `/` without a Session shows a heading whose accessible name is `Event Modeling for the whole team`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `One Event Model, signed in. No passing files around.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("One Event Model, signed in. No passing files around."),
  ).toBeVisible();
});
