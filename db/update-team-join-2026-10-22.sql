-- Saad (Oct 22, 2026): team positions open at the start of each fall semester.
UPDATE page_text SET
  text_en = 'Team positions open at the start of each fall semester. Fill in the application form then, and the team leads will get back to you.',
  text_ar = 'تُفتح المناصب في الفرق في بداية كل فصل خريفي. املأ استمارة الطلب حينها، وسيتواصل معك قادة الفرق.',
  needs_content = 0, updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), updated_by = 'Saad (chat)'
WHERE page = 'team' AND block = 'join_text';
