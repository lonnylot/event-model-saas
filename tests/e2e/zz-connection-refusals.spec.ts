import {
  expect,
  test as base,
  type Page,
  type APIRequestContext,
} from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

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

const BASE = `http://127.0.0.1:${process.env.E2E_PORT ?? "8787"}`;

const test = base.extend<object, { adminState: string }>({
  adminState: [
    async ({ browser }, use, workerInfo) => {
      const page = await browser.newPage({
        baseURL: BASE,
      });
      const request = page.context().request;
      await consumeAdmin(page, request);
      const path = join(
        mkdtempSync(join(tmpdir(), "em-")),
        `state-${workerInfo.workerIndex}.json`,
      );
      await page.context().storageState({ path });
      await page.close();
      await use(path);
    },
    { scope: "worker" },
  ],
  storageState: async ({ adminState }, use) => {
    await use(adminState);
  },
});

test.describe.configure({ mode: "serial" });

async function openUntitledModel(page: Page) {
  await page.goto("/app");
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
  const untitledBefore = await page
    .getByRole("link", { name: "Untitled", exact: true })
    .count();
  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/models") &&
        response.request().method() === "POST",
    ),
    page.getByRole("button", { name: "Create model", exact: true }).click(),
  ]);
  await expect(
    page.getByRole("link", { name: "Untitled", exact: true }),
  ).toHaveCount(untitledBefore + 1);
  await page.goto("/app");
  await page.getByRole("link", { name: "Untitled", exact: true }).last().click();
  await expect(
    page.getByRole("heading", { name: "Untitled", exact: true }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");
}

async function clickNewSlice(page: Page) {
  const count =
    (await page.getByRole("listitem", { name: "New Slice", exact: true }).count()) +
    2;
  await page.getByRole("button", { name: "New Slice", exact: true }).click();
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(count);
}

test("After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const ports = page.getByRole("button", { name: "Command port", exact: true });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("After clicking `New Slice` then `Add Command` twice, dragging from the first `Command port` onto the last `Command port` shows the text `A command can't write a command.` in the first Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const ports = page.getByRole("button", { name: "Command port", exact: true });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }).first(),
  ).toContainText("A command can't write a command.");
});

test("After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const ports = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("After clicking `New Slice` then `Add Event` twice, dragging from the first `Event Happened port` onto the last `Event Happened port` shows the text `An event can't feed an event.` in the first Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const ports = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }).first(),
  ).toContainText("An event can't feed an event.");
});

test("Dragging from `Read Model port` onto `Command port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(page.getByRole("button", { name: "Command port", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Read Model port` onto `Command port` shows the text `A read model can't issue a command.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(page.getByRole("button", { name: "Command port", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("A read model can't issue a command.");
});

test("Dragging from `Read Model port` onto `Event Happened port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Read Model port` onto `Event Happened port` shows the text `A read model can't write an event.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("A read model can't write an event.");
});

test("After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const ports = page.getByRole("button", { name: "Read Model port", exact: true });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("After clicking `New Slice` then `Add Read Model` twice, dragging from the first `Read Model port` onto the last `Read Model port` shows the text `A read model can't feed a read model.` in the first Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const ports = page.getByRole("button", { name: "Read Model port", exact: true });
  await expect(ports).toHaveCount(2);
  await ports.first().dragTo(ports.last());
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }).first(),
  ).toContainText("A read model can't feed a read model.");
});

test("After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again does not append a second Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toHaveLength(1);
});

test("After dragging from `Event Happened port` onto `Read Model port`, dragging from `Event Happened port` onto `Read Model port` again does not append a second Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const eventPort = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  const readModelPort = page.getByRole("button", {
    name: "Read Model port",
    exact: true,
  });
  await expect(eventPort).toBeVisible();
  await expect(readModelPort).toBeVisible();
  await eventPort.dragTo(readModelPort);
  await eventPort.dragTo(readModelPort);
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toHaveLength(1);
});

test("After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again shows the text `That connection already exists.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(
      page.getByRole("button", { name: "Event Happened port", exact: true }),
    );
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("That connection already exists.");
});

test("After dragging from `Command port` onto `Event Happened port`, dragging from `Command port` onto `Event Happened port` again, pressing ⌘Z four times does not show a listitem whose accessible name is `New Slice`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const commandPort = page.getByRole("button", {
    name: "Command port",
    exact: true,
  });
  const eventPort = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(commandPort).toBeVisible();
  await expect(eventPort).toBeVisible();
  await commandPort.dragTo(eventPort);
  await commandPort.dragTo(eventPort);
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("ControlOrMeta+z");
  await page.keyboard.press("ControlOrMeta+z");
  await expect(
    page.getByRole("listitem", { name: "New Slice", exact: true }),
  ).toHaveCount(0);
});

test("After dragging from `Event Happened port` onto `Read Model port`, dragging from `Event Happened port` onto `Read Model port` again shows the text `That connection already exists.` in the Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const eventPort = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  const readModelPort = page.getByRole("button", {
    name: "Read Model port",
    exact: true,
  });
  await expect(eventPort).toBeVisible();
  await expect(readModelPort).toBeVisible();
  await eventPort.dragTo(readModelPort);
  await eventPort.dragTo(readModelPort);
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toContainText("That connection already exists.");
});

test("Dragging from `Command port` onto the same `Command port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const port = page.getByRole("button", { name: "Command port", exact: true });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto the same `Command port` shows the text `A block can't connect to itself.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const port = page.getByRole("button", { name: "Command port", exact: true });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("A block can't connect to itself.");
});

test("Dragging from `Event Happened port` onto the same `Event Happened port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Event Happened port` onto the same `Event Happened port` shows the text `A block can't connect to itself.` in the Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toContainText("A block can't connect to itself.");
});

test("Dragging from `Read Model port` onto the same `Read Model port` does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Read Model port",
    exact: true,
  });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Read Model port` onto the same `Read Model port` shows the text `A block can't connect to itself.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const port = page.getByRole("button", {
    name: "Read Model port",
    exact: true,
  });
  await expect(port).toBeVisible();
  await port.dragTo(port);
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("A block can't connect to itself.");
});

test("Dragging from `Command port` onto the Timeline `Actor` listitem does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Actor", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Actor", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("An actor isn't a connection endpoint.");
});

test("Dragging from `Event Happened port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Actor", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toContainText("An actor isn't a connection endpoint.");
});

test("Dragging from `Read Model port` onto the Timeline `Actor` listitem shows the text `An actor isn't a connection endpoint.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Actor", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Actor", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Actor", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("An actor isn't a connection endpoint.");
});

test("Dragging from `Command port` onto the Timeline `Automation` listitem does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Automation", exact: true }));
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Automation", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("An automation isn't a connection endpoint.");
});

test("Dragging from `Event Happened port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Automation", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toContainText("An automation isn't a connection endpoint.");
});

test("Dragging from `Read Model port` onto the Timeline `Automation` listitem shows the text `An automation isn't a connection endpoint.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  await page.getByRole("button", { name: "Add Automation", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("listitem", { name: "Automation", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(page.getByRole("listitem", { name: "Automation", exact: true }));
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("An automation isn't a connection endpoint.");
});

test("Dragging from `Command port` onto the first `New Slice` listitem does not append a Connection", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const slice = page.getByRole("listitem", { name: "New Slice", exact: true });
  await expect(slice).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(slice.first());
  const json = await page.locator("#event-model-document").textContent();
  expect(JSON.parse(json ?? "{}").connections ?? []).toEqual([]);
});

test("Dragging from `Command port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Command listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  const slice = page.getByRole("listitem", { name: "New Slice", exact: true });
  await expect(slice).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Command port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Command port", exact: true })
    .dragTo(slice.first());
  await expect(
    page.getByRole("listitem", { name: "Command", exact: true }),
  ).toContainText("A slice isn't a connection endpoint.");
});

test("Dragging from `Event Happened port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Event Happened listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const slice = page.getByRole("listitem", { name: "New Slice", exact: true });
  await expect(slice).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Event Happened port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Event Happened port", exact: true })
    .dragTo(slice.first());
  await expect(
    page.getByRole("listitem", { name: "Event Happened", exact: true }),
  ).toContainText("A slice isn't a connection endpoint.");
});

test("Dragging from `Read Model port` onto the first `New Slice` listitem shows the text `A slice isn't a connection endpoint.` in the Read Model listitem", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const slice = page.getByRole("listitem", { name: "New Slice", exact: true });
  await expect(slice).toHaveCount(4);
  await expect(
    page.getByRole("button", { name: "Read Model port", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Read Model port", exact: true })
    .dragTo(slice.first());
  await expect(
    page.getByRole("listitem", { name: "Read Model", exact: true }),
  ).toContainText("A slice isn't a connection endpoint.");
});
test("After dragging from `Command port` onto `Event Happened port`, pointer-down on `Command port`, the `Event Happened port` does not have `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Command", exact: true }).click();
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  const commandPort = page.getByRole("button", {
    name: "Command port",
    exact: true,
  });
  const eventPort = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  await expect(commandPort).toBeVisible();
  await expect(eventPort).toBeVisible();
  await commandPort.dragTo(eventPort);
  await expect
    .poll(async () => {
      const json = await page.locator("#event-model-document").textContent();
      return (JSON.parse(json ?? "{}").connections ?? []).length;
    })
    .toBe(1);
  await commandPort.hover({ force: true });
  await page.mouse.down();
  await expect(eventPort).not.toHaveAttribute("aria-current", "true");
});

test("After dragging from `Event Happened port` onto `Read Model port`, pointer-down on `Event Happened port`, the `Read Model port` does not have `aria-current` `true`", async ({
  page,
}) => {
  await openUntitledModel(page);
  await clickNewSlice(page);
  await page.getByRole("button", { name: "Add Event", exact: true }).click();
  await page.getByRole("button", { name: "Add Read Model", exact: true }).click();
  const eventPort = page.getByRole("button", {
    name: "Event Happened port",
    exact: true,
  });
  const readModelPort = page.getByRole("button", {
    name: "Read Model port",
    exact: true,
  });
  await expect(eventPort).toBeVisible();
  await expect(readModelPort).toBeVisible();
  await eventPort.dragTo(readModelPort);
  await expect
    .poll(async () => {
      const json = await page.locator("#event-model-document").textContent();
      return (JSON.parse(json ?? "{}").connections ?? []).length;
    })
    .toBe(1);
  await eventPort.hover({ force: true });
  await page.mouse.down();
  await expect(readModelPort).not.toHaveAttribute("aria-current", "true");
});

