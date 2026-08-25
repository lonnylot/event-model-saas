import { expect, test, type Page, type APIRequestContext } from "@playwright/test";

test.describe.configure({ mode: "serial" });

async function consumeAdmin(page: Page, request: APIRequestContext) {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email", exact: true }).fill(
    "lonny@lonnylot.com",
  );
  await page
    .getByRole("button", { name: "Email me a link", exact: true })
    .click();
  await expect(
    page.getByText("If you have access, check your inbox."),
  ).toBeVisible();
  const mail = await request.get("/api/test/last-mail");
  const body = (await mail.json()) as { text: string };
  const match = body.text.match(/\/api\/auth\/consume\?token=[^\s]+/);
  expect(match).not.toBeNull();
  await page.goto(match![0]);
}

test("After a member creates a model and a second session Saves with version `1` after the first Save, the second session shows the text `This Event Model was saved by someone else.`", async ({
  page,
  request,
  browser,
}) => {
  await consumeAdmin(page, request);
  const createTeam = page.getByRole("textbox", {
    name: "Team name",
    exact: true,
  });
  if (await createTeam.isVisible()) {
    await createTeam.fill("Library");
    await page.getByRole("button", { name: "Create team", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Library", exact: true }),
    ).toBeVisible();
  }
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/models") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Create model", exact: true }).click(),
  ]);
  await page.goto("/app");
  await page.getByRole("link", { name: "Untitled", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
  const modelUrl = page.url();
  const page2 = await browser.newPage();
  await consumeAdmin(page2, request);
  await page2.goto(modelUrl);
  await expect(
    page2.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await Promise.all([
    page2.waitForResponse(
      (response) =>
        response.url().includes("/api/models/") &&
        response.request().method() === "PUT",
    ),
    page2.getByRole("button", { name: "Save", exact: true }).click(),
  ]);
  await expect(
    page2.getByText("This Event Model was saved by someone else."),
  ).toBeVisible();
  await page2.close();
});
