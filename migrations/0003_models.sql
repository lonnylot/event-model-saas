CREATE TABLE event_models (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  title TEXT NOT NULL,
  version INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id)
);
