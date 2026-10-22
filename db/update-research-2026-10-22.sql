-- Research by Claude (Oct 22, 2026), requested by Saad. Sources:
--   [AUB-IISE] https://www.aub.edu.lb/msfea/iem/Pages/iise-aub.aspx  (chapter "chartered by IISE"; "monthly events, workshops, and talks with industry professionals")
--   [AUB-IEM]  https://www.aub.edu.lb/msfea/iem/Pages/history.aspx   (EM program 1990; IE courses Aug 2014; IEM department Aug 2015)
--   [IISE]     https://iise.org/history                                 (founded 1948 as AIIE; renamed 1981 and 2016; HQ Atlanta)
-- The mission is a DRAFT built from these facts, for the cabinet to approve.

-- ---------- About page ----------
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (research)',
  text_en = 'To bring AUB''s industrial engineering students closer to their profession: through events, workshops and talks with industry professionals, hands-on teams, and the worldwide IISE network.',
  text_ar = 'تقريب طلاب الهندسة الصناعية في الجامعة الأمريكية في بيروت من مهنتهم، عبر الفعاليات وورش العمل واللقاءات مع المهنيين في القطاع، والفرق العملية، وشبكة IISE العالمية.'
  WHERE page = 'about' AND block = 'mission_body';

UPDATE page_text SET needs_content = 0, updated_by = 'Claude (research)',
  text_en = '- Monthly events, workshops and talks with industry professionals
- A General Assembly every fall, where new members meet the cabinet and the teams
- Six student teams: PR & Outreach, Social Media, Events, IISE & Beyond, Technical Development and Coffee with IISE
- IISE & Beyond, our newsletter, and Coffee with IISE, our podcast
- A weekly IE puzzle with a leaderboard, right here on the website',
  text_ar = '- فعاليات وورش عمل ولقاءات شهرية مع مهنيين من القطاع
- جمعية عامة كل خريف يتعرّف فيها الأعضاء الجدد إلى الهيئة الإدارية والفرق
- ستة فرق طلابية: العلاقات العامة والتواصل، ووسائل التواصل الاجتماعي، والفعاليات، وIISE & Beyond، والتطوير التقني، وCoffee with IISE
- نشرتنا الإخبارية IISE & Beyond، وبودكاست Coffee with IISE
- لغز أسبوعي في الهندسة الصناعية مع لوحة صدارة، هنا على الموقع'
  WHERE page = 'about' AND block = 'what_body';

UPDATE page_text SET updated_by = 'Claude (research)',
  text_en = 'IISE AUB is a student chapter chartered by the Institute of Industrial and Systems Engineers (IISE). IISE was founded in 1948 as the American Institute of Industrial Engineers, became the Institute of Industrial Engineers in 1981, and took its current name in 2016. Today it describes itself as the only international, nonprofit professional society dedicated to industrial engineers.

Being an IISE chapter connects our members to student chapters and professionals around the world, IISE conferences and competitions, and IISE''s yearly awards for chapters.',
  text_ar = 'IISE AUB فرع طلابي معتمد من معهد مهندسي الصناعة والأنظمة (IISE). تأسّس المعهد عام 1948 باسم «المعهد الأمريكي للمهندسين الصناعيين»، وأصبح «معهد المهندسين الصناعيين» عام 1981، ثم اتخذ اسمه الحالي عام 2016. ويصف نفسه اليوم بأنه الجمعية المهنية الدولية غير الربحية الوحيدة المخصّصة للمهندسين الصناعيين.

يربط كونُنا فرعًا من IISE أعضاءنا بفروع طلابية ومهنيين حول العالم، وبمؤتمرات المعهد ومسابقاته، وبجوائزه السنوية للفروع.'
  WHERE page = 'about' AND block = 'iise_body';

INSERT OR REPLACE INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order, updated_by) VALUES
('about', 'aub_title', 'IE at AUB: title', 'text', 'Industrial engineering at AUB', 'الهندسة الصناعية في الجامعة الأمريكية في بيروت', 0, 10, 'Claude (research)'),
('about', 'aub_body', 'IE at AUB: text', 'long',
 'Our members study in AUB''s Department of Industrial Engineering and Management (IEM), part of the Maroun Semaan Faculty of Engineering and Architecture.

- 1990: AUB''s Engineering Management program begins.
- 2014: Undergraduate courses in industrial engineering start.
- 2015: The IEM department is created to house both programs.',
 'يدرس أعضاؤنا في دائرة الهندسة الصناعية والإدارة في الجامعة الأمريكية في بيروت، التابعة لكلية مارون سمعان للهندسة والعمارة.

- 1990: انطلاق برنامج الإدارة الهندسية في الجامعة.
- 2014: بدء المقرّرات الجامعية في الهندسة الصناعية.
- 2015: تأسيس دائرة الهندسة الصناعية والإدارة لتضمّ البرنامجين.', 0, 11, 'Claude (research)');

-- ---------- New to IE: "IE at AUB" (was a placeholder) ----------
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (research)',
  text_en = 'Industrial engineering at AUB is taught by the Department of Industrial Engineering and Management (IEM) in the Maroun Semaan Faculty of Engineering and Architecture. Undergraduate IE courses started in 2014, and the department was created in 2015. Students earn a Bachelor of Engineering in industrial engineering, and the department also offers a graduate program in engineering management.',
  text_ar = 'تُدرَّس الهندسة الصناعية في الجامعة الأمريكية في بيروت في دائرة الهندسة الصناعية والإدارة ضمن كلية مارون سمعان للهندسة والعمارة. بدأت المقرّرات الجامعية في الهندسة الصناعية عام 2014، وتأسّست الدائرة عام 2015. يحصل الطلاب على بكالوريوس الهندسة في الهندسة الصناعية، كما تقدّم الدائرة برنامج دراسات عليا في الإدارة الهندسية.'
  WHERE page = 'new-to-ie' AND block = 'aub_body';

-- ---------- History map: stations confirmed from official sources ----------
UPDATE milestones SET is_placeholder = 0, year = 1948, month = NULL, day = NULL, updated_by = 'Claude (research)',
  title_en = 'IISE is founded', title_ar = 'تأسيس معهد مهندسي الصناعة والأنظمة',
  text_en = 'Founded as the American Institute of Industrial Engineers. It became the Institute of Industrial Engineers in 1981 and the Institute of Industrial and Systems Engineers in 2016.',
  text_ar = 'تأسّس باسم «المعهد الأمريكي للمهندسين الصناعيين»، ثم أصبح «معهد المهندسين الصناعيين» عام 1981، و«معهد مهندسي الصناعة والأنظمة» عام 2016.',
  source_note = 'IISE, "Origins of IISE": https://iise.org/history (checked Oct 22, 2026)'
  WHERE title_en = 'IISE is founded';

UPDATE milestones SET is_placeholder = 0, year = 2014, month = 8, day = NULL, updated_by = 'Claude (research)',
  text_en = 'AUB''s Engineering Management program begins offering undergraduate courses in industrial engineering.',
  text_ar = 'يبدأ برنامج الإدارة الهندسية في الجامعة الأمريكية في بيروت بتقديم مقرّرات جامعية في الهندسة الصناعية.',
  source_note = 'AUB IEM department history: https://www.aub.edu.lb/msfea/iem/Pages/history.aspx (checked Oct 22, 2026)'
  WHERE title_en = 'AUB introduces industrial engineering';

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, updated_by)
SELECT 'AUB launches Engineering Management', 'إطلاق برنامج الإدارة الهندسية في الجامعة',
  'AUB starts its graduate Engineering Management program, the root of today''s IEM department.',
  'تُطلق الجامعة الأمريكية في بيروت برنامج الإدارة الهندسية للدراسات العليا، وهو أصل دائرة الهندسة الصناعية والإدارة اليوم.',
  1990, NULL, 'aub', 'AUB IEM department history: https://www.aub.edu.lb/msfea/iem/Pages/history.aspx (checked Oct 22, 2026)', 1, 0, 'Claude (research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'AUB launches Engineering Management');

INSERT INTO milestones (title_en, title_ar, text_en, text_ar, year, month, category, source_note, sort_order, is_placeholder, updated_by)
SELECT 'AUB creates the IEM department', 'تأسيس دائرة الهندسة الصناعية والإدارة',
  'The Department of Industrial Engineering and Management is established to house the new IE program and the Engineering Management program.',
  'تأسّست دائرة الهندسة الصناعية والإدارة لتضمّ برنامج الهندسة الصناعية الجديد وبرنامج الإدارة الهندسية.',
  2015, 8, 'aub', 'AUB IEM department history: https://www.aub.edu.lb/msfea/iem/Pages/history.aspx (checked Oct 22, 2026)', 1, 0, 'Claude (research)'
WHERE NOT EXISTS (SELECT 1 FROM milestones WHERE title_en = 'AUB creates the IEM department');

-- Still unconfirmed chapter stations: keep them after the confirmed AUB dates (ordering only; these years are not shown).
UPDATE milestones SET year = 2016 WHERE title_en = 'IISE AUB is founded' AND is_placeholder = 1;
UPDATE milestones SET year = 2019 WHERE title_en = 'Chapter milestone' AND is_placeholder = 1 AND sort_order = 4;
UPDATE milestones SET year = 2022 WHERE title_en = 'Chapter milestone' AND is_placeholder = 1 AND sort_order = 5;
