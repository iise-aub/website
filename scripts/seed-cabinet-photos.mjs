// Loads the cabinet 2026-27 portraits (db/media/cabinet-2026) into photo storage and links them to people.
// Usage:  node scripts/seed-cabinet-photos.mjs --local     (this computer)
//         node scripts/seed-cabinet-photos.mjs --remote    (the live site)
//         add --r2 to put the files in an R2 bucket instead of the database (only if R2 is connected).
// Safe to run more than once: it reuses the same storage keys (manifest.json) and replaces the files and links.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const where = process.argv.includes('--remote') ? '--remote' : '--local';
const useR2 = process.argv.includes('--r2');
const dir = 'db/media/cabinet-2026';
const PART_SIZE = 40 * 1024; // must match src/lib/media-store.ts
const people = {
  'shayene-kamel': 'Shayene Kamel', 'maria-moarbes': 'Maria Moarbes', 'maria-hajjar': 'Maria Hajjar',
  'saad-majbour': 'Saad Majbour', 'georges-ghanem': 'Georges Ghanem', 'gabriela-rizkallah': 'Gabriela Rizkallah',
  'clara-samaha': 'Clara Samaha', 'lynn-cortas': 'Lynn Cortas', 'clara-espiro': 'Clara Espiro',
};

const manifestPath = `${dir}/manifest.json`;
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
for (const slug of Object.keys(people)) manifest[slug] ??= `uploads/2026/${randomUUID()}`;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const wrangler = (...args) => execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler', ...args], { stdio: 'pipe', shell: process.platform === 'win32' });
const esc = (s) => s.replace(/'/g, "''");
const sql = [];
for (const [slug, name] of Object.entries(people)) {
  const key = manifest[slug];
  for (const w of [480, 960]) {
    const file = `${dir}/${slug}-${w}.webp`;
    const fileKey = `${key}-${w}.webp`;
    if (useR2) {
      wrangler('r2', 'object', 'put', `iise-aub-media/${fileKey}`, `--file=${file}`, '--content-type=image/webp', where);
    } else {
      const bytes = readFileSync(file);
      sql.push(`DELETE FROM media_blobs WHERE key = '${fileKey}';`);
      for (let off = 0, part = 0; off < bytes.length; off += PART_SIZE, part++) {
        sql.push(`INSERT INTO media_blobs (key, part, data) VALUES ('${fileKey}', ${part}, X'${bytes.subarray(off, off + PART_SIZE).toString('hex')}');`);
      }
    }
  }
  sql.push(`INSERT OR IGNORE INTO media (r2_key, widths, width, height, alt_en, alt_ar, created_by) VALUES ('${key}', '[480,960]', 960, 960, 'Portrait of ${esc(name)}', '', 'seed-cabinet-photos');`);
  sql.push(`UPDATE people SET photo_media_id = (SELECT id FROM media WHERE r2_key = '${key}') WHERE name_en = '${esc(name)}';`);
  console.log(`✓ ${name}`);
}
const out = `${dir}/load.sql`;
writeFileSync(out, sql.join('\n') + '\n');
wrangler('d1', 'execute', 'iise-aub-db', where, `--file=${out}`, '--yes');
console.log(`Done (${where.slice(2)}, files in ${useR2 ? 'R2' : 'the database'}).`);
