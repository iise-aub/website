-- 2026-10-22 (Saad): "Where can IE take you?" page. One row per field of industrial engineering.
-- Lists (things you'd do, example roles) use one item per line.
CREATE TABLE ie_fields (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  slug           TEXT NOT NULL UNIQUE,          -- also the quiz key and illustration name
  title_en       TEXT NOT NULL DEFAULT '',  title_ar       TEXT NOT NULL DEFAULT '',
  tagline_en     TEXT NOT NULL DEFAULT '',  tagline_ar     TEXT NOT NULL DEFAULT '',
  body_en        TEXT NOT NULL DEFAULT '',  body_ar        TEXT NOT NULL DEFAULT '',
  tasks_en       TEXT NOT NULL DEFAULT '',  tasks_ar       TEXT NOT NULL DEFAULT '',
  roles_en       TEXT NOT NULL DEFAULT '',  roles_ar       TEXT NOT NULL DEFAULT '',
  love_if_en     TEXT NOT NULL DEFAULT '',  love_if_ar     TEXT NOT NULL DEFAULT '',
  fun_fact_en    TEXT NOT NULL DEFAULT '',  fun_fact_ar    TEXT NOT NULL DEFAULT '',
  photo_media_id INTEGER REFERENCES media(id) ON DELETE SET NULL,   -- optional; replaces the illustration
  sort_order     INTEGER NOT NULL DEFAULT 0,
  visible        INTEGER NOT NULL DEFAULT 1,
  updated_at     TEXT, updated_by TEXT
);

INSERT INTO ie_fields (slug, sort_order, title_en, title_ar, tagline_en, tagline_ar, body_en, body_ar, tasks_en, tasks_ar, roles_en, roles_ar, love_if_en, love_if_ar, fun_fact_en, fun_fact_ar) VALUES
('supply-chain', 1, 'Supply Chain & Logistics', 'سلاسل الإمداد والخدمات اللوجستية',
 'Getting the right thing to the right place, right on time.', 'إيصال الشيء الصحيح إلى المكان الصحيح في الوقت الصحيح.',
 'Everything you buy has travelled through a chain of suppliers, factories, warehouses and trucks. Supply chain engineers design that chain so it is fast, cheap and doesn''t break when something goes wrong.',
 'كل ما تشتريه مرّ عبر سلسلة من المورّدين والمصانع والمستودعات والشاحنات. يصمّم مهندسو سلاسل الإمداد هذه السلسلة لتكون سريعة وقليلة الكلفة وصامدة عندما يحدث خلل.',
 'Decide where warehouses should go and what they should stock
Plan routes for delivery fleets
Forecast demand so shelves are never empty (or overflowing)',
 'تحديد مواقع المستودعات وما يجب أن تخزّنه
تخطيط مسارات أساطيل التوصيل
التنبّؤ بالطلب كي لا تفرغ الرفوف (ولا تفيض)',
 'Supply Chain Analyst
Logistics Planner
Demand Planner
Procurement Specialist',
 'محلّل سلاسل إمداد
مخطّط لوجستي
مخطّط طلب
أخصائي مشتريات',
 'You love planning trips, packing a suitcase perfectly, or finding the fastest way home.',
 'تحب تخطيط الرحلات، وترتيب الحقيبة بإتقان، وإيجاد أسرع طريق إلى المنزل.',
 'Our weekly puzzle, Depot Drop, is a real supply chain problem: choosing where to put warehouses.',
 'لغزنا الأسبوعي «مواقع المستودعات» مسألة حقيقية في سلاسل الإمداد: اختيار أماكن المستودعات.'),

('manufacturing', 2, 'Manufacturing & Production', 'التصنيع والإنتاج',
 'Making things, better, faster and with less waste.', 'صناعة الأشياء بشكل أفضل وأسرع وبهدر أقل.',
 'Factories are giant systems of machines, people and materials. Industrial engineers design production lines, balance the work between stations and remove everything that doesn''t add value.',
 'المصانع أنظمة ضخمة من الآلات والأشخاص والمواد. يصمّم المهندسون الصناعيون خطوط الإنتاج، ويوزّعون العمل بين المحطات بتوازن، ويزيلون كل ما لا يضيف قيمة.',
 'Design the layout of a production line
Balance tasks so no station is a bottleneck
Lead "lean" improvements on the factory floor',
 'تصميم مخطّط خط الإنتاج
توزيع المهام بحيث لا تصبح أي محطة عنق زجاجة
قيادة تحسينات «الإنتاج الرشيق» في أرض المصنع',
 'Process Engineer
Production Planner
Lean / Continuous Improvement Engineer
Plant Operations Engineer',
 'مهندس عمليات
مخطّط إنتاج
مهندس تحسين مستمر
مهندس عمليات مصنع',
 'You can''t watch a slow line at a coffee shop without redesigning it in your head.',
 'لا تستطيع مشاهدة طابور بطيء في مقهى من دون أن تعيد تصميمه في رأسك.',
 'Henry Ford''s moving assembly line, in 1913, is one of the most famous industrial engineering ideas ever.',
 'خط التجميع المتحرك لهنري فورد عام 1913 من أشهر أفكار الهندسة الصناعية على الإطلاق.'),

('quality', 3, 'Quality & Process Improvement', 'الجودة وتحسين العمليات',
 'Hunting down mistakes before customers ever see them.', 'ملاحقة الأخطاء قبل أن يراها العملاء.',
 'Quality engineers use statistics to find out why things go wrong and fix the cause, not just the symptom. Methods like Six Sigma are used in factories, banks, airlines and hospitals.',
 'يستخدم مهندسو الجودة الإحصاء لمعرفة سبب حدوث الأخطاء ومعالجة السبب لا العَرَض فقط. وتُستخدم أساليب مثل «سيغما ستة» في المصانع والمصارف وشركات الطيران والمستشفيات.',
 'Measure processes and spot when they drift
Run root-cause investigations
Design checks that stop defects early',
 'قياس العمليات واكتشاف انحرافها
إجراء تحقيقات في الأسباب الجذرية
تصميم فحوص توقف العيوب مبكرًا',
 'Quality Engineer
Six Sigma Specialist
Process Excellence Analyst
Quality Assurance Lead',
 'مهندس جودة
أخصائي سيغما ستة
محلّل تميّز العمليات
قائد ضمان الجودة',
 'You notice typos instantly and enjoy figuring out why something keeps breaking.',
 'تلاحظ الأخطاء المطبعية فورًا، وتستمتع بمعرفة سبب تعطّل شيء ما مرارًا.',
 '"Six Sigma" quality means about 3.4 defects per million chances.',
 'جودة «سيغما ستة» تعني نحو 3.4 عيوب لكل مليون فرصة.'),

('data', 4, 'Data Analytics & Operations Research', 'تحليل البيانات وبحوث العمليات',
 'Turning numbers into the best possible decision.', 'تحويل الأرقام إلى أفضل قرار ممكن.',
 'Operations research uses maths, optimisation and simulation to find the best answer among millions of options. Add data analytics and you can predict what will happen and decide what to do about it.',
 'تستخدم بحوث العمليات الرياضيات والتحسين الأمثل والمحاكاة لإيجاد أفضل إجابة بين ملايين الخيارات. ومع تحليل البيانات يمكنك توقّع ما سيحدث وتقرير ما يجب فعله.',
 'Build optimisation models for scheduling, pricing or routing
Simulate a system before spending money on it
Create dashboards that help managers decide',
 'بناء نماذج تحسين للجدولة أو التسعير أو التوجيه
محاكاة نظام قبل إنفاق المال عليه
إنشاء لوحات معلومات تساعد المديرين على القرار',
 'Data Analyst
Operations Research Analyst
Business Intelligence Analyst
Data Scientist',
 'محلّل بيانات
محلّل بحوث عمليات
محلّل ذكاء أعمال
عالم بيانات',
 'You like puzzles, spreadsheets, or arguing about stats with friends.',
 'تحب الألغاز والجداول الإلكترونية والنقاش في الإحصاءات مع أصدقائك.',
 'Airlines use operations research to decide which crew flies which plane, a problem with more combinations than there are stars to count.',
 'تستخدم شركات الطيران بحوث العمليات لتحديد أي طاقم يقود أي طائرة، وهي مسألة تضم تراكيب أكثر مما يمكن عدّه.'),

('healthcare', 5, 'Healthcare Systems', 'أنظمة الرعاية الصحية',
 'Shorter waits, safer care, happier patients.', 'انتظار أقصر ورعاية أكثر أمانًا ومرضى أكثر رضا.',
 'Hospitals are some of the most complex systems there are. Industrial engineers improve patient flow, staff schedules and supplies so doctors and nurses can spend more time on care.',
 'المستشفيات من أعقد الأنظمة الموجودة. يحسّن المهندسون الصناعيون تدفّق المرضى وجداول العاملين والإمدادات ليتفرّغ الأطباء والممرّضون أكثر للرعاية.',
 'Cut waiting times in emergency rooms and clinics
Schedule operating rooms and staff
Make medication and supply processes safer',
 'تقليص أوقات الانتظار في الطوارئ والعيادات
جدولة غرف العمليات والعاملين
جعل عمليات الأدوية والإمدادات أكثر أمانًا',
 'Healthcare Systems Engineer
Hospital Operations Analyst
Patient Flow Coordinator
Health Data Analyst',
 'مهندس أنظمة رعاية صحية
محلّل عمليات مستشفى
منسّق تدفّق المرضى
محلّل بيانات صحية',
 'You want your engineering to help people directly.',
 'تريد أن تساعد الناس مباشرة من خلال الهندسة.',
 'Small changes like a better triage order can save hours of waiting every day in a busy hospital.',
 'تغييرات بسيطة مثل ترتيب أفضل لفرز الحالات قد توفّر ساعات من الانتظار يوميًا في مستشفى مزدحم.'),

('consulting', 6, 'Consulting', 'الاستشارات',
 'Solving a different company''s biggest problem every few months.', 'حلّ أكبر مشكلة لشركة مختلفة كل بضعة أشهر.',
 'Consultants help organisations fix problems and grow. Industrial engineers do well here because they are trained to see the whole system, use data and explain clear recommendations.',
 'يساعد المستشارون المؤسسات على حلّ مشكلاتها والنمو. ويتميّز المهندسون الصناعيون في هذا المجال لأنهم مدرَّبون على رؤية النظام كاملًا واستخدام البيانات وتقديم توصيات واضحة.',
 'Analyse how a company works and where it loses money
Build models and present recommendations to leaders
Help put the changes into practice',
 'تحليل طريقة عمل الشركة وأين تخسر المال
بناء النماذج وعرض التوصيات على القيادات
المساعدة في تطبيق التغييرات',
 'Business Analyst
Operations Consultant
Strategy Associate
Management Consultant',
 'محلّل أعمال
مستشار عمليات
مساعد استراتيجية
مستشار إداري',
 'You enjoy variety, teamwork and convincing a room with a good slide.',
 'تحب التنوّع والعمل الجماعي وإقناع الحاضرين بشريحة عرض جيدة.',
 'Many consulting firms hire engineers because structured problem-solving matters more than any single industry.',
 'توظّف شركات استشارية كثيرة مهندسين لأن حلّ المشكلات المنظّم أهم من الخبرة في قطاع واحد.'),

('human-factors', 7, 'Human Factors & Ergonomics', 'العوامل البشرية وبيئة العمل',
 'Designing work, tools and products around real people.', 'تصميم العمل والأدوات والمنتجات حول الإنسان الحقيقي.',
 'Human factors engineers make sure systems fit the people using them: comfortable workstations, controls that are hard to misuse, and screens that make sense. It is engineering for humans.',
 'يحرص مهندسو العوامل البشرية على أن تناسب الأنظمة مستخدميها: محطات عمل مريحة، وأدوات تحكّم يصعب إساءة استخدامها، وشاشات مفهومة. إنها هندسة من أجل الإنسان.',
 'Redesign workstations to prevent injuries
Test how easy a product or app is to use
Study fatigue and safety in demanding jobs',
 'إعادة تصميم محطات العمل لمنع الإصابات
اختبار سهولة استخدام منتج أو تطبيق
دراسة الإرهاق والسلامة في الأعمال الشاقة',
 'Ergonomist
Human Factors Engineer
UX Researcher
Health & Safety Engineer',
 'أخصائي بيئة عمل
مهندس عوامل بشرية
باحث تجربة مستخدم
مهندس صحة وسلامة',
 'You get annoyed by badly designed doors, apps or chairs, and you know how to fix them.',
 'تنزعج من الأبواب والتطبيقات والكراسي سيئة التصميم، وتعرف كيف تصلحها.',
 'Aircraft cockpits were among the first places human factors engineering made a big difference to safety.',
 'كانت قمرات قيادة الطائرات من أوائل الأماكن التي أحدثت فيها هندسة العوامل البشرية فرقًا كبيرًا في السلامة.'),

('project-management', 8, 'Project & Engineering Management', 'إدارة المشاريع والهندسة',
 'Keeping big, complicated projects on time and on budget.', 'إبقاء المشاريع الكبيرة والمعقّدة ضمن الوقت والميزانية.',
 'Building a plant, launching a product or moving a whole company to new software takes hundreds of tasks and people. Project managers plan, track and steer all of it.',
 'بناء مصنع أو إطلاق منتج أو نقل شركة كاملة إلى نظام جديد يتطلّب مئات المهام والأشخاص. يخطّط مديرو المشاريع لكل ذلك ويتابعونه ويوجّهونه.',
 'Break a project into tasks and schedule them
Track costs, risks and progress
Keep teams and stakeholders aligned',
 'تقسيم المشروع إلى مهام وجدولتها
متابعة التكاليف والمخاطر والتقدّم
إبقاء الفرق وأصحاب المصلحة على توافق',
 'Project Engineer
Project Manager
Program Coordinator
Engineering Manager',
 'مهندس مشاريع
مدير مشاريع
منسّق برامج
مدير هندسي',
 'You are the friend who organises the group project, and everyone is glad you did.',
 'أنت الصديق الذي ينظّم مشروع المجموعة، والجميع سعيد بذلك.',
 'The Gantt chart, still used in almost every project today, was popularised by an industrial engineer, Henry Gantt, over a century ago.',
 'مخطّط غانت، المستخدم اليوم في كل مشروع تقريبًا، نشره المهندس الصناعي هنري غانت قبل أكثر من قرن.'),

('finance', 9, 'Finance & Banking', 'المال والمصارف',
 'Engineering decisions where the numbers are money.', 'قرارات هندسية حيث الأرقام أموال.',
 'Banks and investment firms value the same skills: modelling, statistics and risk. Industrial engineers work on pricing, risk analysis and making financial operations run smoothly.',
 'تقدّر المصارف وشركات الاستثمار المهارات نفسها: النمذجة والإحصاء والمخاطر. يعمل المهندسون الصناعيون في التسعير وتحليل المخاطر وتحسين سير العمليات المالية.',
 'Model risk and returns
Analyse costs and investments (engineering economy in real life)
Improve banking operations and processes',
 'نمذجة المخاطر والعوائد
تحليل التكاليف والاستثمارات (الاقتصاد الهندسي في الواقع)
تحسين عمليات المصارف وإجراءاتها',
 'Risk Analyst
Financial Analyst
Operations Analyst (banking)
Investment Analyst',
 'محلّل مخاطر
محلّل مالي
محلّل عمليات (مصرفية)
محلّل استثمار',
 'Engineering economy was secretly your favourite course.',
 'كان الاقتصاد الهندسي مادتك المفضّلة سرًّا.',
 'The ideas behind comparing investments, like the time value of money, are the same ones you learn in engineering economy.',
 'الأفكار وراء مقارنة الاستثمارات، مثل القيمة الزمنية للمال، هي نفسها التي تتعلّمها في الاقتصاد الهندسي.'),

('energy', 10, 'Energy & Sustainability', 'الطاقة والاستدامة',
 'Doing more with less, for the planet.', 'إنجاز المزيد بموارد أقل من أجل الكوكب.',
 'Every system uses energy and materials. Industrial engineers reduce waste, plan cleaner energy and design circular systems where today''s waste becomes tomorrow''s input.',
 'كل نظام يستهلك الطاقة والمواد. يقلّل المهندسون الصناعيون الهدر، ويخطّطون لطاقة أنظف، ويصمّمون أنظمة دائرية تصبح فيها نفايات اليوم مدخلات الغد.',
 'Run energy audits and cut consumption
Plan solar and other renewable projects
Measure and reduce a company''s carbon footprint',
 'إجراء تدقيق للطاقة وخفض الاستهلاك
التخطيط لمشاريع الطاقة الشمسية والمتجدّدة
قياس البصمة الكربونية للشركة وخفضها',
 'Energy Analyst
Sustainability Analyst
Energy Efficiency Engineer
ESG Consultant',
 'محلّل طاقة
محلّل استدامة
مهندس كفاءة طاقة
مستشار ممارسات بيئية واجتماعية',
 'You want your work to leave the world a bit better than you found it.',
 'تريد أن يترك عملك العالم أفضل قليلًا مما وجدته.',
 'The cheapest energy is the energy you never use, which is why efficiency projects often pay for themselves.',
 'أرخص طاقة هي التي لا تستهلكها أبدًا، ولذلك كثيرًا ما تغطي مشاريع الكفاءة تكلفتها بنفسها.');

INSERT INTO page_text (page, block, label, kind, text_en, text_ar, needs_content, sort_order) VALUES
('fields', 'eyebrow', 'Small label above the title', 'text', 'Careers in IE', 'المسارات المهنية', 0, 1),
('fields', 'title', 'Page title', 'text', 'Where can IE take you?', 'إلى أين تأخذك الهندسة الصناعية؟', 0, 2),
('fields', 'intro', 'Text under the title', 'long', 'Industrial engineers make systems work better, and almost everything is a system. Here are ten places the degree can take you.', 'يجعل المهندسون الصناعيون الأنظمة تعمل بشكل أفضل، وكل شيء تقريبًا نظام. إليك عشرة مجالات قد تأخذك إليها هذه الشهادة.', 0, 3),
('fields', 'quiz_title', 'Quiz: title', 'text', 'Which IE field are you?', 'أي مجال في الهندسة الصناعية يناسبك؟', 0, 4),
('fields', 'quiz_intro', 'Quiz: intro', 'text', 'Five quick questions, about a minute. Just for fun.', 'خمسة أسئلة سريعة، دقيقة واحدة تقريبًا. للتسلية فقط.', 0, 5),
('fields', 'outro', 'Bottom of the page', 'long', 'Not sure yet? That is normal. Come to our events and talk to students and alumni who chose each path.', 'لست متأكدًا بعد؟ هذا طبيعي. تعال إلى فعالياتنا وتحدّث مع طلاب وخرّيجين اختاروا كل مسار.', 0, 6);
