-- Coffee with IISE: a podcast with people working in the field (Saad, Oct 25 2026).
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad)',
  text_en = 'Our podcast: conversations with people working in industrial engineering, about what they do and how they got there.',
  text_ar = 'البودكاست الخاص بنا: حوارات مع أشخاص يعملون في مجال الهندسة الصناعية، عن طبيعة عملهم وكيف وصلوا إلى ما هم عليه.'
  WHERE page = 'members' AND block = 'podcast_text';

UPDATE teams SET
  description_en = 'Produces our podcast: conversations with people working in industrial engineering, about what they do and how they got there.',
  description_ar = 'يُنتج البودكاست الخاص بنا: حوارات مع أشخاص يعملون في مجال الهندسة الصناعية، عن طبيعة عملهم وكيف وصلوا إلى ما هم عليه.'
  WHERE slug = 'coffee-with-iise';
