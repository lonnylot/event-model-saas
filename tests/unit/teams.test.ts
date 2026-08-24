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

  it("GET `/app` as site admin with no teams shows a button whose accessible name is `Sign out`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Sign out</button>");
  });

  it("GET `/app` as site admin with no teams shows a link whose accessible name is `Teams admin`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<a href=\"/app/admin/teams\">Teams admin</a>");
  });

  it("GET `/app` as site admin with one Team returns status 303", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(response.status).toBe(303);
    void auth;
  });

  it("GET `/app` as site admin with one Team sets `Location` to `/app/teams/{id}`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(response.headers.get("Location")).toBe("/app/teams/team-1");
  });

  it("GET `/app/teams/{id}` as a member shows a heading whose accessible name is the Team name", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<h1>Library</h1>");
  });

  it("GET `/app/teams/{id}` as a member shows the Person's email", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("lonny@lonnylot.com");
  });

  it("GET `/app/teams/{id}` as a member shows a button whose accessible name is `Sign out`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Sign out</button>");
  });

  it("GET `/app/teams/{id}` as site admin shows a link whose accessible name is `Teams admin`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<a href=\"/app/admin/teams\">Teams admin</a>");
  });

  it("GET `/app/teams/{id}` as a Person who is not a member returns status 404", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
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
      new Request("https://event-model.lonnylot.com/app/teams/team-1", {
        headers: { Cookie: "session=sess-user" },
      }),
      env,
    );
    expect(response.status).toBe(404);
  });

  it("GET `/app` as a Person with two Teams shows a heading whose accessible name is `Your teams`", async () => {
    const { env, auth } = await adminEnv();
    await auth.store.insertTeam({ id: "t-a", name: "Alpha" });
    await auth.store.insertTeam({ id: "t-b", name: "Beta" });
    await auth.store.addMembership("t-a", "p-admin");
    await auth.store.addMembership("t-b", "p-admin");
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<h1>Your teams</h1>");
  });

  it("GET `/app` as a Person with two Teams shows a link whose accessible name is the first Team name", async () => {
    const { env, auth } = await adminEnv();
    await auth.store.insertTeam({ id: "t-a", name: "Alpha" });
    await auth.store.insertTeam({ id: "t-b", name: "Beta" });
    await auth.store.addMembership("t-a", "p-admin");
    await auth.store.addMembership("t-b", "p-admin");
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<a href=\"/app/teams/t-a\">Alpha</a>");
  });

  it("GET `/app` as a Person with two Teams shows a link whose accessible name is the second Team name", async () => {
    const { env, auth } = await adminEnv();
    await auth.store.insertTeam({ id: "t-a", name: "Alpha" });
    await auth.store.insertTeam({ id: "t-b", name: "Beta" });
    await auth.store.addMembership("t-a", "p-admin");
    await auth.store.addMembership("t-b", "p-admin");
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<a href=\"/app/teams/t-b\">Beta</a>");
  });

  it("GET `/app` as site admin with two Teams shows a link whose accessible name is `Teams admin`", async () => {
    const { env, auth } = await adminEnv();
    await auth.store.insertTeam({ id: "t-a", name: "Alpha" });
    await auth.store.insertTeam({ id: "t-b", name: "Beta" });
    await auth.store.addMembership("t-a", "p-admin");
    await auth.store.addMembership("t-b", "p-admin");
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<a href=\"/app/admin/teams\">Teams admin</a>");
  });

  it("GET `/app/admin/teams` as a Person who is not site admin returns status 303", async () => {
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
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-user" },
      }),
      env,
    );
    expect(response.status).toBe(303);
  });

  it("GET `/app/admin/teams` as a Person who is not site admin sets `Location` to `/app`", async () => {
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
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-user" },
      }),
      env,
    );
    expect(response.headers.get("Location")).toBe("/app");
  });

  it("GET `/app/admin/teams` as site admin shows the Person's email", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("lonny@lonnylot.com");
  });

  it("GET `/app/admin/teams` as site admin shows a button whose accessible name is `Sign out`", async () => {
    const { env } = await adminEnv();
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Sign out</button>");
  });

  it("GET `/app/admin/teams` as site admin with a Team named `Library` shows a heading whose accessible name is `Library`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<h1>Library</h1>");
  });

  it("GET `/app/admin/teams` as site admin with a Team shows a textbox whose accessible name is `Invite email`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<label for=\"invite-team-1\">Invite email</label>");
  });

  it("GET `/app/admin/teams` as site admin with a Team shows a button whose accessible name is `Send invite`", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/app/admin/teams", {
        headers: { Cookie: "session=sess-admin" },
      }),
      env,
    );
    expect(await response.text()).toContain("<button type=\"submit\">Send invite</button>");
  });

  it("POST `/api/teams/{id}/invites` as site admin returns status 201", async () => {
    const { env } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    const response = await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams/team-1/invites", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ email: "teammate@example.com" }),
      }),
      env,
    );
    expect(response.status).toBe(201);
  });

  it("POST `/api/teams/{id}/invites` as a Person who is not site admin returns status 403", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
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
      new Request("https://event-model.lonnylot.com/api/teams/team-1/invites", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-user",
        },
        body: JSON.stringify({ email: "other@example.com" }),
      }),
      env,
    );
    expect(response.status).toBe(403);
  });

  it("POST `/api/teams/{id}/invites` with an unknown email creates a Person with that email", async () => {
    const { env, auth } = await adminEnv();
    await handleRequest(createTeamPost(), env);
    await handleRequest(
      new Request("https://event-model.lonnylot.com/api/teams/team-1/invites", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({ email: "teammate@example.com" }),
      }),
      env,
    );
    const person = await auth.store.getPersonByEmail("teammate@example.com");
    expect(person).not.toBeNull();
  });
});
