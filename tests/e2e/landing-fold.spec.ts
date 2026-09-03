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
