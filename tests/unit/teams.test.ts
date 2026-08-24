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

  it("POST `/api/teams` as a Person who is not site admin returns status 403", async () => {
    const { env, auth } = await adminEnv();
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
      createTeamPost("session=sess-user"),
      env,
    );
    expect(response.status).toBe(403);
  });

  it("POST `/api/teams` as site admin with name `Library` creates a Team named `Library`", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const team = await auth.store.getTeam("team-1");
    expect(team?.name).toBe("Library");
  });

  it("POST `/api/teams` as site admin adds a membership for that site admin on the new Team", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    expect(await auth.store.isMember("team-1", "p-admin")).toBe(true);
  });

  it("GET `/app` as site admin with no teams shows a textbox whose accessible name is `Team name`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<label for=\"team-name\">Team name</label>");
  });

  it("GET `/app` as site admin with no teams shows a button whose accessible name is `Create team`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Create team</button>");
  });
});
