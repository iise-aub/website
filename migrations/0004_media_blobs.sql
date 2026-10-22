-- Photo storage in the database (used when no R2 bucket is connected, so no payment card is needed).
-- Each file is split into parts of up to 40 KB, to stay well inside D1's statement and row limits.
CREATE TABLE media_blobs (
  key   TEXT NOT NULL,       -- e.g. uploads/2026/<uuid>-480.webp
  part  INTEGER NOT NULL,
  data  BLOB NOT NULL,
  PRIMARY KEY (key, part)
);
