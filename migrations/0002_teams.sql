CREATE TABLE teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE memberships (
  team_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  PRIMARY KEY (team_id, person_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (person_id) REFERENCES people(id)
);
