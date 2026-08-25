import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { createMemoryDocuments } from "../../src/models/documents.ts";
import { handleRequest } from "../../src/index.ts";

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

  it("POST `/api/teams/{id}/models` as a member writes a document whose `slices` is `[]`", async () => {
    const { env } = await createdUntitled();
    const body = await env.documents.get("models/model-1.eventmodel");
    expect(JSON.parse(body ?? "").slices).toEqual([]);
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

});
