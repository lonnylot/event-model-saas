import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
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
    env: { ASSETS: { fetch: vi.fn() }, auth },
    auth,
  };
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

});
