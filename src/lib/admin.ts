// Small helpers shared by the editing panel pages.
import { db } from './db';

/** Read a trimmed text field from a submitted form. */
export const field = (form: FormData, name: string) => String(form.get(name) ?? '').trim();
export const checked = (form: FormData, name: string) => form.get(name) === 'on' ? 1 : 0;
export const now = () => new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');

/** Record who changed what (shown on the panel overview). */
export function logChange(email: string, entity: string, id: string | number, action: 'create' | 'update' | 'delete', summary = '') {
  return db().prepare('INSERT INTO change_log (user_email, entity, entity_id, action, summary) VALUES (?, ?, ?, ?, ?)')
    .bind(email, entity, String(id), action, summary.slice(0, 200));
}

/** "Career Fair 2026!" → "career-fair-2026", unique within a table. */
export async function uniqueSlug(table: 'events' | 'teams', text: string, exceptId?: number) {
  const base = text.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60) || 'item';
  let slug = base;
  for (let n = 2; ; n++) {
    const hit = await db().prepare(`SELECT id FROM ${table} WHERE slug = ? AND id IS NOT ?`).bind(slug, exceptId ?? null).first();
    if (!hit) return slug;
    slug = `${base}-${n}`;
  }
}

/** Accept only http(s) links (or an empty value). */
export function isUrlOrEmpty(value: string) {
  if (!value) return true;
  try { const u = new URL(value); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
}

/** Save the alt text of a photo and return its id (or null when the form says "no photo"). */
export async function savePhotoFromForm(form: FormData, name: string): Promise<number | null> {
  if (form.get(`${name}_remove`) === 'on') return null;
  const id = Number(form.get(name)) || null;
  if (id) {
    await db().prepare('UPDATE media SET alt_en = ?, alt_ar = ? WHERE id = ?')
      .bind(field(form, `${name}_alt_en`), field(form, `${name}_alt_ar`), id).run();
  }
  return id;
}

export interface Media { id: number; r2_key: string; widths: string; alt_en: string; alt_ar: string }
export async function getMedia(id: number | null | undefined): Promise<Media | null> {
  if (!id) return null;
  return db().prepare('SELECT id, r2_key, widths, alt_en, alt_ar FROM media WHERE id = ?').bind(id).first<Media>();
}
