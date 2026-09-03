import { expect, test } from "@playwright/test";

test("GET `/` at viewport `1440x900`, `.hero` computed `display` is `grid`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".hero")).toHaveCSS("display", "grid");
});

test("GET `/` at viewport `1440x900`, heading `Event Modeling for the whole team` computed `text-align` is `start`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("text-align", "start");
});

test("GET `/` at viewport `390x844`, heading `Event Modeling for the whole team` computed `text-align` is `start`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("text-align", "start");
});

test("GET `/` at viewport `1440x900`, heading `Event Modeling for the whole team` computed `font-size` is `72px`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("font-size", "72px");
});
