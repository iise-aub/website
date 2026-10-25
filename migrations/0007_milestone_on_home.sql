-- History stations: choose which ones also appear on the homepage (Saad, Oct 25 2026:
-- the homepage keeps about 8 main moments; the History page shows them all, ideally under 15).
ALTER TABLE milestones ADD COLUMN on_home INTEGER NOT NULL DEFAULT 1;
