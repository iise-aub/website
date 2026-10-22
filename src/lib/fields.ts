// IE fields page: data loader and the "Which IE field are you?" quiz.
import { db, loadPage } from './db';

export interface FieldRow {
  id: number; slug: string; title_en: string; title_ar: string; tagline_en: string; tagline_ar: string;
  body_en: string; body_ar: string; tasks_en: string; tasks_ar: string; roles_en: string; roles_ar: string;
  love_if_en: string; love_if_ar: string; fun_fact_en: string; fun_fact_ar: string; photo_key: string | null;
}

export async function loadFieldsPage() {
  const [{ settings, text }, { results }] = await Promise.all([
    loadPage('fields'),
    db().prepare(`SELECT f.*, m.r2_key AS photo_key FROM ie_fields f LEFT JOIN media m ON m.id = f.photo_media_id
      WHERE f.visible = 1 ORDER BY f.sort_order, f.title_en`).all<FieldRow>(),
  ]);
  return { settings, text, fields: results };
}

/** Quiz: each answer gives points to fields (by slug). Fixed in code; the field texts are editable in the panel. */
export const QUIZ: { q: { en: string; ar: string }; a: { en: string; ar: string; pts: string[] }[] }[] = [
  {
    q: { en: 'Pick a perfect Saturday:', ar: 'اختر يوم سبت مثاليًا:' },
    a: [
      { en: 'Planning a road trip for ten friends', ar: 'التخطيط لرحلة لعشرة أصدقاء', pts: ['supply-chain', 'project-management'] },
      { en: 'Fixing something that is annoyingly slow', ar: 'إصلاح شيء بطيء بشكل مزعج', pts: ['manufacturing', 'quality'] },
      { en: 'Digging into your team’s match stats', ar: 'الغوص في إحصاءات مباراة فريقك', pts: ['data', 'finance'] },
      { en: 'Volunteering to help people', ar: 'التطوّع لمساعدة الناس', pts: ['healthcare', 'energy'] },
    ],
  },
  {
    q: { en: 'Which feels most satisfying?', ar: 'أيّها يمنحك أكبر رضا؟' },
    a: [
      { en: 'A spreadsheet that finally balances', ar: 'جدول بيانات يتوازن أخيرًا', pts: ['finance', 'data'] },
      { en: 'A queue that suddenly moves twice as fast', ar: 'طابور يتحرّك فجأة بضعف السرعة', pts: ['healthcare', 'manufacturing'] },
      { en: 'An app that’s finally easy to use', ar: 'تطبيق أصبح أخيرًا سهل الاستخدام', pts: ['human-factors', 'quality'] },
      { en: 'Convincing a room with your plan', ar: 'إقناع الحاضرين بخطّتك', pts: ['consulting', 'project-management'] },
    ],
  },
  {
    q: { en: 'Your dream workplace:', ar: 'مكان عملك المثالي:' },
    a: [
      { en: 'A busy factory floor', ar: 'أرض مصنع مزدحمة', pts: ['manufacturing', 'quality'] },
      { en: 'A city office, meeting new clients', ar: 'مكتب في المدينة ولقاء عملاء جدد', pts: ['consulting', 'finance'] },
      { en: 'A hospital or a public service', ar: 'مستشفى أو خدمة عامة', pts: ['healthcare', 'human-factors'] },
      { en: 'Ports, warehouses, solar farms', ar: 'موانئ ومستودعات ومزارع شمسية', pts: ['supply-chain', 'energy'] },
    ],
  },
  {
    q: { en: 'Pick a superpower:', ar: 'اختر قوة خارقة:' },
    a: [
      { en: 'Seeing patterns in chaos', ar: 'رؤية الأنماط في الفوضى', pts: ['data'] },
      { en: 'Getting everyone to agree', ar: 'جعل الجميع يتّفقون', pts: ['consulting', 'project-management'] },
      { en: 'Spotting waste instantly', ar: 'اكتشاف الهدر فورًا', pts: ['manufacturing', 'energy'] },
      { en: 'Knowing what people really need', ar: 'معرفة ما يحتاجه الناس فعلًا', pts: ['human-factors', 'healthcare'] },
    ],
  },
  {
    q: { en: 'Favourite kind of IE problem?', ar: 'نوع المسائل المفضّل لديك في الهندسة الصناعية؟' },
    a: [
      { en: 'Optimisation: find the best answer', ar: 'التحسين الأمثل: إيجاد أفضل إجابة', pts: ['data', 'supply-chain'] },
      { en: 'Layouts and simulation', ar: 'المخطّطات والمحاكاة', pts: ['manufacturing', 'supply-chain'] },
      { en: 'Statistics and quality control', ar: 'الإحصاء وضبط الجودة', pts: ['quality', 'finance'] },
      { en: 'Engineering economy and projects', ar: 'الاقتصاد الهندسي والمشاريع', pts: ['project-management', 'finance', 'energy'] },
    ],
  },
];
