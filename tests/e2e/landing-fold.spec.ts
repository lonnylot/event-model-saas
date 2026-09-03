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

test("GET `/` without a Session shows the text `Every Event Model belongs to one Team. Every Person on that Team may edit it.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Every Event Model belongs to one Team. Every Person on that Team may edit it.",
    ),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Each Slice is one vertical feature: Actor, Command, Event, Read Model, Automation.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Each Slice is one vertical feature: Actor, Command, Event, Read Model, Automation.",
    ),
  ).toBeVisible();
});

test("GET `/` without a Session shows the text `Magic-link sign-in. No public signup. Site admin sends Invites. Save is explicit.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText(
      "Magic-link sign-in. No public signup. Site admin sends Invites. Save is explicit.",
    ),
  ).toBeVisible();
});

test("GET `/` without a Session does not show the text `Here the Event Model belongs to a Team.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("Here the Event Model belongs to a Team."),
  ).toHaveCount(0);
});

test("GET `/` without a Session does not show the text `a vertical column on the timeline`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("a vertical column on the timeline"),
  ).toHaveCount(0);
});

test("GET `/` without a Session does not show the text `The Mac app is local: one person, one .eventmodel file.`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByText("The Mac app is local: one person, one .eventmodel file."),
  ).toHaveCount(0);
});

test("GET `/` `.bento article` first article has exactly one `p`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento article").nth(0).locator("p")).toHaveCount(
    1,
  );
});

test("GET `/` `.bento article` second article has exactly one `p`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento article").nth(1).locator("p")).toHaveCount(
    1,
  );
});

test("GET `/` `.bento article` third article has exactly one `p`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".bento article").nth(2).locator("p")).toHaveCount(
    1,
  );
});

test("GET `/` `footer` has an `img` whose `src` is `/favicon.png`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("footer").locator("img")).toHaveAttribute(
    "src",
    "/favicon.png",
  );
});

test("GET `/` without a Session, `footer` does not show a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("GET `/` with a Session, `footer` does not show a link whose accessible name is `Open app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator("footer").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).toHaveCount(0);
});

test("GET `/` without a Session, `.hero` shows a link whose accessible name is `Sign in`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` without a Session, the `.hero` link `Sign in` has `href` `/login`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Sign in",
      exact: true,
    }),
  ).toHaveAttribute("href", "/login");
});

test("GET `/` with a Session, `.hero` shows a link whose accessible name is `Open app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).toBeVisible();
});

test("GET `/` with a Session, the `.hero` link `Open app` has `href` `/app`", async ({
  page,
}) => {
  await page.request.post("/api/test/non-admin-session");
  await page.goto("/");
  await expect(
    page.locator(".hero").getByRole("link", {
      name: "Open app",
      exact: true,
    }),
  ).toHaveAttribute("href", "/app");
});

test("GET `/` `.product-shot` does not show the text `lonny@lonnylot.com`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".product-shot")).not.toContainText(
    "lonny@lonnylot.com",
  );
});

test("GET `/` `.product-shot` shows the text `Command → Event Happened`", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator(".product-shot").getByText("Command → Event Happened"),
  ).toBeVisible();
});

test("GET `/` at viewport `1440x900`, `.product-shot` `getBoundingClientRect().bottom` is less than or equal to `window.innerHeight`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const { bottom, innerHeight } = await page.locator(".product-shot").evaluate(
    (el) => ({
      bottom: el.getBoundingClientRect().bottom,
      innerHeight: window.innerHeight,
    }),
  );
  expect(bottom).toBeLessThanOrEqual(innerHeight);
});

test("GET `/` at viewport `1440x900`, `#waitlist-form` computed `flex-direction` is `row`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("#waitlist-form")).toHaveCSS(
    "flex-direction",
    "row",
  );
});

test("GET `/` at viewport `390x844`, `#waitlist-form` computed `flex-direction` is `column`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#waitlist-form")).toHaveCSS(
    "flex-direction",
    "column",
  );
});

test("GET `/` at viewport `390x844`, `.product-shot` shows the text `Checkout`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page
      .locator(".product-shot")
      .getByText("Checkout", { exact: true })
      .filter({ visible: true }),
  ).not.toHaveCount(0);
});

test("GET `/` at viewport `390x844`, `.product-shot` does not show the text `Fulfillment`", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page
      .locator(".product-shot")
      .getByText("Fulfillment", { exact: true })
      .filter({ visible: true }),
  ).toHaveCount(0);
});