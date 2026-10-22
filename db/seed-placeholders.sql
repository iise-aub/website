-- Starting content for local development and the first preview.
-- Everything marked needs_content = 1 or is_placeholder = 1 is a PLACEHOLDER and shows as such on the site.
-- Nothing here is a confirmed fact about the chapter. See CONTENT-NEEDED.md.

-- ---------- Settings ----------
INSERT INTO settings (key, value, label, sort_order) VALUES
  ('crn',                  '5029', 'CRN (club registration number)', 1),
  ('crn_term_en',          '',     'Term the CRN applies to (English), e.g. Fall 2026-27', 2),
  ('crn_term_ar',          '',     'Term the CRN applies to (Arabic)', 3),
  ('aub_registration_url', 'https://sturegss.aub.edu.lb/StudentRegistrationSsb/ssb/registration',     'AUB club registration link', 4),
  ('iise_join_url',        '',     'IISE membership join page link', 5),
  ('whatsapp_url',         'https://chat.whatsapp.com/LWOoMh9faTv0C0FA3v0XkS', 'WhatsApp group invite link (hidden behind the robot check)', 6),
  ('instagram_url',        'https://www.instagram.com/iise_aub', 'Instagram link', 7),
  ('tiktok_url',           'https://www.tiktok.com/@iise_aub', 'TikTok link', 8),
  ('linkedin_url',         '',     'LinkedIn page link (leave empty if none)', 9),
  ('contact_email',        'iiseaub@outlook.com', 'Chapter contact email', 10),
  ('podcast_url',          '',     'Coffee with IISE: where episodes are published', 11),
  ('team_application_url', 'https://forms.cloud.microsoft/r/4XGMzkW7hB', 'Sub-cabinet / team application form link', 12),
  ('linktree_url',         'https://linktr.ee/IISE.AUB', 'Linktree link', 13);

-- ---------- Homepage text ----------
-- Draft wording by Claude (general, not chapter facts). The team may rewrite any of it in the panel.
INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
  ('home', 'hero_eyebrow', 'Top line above the headline', 'text',
   'IISE Student Chapter · American University of Beirut',
   'الفرع الطلابي لمعهد مهندسي الصناعة والأنظمة · الجامعة الأمريكية في بيروت', 0, 1),
  ('home', 'hero_title', 'Main headline', 'text',
   'Engineers make things. Industrial engineers make things better.',
   'المهندسون يصنعون الأشياء، والمهندسون الصناعيون يجعلونها أفضل.', 0, 2),
  ('home', 'hero_text', 'Text under the headline', 'long',
   'We are the AUB student chapter of the Institute of Industrial and Systems Engineers. We bring students closer to industrial engineering through events, teams and connections with industry.',
   'نحن الفرع الطلابي لمعهد مهندسي الصناعة والأنظمة في الجامعة الأمريكية في بيروت. نُقرّب الطلاب من الهندسة الصناعية عبر الفعاليات والفرق والتواصل مع قطاع الأعمال.', 0, 3),
  ('home', 'hero_fields', 'Fields of IE around the globe (one per line, up to 5 shown on wide screens)', 'long',
   'Operations
Supply chain
Data & analytics
Quality
Human factors',
   'العمليات
سلاسل الإمداد
تحليل البيانات
الجودة
العوامل البشرية', 0, 4),
  ('home', 'hero_fields_label', 'Label read by screen readers for the fields list', 'text',
   'Fields of industrial engineering', 'مجالات الهندسة الصناعية', 0, 4),
  ('home', 'join_button', 'Join button text', 'text', 'Join IISE AUB', 'انضمّ إلى IISE AUB', 0, 4),
  ('home', 'banner_empty_title', 'Banner when no event is scheduled: title', 'text',
   'No event scheduled right now', 'لا توجد فعالية مُجدولة حاليًا', 0, 5),
  ('home', 'banner_empty_text', 'Banner when no event is scheduled: text', 'text',
   'Follow us to hear about the next one first.', 'تابعونا لتكونوا أول من يعلم بالفعالية القادمة.', 0, 6),
  ('home', 'journey_eyebrow', 'Journey map: small label above the title', 'text', 'Story · Milestones', 'القصة · المحطات', 0, 7),
  ('home', 'journey_title', 'Journey map: title', 'text', 'Our journey', 'رحلتنا', 0, 7),
  ('home', 'journey_intro', 'Journey map: intro', 'long',
   'From the founding of IISE to today. Follow the road: every station is a moment that shaped the chapter.',
   'من تأسيس المعهد حتى اليوم. اتبع الطريق: كل محطة لحظةٌ صنعت مسيرة فرعنا.', 0, 8),
  ('home', 'doors_title', 'Three doors: title', 'text', 'Where would you like to start?', 'من أين تودّ أن تبدأ؟', 0, 9),
  ('home', 'door_new_title', 'Door 1 (New to IE): title', 'text', 'New to IE?', 'جديد على الهندسة الصناعية؟', 0, 10),
  ('home', 'door_new_text', 'Door 1 (New to IE): text', 'long',
   'What industrial engineering is, the IE path at AUB, and why students join us.',
   'ما هي الهندسة الصناعية، ومسارها في الجامعة الأمريكية في بيروت، ولماذا ينضمّ إلينا الطلاب.', 0, 11),
  ('home', 'door_members_title', 'Door 2 (Current members): title', 'text', 'Current members', 'الأعضاء الحاليون', 0, 12),
  ('home', 'door_members_text', 'Door 2 (Current members): text', 'long',
   'Upcoming events, joining a team, our WhatsApp group and the Coffee with IISE podcast.',
   'الفعاليات القادمة، والانضمام إلى فريق، ومجموعتنا على واتساب، وبودكاست Coffee with IISE.', 0, 13),
  ('home', 'door_partners_title', 'Door 3 (Companies): title', 'text', 'Companies', 'الشركات', 0, 14),
  ('home', 'door_partners_text', 'Door 3 (Companies): text', 'long',
   'Why work with us, what we offer, and how to reach the team.',
   'لماذا تعمل معنا، وماذا نقدّم، وكيف تتواصل مع الفريق.', 0, 15);

-- ---------- Join page ----------
-- The steps are a DRAFT (needs_content = 1) until the team confirms AUB's exact steps.
INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
  ('join', 'eyebrow', 'Small label above the title', 'text', 'Join IISE AUB', 'انضمّ إلى IISE AUB', 0, 1),
  ('join', 'title', 'Page title', 'text', 'Become a member in a few minutes.', 'كن عضوًا في دقائق.', 0, 2),
  ('join', 'intro', 'Text under the title', 'long',
   'Registering for the club happens on AUB''s student registration system, using our CRN.',
   'يتم التسجيل في النادي عبر نظام تسجيل الطلاب في الجامعة الأمريكية في بيروت، باستخدام رقم CRN الخاص بنا.', 0, 3),
  ('join', 'steps', 'Registration steps (one step per line)', 'long',
   'Open AUB''s student registration page and sign in.
Go to the registration section for the current term.
Enter our CRN and submit.
Check that IISE AUB appears in your registered list.',
   'افتح صفحة تسجيل الطلاب في الجامعة وسجّل الدخول.
انتقل إلى قسم التسجيل للفصل الحالي.
أدخل رقم CRN الخاص بنا وأرسل الطلب.
تحقّق من ظهور IISE AUB في قائمة تسجيلك.', 1, 4);

-- ---------- History journey map (all PLACEHOLDERS until the team confirms with sources) ----------
-- The year below is used only to put stations in order. Placeholder stations show "Date to be confirmed".
INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, category, source_note, sort_order, is_placeholder) VALUES
  ('IISE is founded', 'تأسيس معهد مهندسي الصناعة والأنظمة',
   'The Institute of Industrial and Systems Engineers begins. Wording and date to be confirmed by the team.',
   'انطلاقة معهد مهندسي الصناعة والأنظمة. الصياغة والتاريخ بانتظار تأكيد الفريق.',
   1948, 'ie_world', 'NEEDS SOURCE. Claude''s starting point: founded in 1948 as the American Institute of Industrial Engineers (AIIE). Team to confirm on iise.org.', 1, 1),
  ('AUB introduces industrial engineering', 'إطلاق تخصص الهندسة الصناعية في الجامعة الأمريكية في بيروت',
   'Industrial engineering becomes a major at AUB. Wording and date to be provided by the team.',
   'تصبح الهندسة الصناعية تخصصًا في الجامعة الأمريكية في بيروت. الصياغة والتاريخ بانتظار الفريق.',
   1990, 'aub', 'NEEDS SOURCE. Year is for ordering only and is not shown.', 2, 1),
  ('IISE AUB is founded', 'تأسيس فرع IISE في الجامعة الأمريكية في بيروت',
   'Our student chapter is founded. Wording and date to be provided by the team.',
   'تأسيس فرعنا الطلابي. الصياغة والتاريخ بانتظار الفريق.',
   2000, 'chapter', 'NEEDS SOURCE. Year is for ordering only and is not shown.', 3, 1),
  ('Chapter milestone', 'محطة من مسيرة الفرع',
   'A chapter milestone provided by the team.', 'محطة يزوّدنا بها الفريق.',
   2010, 'chapter', 'Placeholder station. Team to provide.', 4, 1),
  ('Chapter milestone', 'محطة من مسيرة الفرع',
   'A chapter milestone provided by the team.', 'محطة يزوّدنا بها الفريق.',
   2018, 'chapter', 'Placeholder station. Team to provide.', 5, 1),
  ('Best Society award', 'جائزة أفضل جمعية',
   'Exact award name and awarding body to be confirmed by the team.',
   'الاسم الدقيق للجائزة والجهة المانحة بانتظار تأكيد الفريق.',
   2024, 'award', 'NEEDS SOURCE. 2024 per BRIEF.md; name and awarding body to be confirmed.', 6, 1);

-- ---------- Sample events (PLACEHOLDERS, for testing the banner and lists) ----------
INSERT INTO events (slug, title_en, title_ar, summary_en, summary_ar, starts_at, ends_at, location_en, location_ar, status, is_placeholder) VALUES
  ('sample-upcoming-event', 'Sample event (placeholder)', 'فعالية تجريبية (نص مؤقت)',
   'This is a sample event to show how the banner works. Replace it in the panel.',
   'هذه فعالية تجريبية لعرض طريقة عمل الشريط. استبدلها من لوحة التحرير.',
   '2026-11-12T15:00:00Z', '2026-11-12T17:00:00Z', 'Location to be confirmed', 'المكان بانتظار التأكيد', 'published', 1),
  ('sample-past-event', 'Sample past event (placeholder)', 'فعالية سابقة تجريبية (نص مؤقت)',
   'A sample past event, to test past and upcoming lists.', 'فعالية سابقة تجريبية لاختبار القوائم.',
   '2026-09-24T14:00:00Z', '2026-09-24T16:00:00Z', 'Location to be confirmed', 'المكان بانتظار التأكيد', 'published', 1);
