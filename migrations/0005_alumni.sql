-- 2026-10-22 (Saad): Alumni stories moved forward from Phase 2. For now the cabinet adds entries (no public form).
-- An alumnus is a person (name, photo, graduation year, LinkedIn) with one story.
CREATE TABLE alumni_stories (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id       INTEGER NOT NULL UNIQUE REFERENCES people(id) ON DELETE CASCADE,
  job_title_en    TEXT NOT NULL DEFAULT '',
  job_title_ar    TEXT NOT NULL DEFAULT '',
  company         TEXT NOT NULL DEFAULT '',
  industry        TEXT NOT NULL DEFAULT '',      -- key from the list in src/lib/alumni.ts
  country         TEXT NOT NULL DEFAULT '',      -- ISO 3166 code, e.g. LB, AE, FR
  story_en        TEXT NOT NULL DEFAULT '',      -- "How I got here"
  story_ar        TEXT NOT NULL DEFAULT '',
  consent_on      TEXT,                          -- date they agreed to be shown (required to publish)
  visible         INTEGER NOT NULL DEFAULT 1,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at      TEXT,
  updated_by      TEXT
);
CREATE INDEX alumni_visible ON alumni_stories (visible, sort_order);

INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
('alumni', 'eyebrow', 'Small label above the title', 'text', 'Alumni', 'الخرّيجون', 0, 1),
('alumni', 'title', 'Page title', 'text', 'Where industrial engineering took them', 'إلى أين أخذتهم الهندسة الصناعية', 0, 2),
('alumni', 'intro', 'Text under the title', 'long', 'IISE AUB alumni share what they do now and how they got there.', 'يشارك خرّيجو IISE AUB ما يعملون به اليوم وكيف وصلوا إليه.', 0, 3),
('alumni', 'empty', 'Shown before any stories are added', 'long', 'Alumni stories are coming soon.', 'قصص الخرّيجين قريبًا.', 0, 4),
('alumni', 'share', 'Invitation to alumni (bottom of the page)', 'long', 'Are you an IISE AUB alumnus? We would love to share your story. Email us, and tell us if you ever want your entry changed or removed.', 'هل أنت من خرّيجي IISE AUB؟ يسعدنا أن نشارك قصتك. راسلنا عبر البريد الإلكتروني، وأخبرنا متى أردت تعديل قصتك أو حذفها.', 0, 5);
