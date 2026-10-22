-- Cabinet 2026-27 and teams.
-- Cabinet names/positions: Instagram "Meet the IISE Cabinet 2026-2027" (Sep 16, 2026). Team names confirmed by Saad (Oct 22, 2026).
-- Arabic positions are left empty on purpose: Arabic job titles are gendered, so the Arabic reviewer fills them in.
-- Team descriptions are PLACEHOLDERS (is_placeholder = 1) until the team writes them.

INSERT INTO people (name_en) VALUES
  ('Shayene Kamel'), ('Maria Moarbes'), ('Maria Hajjar'), ('Saad Majbour'), ('Georges Ghanem'),
  ('Gabriela Rizkallah'), ('Clara Samaha'), ('Lynn Cortas'), ('Clara Espiro');

WITH v(name, position, ord) AS (VALUES
  ('Shayene Kamel', 'President', 1), ('Maria Moarbes', 'Vice President', 2), ('Maria Hajjar', 'Head of Growth', 3),
  ('Saad Majbour', 'Secretary', 4), ('Georges Ghanem', 'Treasurer', 5), ('Gabriela Rizkallah', 'Communications Officer', 6),
  ('Clara Samaha', 'PR Officer', 7), ('Lynn Cortas', 'Event Officer', 8), ('Clara Espiro', 'Member at Large', 9))
INSERT INTO person_roles (person_id, role, position_en, start_date, sort_order)
SELECT p.id, 'cabinet', v.position, '2026-09-01', v.ord FROM v JOIN people p ON p.name_en = v.name;

INSERT INTO teams (slug, name_en, name_ar, description_en, description_ar, sort_order, is_placeholder) VALUES
  ('technical', 'Team Technical', 'الفريق التقني', 'What this team does, in one or two sentences (to be written by the team).', '', 1, 1),
  ('media', 'Team Media', 'فريق الإعلام', 'What this team does, in one or two sentences (to be written by the team).', '', 2, 1),
  ('coffee-with-iise', 'Team Coffee with IISE', 'فريق Coffee with IISE', 'What this team does, in one or two sentences (to be written by the team).', '', 3, 1),
  ('social', 'Team Social', 'الفريق الاجتماعي', 'What this team does, in one or two sentences (to be written by the team).', '', 4, 1),
  ('pr', 'Team PR', 'فريق العلاقات العامة', 'What this team does, in one or two sentences (to be written by the team).', '', 5, 1),
  ('iise-and-beyond', 'Team IISE & Beyond', 'فريق IISE & Beyond', 'What this team does, in one or two sentences (to be written by the team).', '', 6, 1);

INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
  ('team', 'eyebrow', 'Small label above the title', 'text', 'The people behind IISE AUB', 'الفريق وراء IISE AUB', 0, 1),
  ('team', 'title', 'Page title', 'text', 'Meet the cabinet and the teams', 'تعرّف إلى الهيئة الإدارية والفرق', 0, 2),
  ('team', 'intro', 'Text under the title', 'long',
   'A student-run chapter: the cabinet leads, and the teams make it happen.',
   'فرعٌ يديره الطلاب: تقوده الهيئة الإدارية وتُنجز الفرقُ عمله.', 0, 3),
  ('team', 'cabinet_title', 'Cabinet section: title', 'text', 'Cabinet 2026–27', 'الهيئة الإدارية 2026/2027', 0, 4),
  ('team', 'teams_title', 'Teams section: title', 'text', 'Our teams', 'فرقنا', 0, 5),
  ('team', 'teams_intro', 'Teams section: intro', 'long',
   'Every member can join a team. Pick the one that matches what you want to learn.',
   'يستطيع كل عضو الانضمام إلى فريق. اختر الفريق الذي يناسب ما تريد أن تتعلّمه.', 0, 6),
  ('team', 'join_title', 'How to join a team: title', 'text', 'Join a team', 'انضمّ إلى فريق', 0, 7),
  ('team', 'join_text', 'How to join a team: text', 'long',
   'Applications for the teams (sub-cabinet) open at the start of each term. Fill in the form, and the team leads will get back to you.',
   'تُفتح طلبات الانضمام إلى الفرق في بداية كل فصل. املأ الاستمارة وسيتواصل معك قادة الفرق.', 1, 8);
