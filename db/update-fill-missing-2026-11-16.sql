-- Fill the remaining gaps (Saad, Nov 16 2026: "if there are any missing info... fill it even if you're not 100% sure")
-- and the new official email. Nothing here is invented about real people or events.
-- Sources: chapter facts already on the site (AUB IISE page, history research).
-- Saad: the benefits are the society's own (a community where students help each other), not IISE membership,
-- so the IISE membership link stays empty (its button stays hidden).

-- ---------- Settings ----------
UPDATE settings SET value = 'iiseaub@aub.edu.lb' WHERE key = 'contact_email';
-- The clubs term name on AUB's registration system (from Saad's registration guide).
UPDATE settings SET value = 'Clubs 2026-2027' WHERE key = 'crn_term_en';
UPDATE settings SET value = 'Clubs 2026/2027' WHERE key = 'crn_term_ar';
UPDATE settings SET value = '' WHERE key = 'iise_join_url';

-- ---------- Why join: benefits (the society, not IISE membership) ----------
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad)',
  text_en = '- A community, not just a club: IE students from every year who help each other out.
- Advice from people who have been there: older students share what they know about courses, projects and internships.
- Friends outside your class: events, workshops and our yearly welcome night, The Gathering.
- IE beyond the classroom: talks with people working in the field, and factory visits.
- A place to get involved: join one of our six teams, from Events to Social Media.
- Fun along the way: the weekly puzzle, competitions and more.',
  text_ar = '- مجتمع، لا مجرد نادٍ: طلاب هندسة صناعية من كل السنوات يساعدون بعضهم بعضًا.
- نصائح ممن سبقوك: يشارك الطلاب الأكبر ما يعرفونه عن المقرّرات والمشاريع والتدريب.
- أصدقاء من خارج صفّك: فعاليات وورش عمل وأمسية الترحيب السنوية The Gathering.
- الهندسة الصناعية خارج الصف: لقاءات مع أشخاص يعملون في المجال وزيارات للمصانع.
- مكان لتشارك فيه: انضمّ إلى أحد فرقنا الستة، من الفعاليات إلى وسائل التواصل الاجتماعي.
- متعة على الطريق: اللغز الأسبوعي والمسابقات وغيرها.'
  WHERE page = 'why-join' AND block = 'benefits_body';

-- ---------- Privacy (matches what the site does; no analytics was ever set up) ----------
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (fill missing)',
  text_en = 'We keep this simple.

- This site has no advertising and no tracking cookies.
- One small cookie remembers your language choice.
- If you play the weekly puzzle, we keep the nickname you choose and your scores, shown on the leaderboards. Your browser keeps a random player number so you can come back as the same player.
- Before showing our WhatsApp link, a Cloudflare Turnstile check confirms you are not a robot.
- If you email us, we use your message only to reply.

Questions? Email us at the address on our Contact page.',
  text_ar = 'نبقي الأمر بسيطًا.

- لا يحتوي هذا الموقع على إعلانات ولا على ملفات تتبّع.
- ملف صغير واحد يتذكّر اللغة التي اخترتها.
- إذا لعبت اللغز الأسبوعي، نحتفظ بالاسم المستعار الذي تختاره وبنتائجك، وتظهر في لوحات الصدارة. ويحفظ متصفحك رقم لاعب عشوائيًا لتعود باللاعب نفسه.
- قبل عرض رابط مجموعتنا على واتساب، يتحقّق Cloudflare Turnstile من أنك لست روبوتًا.
- إذا راسلتنا، نستخدم رسالتك للرد عليك فقط.

أسئلة؟ راسلنا على العنوان الموجود في صفحة «تواصل معنا».'
  WHERE page = 'privacy' AND block = 'body';

-- ---------- Sample events: off the site until real events are added (kept as drafts, not deleted) ----------
UPDATE events SET status = 'draft' WHERE is_placeholder = 1;
