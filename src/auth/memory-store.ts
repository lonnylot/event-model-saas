import type {
  AuthStore,
  MagicLink,
  Person,
  SessionRow,
} from "./types";

export function createMemoryStore(): AuthStore {
  const people: Person[] = [];
  const links: MagicLink[] = [];
  const sessions: SessionRow[] = [];
  const attempts: { key: string; at: number }[] = [];

  return {
    async getPersonByEmail(email) {
      return people.find((p) => p.email === email) ?? null;
    },
    async getPersonById(id) {
      return people.find((p) => p.id === id) ?? null;
    },
    async insertPerson(person) {
      people.push(person);
    },
    async insertMagicLink(link) {
      links.push({ ...link });
    },
    async getMagicLink(token) {
      const found = links.find((l) => l.token === token);
      return found ? { ...found } : null;
    },
    async markMagicLinkUsed(token, usedAt) {
      const found = links.find((l) => l.token === token);
      if (found) found.usedAt = usedAt;
    },
    async insertSession(session) {
      sessions.push(session);
    },
    async getSession(id) {
      return sessions.find((s) => s.id === id) ?? null;
    },
    async deleteSession(id) {
      const i = sessions.findIndex((s) => s.id === id);
      if (i >= 0) sessions.splice(i, 1);
    },
    async countAttempts(key, since) {
      return attempts.filter((a) => a.key === key && a.at >= since).length;
    },
    async insertAttempt(key, at) {
      attempts.push({ key, at });
    },
  };
}
