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

test("GET `/` `.hero h1 span` computed `color` is `rgb(15, 118, 110)`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero h1 span")).toHaveCSS(
    "color",
    "rgb(15, 118, 110)",
  );
});

test("GET `/` `header` link `Sign in` computed `border-top-width` is not `0px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("header").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).not.toHaveCSS("border-top-width", "0px");
});

test("GET `/` without a Session, `.hero` link `Sign in` computed `border-top-width` is not `0px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).not.toHaveCSS("border-top-width", "0px");
});

test("GET `/` with a Session, `header` link `Open app` computed `border-top-width` is not `0px`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator("header").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).not.toHaveCSS("border-top-width", "0px");
});

test("GET `/` with a Session, `.hero` link `Open app` computed `border-top-width` is not `0px`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).not.toHaveCSS("border-top-width", "0px");
});

test("GET `/` at viewport `1440x900`, `.bento` computed `background-color` is `rgba(0, 0, 0, 0)`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".bento")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
});

test("GET `/` at viewport `1440x900`, `.bento article` computed `box-shadow` is `none`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".bento article").first()).toHaveCSS(
    "box-shadow",
    "none",
  );
});

test("GET `/` at viewport `390x844`, `.bento article` computed `box-shadow` is `none`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".bento article").first()).toHaveCSS(
    "box-shadow",
    "none",
  );
});

test("GET `/` at viewport `1440x900`, `.bento article` computed `background-color` is `rgba(0, 0, 0, 0)`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".bento article").first()).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
});

test("GET `/` `.bento` first `article` has `.team-shot`", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.locator(".bento article").nth(0).locator(".team-shot"),
  ).toHaveCount(1);
});
