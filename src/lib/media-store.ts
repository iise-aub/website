// Where photo files live. If an R2 bucket is connected (binding "MEDIA"), files go there;
// otherwise they are stored in the database in 40 KB parts (no payment card needed). Switching to R2
// later only needs the binding added in wrangler.jsonc and existing files copied over.
import { env } from 'cloudflare:workers';
import { db } from './db';

export const PART_SIZE = 40 * 1024;
const r2 = () => (env as unknown as { MEDIA?: R2Bucket }).MEDIA;

export async function putFile(key: string, bytes: ArrayBuffer, contentType: string) {
  const bucket = r2();
  if (bucket) { await bucket.put(key, bytes, { httpMetadata: { contentType } }); return; }
  const d = db();
  const parts = [];
  for (let off = 0, part = 0; off < bytes.byteLength; off += PART_SIZE, part++) {
    parts.push(d.prepare('INSERT INTO media_blobs (key, part, data) VALUES (?, ?, ?)').bind(key, part, bytes.slice(off, off + PART_SIZE)));
  }
  await d.batch([d.prepare('DELETE FROM media_blobs WHERE key = ?').bind(key), ...parts]);
}

export async function getFile(key: string): Promise<{ body: ReadableStream | Uint8Array; etag: string } | null> {
  const bucket = r2();
  if (bucket) {
    const o = await bucket.get(key);
    return o ? { body: o.body, etag: o.httpEtag } : null;
  }
  const { results } = await db().prepare('SELECT data FROM media_blobs WHERE key = ? ORDER BY part').bind(key).all<{ data: ArrayBuffer | number[] }>();
  if (!results.length) return null;
  const chunks = results.map((r) => (r.data instanceof ArrayBuffer ? new Uint8Array(r.data) : Uint8Array.from(r.data)));
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0));
  let off = 0;
  for (const c of chunks) { out.set(c, off); off += c.length; }
  return { body: out, etag: `"${key.split('/').pop()}"` };
}
