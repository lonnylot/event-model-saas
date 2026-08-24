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

});
