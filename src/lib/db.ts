// Reading content from the database (Cloudflare D1).
import { env } from 'cloudflare:workers';

export const db = () => env.DB;

export type Row = Record<string, unknown>;

export interface PageText {
  [block: string]: { text_en: string; text_ar: string; needs_content: number };
}

export interface Milestone {
  kind: 'milestone' | 'event';
  id: number;
  title_en: string;
  title_ar: string;
  text_en: string;
  text_ar: string;
  year: number;
  month: number | null;
  day: number | null;
  category: 'ie_world' | 'aub' | 'chapter' | 'award';
  is_placeholder: number;
  photo_key: string | null;
  href?: string;
}

export interface EventRow {
  id: number;
  slug: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  starts_at: string;
  ends_at: string;
  location_en: string;
  location_ar: string;
  is_placeholder: number;
  cover_key: string | null;
}

const settingsSql = (d: D1Database) => d.prepare('SELECT key, value FROM settings');
const pageTextSql = (d: D1Database, page: string) =>
  d.prepare('SELECT block, text_en, text_ar, needs_content FROM page_text WHERE page = ?').bind(page);

export function toSettings(rows: Row[]): Record<string, string> {
  return Object.fromEntries(rows.map((r) => [String(r.key), String(r.value ?? '')]));
}

export function toPageText(rows: Row[]): PageText {
  return Object.fromEntries(rows.map((r) => [String(r.block), r as PageText[string]]));
}

const nextEventSql = (d: D1Database, nowIso: string) =>
  d.prepare(
    `SELECT e.*, m.r2_key AS cover_key FROM events e
     LEFT JOIN media m ON m.id = e.cover_media_id
     WHERE e.status = 'published' AND e.ends_at > ?
     ORDER BY e.starts_at ASC LIMIT 1`,
  ).bind(nowIso);

// Stations: visible milestones, plus published past events flagged "show on history map".
const journeySql = (d: D1Database, nowIso: string) =>
  d.prepare(
    `SELECT * FROM (
     SELECT 'milestone' AS kind, ms.id, ms.title_en, ms.title_ar, ms.text_en, ms.text_ar,
            ms.year, ms.month, ms.day, ms.category, ms.is_placeholder, ms.sort_order,
            (SELECT m.r2_key FROM milestone_photos mp JOIN media m ON m.id = mp.media_id
              WHERE mp.milestone_id = ms.id ORDER BY mp.sort_order LIMIT 1) AS photo_key,
            NULL AS slug
       FROM milestones ms WHERE ms.visible = 1
     UNION ALL
     SELECT 'event', e.id, e.title_en, e.title_ar, e.summary_en, e.summary_ar,
            CAST(strftime('%Y', e.starts_at) AS INTEGER), CAST(strftime('%m', e.starts_at) AS INTEGER),
            CAST(strftime('%d', e.starts_at) AS INTEGER), 'chapter', e.is_placeholder, 0,
            (SELECT m.r2_key FROM media m WHERE m.id = e.cover_media_id), e.slug
       FROM events e
      WHERE e.status = 'published' AND e.show_on_history_map = 1 AND e.starts_at <= ?
     ) ORDER BY year, COALESCE(month, 0), COALESCE(day, 0), sort_order`,
  ).bind(nowIso);

export async function loadHome(lang: string) {
  const d = db();
  const now = new Date().toISOString();
  const [settings, text, next, journey] = await d.batch([
    settingsSql(d),
    pageTextSql(d, 'home'),
    nextEventSql(d, now),
    journeySql(d, now),
  ]);
  return {
    settings: toSettings(settings.results as Row[]),
    text: toPageText(text.results as Row[]),
    nextEvent: (next.results[0] as unknown as EventRow) ?? null,
    stations: (journey.results as Row[]).map((r) => ({
      ...(r as unknown as Milestone),
      href: r.slug ? `/${lang}/events/${r.slug}` : undefined,
    })),
  };
}

/** Settings only (header, footer and pages that need nothing else). */
export async function loadSettings() {
  const { results } = await settingsSql(db()).all();
  return toSettings(results as Row[]);
}

/** Settings plus one page's editable text, in one round trip. */
export async function loadPage(page: string) {
  const d = db();
  const [settings, text] = await d.batch([settingsSql(d), pageTextSql(d, page)]);
  return { settings: toSettings(settings.results as Row[]), text: toPageText(text.results as Row[]) };
}

export interface PersonCard {
  id: number; name_en: string; name_ar: string; bio_en: string; bio_ar: string;
  position_en: string; position_ar: string; photo_key: string | null;
  linkedin_url: string; linkedin_opt_in: number; team_id: number | null; is_placeholder: number;
}
export interface TeamCard {
  id: number; slug: string; name_en: string; name_ar: string; description_en: string; description_ar: string;
  how_to_join_en: string; how_to_join_ar: string; is_placeholder: number; leads: PersonCard[];
}

/** Team page: current cabinet (no end date, or ending today or later) and visible teams with their leads. */
export async function loadTeamPage() {
  const d = db();
  const today = new Date().toISOString().slice(0, 10);
  const peopleSql = (role: string) => d.prepare(
    `SELECT p.id, p.name_en, p.name_ar, p.bio_en, p.bio_ar, p.linkedin_url, p.linkedin_opt_in, p.is_placeholder,
            r.position_en, r.position_ar, r.team_id, m.r2_key AS photo_key
       FROM person_roles r JOIN people p ON p.id = r.person_id LEFT JOIN media m ON m.id = p.photo_media_id
      WHERE r.role = ? AND (r.end_date IS NULL OR r.end_date = '' OR r.end_date >= ?)
      ORDER BY r.sort_order, p.name_en`).bind(role, today);
  const [settings, text, cabinet, members, teams] = await d.batch([
    settingsSql(d), pageTextSql(d, 'team'), peopleSql('cabinet'), peopleSql('member'),
    d.prepare('SELECT * FROM teams WHERE visible = 1 ORDER BY sort_order, name_en'),
  ]);
  const leads = members.results as unknown as PersonCard[];
  return {
    settings: toSettings(settings.results as Row[]),
    text: toPageText(text.results as Row[]),
    cabinet: cabinet.results as unknown as PersonCard[],
    teams: (teams.results as unknown as TeamCard[]).map((tm) => ({ ...tm, leads: leads.filter((l) => l.team_id === tm.id) })),
  };
}

const upcomingSql = (d: D1Database, nowIso: string, limit = 50) =>
  d.prepare(`SELECT e.*, m.r2_key AS cover_key FROM events e LEFT JOIN media m ON m.id = e.cover_media_id
    WHERE e.status = 'published' AND e.ends_at > ? ORDER BY e.starts_at ASC LIMIT ?`).bind(nowIso, limit);

/** Events page: upcoming (soonest first) and past (most recent first). */
export async function loadEventsPage() {
  const d = db();
  const now = new Date().toISOString();
  const [settings, text, upcoming, past] = await d.batch([
    settingsSql(d), pageTextSql(d, 'events'), upcomingSql(d, now),
    d.prepare(`SELECT e.*, m.r2_key AS cover_key FROM events e LEFT JOIN media m ON m.id = e.cover_media_id
      WHERE e.status = 'published' AND e.ends_at <= ? ORDER BY e.starts_at DESC LIMIT 24`).bind(now),
  ]);
  return {
    settings: toSettings(settings.results as Row[]), text: toPageText(text.results as Row[]),
    upcoming: upcoming.results as unknown as EventRow[], past: past.results as unknown as EventRow[],
  };
}

export type EventFull = EventRow & { body_en: string; body_ar: string; registration_url: string; cover_alt_en: string | null; cover_alt_ar: string | null };

/** One published event by its web address. */
export async function loadEvent(slug: string) {
  const d = db();
  const [settings, ev] = await d.batch([
    settingsSql(d),
    d.prepare(`SELECT e.*, m.r2_key AS cover_key, m.alt_en AS cover_alt_en, m.alt_ar AS cover_alt_ar FROM events e
      LEFT JOIN media m ON m.id = e.cover_media_id WHERE e.slug = ? AND e.status = 'published'`).bind(slug),
  ]);
  return { settings: toSettings(settings.results as Row[]), event: (ev.results[0] as unknown as EventFull) ?? null };
}

/** Members page: its text plus the next three events. */
export async function loadMembersPage() {
  const d = db();
  const [settings, text, upcoming] = await d.batch([settingsSql(d), pageTextSql(d, 'members'), upcomingSql(d, new Date().toISOString(), 3)]);
  return { settings: toSettings(settings.results as Row[]), text: toPageText(text.results as Row[]), upcoming: upcoming.results as unknown as EventRow[] };
}
