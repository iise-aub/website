-- IISE AUB website: initial database structure (Phase 1, with room for Phases 2-3).
-- Times are stored in UTC as ISO 8601 text ("2026-11-05T15:00:00Z") and shown in Asia/Beirut.
-- Every visible text has an English (_en) and Arabic (_ar) version. Empty Arabic falls back to English.

-- Live settings: CRN, term, links, contact details.
CREATE TABLE settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  label       TEXT NOT NULL DEFAULT '',      -- plain-language name shown in the panel
  sort_order  INTEGER NOT NULL DEFAULT 0,
  updated_at  TEXT,
  updated_by  TEXT
);

-- Editable page text, as named blocks per page.
CREATE TABLE page_text (
  page           TEXT NOT NULL,
  block          TEXT NOT NULL,
  label          TEXT NOT NULL DEFAULT '',   -- plain-language name shown in the panel
  kind           TEXT NOT NULL DEFAULT 'text' CHECK (kind IN ('text', 'long', 'url')),
  text_en        TEXT NOT NULL DEFAULT '',
  text_ar        TEXT NOT NULL DEFAULT '',
  needs_content  INTEGER NOT NULL DEFAULT 0, -- 1 = placeholder; cleared when an editor saves
  sort_order     INTEGER NOT NULL DEFAULT 0,
  updated_at     TEXT,
  updated_by     TEXT,
  PRIMARY KEY (page, block)
);

-- Uploaded photos (files live in R2).
CREATE TABLE media (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  r2_key      TEXT NOT NULL UNIQUE,          -- base key; sizes are stored as <key>-<width>.webp
  widths      TEXT NOT NULL DEFAULT '[]',    -- JSON list of stored widths, e.g. [480, 960, 1600]
  width       INTEGER NOT NULL DEFAULT 0,
  height      INTEGER NOT NULL DEFAULT 0,
  alt_en      TEXT NOT NULL DEFAULT '',
  alt_ar      TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  created_by  TEXT
);

CREATE TABLE events (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                 TEXT NOT NULL UNIQUE,
  title_en             TEXT NOT NULL DEFAULT '',
  title_ar             TEXT NOT NULL DEFAULT '',
  summary_en           TEXT NOT NULL DEFAULT '',
  summary_ar           TEXT NOT NULL DEFAULT '',
  body_en              TEXT NOT NULL DEFAULT '',
  body_ar              TEXT NOT NULL DEFAULT '',
  starts_at            TEXT NOT NULL,
  ends_at              TEXT NOT NULL,
  location_en          TEXT NOT NULL DEFAULT '',
  location_ar          TEXT NOT NULL DEFAULT '',
  cover_media_id       INTEGER REFERENCES media(id) ON DELETE SET NULL,
  registration_url     TEXT NOT NULL DEFAULT '',
  recap_en             TEXT NOT NULL DEFAULT '',   -- Phase 2
  recap_ar             TEXT NOT NULL DEFAULT '',   -- Phase 2
  gold_category        TEXT NOT NULL DEFAULT '',   -- internal only, never shown publicly
  show_on_history_map  INTEGER NOT NULL DEFAULT 0,
  status               TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_placeholder       INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at           TEXT,
  updated_by           TEXT
);
CREATE INDEX events_by_start ON events (status, starts_at);

CREATE TABLE event_photos (
  event_id    INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  media_id    INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_id, media_id)
);

-- History journey map stations. Awards are milestones with category 'award'.
CREATE TABLE milestones (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  title_en        TEXT NOT NULL DEFAULT '',
  title_ar        TEXT NOT NULL DEFAULT '',
  text_en         TEXT NOT NULL DEFAULT '',
  text_ar         TEXT NOT NULL DEFAULT '',
  year            INTEGER NOT NULL,
  month           INTEGER CHECK (month BETWEEN 1 AND 12),
  day             INTEGER CHECK (day BETWEEN 1 AND 31),
  category        TEXT NOT NULL CHECK (category IN ('ie_world', 'aub', 'chapter', 'award')),
  source_note     TEXT NOT NULL DEFAULT '',     -- where the date comes from; required before launch
  sort_order      INTEGER NOT NULL DEFAULT 0,   -- breaks ties within the same date
  visible         INTEGER NOT NULL DEFAULT 1,
  is_placeholder  INTEGER NOT NULL DEFAULT 0,   -- 1 = date/wording not yet confirmed by the team
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at      TEXT,
  updated_by      TEXT
);

CREATE TABLE milestone_photos (
  milestone_id  INTEGER NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  media_id      INTEGER NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (milestone_id, media_id)
);

CREATE TABLE teams (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  slug            TEXT NOT NULL UNIQUE,
  name_en         TEXT NOT NULL DEFAULT '',
  name_ar         TEXT NOT NULL DEFAULT '',
  description_en  TEXT NOT NULL DEFAULT '',
  description_ar  TEXT NOT NULL DEFAULT '',
  how_to_join_en  TEXT NOT NULL DEFAULT '',
  how_to_join_ar  TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  visible         INTEGER NOT NULL DEFAULT 1,
  is_placeholder  INTEGER NOT NULL DEFAULT 0,
  updated_at      TEXT,
  updated_by      TEXT
);

-- One person can hold several roles over time (member, cabinet, alumni).
CREATE TABLE people (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en          TEXT NOT NULL DEFAULT '',
  name_ar          TEXT NOT NULL DEFAULT '',
  photo_media_id   INTEGER REFERENCES media(id) ON DELETE SET NULL,
  bio_en           TEXT NOT NULL DEFAULT '',
  bio_ar           TEXT NOT NULL DEFAULT '',
  linkedin_url     TEXT NOT NULL DEFAULT '',   -- shown only when linkedin_opt_in = 1
  linkedin_opt_in  INTEGER NOT NULL DEFAULT 0,
  grad_year        INTEGER,
  email            TEXT,                       -- never shown publicly
  is_placeholder   INTEGER NOT NULL DEFAULT 0,
  updated_at       TEXT,
  updated_by       TEXT
);

CREATE TABLE person_roles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id    INTEGER NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('member', 'cabinet', 'alumni')),
  position_en  TEXT NOT NULL DEFAULT '',
  position_ar  TEXT NOT NULL DEFAULT '',
  team_id      INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  start_date   TEXT,                          -- YYYY-MM-DD
  end_date     TEXT,                          -- YYYY-MM-DD; empty = current
  sort_order   INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX person_roles_by_role ON person_roles (role, end_date);

CREATE TABLE sponsors (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en         TEXT NOT NULL DEFAULT '',
  name_ar         TEXT NOT NULL DEFAULT '',
  logo_media_id   INTEGER REFERENCES media(id) ON DELETE SET NULL,
  url             TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'current' CHECK (status IN ('current', 'past')),
  years           TEXT NOT NULL DEFAULT '',
  blurb_en        TEXT NOT NULL DEFAULT '',
  blurb_ar        TEXT NOT NULL DEFAULT '',
  sort_order      INTEGER NOT NULL DEFAULT 0,
  visible         INTEGER NOT NULL DEFAULT 1,
  is_placeholder  INTEGER NOT NULL DEFAULT 0,
  updated_at      TEXT,
  updated_by      TEXT
);

-- One login system for every role. Phase 1: only editors and cabinet admins sign in.
CREATE TABLE users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  email            TEXT NOT NULL UNIQUE COLLATE NOCASE,
  person_id        INTEGER REFERENCES people(id) ON DELETE SET NULL,
  created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  last_sign_in_at  TEXT
);

CREATE TABLE user_roles (
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('editor', 'cabinet', 'cabinet_admin', 'member', 'alumni', 'sponsor', 'treasurer')),
  granted_by  TEXT,
  granted_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  PRIMARY KEY (user_id, role)
);

-- Who changed what, for accountability across cabinets.
CREATE TABLE change_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  user_email  TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   TEXT NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  summary     TEXT NOT NULL DEFAULT ''
);
CREATE INDEX change_log_by_time ON change_log (at);
