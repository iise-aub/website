-- Companies page: why work with us and what we offer (Saad, Oct 25 2026: social media exposure,
-- brand recognition among students, engagement with the brand, and AUB's size).
-- Sources:
--   AUB Facts and Figures, https://www.aub.edu.lb/aboutus/Pages/facts.aspx (checked Oct 25 2026):
--     "9,759 students (8,300 full-time, 1,459 part-time)", "as of October 15, 2025", "90 countries",
--     "more than 82,000 alumni live in more than 135 countries".
--   AUB IISE chapter page, https://www.aub.edu.lb/msfea/iem/Pages/iise-aub.aspx (monthly events, workshops, talks).
-- Update the student figure when AUB publishes a new one.
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad)',
  text_en = 'AUB is one of the region''s leading universities: 9,759 students from 90 countries (AUB, October 2025), and more than 82,000 alumni in over 135 countries.

- Meet AUB''s industrial engineering students: future engineers, analysts, consultants and managers.
- Reach them where they are: our events, our social media and our newsletter.
- Work with a chapter of the Institute of Industrial and Systems Engineers (IISE), the worldwide professional society for industrial engineers.',
  text_ar = 'الجامعة الأمريكية في بيروت من الجامعات الرائدة في المنطقة: 9,759 طالبًا من 90 بلدًا (الجامعة، تشرين الأول 2025)، وأكثر من 82,000 خرّيج في أكثر من 135 بلدًا.

- تعرّفوا إلى طلاب الهندسة الصناعية في الجامعة: مهندسو المستقبل ومحلّلوه ومستشاروه ومديروه.
- صِلوا إليهم حيث هم: في فعالياتنا، وعلى وسائل التواصل الاجتماعي، وفي نشرتنا الإخبارية.
- تعاونوا مع فرع لمعهد مهندسي الصناعة والأنظمة (IISE)، الجمعية المهنية العالمية للمهندسين الصناعيين.'
  WHERE page = 'companies' AND block = 'why_body';

UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad)',
  text_en = '- Social media exposure: your brand featured on our Instagram and TikTok, and in IISE & Beyond, our newsletter.
- Brand recognition among students: your name and logo at our events, talks and workshops.
- Engagement with your brand: meet students in person by hosting a talk, a workshop or an information session.

Every partnership is shaped around what you need. Email us and we''ll put together a proposal.',
  text_ar = '- الظهور على وسائل التواصل الاجتماعي: علامتكم التجارية على حساباتنا في إنستغرام وتيك توك، وفي نشرتنا الإخبارية IISE & Beyond.
- انتشار علامتكم بين الطلاب: اسمكم وشعاركم في فعالياتنا ولقاءاتنا وورش عملنا.
- تفاعل مباشر مع علامتكم: التقوا الطلاب وجهًا لوجه عبر تقديم محاضرة أو ورشة عمل أو جلسة تعريفية.

نصمّم كل شراكة وفق احتياجاتكم. راسلونا وسنعدّ لكم عرضًا.'
  WHERE page = 'companies' AND block = 'offer_body';
