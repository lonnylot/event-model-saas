import { describe, expect, it } from "vitest";
import { createD1Store } from "../../src/auth/d1-store.ts";

type Row = Record<string, unknown>;

function fakeD1() {
  const teams = new Map<string, Row>();
  const memberships: { team_id: string; person_id: string }[] = [];

  const db = {
    prepare(sql: string) {
      return {
        bind(...args: unknown[]) {
          return {
            async run() {
              if (sql === "INSERT INTO teams (id, name) VALUES (?, ?)") {
                teams.set(String(args[0]), {
                  id: String(args[0]),
                  name: String(args[1]),
                });
                return {};
              }
              if (
                sql ===
                "INSERT OR IGNORE INTO memberships (team_id, person_id) VALUES (?, ?)"
              ) {
                const team_id = String(args[0]);
                const person_id = String(args[1]);
                if (
                  !memberships.some(
                    (m) => m.team_id === team_id && m.person_id === person_id,
                  )
                ) {
                  memberships.push({ team_id, person_id });
                }
                return {};
              }
              throw new Error(`unexpected run SQL: ${sql}`);
            },
            async first() {
              if (sql === "SELECT id, name FROM teams WHERE id = ?") {
                return teams.get(String(args[0])) ?? null;
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

  return db;
}

describe("createD1Store", () => {
  it("`createD1Store` `insertTeam` with name `Library` returns that Team from `getTeam`", async () => {
    const store = createD1Store(fakeD1());
    await store.insertTeam({ id: "team-1", name: "Library" });
    expect(await store.getTeam("team-1")).toEqual({
      id: "team-1",
      name: "Library",
    });
  });

  it("`createD1Store` `addMembership` then `isMember` returns true", async () => {
    const store = createD1Store(fakeD1());
    await store.insertTeam({ id: "team-1", name: "Library" });
    await store.addMembership("team-1", "p-admin");
    expect(await store.isMember("team-1", "p-admin")).toBe(true);
  });
});
