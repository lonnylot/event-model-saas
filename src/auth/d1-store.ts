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
  };
}
