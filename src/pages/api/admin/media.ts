// Photo upload for the editing panel (signed-in editors only; see middleware).
// Receives WebP files already resized in the browser and stores them in R2 as <key>-<width>.webp.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { db } from '../../../lib/db';
import { logChange } from '../../../lib/admin';

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_WIDTHS = new Set([480, 960, 1600]);
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export const POST: APIRoute = async ({ request, locals }) => {
  const form = await request.formData();
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  let widths: number[];
  try { widths = JSON.parse(String(form.get('widths'))); } catch { return json({ error: 'Missing sizes' }, 400); }
  const width = Number(form.get('width')), height = Number(form.get('height'));

  if (files.length < 2 || files.length !== widths.length || files.length > 3 || !widths.includes(480) || !widths.includes(960)) return json({ error: 'Unexpected files' }, 400);
  for (const [i, f] of files.entries()) {
    if (f.type !== 'image/webp') return json({ error: 'Only prepared WebP images are accepted' }, 400);
    if (f.size > MAX_BYTES) return json({ error: 'Photo too large' }, 400);
    if (!ALLOWED_WIDTHS.has(widths[i])) return json({ error: 'Unexpected size' }, 400);
  }

  const d = new Date();
  const key = `uploads/${d.getUTCFullYear()}/${crypto.randomUUID()}`;
  await Promise.all(files.map((f, i) =>
    env.MEDIA.put(`${key}-${widths[i]}.webp`, f.stream(), { httpMetadata: { contentType: 'image/webp' } })));

  const row = await db().prepare('INSERT INTO media (r2_key, widths, width, height, created_by) VALUES (?, ?, ?, ?, ?) RETURNING id')
    .bind(key, JSON.stringify(widths), width || 0, height || 0, locals.user!.email).first<{ id: number }>();
  await logChange(locals.user!.email, 'media', row!.id, 'create', 'Uploaded a photo').run();
  return json({ id: row!.id, key });
};
