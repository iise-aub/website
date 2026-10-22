-- Weekly puzzle page text (Claude drafts; editable in the panel under Page text → Weekly puzzle page).
INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
('game', 'eyebrow', 'Small label above the title', 'text', 'Weekly puzzle', 'لغز الأسبوع', 0, 1),
('game', 'title', 'Page title', 'text', 'Coffee Run', 'جولة القهوة', 0, 2),
('game', 'intro', 'Text under the title', 'long', 'Deliver coffee to every stop on campus and get back to the cart. The shortest route wins. A new map every Monday.', 'أوصل القهوة إلى كل محطة في الحرم الجامعي ثم عُد إلى عربة القهوة. يفوز أقصر مسار. خريطة جديدة كل يوم اثنين.', 0, 3),
('game', 'rules', 'How it works (use "- " for a list)', 'long', '- Tap the stops in the order you want to visit them. Tap the last one again to undo.
- When every stop is served, your route returns to the cart automatically.
- Score: 1000 points for the shortest possible route, fewer the longer yours is.
- Ties go to whoever finished faster. The clock starts when you press Start.
- One scored try per week.', '- اضغط على المحطات بالترتيب الذي تريد زيارتها به. اضغط على آخر محطة مرة أخرى للتراجع.
- عندما تخدم كل المحطات، يعود مسارك تلقائيًا إلى العربة.
- النتيجة: 1000 نقطة لأقصر مسار ممكن، وأقل كلما طال مسارك.
- عند التعادل يفوز الأسرع. يبدأ الوقت عند الضغط على «ابدأ».
- محاولة واحدة محتسبة كل أسبوع.', 0, 4),
('game', 'nickname_hint', 'Nickname hint', 'text', 'Pick a nickname for the leaderboard. You keep it for the whole term.', 'اختر اسمًا مستعارًا للوحة الصدارة. يبقى لك طوال الفصل.', 0, 5),
('game', 'off_text', 'Shown when the puzzle is switched off', 'text', 'The weekly puzzle is taking a break. Check back soon.', 'لغز الأسبوع في استراحة. عُد قريبًا.', 0, 6),
('game', 'cta_title', 'Homepage/Members teaser: title', 'text', 'Can you find the shortest route?', 'هل تستطيع إيجاد أقصر مسار؟', 0, 7),
('game', 'cta_text', 'Homepage/Members teaser: text', 'long', 'A new IE puzzle every Monday. Climb the leaderboard.', 'لغز جديد في الهندسة الصناعية كل يوم اثنين. تقدّم في لوحة الصدارة.', 0, 8);
