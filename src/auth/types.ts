export type Person = {
  id: string;
  email: string;
  isSiteAdmin: boolean;
};

export type MagicLink = {
  token: string;
  personId: string;
  expiresAt: number;
  usedAt: number | null;
};

export type SessionRow = {
  id: string;
  personId: string;
  expiresAt: number;
};

export type Team = {
  id: string;
  name: string;
};

export type EventModelRow = {
  id: string;
  teamId: string;
  title: string;
  version: number;
  r2Key: string;
};

export type MailMessage = {
  to: string;
  from: string;
  subject: string;
  text: string;
};

export type AuthStore = {
  getPersonByEmail(email: string): Promise<Person | null>;
  getPersonById(id: string): Promise<Person | null>;
  insertPerson(person: Person): Promise<void>;
  insertMagicLink(link: MagicLink): Promise<void>;
  getMagicLink(token: string): Promise<MagicLink | null>;
  markMagicLinkUsed(token: string, usedAt: number): Promise<void>;
  insertSession(session: SessionRow): Promise<void>;
  getSession(id: string): Promise<SessionRow | null>;
  deleteSession(id: string): Promise<void>;
  countAttempts(key: string, since: number): Promise<number>;
  insertAttempt(key: string, at: number): Promise<void>;
  insertTeam(team: Team): Promise<void>;
  getTeam(id: string): Promise<Team | null>;
  listTeamsForPerson(personId: string): Promise<Team[]>;
  addMembership(teamId: string, personId: string): Promise<void>;
  isMember(teamId: string, personId: string): Promise<boolean>;
  insertEventModel(model: EventModelRow): Promise<void>;
  getEventModel(id: string): Promise<EventModelRow | null>;
  listEventModelsForTeam(teamId: string): Promise<EventModelRow[]>;
  setEventModelVersion(id: string, version: number): Promise<void>;
};

export type MailPort = {
  send(message: MailMessage): Promise<void>;
};

export type AuthRuntime = {
  store: AuthStore;
  mail: MailPort;
  now: () => number;
  randomId: () => string;
  siteAdminEmail: string;
  authFrom: string;
};
