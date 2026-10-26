-- Editing panel sign-in with passkeys (Saad, Oct 26 2026: Cloudflare Access asks for a card, so the panel
-- signs people in itself). No passwords: each person saves a passkey (Face ID, fingerprint or device PIN)
-- from a one-time invite link the admin sends them.

CREATE TABLE passkeys (
  id            TEXT PRIMARY KEY,                -- credential ID (base64url)
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  public_key    TEXT NOT NULL,                   -- COSE public key (base64url)
  counter       INTEGER NOT NULL DEFAULT 0,
  transports    TEXT NOT NULL DEFAULT '',        -- comma-separated hints, e.g. "internal,hybrid"
  device        TEXT NOT NULL DEFAULT '',        -- short description of the browser/device it was made on
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  last_used_at  TEXT
);
CREATE INDEX passkeys_user ON passkeys (user_id);

-- One-time sign-in links. Only a hash of the token is stored.
CREATE TABLE panel_invites (
  token_hash  TEXT PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_by  TEXT,
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  expires_at  TEXT NOT NULL,
  used_at     TEXT
);

-- Signed-in browsers. Only a hash of the cookie value is stored, so removing a row signs that browser out.
CREATE TABLE panel_sessions (
  token_hash    TEXT PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  expires_at    TEXT NOT NULL,
  last_seen_at  TEXT
);
CREATE INDEX panel_sessions_user ON panel_sessions (user_id);

-- Short-lived passkey challenges (5 minutes), referenced by a cookie.
CREATE TABLE auth_challenges (
  id           TEXT PRIMARY KEY,
  challenge    TEXT NOT NULL,
  purpose      TEXT NOT NULL CHECK (purpose IN ('login', 'register')),
  invite_hash  TEXT,
  expires_at   TEXT NOT NULL
);
