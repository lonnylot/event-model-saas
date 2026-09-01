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

test("GET `/` `header` computed `display` is `flex`", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/` `header` computed `padding-top` is not `0px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("header")).not.toHaveCSS("padding-top", "0px");
});

test("GET `/` `main` computed `padding-top` is not `0px`", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).not.toHaveCSS("padding-top", "0px");
});

test("GET `/` form `waitlist-form` computed `padding-top` is not `0px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("form#waitlist-form")).not.toHaveCSS(
    "padding-top",
    "0px",
  );
});

test("GET `/login` `header` computed `display` is `flex`", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator("header")).toHaveCSS("display", "flex");
});

test("GET `/login` `header` computed `padding-top` is not `0px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("header")).not.toHaveCSS("padding-top", "0px");
});

test("GET `/login` form `login` computed `padding-top` is not `0px`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator("form#login")).not.toHaveCSS("padding-top", "0px");
});

test("GET `/` link `Sign in` `:focus-visible` computed `box-shadow` is not `none`", async ({
  page,
}) => {
  await page.goto("/");
  const signIn = page.getByRole("link", { name: "Sign in", exact: true });
  await signIn.focus();
  await expect(signIn).not.toHaveCSS("box-shadow", "none");
});

test("GET `/` shows an image whose accessible name is `Event Model editor`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("img", { name: "Event Model editor", exact: true }),
  ).toBeVisible();
});

test("GET `/` heading `Event Modeling for the whole team` computed `font-size` is `56px`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "Event Modeling for the whole team",
      exact: true,
    }),
  ).toHaveCSS("font-size", "56px");
});

test("GET `/` `main` computed `max-width` is `none`", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveCSS("max-width", "none");
});

test("GET `/shell.css` includes `fonts.googleapis.com/css2?family=Inter` and `font-family: Inter, ui-sans-serif, system-ui, sans-serif`", async ({
  request,
}) => {
  const css = await (await request.get("/shell.css")).text();
  expect(css).toContain("fonts.googleapis.com/css2?family=Inter");
  expect(css).toContain(
    "font-family: Inter, ui-sans-serif, system-ui, sans-serif",
  );
});
