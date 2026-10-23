-- Join page: the real registration steps on AUB's system, as described by Saad (Oct 23 2026).
-- AUB's system is in English, so the Arabic steps keep the English button and term names as they appear on screen.
UPDATE page_text SET needs_content = 0, updated_by = 'Claude (from Saad)',
  text_en = 'Press "Go to AUB registration" below and sign in with your AUB account.
Click "Register for Classes".
In the "Select a Term" dropdown, choose "Clubs Scholastic Year".
Enter our CRN (shown on this page) and click "Submit".',
  text_ar = 'اضغط «انتقل إلى التسجيل في الجامعة» في الأسفل وسجّل الدخول بحساب الجامعة.
اضغط على «Register for Classes».
من القائمة المنسدلة «Select a Term»، اختر «Clubs Scholastic Year».
أدخل رقم CRN الخاص بنا (الظاهر في هذه الصفحة) واضغط «Submit».'
  WHERE page = 'join' AND block = 'steps';
