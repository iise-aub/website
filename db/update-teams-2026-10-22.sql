-- Teams as given by Saad (Oct 22, 2026). Descriptions: Claude drafts, except IISE & Beyond and Technical Development, which Saad described.
UPDATE teams SET slug = 'pr-and-outreach', name_en = 'PR & Outreach', name_ar = 'العلاقات العامة والتواصل', sort_order = 1, is_placeholder = 0,
  description_en = 'Builds the chapter''s relationships with companies, alumni and other clubs, and brings new students to our events.',
  description_ar = 'يبني علاقات الفرع مع الشركات والخرّيجين والأندية الأخرى، ويستقطب طلابًا جددًا إلى فعالياتنا.'
  WHERE slug = 'pr';
UPDATE teams SET slug = 'social-media', name_en = 'Social Media', name_ar = 'وسائل التواصل الاجتماعي', sort_order = 2, is_placeholder = 0,
  description_en = 'Runs our Instagram and TikTok: the photos, reels and announcements that show what IISE AUB is about.',
  description_ar = 'يدير حساباتنا على إنستغرام وتيك توك: الصور والمقاطع والإعلانات التي تُظهر ما يقدّمه IISE AUB.'
  WHERE slug = 'media';
UPDATE teams SET slug = 'events', name_en = 'Events', name_ar = 'الفعاليات', sort_order = 3, is_placeholder = 0,
  description_en = 'Plans and runs our events from start to finish: venues, speakers, logistics and the day itself.',
  description_ar = 'يخطّط لفعالياتنا وينفّذها من البداية إلى النهاية: الأماكن والمتحدّثون والتنظيم ويوم الفعالية نفسه.'
  WHERE slug = 'social';
UPDATE teams SET name_en = 'IISE & Beyond', name_ar = 'IISE & Beyond', sort_order = 4, is_placeholder = 0,
  description_en = 'Writes and publishes IISE & Beyond, our newsletter: chapter news, event recaps and stories from the world of industrial engineering.',
  description_ar = 'يكتب وينشر IISE & Beyond، النشرة الإخبارية للفرع: أخبار الفرع وملخّصات الفعاليات وقصص من عالم الهندسة الصناعية.'
  WHERE slug = 'iise-and-beyond';
UPDATE teams SET slug = 'technical-development', name_en = 'Technical Development', name_ar = 'التطوير التقني', sort_order = 5, is_placeholder = 0,
  description_en = 'Develops and maintains this website, and designs the chapter''s presentations.',
  description_ar = 'يطوّر هذا الموقع ويتولّى صيانته، ويصمّم العروض التقديمية للفرع.'
  WHERE slug = 'technical';
UPDATE teams SET name_en = 'Coffee with IISE', name_ar = 'Coffee with IISE', sort_order = 6, is_placeholder = 0,
  description_en = 'Produces our podcast: conversations with engineers, alumni and students about where industrial engineering can take you.',
  description_ar = 'يُنتج البودكاست الخاص بنا: حوارات مع مهندسين وخرّيجين وطلاب حول آفاق الهندسة الصناعية.'
  WHERE slug = 'coffee-with-iise';
