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

test("GET `/` link `Sign in` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveCSS("color", "rgb(15, 118, 110)");
});

test("GET `/` heading `Event Modeling for the whole team` computed `font-size` is `36px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("font-size", "36px");
});

test("GET `/` the text `One Event Model, signed in. No passing files around.` computed `color` is `rgb(100, 116, 139)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("One Event Model, signed in. No passing files around."),
  ).toHaveCSS("color", "rgb(100, 116, 139)");
});
