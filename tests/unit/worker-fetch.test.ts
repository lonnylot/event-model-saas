import { describe, expect, it, vi } from "vitest";
import { createMemoryStore } from "../../src/auth/memory-store.ts";
import type { AuthRuntime } from "../../src/auth/types.ts";
import worker from "../../src/index.ts";

function fakeR2() {
  const objects = new Map<string, string>();
  return {
    objects,
    async put(key: string, value: string) {
      objects.set(key, value);
      return {};
    },
    async get(key: string) {
      const body = objects.get(key);
      if (body == null) return null;
      return { text: async () => body };
    },
  };
}

async function memberAuth(): Promise<AuthRuntime> {
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
  return auth;
}

function fakeD1() {
  type Row = Record<string, unknown>;
  const people = new Map<string, Row>();
  const sessions = new Map<string, Row>();
  const memberships: { team_id: string; person_id: string }[] = [];
  const eventModels = new Map<string, Row>();
  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async run() {
              if (
                sql ===
                "INSERT INTO event_models (id, team_id, title, version, r2_key) VALUES (?, ?, ?, ?, ?)"
              ) {
                eventModels.set(String(args[0]), {
                  id: String(args[0]),
                  team_id: String(args[1]),
                  title: String(args[2]),
                  version: Number(args[3]),
                  r2_key: String(args[4]),
                });
                return {};
              }
              throw new Error(`unexpected run SQL: ${sql}`);
            },
            async first() {
              if (
                sql ===
                "SELECT id, person_id, expires_at FROM sessions WHERE id = ?"
              ) {
                return sessions.get(String(args[0])) ?? null;
              }
              if (
                sql === "SELECT id, email, is_site_admin FROM people WHERE id = ?"
              ) {
                return people.get(String(args[0])) ?? null;
              }
              if (
                sql ===
                "SELECT 1 AS n FROM memberships WHERE team_id = ? AND person_id = ?"
              ) {
                const hit = memberships.some(
                  (m) =>
                    m.team_id === String(args[0]) &&
                    m.person_id === String(args[1]),
                );
                return hit ? { n: 1 } : null;
              }
              throw new Error(`unexpected first SQL: ${sql}`);
            },
            async all() {
              throw new Error(`unexpected all SQL: ${sql}`);
            },
          };
        },
      };
    },
  } as unknown as D1Database;
  return { db, people, sessions, memberships, eventModels };
}

describe("Worker fetch", () => {
  it("Worker `fetch` when `TEST_MAIL` is not `1` puts `models/{id}.eventmodel` on `MODELS`", async () => {
    const auth = await memberAuth();
    const models = fakeR2();
    const env = {
      ASSETS: { fetch: vi.fn() },
      auth,
      MODELS: models as unknown as R2Bucket,
    };
    await worker.fetch(
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
    await worker.fetch(
      new Request("https://event-model.lonnylot.com/api/teams/team-1/models", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({}),
      }),
      env,
    );
    expect(models.objects.get("models/model-1.eventmodel")).toBeDefined();
  });

  it("Worker `fetch` when `TEST_MAIL` is not `1` inserts the Event Model into `DB`", async () => {
    const { db, people, sessions, memberships, eventModels } = fakeD1();
    people.set("p-admin", {
      id: "p-admin",
      email: "lonny@lonnylot.com",
      is_site_admin: 1,
    });
    sessions.set("sess-admin", {
      id: "sess-admin",
      person_id: "p-admin",
      expires_at: Date.now() + 60_000,
    });
    memberships.push({ team_id: "team-1", person_id: "p-admin" });
    await worker.fetch(
      new Request("https://event-model.lonnylot.com/api/teams/team-1/models", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Cookie: "session=sess-admin",
        },
        body: JSON.stringify({}),
      }),
      {
        ASSETS: { fetch: vi.fn() },
        DB: db,
      },
    );
    expect([...eventModels.values()].some((row) => row.title === "Untitled")).toBe(
      true,
    );
  });
});
