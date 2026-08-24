import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import { handleRequest } from "../../src/index.ts";

async function adminEnv() {
  const store = createMemoryStore();
  const auth: AuthRuntime = {
    store,
    mail: { async send() {} },
    now: () => 1_700_000_000_000,
    randomId: () => "team-1",
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

function createTeamPost(cookie = "session=sess-admin") {
  return new Request("https://event-model.lonnylot.com/api/teams", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ name: "Library" }),
  });
}

describe("create team", () => {
  it("POST `/api/teams` as site admin returns status 201", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(createTeamPost(), env);
    expect(response.status).toBe(201);
  });

  it("POST `/api/teams` as site admin returns content-type `application/json; charset=utf-8`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(createTeamPost(), env);
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });
});
