-- Homepage: a "Careers in IE" door, second after "New to IE" (Saad, Oct 23 2026: for first and second years).
-- Door labels renumbered to match the new order on the page.
INSERT OR REPLACE INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order, updated_by) VALUES
  ('home', 'door_careers_title', 'Door 2 (Careers in IE): title', 'text', 'Where can IE take you?', 'إلى أين تأخذك الهندسة الصناعية؟', 0, 11, 'Claude'),
  ('home', 'door_careers_text', 'Door 2 (Careers in IE): text', 'long',
   'Ten fields, real job titles, and a quick quiz to find the one that fits you.',
   'عشرة مجالات، ومسمّيات وظيفية حقيقية، واختبار قصير لتكتشف المجال الذي يناسبك.', 0, 11, 'Claude');

UPDATE page_text SET label = 'Door 3 (Current members): title' WHERE page = 'home' AND block = 'door_members_title';
UPDATE page_text SET label = 'Door 3 (Current members): text' WHERE page = 'home' AND block = 'door_members_text';
UPDATE page_text SET label = 'Door 4 (Companies): title' WHERE page = 'home' AND block = 'door_partners_title';
UPDATE page_text SET label = 'Door 4 (Companies): text' WHERE page = 'home' AND block = 'door_partners_text';
UPDATE page_text SET label = 'Doors: title' WHERE page = 'home' AND block = 'doors_title';
