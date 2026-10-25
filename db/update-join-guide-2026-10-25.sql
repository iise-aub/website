-- Join page: Saad's illustrated registration guide (PDF, Oct 25 2026), and steps that match it.
-- The PDF lives at public/guides/; its link is a setting so next year's guide can replace it.
-- The guide shows the clubs term as "Clubs 2026-2027" (not "Clubs Scholastic Year"), then Continue → Enter CRNs → Add to Summary → Submit.
INSERT OR IGNORE INTO settings (key, value, label, sort_order) VALUES
  ('registration_guide_url', '/guides/iise-club-registration-guide-2026-27.pdf', 'Registration guide (PDF with screenshots)', 5);

UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad''s guide)',
  text_en = 'Press "Go to AUB registration" below, sign in with your AUB account, and click "Register for Classes".
Open the term box, choose "Clubs" with the current year (for example "Clubs 2026-2027"), and click "Continue".
Open the "Enter CRNs" tab (skip the search boxes).
Type our CRN (shown on this page) and click "Add to Summary".
Click "Submit" at the bottom right. When "IISE Society" shows a green "Registered", you''re in!',
  text_ar = 'اضغط «انتقل إلى التسجيل في الجامعة» في الأسفل، وسجّل الدخول بحساب الجامعة، ثم اضغط «Register for Classes».
افتح خانة الفصل واختر «Clubs» مع السنة الحالية (مثلًا «Clubs 2026-2027»)، ثم اضغط «Continue».
افتح تبويب «Enter CRNs» (تجاهل خانات البحث).
اكتب رقم CRN الخاص بنا (الظاهر في هذه الصفحة) واضغط «Add to Summary».
اضغط «Submit» في أسفل اليمين. عندما يظهر «IISE Society» مع علامة «Registered» الخضراء، تكون قد انضممت!'
  WHERE page = 'join' AND block = 'steps';
