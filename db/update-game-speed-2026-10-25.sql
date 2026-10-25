-- Weekly puzzle: speed counts from week 44 (Monday Oct 26 2026), so there's no time to solve it with AI (Saad, Oct 25 2026).
UPDATE page_text SET updated_by = 'Claude (from Saad)',
  text_en = '- Tap 3 empty squares to place your warehouses. Tap a warehouse to pick it up again.
- Each house is served by its nearest warehouse. Trucks drive square by square, cross the river only on a bridge, and cannot go through buildings.
- The number on a house is how many deliveries it needs: its distance counts that many times.
- Your total distance updates as you play. Layout points: 1000 for the best possible layout, less the further you are from it.
- Be quick: you keep full points for the first 45 seconds, then your score shrinks the longer you take (×0.75 at 2 minutes, ×0.55 at 3 minutes, never below ×0.25).
- The clock starts when you press Start. Ties go to whoever finished faster. One scored try per week.',
  text_ar = '- اضغط على 3 مربّعات فارغة لوضع مستودعاتك. اضغط على مستودع لرفعه مرة أخرى.
- يخدم كل منزلٍ أقربُ مستودع إليه. تسير الشاحنات مربّعًا تلو الآخر، ولا تعبر النهر إلا على جسر، ولا تمرّ عبر المباني.
- الرقم على المنزل هو عدد طلبات التوصيل التي يحتاجها: تُحتسب مسافته بعدد هذه الطلبات.
- تتحدّث مسافتك الإجمالية أثناء اللعب. نقاط التوزيع: 1000 لأفضل توزيع ممكن، وأقل كلما ابتعدت عنه.
- كن سريعًا: تحتفظ بالنقاط كاملة خلال أول 45 ثانية، ثم تنخفض نتيجتك كلما تأخّرت (تبقى لك 75% بعد دقيقتين، و55% بعد 3 دقائق، ولا تقلّ عن 25%).
- يبدأ الوقت عند الضغط على «ابدأ». عند التعادل يفوز الأسرع. محاولة واحدة محتسبة كل أسبوع.'
  WHERE page = 'game' AND block = 'rules';
