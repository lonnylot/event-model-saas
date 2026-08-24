CREATE TABLE people (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_site_admin INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE magic_links (
  token TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  used_at INTEGER,
  FOREIGN KEY (person_id) REFERENCES people(id)
);

CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (person_id) REFERENCES people(id)
);

CREATE TABLE login_attempts (
  key TEXT NOT NULL,
  attempted_at INTEGER NOT NULL
);

CREATE INDEX login_attempts_key_time ON login_attempts (key, attempted_at);
