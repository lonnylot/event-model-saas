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

test("GET `/` without a Session shows a link whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session, the link `Event Model` has `href` `/`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveAttribute("href", "/");
});

test("GET `/` without a Session shows a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("GET `/` without a Session, a link `Sign in` has `href` `/login`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toHaveAttribute("href", "/login");
});

test("GET `/login` without a Session returns status 200", async ({
  request,
}) => {
  const response = await request.get("/login", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
});

test('GET `/login` without a Session has a `link[rel="stylesheet"]` whose `href` is `/shell.css`', async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator('link[rel="stylesheet"]')).toHaveAttribute(
    "href",
    "/shell.css",
  );
});

test('GET `/login` without a Session has a `link[rel="icon"]` whose `href` is `/favicon.png`', async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
    "href",
    "/favicon.png",
  );
});

test("GET `/login` without a Session shows a heading whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: "Sign in", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session shows the text `We'll email you a magic link.`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(page.getByText("We'll email you a magic link.")).toBeVisible();
});

test("GET `/login` without a Session shows a link whose accessible name is `Join the waitlist`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session, the link `Join the waitlist` has `href` `/#waitlist`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Join the waitlist", exact: true }),
  ).toHaveAttribute("href", "/#waitlist");
});

test("GET `/login` without a Session shows a link whose accessible name is `Event Model`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toBeVisible();
});

test("GET `/login` without a Session, the link `Event Model` has `href` `/`", async ({
  page,
}) => {
  await page.goto("/login");
  await expect(
    page.getByRole("link", { name: "Event Model", exact: true }),
  ).toHaveAttribute("href", "/");
});

test("GET `/` without a Session does not show a button whose accessible name is `Email me a link`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Email me a link", exact: true }),
  ).toHaveCount(0);
});

test("GET `/` without a Session does not show a control whose accessible name is `Sign up`", async ({
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

test("GET `/` without a Session shows a heading whose accessible name is `The model lives with the team`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "The model lives with the team",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Here the Event Model belongs to a Team.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Here the Event Model belongs to a Team."),
  ).toBeVisible();
});
