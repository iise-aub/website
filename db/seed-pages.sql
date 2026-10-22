-- Text for the inner pages. Drafts by Claude; general wording only.
-- needs_content = 1 marks chapter-specific facts the team must write or confirm (shown as "Placeholder").
-- In long texts: a blank line starts a new paragraph; lines starting with "- " become a bulleted list.

INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
-- ---------- Events ----------
('events', 'eyebrow', 'Small label above the title', 'text', 'Events', 'الفعاليات', 0, 1),
('events', 'title', 'Page title', 'text', 'What''s coming up', 'ما الذي ينتظرنا', 0, 2),
('events', 'intro', 'Text under the title', 'long', 'Talks, workshops, competitions and socials. Add any event to your calendar in one tap.', 'محاضرات وورش عمل ومسابقات ولقاءات اجتماعية. أضف أي فعالية إلى تقويمك بنقرة واحدة.', 0, 3),
('events', 'empty', 'Shown when nothing is scheduled', 'text', 'No events scheduled right now. Follow us to hear about the next one first.', 'لا توجد فعاليات مجدولة حاليًا. تابعونا لتكونوا أول من يعلم بالفعالية القادمة.', 0, 4),
('events', 'past_title', 'Past events: title', 'text', 'Past events', 'فعاليات سابقة', 0, 5),

-- ---------- Members ----------
('members', 'eyebrow', 'Small label above the title', 'text', 'Current members', 'الأعضاء الحاليون', 0, 1),
('members', 'title', 'Page title', 'text', 'Everything members need, in one place', 'كل ما يحتاجه الأعضاء في مكان واحد', 0, 2),
('members', 'intro', 'Text under the title', 'long', 'What''s coming up, how to get more involved, and where to find the community.', 'ما الذي ينتظرنا، وكيف تشارك أكثر، وأين تجد مجتمعنا.', 0, 3),
('members', 'events_title', 'Upcoming events: title', 'text', 'Coming up', 'قريبًا', 0, 4),
('members', 'team_title', 'Join a team: title', 'text', 'Join a team', 'انضمّ إلى فريق', 0, 5),
('members', 'team_text', 'Join a team: text', 'long', 'Want to do more than attend? Join one of our teams and help run the chapter.', 'تريد أن تفعل أكثر من الحضور؟ انضمّ إلى أحد فرقنا وساهم في إدارة الفرع.', 0, 6),
('members', 'whatsapp_title', 'WhatsApp: title', 'text', 'The WhatsApp community', 'مجتمعنا على واتساب', 0, 7),
('members', 'whatsapp_text', 'WhatsApp: text', 'long', 'Announcements and reminders go to our WhatsApp community. An admin approves every new member.', 'نرسل الإعلانات والتذكيرات عبر مجتمعنا على واتساب. يوافق أحد المشرفين على كل عضو جديد.', 0, 8),
('members', 'podcast_title', 'Podcast: title', 'text', 'Coffee with IISE', 'Coffee with IISE', 0, 9),
('members', 'podcast_text', 'Podcast: text', 'long', 'Our podcast. (One or two sentences about what the episodes are about, to be written by the team.)', 'البودكاست الخاص بنا. (جملة أو جملتان عن محتوى الحلقات، يكتبها الفريق.)', 1, 10),

-- ---------- Contact ----------
('contact', 'eyebrow', 'Small label above the title', 'text', 'Contact', 'تواصل معنا', 0, 1),
('contact', 'title', 'Page title', 'text', 'Get in touch', 'تواصل معنا', 0, 2),
('contact', 'intro', 'Text under the title', 'long', 'The fastest way to reach us is a message on Instagram or an email.', 'أسرع طريقة للتواصل معنا هي رسالة على إنستغرام أو بريد إلكتروني.', 0, 3),
('contact', 'partners_text', 'Note for companies', 'text', 'Representing a company? See how we can work together.', 'تمثّل شركة؟ اطّلع على طرق التعاون معنا.', 0, 4),

-- ---------- Companies (contact page for companies; the sponsor list was removed by Saad, Oct 22 2026) ----------
('companies', 'eyebrow', 'Small label above the title', 'text', 'Companies', 'الشركات', 0, 1),
('companies', 'title', 'Page title', 'text', 'Work with IISE AUB', 'اعمل مع IISE AUB', 0, 2),
('companies', 'intro', 'Text under the title', 'long', 'Meet AUB''s industrial engineering students: future engineers, analysts and consultants.', 'تعرّف إلى طلاب الهندسة الصناعية في الجامعة الأمريكية في بيروت: مهندسو المستقبل ومحلّلوه ومستشاروه.', 0, 3),
('companies', 'why_title', 'Why work with us: title', 'text', 'Why work with us', 'لماذا تعمل معنا', 0, 4),
('companies', 'why_body', 'Why work with us: text (use "- " for a list)', 'long', '- (Reason 1, to be written by the cabinet)
- (Reason 2)
- (Reason 3)', '- (السبب الأول، يكتبه الفريق)
- (السبب الثاني)
- (السبب الثالث)', 1, 5),
('companies', 'offer_title', 'What we offer: title', 'text', 'What we offer', 'ماذا نقدّم', 0, 6),
('companies', 'offer_body', 'What we offer: text (use "- " for a list)', 'long', '- (Offer 1, e.g. event sponsorship; to be confirmed by the cabinet)
- (Offer 2)
- (Offer 3)', '- (العرض الأول؛ بانتظار تأكيد الفريق)
- (العرض الثاني)
- (العرض الثالث)', 1, 7),
('companies', 'contact_title', 'Contact: title', 'text', 'Let''s talk', 'لنتحدّث', 0, 11),
('companies', 'contact_text', 'Contact: text', 'long', 'Email us and the cabinet will get back to you.', 'راسلنا عبر البريد الإلكتروني وستتواصل معك الهيئة الإدارية.', 0, 12),

-- ---------- About ----------
('about', 'eyebrow', 'Small label above the title', 'text', 'About', 'من نحن', 0, 1),
('about', 'title', 'Page title', 'text', 'About IISE AUB', 'عن IISE AUB', 0, 2),
('about', 'intro', 'Text under the title', 'long', 'The student chapter of the Institute of Industrial and Systems Engineers at the American University of Beirut.', 'الفرع الطلابي لمعهد مهندسي الصناعة والأنظمة في الجامعة الأمريكية في بيروت.', 0, 3),
('about', 'mission_title', 'Mission: title', 'text', 'Our mission', 'رسالتنا', 0, 4),
('about', 'mission_body', 'Mission: text', 'long', '(The chapter''s mission statement, to be provided by the cabinet.)', '(رسالة الفرع، تزوّدنا بها الهيئة الإدارية.)', 1, 5),
('about', 'what_title', 'What we do: title', 'text', 'What we do', 'ماذا نفعل', 0, 6),
('about', 'what_body', 'What we do: text (use "- " for a list)', 'long', '- (Activity 1, to be written by the cabinet)
- (Activity 2)
- (Activity 3)', '- (النشاط الأول، تكتبه الهيئة الإدارية)
- (النشاط الثاني)
- (النشاط الثالث)', 1, 7),
('about', 'iise_title', 'About IISE: title', 'text', 'Part of IISE', 'جزء من IISE', 0, 8),
('about', 'iise_body', 'About IISE: text', 'long', 'IISE is the international professional society for industrial and systems engineers. Its student chapters connect students with the profession, with each other and with industry.', 'معهد مهندسي الصناعة والأنظمة (IISE) هو الجمعية المهنية الدولية لمهندسي الصناعة والأنظمة. تربط فروعه الطلابية الطلاب بالمهنة وببعضهم وبقطاع الأعمال.', 0, 9),

-- ---------- Why join ----------
('why-join', 'eyebrow', 'Small label above the title', 'text', 'Why join', 'لماذا تنضمّ', 0, 1),
('why-join', 'title', 'Page title', 'text', 'Why join IISE AUB', 'لماذا تنضمّ إلى IISE AUB', 0, 2),
('why-join', 'intro', 'Text under the title', 'long', 'Meet people who think like you, learn what the classroom doesn''t teach, and get closer to industry.', 'تعرّف إلى من يشاركونك طريقة التفكير، وتعلّم ما لا تعلّمه القاعات، واقترب من قطاع الأعمال.', 0, 3),
('why-join', 'benefits_title', 'Member benefits: title', 'text', 'What members get', 'ما يحصل عليه الأعضاء', 0, 4),
('why-join', 'benefits_body', 'Member benefits (use "- " for a list)', 'long', '- (Benefit 1, to be written by the cabinet)
- (Benefit 2)
- (Benefit 3)', '- (الميزة الأولى، تكتبها الهيئة الإدارية)
- (الميزة الثانية)
- (الميزة الثالثة)', 1, 5),
('why-join', 'register_title', 'Join the club: title', 'text', 'Join the club at AUB', 'انضمّ إلى النادي في الجامعة', 0, 6),
('why-join', 'register_text', 'Join the club: text', 'long', 'Register for the club on AUB''s system, using our CRN. It takes a few minutes.', 'سجّل في النادي عبر نظام الجامعة باستخدام رقم CRN الخاص بنا. يستغرق الأمر دقائق.', 0, 7),
('why-join', 'iise_title', 'IISE membership: title', 'text', 'Become an IISE member too', 'كن عضوًا في IISE أيضًا', 0, 8),
('why-join', 'iise_text', 'IISE membership: text', 'long', 'IISE membership is separate from the AUB club and is handled by IISE itself. The current fees and steps are on IISE''s website.', 'العضوية في IISE منفصلة عن نادي الجامعة ويتولّاها المعهد نفسه. تجد الرسوم والخطوات الحالية على موقع IISE.', 0, 9),

-- ---------- New to IE ----------
('new-to-ie', 'eyebrow', 'Small label above the title', 'text', 'New to IE?', 'جديد على الهندسة الصناعية؟', 0, 1),
('new-to-ie', 'title', 'Page title', 'text', 'What is industrial engineering?', 'ما هي الهندسة الصناعية؟', 0, 2),
('new-to-ie', 'intro', 'Text under the title', 'long', 'Industrial engineers design and improve the systems that make things work: factories, hospitals, supply chains, airports and services.', 'يصمّم المهندسون الصناعيون الأنظمة التي تجعل الأشياء تعمل ويحسّنونها: المصانع والمستشفيات وسلاسل الإمداد والمطارات والخدمات.', 0, 3),
('new-to-ie', 'what_title', 'Section 1: title', 'text', 'Making things better', 'نجعل الأشياء أفضل', 0, 4),
('new-to-ie', 'what_body', 'Section 1: text', 'long', 'Where other engineers design a product, industrial engineers design the system around it: the people, processes, machines, information and money that make it work.

They use data, modelling and optimisation to make systems faster, cheaper, safer and better for the people in them.', 'حيث يصمّم مهندسون آخرون المنتج، يصمّم المهندس الصناعي النظام المحيط به: الأشخاص والعمليات والآلات والمعلومات والموارد المالية التي تجعله يعمل.

ويستخدم البيانات والنمذجة والتحسين الأمثل ليجعل الأنظمة أسرع وأقل كلفة وأكثر أمانًا وأفضل للعاملين فيها.', 0, 5),
('new-to-ie', 'fields_title', 'Where IE leads: title', 'text', 'Where IE can take you', 'إلى أين تأخذك الهندسة الصناعية', 0, 6),
('new-to-ie', 'fields_body', 'Where IE leads (use "- " for a list)', 'long', '- Operations and supply chain
- Data analytics and operations research
- Quality and process improvement
- Healthcare systems
- Consulting
- Human factors and ergonomics', '- العمليات وسلاسل الإمداد
- تحليل البيانات وبحوث العمليات
- الجودة وتحسين العمليات
- أنظمة الرعاية الصحية
- الاستشارات
- العوامل البشرية وبيئة العمل', 0, 7),
('new-to-ie', 'aub_title', 'IE at AUB: title', 'text', 'Industrial engineering at AUB', 'الهندسة الصناعية في الجامعة الأمريكية في بيروت', 0, 8),
('new-to-ie', 'aub_body', 'IE at AUB: text', 'long', '(The IE path at AUB: the major, what students study and where graduates go. To be written by the team from AUB''s official pages.)', '(مسار الهندسة الصناعية في الجامعة: التخصص وما يدرسه الطلاب وأين يعمل الخرّيجون. يكتبه الفريق استنادًا إلى صفحات الجامعة الرسمية.)', 1, 9),
('new-to-ie', 'join_title', 'Call to action: title', 'text', 'Curious? Come and see', 'فضولي؟ تعال وتعرّف إلينا', 0, 10),
('new-to-ie', 'join_text', 'Call to action: text', 'long', 'Our events are open to everyone. Joining the club takes a few minutes.', 'فعالياتنا مفتوحة للجميع، والانضمام إلى النادي يستغرق دقائق.', 0, 11),

-- ---------- History (full page) ----------
('history', 'eyebrow', 'Small label above the title', 'text', 'Story · Milestones', 'القصة · المحطات', 0, 1),
('history', 'title', 'Page title', 'text', 'Our journey', 'رحلتنا', 0, 2),
('history', 'intro', 'Text under the title', 'long', 'From the founding of IISE to today. Follow the road: every station is a moment that shaped the chapter.', 'من تأسيس المعهد حتى اليوم. اتبع الطريق: كل محطة لحظةٌ صنعت مسيرة فرعنا.', 0, 3),

-- ---------- Privacy ----------
('privacy', 'title', 'Page title', 'text', 'Privacy', 'الخصوصية', 0, 1),
('privacy', 'body', 'Privacy note (use "- " for a list)', 'long', 'We keep this simple.

- This site has no advertising and no tracking cookies.
- We count visits with Cloudflare Web Analytics, which does not use cookies or identify you.
- One small cookie remembers your language choice.
- Before showing our WhatsApp link, a Cloudflare Turnstile check confirms you are not a robot.
- If you email us, we use your message only to reply.

Questions? Email us at the address on our Contact page.', 'نحرص على البساطة.

- لا يحتوي هذا الموقع على إعلانات ولا على ملفات تعريف ارتباط للتتبّع.
- نحصي الزيارات باستخدام Cloudflare Web Analytics الذي لا يستخدم ملفات تعريف الارتباط ولا يحدّد هويتك.
- يحفظ ملف تعريف ارتباط صغير واحد اختيارك للغة.
- قبل عرض رابط واتساب، يتحقّق Cloudflare Turnstile من أنك لست روبوتًا.
- إذا راسلتنا عبر البريد الإلكتروني، نستخدم رسالتك للرد عليك فقط.

لديك سؤال؟ راسلنا على العنوان الموجود في صفحة التواصل.', 1, 2);
