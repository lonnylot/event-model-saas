import type {
  AuthStore,
  MagicLink,
  Person,
  SessionRow,
} from "./types";

function personFromRow(row: Record<string, unknown>): Person {
  return {
    id: String(row.id),
    email: String(row.email),
    isSiteAdmin: Number(row.is_site_admin) === 1,
  };
}

export function createD1Store(db: D1Database): AuthStore {
  return {
    async getPersonByEmail(email) {
      const row = await db
        .prepare("SELECT id, email, is_site_admin FROM people WHERE email = ?")
        .bind(email)
        .first();
      return row ? personFromRow(row) : null;
    },
    async getPersonById(id) {
      const row = await db
        .prepare("SELECT id, email, is_site_admin FROM people WHERE id = ?")
        .bind(id)
        .first();
      return row ? personFromRow(row) : null;
    },
    async insertPerson(person) {
      await db
        .prepare(
          "INSERT INTO people (id, email, is_site_admin) VALUES (?, ?, ?)",
        )
        .bind(person.id, person.email, person.isSiteAdmin ? 1 : 0)
        .run();
    },
    async insertMagicLink(link) {
      await db
        .prepare(
          "INSERT INTO magic_links (token, person_id, expires_at, used_at) VALUES (?, ?, ?, ?)",
        )
        .bind(link.token, link.personId, link.expiresAt, link.usedAt)
        .run();
    },
    async getMagicLink(token) {
      const row = await db
        .prepare(
          "SELECT token, person_id, expires_at, used_at FROM magic_links WHERE token = ?",
        )
        .bind(token)
        .first();
      if (!row) return null;
      return {
        token: String(row.token),
        personId: String(row.person_id),
        expiresAt: Number(row.expires_at),
        usedAt: row.used_at == null ? null : Number(row.used_at),
      } satisfies MagicLink;
    },
    async markMagicLinkUsed(token, usedAt) {
      await db
        .prepare("UPDATE magic_links SET used_at = ? WHERE token = ?")
        .bind(usedAt, token)
        .run();
    },
    async insertSession(session: SessionRow) {
      await db
        .prepare(
          "INSERT INTO sessions (id, person_id, expires_at) VALUES (?, ?, ?)",
        )
        .bind(session.id, session.personId, session.expiresAt)
        .run();
    },
    async getSession(id) {
      const row = await db
        .prepare(
          "SELECT id, person_id, expires_at FROM sessions WHERE id = ?",
        )
        .bind(id)
        .first();
      if (!row) return null;
      return {
        id: String(row.id),
        personId: String(row.person_id),
        expiresAt: Number(row.expires_at),
      };
    },
    async deleteSession(id) {
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
    },
    async countAttempts(key, since) {
      const row = await db
        .prepare(
          "SELECT COUNT(*) AS n FROM login_attempts WHERE key = ? AND attempted_at >= ?",
        )
        .bind(key, since)
        .first<{ n: number }>();
      return Number(row?.n ?? 0);
    },
    async insertAttempt(key, at) {
      await db
        .prepare(
          "INSERT INTO login_attempts (key, attempted_at) VALUES (?, ?)",
        )
        .bind(key, at)
        .run();
    },
    async insertTeam(team) {
      await db
        .prepare("INSERT INTO teams (id, name) VALUES (?, ?)")
        .bind(team.id, team.name)
        .run();
    },
    async getTeam(id) {
      const row = await db
        .prepare("SELECT id, name FROM teams WHERE id = ?")
        .bind(id)
        .first();
      if (!row) return null;
      return { id: String(row.id), name: String(row.name) };
    },
    async listTeamsForPerson(personId) {
      const result = await db
        .prepare(
          "SELECT t.id, t.name FROM teams t JOIN memberships m ON m.team_id = t.id WHERE m.person_id = ?",
        )
        .bind(personId)
        .all();
      return (result.results ?? []).map((row) => ({
        id: String(row.id),
        name: String(row.name),
      }));
    },
    async addMembership(teamId, personId) {
      await db
        .prepare(
          "INSERT OR IGNORE INTO memberships (team_id, person_id) VALUES (?, ?)",
        )
        .bind(teamId, personId)
        .run();
    },
    async isMember(teamId, personId) {
      const row = await db
        .prepare(
          "SELECT 1 AS n FROM memberships WHERE team_id = ? AND person_id = ?",
        )
        .bind(teamId, personId)
        .first();
      return row != null;
    },
    async insertEventModel(model) {
      await db
        .prepare(
          "INSERT INTO event_models (id, team_id, title, version, r2_key) VALUES (?, ?, ?, ?, ?)",
        )
        .bind(
          model.id,
          model.teamId,
          model.title,
          model.version,
          model.r2Key,
        )
        .run();
    },
    async getEventModel(id) {
      const row = await db
        .prepare(
          "SELECT id, team_id, title, version, r2_key FROM event_models WHERE id = ?",
        )
        .bind(id)
        .first();
      if (!row) return null;
      return {
        id: String(row.id),
        teamId: String(row.team_id),
        title: String(row.title),
        version: Number(row.version),
        r2Key: String(row.r2_key),
      };
    },
    async listEventModelsForTeam(teamId) {
      const result = await db
        .prepare(
          "SELECT id, team_id, title, version, r2_key FROM event_models WHERE team_id = ?",
        )
        .bind(teamId)
        .all();
      return (result.results ?? []).map((row) => ({
        id: String(row.id),
        teamId: String(row.team_id),
        title: String(row.title),
        version: Number(row.version),
        r2Key: String(row.r2_key),
      }));
    },
    async setEventModelVersion(id, version) {
      await db
        .prepare("UPDATE event_models SET version = ? WHERE id = ?")
        .bind(version, id)
        .run();
    },
    async insertWaitlist(email) {
      await db
        .prepare("INSERT OR IGNORE INTO waitlist (email) VALUES (?)")
        .bind(email)
        .run();
    },
    async isWaitlisted(email) {
      const row = await db
        .prepare("SELECT email FROM waitlist WHERE email = ?")
        .bind(email)
        .first();
      return row != null;
    },
  };
}
