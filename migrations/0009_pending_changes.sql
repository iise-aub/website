-- Approval step (Saad, Oct 26 2026): only the panel admin publishes directly. When an editor saves any panel
-- form, the submission is stored here instead of being applied; the admin reviews it (current vs proposed)
-- and approves (the form is re-submitted with the admin's authority) or rejects it with a note.
CREATE TABLE pending_changes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  email       TEXT NOT NULL,                 -- who submitted it
  path        TEXT NOT NULL,                 -- the panel page the form was sent to, e.g. /admin/events/12
  fields      TEXT NOT NULL,                 -- JSON list of [name, value] pairs, exactly as submitted
  page        TEXT NOT NULL DEFAULT '',      -- page heading, for the review list
  item        TEXT NOT NULL DEFAULT '',      -- list item the button belonged to, if any
  button      TEXT NOT NULL DEFAULT '',      -- the button they pressed
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'failed')),
  note        TEXT NOT NULL DEFAULT '',      -- admin's note on rejection, or why applying failed
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  decided_by  TEXT,
  decided_at  TEXT
);
CREATE INDEX pending_changes_status ON pending_changes (status, created_at);
CREATE INDEX pending_changes_user ON pending_changes (user_id, created_at);
