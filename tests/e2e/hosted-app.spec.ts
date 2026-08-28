import { expect, test } from "@playwright/test";

test("GET `/` does not show a control whose accessible name is `Sign up`", async ({
  page,
}) => {
  await page.goto("/");
  for (const role of [
    "button",
    "link",
    "checkbox",
    "radio",
    "switch",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "tab",
    "combobox",
    "textbox",
    "searchbox",
    "slider",
    "spinbutton",
    "treeitem",
  ] as const) {
    await expect(
      page.getByRole(role, { name: "Sign up", exact: true }),
    ).toHaveCount(0);
  }
});

test("GET an unknown document path returns status 404", async ({ page }) => {
  const response = await page.goto("/no-such-page");
  expect(response?.status()).toBe(404);
});

test("GET an unknown document path shows a heading whose accessible name is `Not found`", async ({
  page,
}) => {
  await page.goto("/no-such-page");
  await expect(
    page.getByRole("heading", { name: "Not found", exact: true, level: 1 }),
  ).toBeVisible();
});
