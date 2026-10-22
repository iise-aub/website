// Alumni stories: fixed lists for industries and countries, and the page loader.
import { db, loadPage } from './db';
import type { Lang } from './i18n';
import { locale } from './i18n';

export const INDUSTRIES: Record<string, { en: string; ar: string }> = {
  consulting: { en: 'Consulting', ar: 'الاستشارات' },
  'supply-chain': { en: 'Supply chain & logistics', ar: 'سلاسل الإمداد والخدمات اللوجستية' },
  manufacturing: { en: 'Manufacturing & operations', ar: 'التصنيع والعمليات' },
  tech: { en: 'Tech & data', ar: 'التكنولوجيا والبيانات' },
  finance: { en: 'Finance & banking', ar: 'المال والمصارف' },
  healthcare: { en: 'Healthcare', ar: 'الرعاية الصحية' },
  energy: { en: 'Energy', ar: 'الطاقة' },
  retail: { en: 'Retail & consumer goods', ar: 'التجزئة والسلع الاستهلاكية' },
  public: { en: 'Government & non-profit', ar: 'القطاع العام والمنظمات غير الربحية' },
  research: { en: 'Academia & research', ar: 'الأكاديميا والبحث' },
  startup: { en: 'Entrepreneurship', ar: 'ريادة الأعمال' },
  other: { en: 'Other', ar: 'أخرى' },
};

// Countries where AUB graduates commonly work; shown by name in the visitor's language.
export const COUNTRIES = ['LB', 'AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'JO', 'EG', 'IQ', 'CY', 'TR', 'FR', 'DE', 'GB', 'NL', 'BE', 'CH', 'IT', 'ES', 'SE', 'IE', 'US', 'CA', 'AU'];

export const countryName = (code: string, lang: Lang) => {
  try { return new Intl.DisplayNames([locale(lang)], { type: 'region' }).of(code) ?? code; } catch { return code; }
};

export interface AlumnusCard {
  id: number; name_en: string; name_ar: string; grad_year: number | null; photo_key: string | null;
  linkedin_url: string; linkedin_opt_in: number;
  job_title_en: string; job_title_ar: string; company: string; industry: string; country: string; story_en: string; story_ar: string;
}

/** Alumni page: text plus published stories (visible, with consent recorded). */
export async function loadAlumniPage() {
  const [{ settings, text }, { results }] = await Promise.all([
    loadPage('alumni'),
    db().prepare(`SELECT a.id, p.name_en, p.name_ar, p.grad_year, p.linkedin_url, p.linkedin_opt_in, m.r2_key AS photo_key,
        a.job_title_en, a.job_title_ar, a.company, a.industry, a.country, a.story_en, a.story_ar
      FROM alumni_stories a JOIN people p ON p.id = a.person_id LEFT JOIN media m ON m.id = p.photo_media_id
      WHERE a.visible = 1 AND a.consent_on IS NOT NULL AND a.consent_on <> ''
      ORDER BY a.sort_order, p.grad_year DESC, p.name_en`).all<AlumnusCard>(),
  ]);
  return { settings, text, alumni: results };
}
