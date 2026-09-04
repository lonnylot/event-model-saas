import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { createMemoryDocuments } from "../../src/models/documents.ts";
import { handleRequest } from "../../src/index.ts";

function timelineMarkup(html: string): string {
  const start = html.indexOf('<section aria-label="Timeline">');
  const end = html.indexOf('<section aria-label="Inspector">');
  return html.slice(start, end);
}

async function memberEnv() {
  const store = createMemoryStore();
  let n = 0;
  const auth: AuthRuntime = {
    store,
    mail: { async send() {} },
    now: () => 1_700_000_000_000,
    randomId: () => {
      n += 1;
      return n === 1 ? "team-1" : "model-1";
    },
    siteAdminEmail: "lonny@lonnylot.com",
    authFrom: "auth@event-model.lonnylot.com",
  };
  await store.insertPerson({
    id: "p-admin",
    email: "lonny@lonnylot.com",
    isSiteAdmin: true,
  });
  await store.insertSession({
    id: "sess-admin",
    personId: "p-admin",
    expiresAt: auth.now() + 60_000,
  });
  return {
    env: {
      ASSETS: { fetch: vi.fn() },
      auth,
      documents: createMemoryDocuments(),
    },
    auth,
  };
}

async function createdUntitled() {
  const ctx = await memberEnv();
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({ name: "Library" }),
    }),
    ctx.env,
  );
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams/team-1/models", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({}),
    }),
    ctx.env,
  );
  return ctx;
}

async function importedEmpty() {
  const ctx = await memberEnv();
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({ name: "Library" }),
    }),
    ctx.env,
  );
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams/team-1/imports", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({
        document: {
          format: "eventmodel",
          schemaVersion: 1,
          id: "00000000-0000-4000-8000-000000000001",
          title: "Untitled",
          slices: [],
        },
      }),
    }),
    ctx.env,
  );
  return ctx;
}

async function importedSliceWithoutActors() {
  const ctx = await memberEnv();
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({ name: "Library" }),
    }),
    ctx.env,
  );
  await handleRequest(
    new Request("https://event-model.lonnylot.com/api/teams/team-1/imports", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Cookie: "session=sess-admin",
      },
      body: JSON.stringify({
        document: {
          format: "eventmodel",
          schemaVersion: 1,
          id: "00000000-0000-4000-8000-000000000002",
          title: "Checkout",
          slices: [
            {
              id: "00000000-0000-4000-8000-000000000003",
              title: "Checkout",
              sliceType: "STATE_CHANGE",
              actors: [],
              commands: [],
              events: [],
              readModels: [],
              processors: [],
            },
          ],
        },
      }),
    }),
    ctx.env,
  );
  return ctx;
}

describe("create model", () => {
  it("POST `/api/teams/{id}/models` as a member returns status 201", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    expect(response.status).toBe(201);
  });
  it("POST `/api/teams/{id}/models` as a Person who is not a member returns status 404", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await auth.store.insertPerson({
      id: "p-user",
      email: "teammate@example.com",
      isSiteAdmin: false,
    });
    await auth.store.insertSession({
      id: "sess-user",
      personId: "p-user",
      expiresAt: auth.now() + 60_000,
    });
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-user",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    expect(response.status).toBe(404);
  });
  it("POST `/api/teams/{id}/models` as a member returns content-type `application/json; charset=utf-8`", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });
  it("POST `/api/teams/{id}/models` as a member creates an Event Model whose title is `Untitled`", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    const model = await auth.store.getEventModel("model-1");
    expect(model?.title).toBe("Untitled");
  });

  it("POST `/api/teams/{id}/models` as a member creates an Event Model whose version is `1`", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    const model = await auth.store.getEventModel("model-1");
    expect(model?.version).toBe(1);
  });
  it("GET `/app/teams/{id}` as a member shows a button whose accessible name is `Create model`", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="submit">Create model</button>',
    );
  });

  it("POST `/api/teams/{id}/models` as a member writes R2 object `models/{id}.eventmodel`", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    expect(await env.documents.get("models/model-1.eventmodel")).not.toBeNull();
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `format` is `eventmodel`", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/models",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({}),
        },
      ),
      env,
    );
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").format).toBe("eventmodel");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `schemaVersion` is `1`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").schemaVersion).toBe(1);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `id` is the Event Model id", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").id).toBe("model-1");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `title` is `Untitled`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").title).toBe("Untitled");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `description` is `\"\"`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").description).toBe("");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `connections` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").connections).toEqual([]);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose `slices` length is `1`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices).toHaveLength(1);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `title` is `New Slice`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].title).toBe("New Slice");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `sliceType` is `STATE_CHANGE`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].sliceType).toBe("STATE_CHANGE");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `actors` length is `1`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].actors).toHaveLength(1);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice first Actor `name` is `Actor`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].actors[0].name).toBe("Actor");
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `commands` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].commands).toEqual([]);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `events` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].events).toEqual([]);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `readModels` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].readModels).toEqual([]);
  });

  it("POST `/api/teams/{id}/models` as a member writes a document whose first Slice `processors` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices[0].processors).toEqual([]);
  });

  it("GET `/app/teams/{id}` as a member with an Event Model titled `Untitled` shows a link whose accessible name is `Untitled`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain(
      '<a href="/app/teams/team-1/models/model-1">Untitled</a>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows the Team name", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    const html = await response.text();
    expect(html).toMatch(/<p><a\b[^>]*>Library<\/a><\/p>/);
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `New Slice`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">New Slice</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Actor`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Add Actor</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Command`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Add Command</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Event`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Add Event</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Read Model`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Add Read Model</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Add Automation`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Add Automation</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Slices`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<h2>Slices</h2>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member with no Slices does not show a listitem whose accessible name is `New Slice`", async () => {
    const { env } = await importedEmpty();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).not.toMatch(/<li[^>]*>New Slice<\/li>/);
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model shows a listitem whose accessible name is `New Slice`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toMatch(
      /<li[^>]*aria-label="New Slice"[^>]*>New Slice<\/li>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a listitem whose accessible name is `New Slice`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<li[^>]*aria-label="New Slice"[^>]*>New Slice<\/li>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Actor on lane`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<button type="button"[^>]*>Add Actor on lane<\/button>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Command on lane`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<button type="button"[^>]*>Add Command on lane<\/button>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Event on lane`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<button type="button"[^>]*>Add Event on lane<\/button>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Read Model on lane`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<button type="button"[^>]*>Add Read Model on lane<\/button>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline region shows a button whose accessible name is `Add Automation on lane`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<button type="button"[^>]*>Add Automation on lane<\/button>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member with no Actors does not show a listitem whose accessible name is `Actor`", async () => {
    const { env } = await importedSliceWithoutActors();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).not.toMatch(/<li[^>]*>Actor<\/li>/);
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model shows a listitem whose accessible name is `Actor` in the Timeline region", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toMatch(
      /aria-label="Timeline"[\s\S]*<li[^>]*aria-label="Actor"[^>]*>Actor<\/li>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member after Create model, the Timeline `Actor` listitem has a non-empty `data-id`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(timelineMarkup(await response.text())).toMatch(
      /<li[^>]*aria-label="Actor"[^>]*data-id="[^"]+"[^>]*>Actor<\/li>/,
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Timeline`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain('aria-label="Timeline"');
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Model`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<h2>Model</h2>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member with no Slices shows a heading whose accessible name is `Start the timeline`", async () => {
    const { env } = await importedEmpty();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<h2>Start the timeline</h2>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows the text `Time`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(">Time<");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member with no local edits shows the text `Nothing Selected`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("Nothing Selected");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a region whose accessible name is `Inspector`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<section aria-label="Inspector">',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Inspector`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<h2>Inspector</h2>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom in`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Zoom in</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Zoom out`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Zoom out</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Reset zoom`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="button">Reset zoom</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a heading whose accessible name is `Untitled`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<h1>Untitled</h1>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a Person who is not a member returns status 404", async () => {
    const { env, auth } = await createdUntitled();
    await auth.store.insertPerson({
      id: "p-user",
      email: "teammate@example.com",
      isSiteAdmin: false,
    });
    await auth.store.insertSession({
      id: "sess-user",
      personId: "p-user",
      expiresAt: auth.now() + 60_000,
    });
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-user" } },
      ),
      env,
    );
    expect(response.status).toBe(404);
  });
  it("GET `/app/teams/{id}/models/{mid}` as a member shows the Person's email", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain("<p>lonny@lonnylot.com</p>");
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Save`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="submit">Save</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Export`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="submit">Export</button>',
    );
  });

  it("GET `/app/teams/{id}/models/{mid}` as a member shows a button whose accessible name is `Sign out`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/app/teams/team-1/models/model-1",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(await response.text()).toContain(
      '<button type="submit">Sign out</button>',
    );
  });
  it("PUT `/api/models/{id}` as a member with matching version returns status 200", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: {
            format: "eventmodel",
            schemaVersion: 1,
            id: "model-1",
            title: "Untitled",
            slices: [],
          },
        }),
      }),
      env,
    );
    expect(response.status).toBe(200);
  });
  it("PUT `/api/models/{id}` as a member with a mismatched version returns status 409", async () => {
    const { env } = await createdUntitled();
    const put = () =>
      handleRequest(
        new Request("https://event-model.lonnylot.com/api/models/model-1", {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({
            version: 1,
            document: {
              format: "eventmodel",
              schemaVersion: 1,
              id: "model-1",
              title: "Untitled",
              slices: [],
            },
          }),
        }),
        env,
      );
    await put();
    const response = await put();
    expect(response.status).toBe(409);
  });
  it("PUT `/api/models/{id}` as a Person who is not a member returns status 404", async () => {
    const { env, auth } = await createdUntitled();
    await auth.store.insertPerson({
      id: "p-user",
      email: "teammate@example.com",
      isSiteAdmin: false,
    });
    await auth.store.insertSession({
      id: "sess-user",
      personId: "p-user",
      expiresAt: auth.now() + 60_000,
    });
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-user",
        },
        body: JSON.stringify({
          version: 1,
          document: {
            format: "eventmodel",
            schemaVersion: 1,
            id: "model-1",
            title: "Untitled",
            slices: [],
          },
        }),
      }),
      env,
    );
    expect(response.status).toBe(404);
  });
  it("PUT `/api/models/{id}` as a member with matching version returns the new version `2`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: {
            format: "eventmodel",
            schemaVersion: 1,
            id: "model-1",
            title: "Untitled",
            slices: [],
          },
        }),
      }),
      env,
    );
    expect(await response.json()).toEqual({ version: 2 });
  });
  it("PUT `/api/models/{id}` with a document whose `format` is not `eventmodel` returns status 400", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: { format: "other" },
        }),
      }),
      env,
    );
    expect(response.status).toBe(400);
  });
  it("PUT `/api/models/{id}` with a document whose `format` is not `eventmodel` leaves version `1`", async () => {
    const { env, auth } = await createdUntitled();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: { format: "other" },
        }),
      }),
      env,
    );
    expect((await auth.store.getEventModel("model-1"))?.version).toBe(1);
  });

  it("GET `/api/models/{id}/export` as a member returns content-type `application/json`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/models/model-1/export",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(response.headers.get("content-type")).toBe("application/json");
  });
  it("GET `/api/models/{id}/export` as a Person who is not a member returns status 404", async () => {
    const { env, auth } = await createdUntitled();
    await auth.store.insertPerson({
      id: "p-user",
      email: "teammate@example.com",
      isSiteAdmin: false,
    });
    await auth.store.insertSession({
      id: "sess-user",
      personId: "p-user",
      expiresAt: auth.now() + 60_000,
    });
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/models/model-1/export",
        { headers: { Cookie: "session=sess-user" } },
      ),
      env,
    );
    expect(response.status).toBe(404);
  });

  it("GET `/api/models/{id}/export` as a member sets `Content-Disposition` to `attachment; filename=\"Untitled.eventmodel\"`", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/models/model-1/export",
        { headers: { Cookie: "session=sess-admin" } },
      ),
      env,
    );
    expect(response.headers.get("Content-Disposition")).toBe(
      'attachment; filename="Untitled.eventmodel"',
    );
  });
  it("POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` returns status 201", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({
            document: {
              format: "eventmodel",
              schemaVersion: 1,
              id: "imported-1",
              title: "Library",
              slices: [],
            },
          }),
        },
      ),
      env,
    );
    expect(response.status).toBe(201);
  });
  it("POST `/api/teams/{id}/imports` with a document whose `format` is not `eventmodel` returns status 400", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document: { format: "other" } }),
        },
      ),
      env,
    );
    expect(response.status).toBe(400);
  });

  it("POST `/api/teams/{id}/imports` with a document whose `format` is not `eventmodel` does not create an Event Model", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document: { format: "other" } }),
        },
      ),
      env,
    );
    expect(await auth.store.listEventModelsForTeam("team-1")).toEqual([]);
  });

  it("POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` creates an Event Model whose title is `Library`", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({
            document: {
              format: "eventmodel",
              schemaVersion: 1,
              id: "imported-1",
              title: "Library",
              slices: [],
            },
          }),
        },
      ),
      env,
    );
    const model = await auth.store.getEventModel("model-1");
    expect(model?.title).toBe("Library");
  });
  it("POST `/api/teams/{id}/imports` as a member with a valid Event Model titled `Library` writes the submitted document to `models/{id}.eventmodel`", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const document = {
      format: "eventmodel",
      schemaVersion: 1,
      id: "imported-1",
      title: "Library",
      slices: [],
    };
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document }),
        },
      ),
      env,
    );
    expect(await env.documents.get("models/model-1.eventmodel")).toBe(
      JSON.stringify(document),
    );
  });

  it("PUT `/api/models/{id}` as a member with matching version writes the submitted document to `models/{id}.eventmodel`", async () => {
    const { env } = await createdUntitled();
    const document = {
      format: "eventmodel",
      schemaVersion: 1,
      id: "model-1",
      title: "Saved",
      slices: [],
    };
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document,
        }),
      }),
      env,
    );
    expect(await env.documents.get("models/model-1.eventmodel")).toBe(
      JSON.stringify(document),
    );
  });

  it("PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` returns status 400", async () => {
    const { env } = await createdUntitled();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: { format: "eventmodel" },
        }),
      }),
      env,
    );
    expect(response.status).toBe(400);
  });

  it("PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves version `1`", async () => {
    const { env, auth } = await createdUntitled();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: { format: "eventmodel" },
        }),
      }),
      env,
    );
    expect((await auth.store.getEventModel("model-1"))?.version).toBe(1);
  });

  it("PUT `/api/models/{id}` with a document that fails `schemas/eventmodel.schema.json` leaves the R2 object unchanged", async () => {
    const { env } = await createdUntitled();
    const before = await env.documents.get("models/model-1.eventmodel");
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/models/model-1", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({
          version: 1,
          document: { format: "eventmodel" },
        }),
      }),
      env,
    );
    expect(await env.documents.get("models/model-1.eventmodel")).toBe(before);
  });

  it("POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` returns status 400", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    const response = await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document: { format: "eventmodel" } }),
        },
      ),
      env,
    );
    expect(response.status).toBe(400);
  });

  it("POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not create an Event Model", async () => {
    const { env, auth } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document: { format: "eventmodel" } }),
        },
      ),
      env,
    );
    expect(await auth.store.listEventModelsForTeam("team-1")).toEqual([]);
  });

  it("POST `/api/teams/{id}/imports` with a document that fails `schemas/eventmodel.schema.json` does not write an R2 object", async () => {
    const { env } = await memberEnv();
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ name: "Library" }),
      }),
      env,
    );
    await handleRequest(
      new Request(
        "https://event-model.lonnylot.com/api/teams/team-1/imports",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Cookie: "session=sess-admin",
          },
          body: JSON.stringify({ document: { format: "eventmodel" } }),
        },
      ),
      env,
    );
    expect(await env.documents.get("models/model-1.eventmodel")).toBeNull();
  });
});
