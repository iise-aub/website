-- History map from the research PDF Saad shared (IISE_AUB_History_Research.pdf, researched Oct 25 2026
-- from the chapter Instagram, iise.org and AUB's IEM pages). Saad: homepage about 8 main moments,
-- History page under 15, short neat text. Run after migration 0007 (on_home).
-- 13 stations: 8 on the homepage (on_home = 1), 5 more on the History page only.

-- ---------- Existing confirmed stations ----------
UPDATE milestones SET on_home = 1, updated_by = 'Claude (history research)',
  text_en = 'Founded as the American Institute of Industrial Engineers. It took its current name, the Institute of Industrial and Systems Engineers, in 2016.',
  text_ar = 'تأسّس باسم «المعهد الأمريكي للمهندسين الصناعيين»، واتخذ اسمه الحالي «معهد مهندسي الصناعة والأنظمة» عام 2016.'
  WHERE title_en = 'IISE is founded';
UPDATE milestones SET on_home = 0 WHERE title_en = 'AUB launches Engineering Management';
UPDATE milestones SET on_home = 1 WHERE title_en = 'AUB introduces industrial engineering';
UPDATE milestones SET on_home = 0 WHERE title_en = 'AUB creates the IEM department';

-- ---------- Placeholders replaced by confirmed chapter stations ----------
UPDATE milestones SET is_placeholder = 0, on_home = 1, category = 'chapter', year = 2015, month = 10, day = 8, sort_order = 1,
  updated_by = 'Claude (history research)',
  title_en = 'It all starts on Hostler Roof', title_ar = 'البداية على سطح هوستلر',
  text_en = 'Then called the Industrial Engineering Society, the chapter holds its first event, "The Gathering". It becomes our yearly welcome night.',
  text_ar = 'يقيم الفرع، وكان اسمه آنذاك «جمعية الهندسة الصناعية»، أولى فعالياته «The Gathering»، التي أصبحت أمسية الترحيب السنوية.',
  source_note = 'Instagram, first post (Oct 6, 2015) announcing the Oct 8, 2015 event: https://www.instagram.com/p/8fmU5SB_lq/'
  WHERE title_en = 'IISE AUB is founded' AND is_placeholder = 1;

UPDATE milestones SET is_placeholder = 0, on_home = 1, category = 'chapter', year = 2020, month = 8, day = NULL, sort_order = 1,
  updated_by = 'Claude (history research)',
  title_en = 'Standing with Beirut', title_ar = 'إلى جانب بيروت',
  text_en = 'Days after the August 4 port explosion, members join the Beirut Emergency Response clean-up.',
  text_ar = 'بعد أيام من انفجار المرفأ في 4 آب، يشارك أعضاؤنا في حملة تنظيف ضمن الاستجابة الطارئة لبيروت.',
  source_note = 'Instagram (Aug 2020): https://www.instagram.com/p/CDjtQ6EFSIE/'
  WHERE title_en = 'Chapter milestone' AND is_placeholder = 1 AND sort_order = 4;

UPDATE milestones SET is_placeholder = 0, on_home = 1, category = 'chapter', year = 2022, month = 10, day = NULL, sort_order = 1,
  updated_by = 'Claude (history research)',
  title_en = 'Coffee with IISE begins', title_ar = 'انطلاق Coffee with IISE',
  text_en = 'Our series of conversations with IE graduates working at companies such as BCG, Bain, Amazon and Hermès.',
  text_ar = 'سلسلة حواراتنا مع خرّيجي الهندسة الصناعية العاملين في شركات مثل BCG وBain وAmazon وHermès.',
  source_note = 'Instagram (Oct 2022): https://www.instagram.com/p/Cj8FzUYrUU8/'
  WHERE title_en = 'Chapter milestone' AND is_placeholder = 1 AND sort_order = 5;

UPDATE milestones SET is_placeholder = 0, on_home = 1, category = 'award', year = 2025, month = 8, day = NULL, sort_order = 2,
  updated_by = 'Claude (history research)',
  title_en = 'Society of the Year', title_ar = 'جمعية العام',
  text_en = 'Named Society of the Year at AUB for 2024-25, after a record 50+ initiatives. We also win the Community and Citizenship Award.',
  text_ar = 'نلنا لقب «جمعية العام» في الجامعة لعام 2024/2025 بعد أكثر من 50 نشاطًا، وهو رقم قياسي، إضافةً إلى جائزة المجتمع والمواطنة.',
  source_note = 'Instagram, announced Aug 20, 2025: https://www.instagram.com/p/DNlmy8SMq9s/ (awarding body most likely AUB Office of Student Affairs, Excellence in Student Life Award Ceremony; to confirm)'
  WHERE title_en = 'Best Society award' AND is_placeholder = 1;

-- ---------- New stations ----------
INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, on_home, updated_by)
SELECT 'Our first field trip', 'أولى رحلاتنا الميدانية',
  'Members visit Kassatly Chtaura in the Bekaa to see industrial engineering on a real factory floor. Factory visits are still a yearly event.',
  'يزور الأعضاء مصنع قساطلي شتورا في البقاع ليروا الهندسة الصناعية على أرض الواقع. وما زالت زيارات المصانع نشاطًا سنويًا.',
  2018, 3, 'chapter', 'Instagram (Mar 2018): https://www.instagram.com/p/Bf3xYTFgjre/', 1, 0, 1, 'Claude (history research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'Our first field trip');

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, on_home, updated_by)
SELECT 'AUB''s first IE graduates', 'أول خرّيجي الهندسة الصناعية في الجامعة',
  'The first class of industrial engineers at AUB presents its final year projects.',
  'تعرض أول دفعة من مهندسي الصناعة في الجامعة مشاريع تخرّجها.',
  2018, 5, 'aub', 'Instagram (May 2018): https://www.instagram.com/p/BizxMvOnmZk/', 1, 0, 0, 'Claude (history research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'AUB''s first IE graduates');

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, on_home, updated_by)
SELECT 'IISE Chapters in MENA', 'فروع IISE في الشرق الأوسط وشمال أفريقيا',
  'A first regional collaboration with the IISE chapters at the University of Jordan and An-Najah National University, with workshops by engineers from Jordan, Palestine and Lebanon.',
  'أول تعاون إقليمي مع فرعَي IISE في الجامعة الأردنية وجامعة النجاح الوطنية، مع ورش عمل يقدّمها مهندسون من الأردن وفلسطين ولبنان.',
  2021, 4, 'chapter', 'Instagram (Apr 2021): https://www.instagram.com/p/CNQVfjWMk_H/', 1, 0, 0, 'Claude (history research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'IISE Chapters in MENA');

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, on_home, updated_by)
SELECT 'A supply chain competition with Pfizer', 'مسابقة سلاسل الإمداد مع Pfizer',
  '"Talent of the Future", our supply chain case competition with Pfizer at IDEAS 2024. Winners are recognized by Pfizer''s Middle East supply chain division.',
  '«Talent of the Future»: مسابقة حالات في سلاسل الإمداد مع Pfizer ضمن IDEAS 2024، يحظى الفائزون فيها بتقدير قسم سلاسل الإمداد في Pfizer الشرق الأوسط.',
  2024, 4, 'chapter', 'Instagram (Apr 2024): https://www.instagram.com/p/C5V8ilQsHkJ/', 1, 0, 0, 'Claude (history research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'A supply chain competition with Pfizer');

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, on_home, updated_by)
SELECT 'Ten years of IISE AUB', 'عشر سنوات من IISE AUB',
  'Students paint a giant canvas mural on campus, covered in their messages, to mark the chapter''s 10th anniversary.',
  'يرسم الطلاب جدارية ضخمة على قماش في الحرم الجامعي، مليئة برسائلهم، احتفالًا بالذكرى العاشرة للفرع.',
  2025, 4, 'chapter', 'Instagram (Apr 2025): https://www.instagram.com/p/DNYsKKBMOEi/', 1, 0, 1, 'Claude (history research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'Ten years of IISE AUB');

-- Saad, Oct 25 2026: the Beirut clean-up stays on the History page only (homepage: 7 main moments).
UPDATE milestones SET on_home = 0 WHERE title_en = 'Standing with Beirut';

-- Saad, Oct 25 2026: 2014 and 2015 were too similar. Keep 2014 (with the MSFEA building photo) and fold the
-- 2015 department into its text; the 2015 station is hidden (not deleted, so it can come back from the panel).
UPDATE milestones SET updated_by = 'Claude (from Saad)',
  text_en = 'AUB begins teaching undergraduate industrial engineering. A year later it creates the Department of Industrial Engineering and Management (IEM) to house the program.',
  text_ar = 'تبدأ الجامعة الأمريكية في بيروت بتدريس الهندسة الصناعية للطلاب الجامعيين، وبعد عام تؤسّس دائرة الهندسة الصناعية والإدارة لتحتضن البرنامج.'
  WHERE title_en = 'AUB introduces industrial engineering';
UPDATE milestones SET visible = 0 WHERE title_en = 'AUB creates the IEM department';
