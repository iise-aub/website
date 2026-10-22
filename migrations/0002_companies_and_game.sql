-- 2026-10-22 (Saad): sponsors list removed; "Companies" becomes a contact page. Weekly IE puzzle + leaderboard added.

-- Companies page replaces the Sponsors page (same text, minus the sponsor lists).
DROP TABLE IF EXISTS sponsors;
UPDATE page_text SET page = 'companies' WHERE page = 'sponsors';
DELETE FROM page_text WHERE page = 'companies' AND block IN ('current_title', 'past_title', 'empty');

-- Weekly puzzle. Players pick a nickname for now; in Phase 2 a player is linked to a verified account (user_id).
CREATE TABLE game_players (
  id            TEXT PRIMARY KEY,                     -- random id, kept in a cookie on the player's device
  nickname      TEXT NOT NULL,
  nickname_key  TEXT NOT NULL UNIQUE,                 -- lowercase, for "is this name taken?"
  hidden        INTEGER NOT NULL DEFAULT 0,           -- hidden by a cabinet admin (rude name, etc.)
  user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE TABLE game_scores (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  week         TEXT NOT NULL,                         -- e.g. "2026-W44" (weeks start Monday 00:00 Beirut)
  puzzle       TEXT NOT NULL,                         -- puzzle type, e.g. "coffee-run"
  player_id    TEXT NOT NULL REFERENCES game_players(id) ON DELETE CASCADE,
  score        INTEGER NOT NULL,                      -- 0-1000; 1000 = the best possible answer
  result       REAL NOT NULL,                         -- the player's route length (or other measure)
  best         REAL NOT NULL,                         -- the best possible value for this week
  duration_ms  INTEGER NOT NULL,                      -- time taken, measured by the server
  hidden       INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  UNIQUE (week, player_id)                            -- one scored try per player per week
);
CREATE INDEX game_scores_rank ON game_scores (week, hidden, score DESC, duration_ms);

INSERT INTO settings (key, value, label, sort_order) VALUES
  ('game_enabled', '1', 'Weekly puzzle switched on (1 = on, 0 = off)', 20),
  ('game_term_start', '2026-09-01', 'Term leaderboard counts weeks from this date (YYYY-MM-DD)', 21);
