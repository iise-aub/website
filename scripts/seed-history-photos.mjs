// Loads the history station photos (db/media/history-2026) into photo storage and links them to stations.
// Photos come from the chapter's Instagram posts (via the history research, Oct 2026), made 4:3 without cropping;
// the 1948 AIIE seal photo was sent by Saad (Oct 25 2026).
// Usage:  node scripts/seed-history-photos.mjs --local     (this computer)
//         node scripts/seed-history-photos.mjs --remote    (the live site)
//         add --r2 to put the files in an R2 bucket instead of the database (only if R2 is connected).
// Run after db/update-history-2026-10-25.sql. Safe to run more than once (same storage keys, links replaced).
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';

const where = process.argv.includes('--remote') ? '--remote' : '--local';
const useR2 = process.argv.includes('--r2');
const dir = 'db/media/history-2026';
const PART_SIZE = 40 * 1024; // must match src/lib/media-store.ts
// photo slug → [station title (English), alt text EN, alt text AR]
const stations = {
  'iise-1948': ['IISE is founded', 'The original seal of the American Institute of Industrial Engineers, “Founded 1948”', 'الختم الأصلي للمعهد الأمريكي للمهندسين الصناعيين، «تأسّس عام 1948»'],
  'aub-ie-2014': ['AUB introduces industrial engineering', 'The Maroun Semaan Faculty of Engineering and Architecture building at AUB', 'مبنى كلية مارون سمعان للهندسة والعمارة في الجامعة الأمريكية في بيروت'],
  'first-event': ['It all starts on Hostler Roof', 'Poster for The Gathering, the Industrial Engineering Society’s first event, on Hostler Roof', 'ملصق The Gathering، أولى فعاليات جمعية الهندسة الصناعية'],
  'field-trip': ['Our first field trip', 'Members in front of the Kassatly Chtaura factory in the Bekaa', 'الأعضاء أمام مصنع قساطلي شتورا في البقاع'],
  'first-graduates': ["AUB's first IE graduates", 'AUB’s first class of industrial engineers in front of the Bechtel Engineering Building', 'أول دفعة من مهندسي الصناعة أمام مبنى بكتل للهندسة'],
  'beirut': ['Standing with Beirut', 'Poster for Cleaning Day 3 of the Beirut Emergency Response', 'ملصق يوم التنظيف الثالث ضمن الاستجابة الطارئة لبيروت'],
  'mena': ['IISE Chapters in MENA', 'The three guest speakers of IISE Chapters in MENA', 'المتحدثون الثلاثة في فعالية فروع IISE في المنطقة'],
  'coffee': ['Coffee with IISE begins', 'Coffee with IISE title card', 'شعار Coffee with IISE'],
  'pfizer': ['A supply chain competition with Pfizer', 'Poster for Talent of the Future, the supply chain competition with Pfizer', 'ملصق مسابقة Talent of the Future مع Pfizer'],
  'ten-years': ['Ten years of IISE AUB', 'Students with the 10th anniversary canvas mural', 'طلاب أمام جدارية الذكرى العاشرة'],
  'society-of-the-year': ['Society of the Year', 'Chapter members holding the Society of the Year certificates', 'أعضاء الفرع يحملون شهادتَي جمعية العام'],
};

const manifestPath = `${dir}/manifest.json`;
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
for (const slug of Object.keys(stations)) manifest[slug] ??= `uploads/2026/${randomUUID()}`;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const wrangler = (...args) => execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler', ...args], { stdio: 'pipe', shell: process.platform === 'win32' });
const esc = (s) => s.replace(/'/g, "''");
const sql = [];
for (const [slug, [title, altEn, altAr]] of Object.entries(stations)) {
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
  sql.push(`INSERT OR IGNORE INTO media (r2_key, widths, width, height, alt_en, alt_ar, created_by) VALUES ('${key}', '[480,960]', 960, 720, '${esc(altEn)}', '${esc(altAr)}', 'seed-history-photos');`);
  sql.push(`DELETE FROM milestone_photos WHERE milestone_id IN (SELECT id FROM milestones WHERE title_en = '${esc(title)}');`);
  sql.push(`INSERT INTO milestone_photos (milestone_id, media_id, sort_order) SELECT ms.id, m.id, 0 FROM milestones ms, media m WHERE ms.title_en = '${esc(title)}' AND m.r2_key = '${key}';`);
  console.log(`✓ ${title}`);
}
const out = `${dir}/load.sql`;
writeFileSync(out, sql.join('\n') + '\n');
wrangler('d1', 'execute', 'iise-aub-db', where, `--file=${out}`, '--yes');
console.log(`Done (${where.slice(2)}, files in ${useR2 ? 'R2' : 'the database'}).`);
