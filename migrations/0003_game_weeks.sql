-- Each week's puzzle is generated and solved once, then stored, so later requests only read it.
CREATE TABLE game_weeks (
  week          TEXT NOT NULL,
  puzzle        TEXT NOT NULL,
  grid          TEXT NOT NULL,     -- JSON array of row strings
  best          REAL NOT NULL,     -- best possible result
  best_answer   TEXT NOT NULL,     -- JSON (e.g. the best warehouse cells), revealed after playing
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (week, puzzle)
);
