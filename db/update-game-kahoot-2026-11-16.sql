-- Weekly puzzle: every second counts (Saad, Nov 16 2026). The rules say so without the exact numbers (Saad).
UPDATE page_text SET updated_by = 'Claude (from Saad)',
  text_en = '- Tap 3 empty squares to place your warehouses. Tap a warehouse to pick it up again.
- Each house is served by its nearest warehouse. Trucks drive square by square, cross the river only on a bridge, and cannot go through buildings.
- The number on a house is how many deliveries it needs: its distance counts that many times.
- Your total distance updates as you play. Layout points: 1000 for the best possible layout, less the further you are from it.
- You''re being timed: every second you take lowers your score, so be quick.
- Ties go to whoever finished faster. One scored try per week.',
  text_ar = '- اضغط على 3 مربّعات فارغة لوضع مستودعاتك. اضغط على مستودع لرفعه مرة أخرى.
- يخدم كل منزلٍ أقربُ مستودع إليه. تسير الشاحنات مربّعًا تلو الآخر، ولا تعبر النهر إلا على جسر، ولا تمرّ عبر المباني.
- الرقم على المنزل هو عدد طلبات التوصيل التي يحتاجها: تُحتسب مسافته بعدد هذه الطلبات.
- تتحدّث مسافتك الإجمالية أثناء اللعب. نقاط التوزيع: 1000 لأفضل توزيع ممكن، وأقل كلما ابتعدت عنه.
- الوقت يُحتسب: كل ثانية تأخذها تُنقص نتيجتك، فكن سريعًا.
- عند التعادل يفوز الأسرع. محاولة واحدة محتسبة كل أسبوع.'
  WHERE page = 'game' AND block = 'rules';
