// Makes the images for the society's Moodle page (tiles course format): a banner for the top section and one
// picture per section tile, in the site's colours with the IISE logo and the globe lines from the website.
// Usage: node scripts/make-moodle-assets.mjs   → writes PNGs to moodle/
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';

const OUT = 'moodle';
mkdirSync(OUT, { recursive: true });
// Static weights (the canvas library ignores the weight axis of the variable font the site uses).
for (const w of [500, 600, 700]) GlobalFonts.registerFromPath(`node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-${w}-normal.woff2`, `Source Sans 3 ${w}`);
const font = (weight, px) => `${px}px "Source Sans 3 ${weight}", "Segoe UI", Arial, sans-serif`;
const C = { navy950: '#0f2147', navy900: '#142c58', navy800: '#1a3668', slate500: '#4c6589', steel400: '#68809c', steel300: '#a4b3c6', steel200: '#cdd6e2', white: '#ffffff' };

/** The globe from the IISE logo, as thin lines (meridians, parallels and an orbit with two beads). */
function globe(ctx, cx, cy, r, alpha) {
  ctx.save();
  ctx.strokeStyle = `rgba(205, 214, 226, ${alpha})`;
  ctx.lineWidth = Math.max(2, r / 120);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
  for (const k of [0.25, 0.55, 0.85]) { ctx.beginPath(); ctx.ellipse(cx, cy, r * k, r, 0, 0, Math.PI * 2); ctx.stroke(); }
  for (const y of [-0.66, -0.33, 0, 0.33, 0.66]) {
    const half = Math.sqrt(1 - y * y) * r;
    ctx.beginPath(); ctx.moveTo(cx - half, cy + y * r); ctx.lineTo(cx + half, cy + y * r); ctx.stroke();
  }
  ctx.strokeStyle = `rgba(164, 179, 198, ${alpha * 1.6})`;
  ctx.beginPath(); ctx.ellipse(cx, cy, r * 1.35, r * 0.42, -0.3, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 3)})`;
  for (const t of [0.6, 3.6]) {
    const x = r * 1.35 * Math.cos(t), y = r * 0.42 * Math.sin(t);
    ctx.beginPath(); ctx.arc(cx + x * Math.cos(-0.3) - y * Math.sin(-0.3), cy + x * Math.sin(-0.3) + y * Math.cos(-0.3), r / 28, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

function background(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, C.navy950); g.addColorStop(0.55, C.navy900); g.addColorStop(1, C.navy800);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  const glow = ctx.createRadialGradient(w * 0.82, h * 0.35, 0, w * 0.82, h * 0.35, w * 0.5);
  glow.addColorStop(0, 'rgba(76, 101, 137, 0.45)'); glow.addColorStop(1, 'rgba(76, 101, 137, 0)');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);
}

// ---------- Line icons (drawn in a 120 × 120 box) ----------
const icons = {
  info(ctx) { ctx.beginPath(); ctx.arc(60, 60, 52, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(60, 52); ctx.lineTo(60, 88); ctx.stroke(); ctx.beginPath(); ctx.arc(60, 34, 4, 0, Math.PI * 2); ctx.fill(); },
  join(ctx) {
    ctx.beginPath(); ctx.arc(46, 38, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(10, 104); ctx.quadraticCurveTo(12, 66, 46, 66); ctx.quadraticCurveTo(80, 66, 82, 104); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(100, 34); ctx.lineTo(100, 70); ctx.moveTo(82, 52); ctx.lineTo(118, 52); ctx.stroke();
  },
  events(ctx) {
    ctx.beginPath(); ctx.roundRect(8, 20, 104, 90, 12); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(8, 46); ctx.lineTo(112, 46); ctx.moveTo(36, 8); ctx.lineTo(36, 30); ctx.moveTo(84, 8); ctx.lineTo(84, 30); ctx.stroke();
    for (const [x, y] of [[34, 66], [60, 66], [86, 66], [34, 90], [60, 90]]) { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill(); }
  },
  puzzle(ctx) {
    const filled = new Set([0, 5, 7]);
    for (let i = 0; i < 9; i++) {
      const x = 6 + (i % 3) * 42, y = 6 + Math.floor(i / 3) * 42;
      ctx.beginPath(); ctx.roundRect(x, y, 28, 28, 6);
      if (filled.has(i)) ctx.fill(); else ctx.stroke();
    }
  },
  explore(ctx) {
    ctx.beginPath(); ctx.arc(60, 60, 52, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(84, 36); ctx.lineTo(68, 68); ctx.lineTo(36, 84); ctx.lineTo(52, 52); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(84, 36); ctx.lineTo(68, 68); ctx.lineTo(52, 52); ctx.closePath(); ctx.fill();
  },
  alumni(ctx) {
    ctx.beginPath(); ctx.moveTo(60, 14); ctx.lineTo(116, 40); ctx.lineTo(60, 66); ctx.lineTo(4, 40); ctx.closePath(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(26, 52); ctx.lineTo(26, 82); ctx.quadraticCurveTo(60, 104, 94, 82); ctx.lineTo(94, 52); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(116, 40); ctx.lineTo(116, 76); ctx.stroke();
  },
};

function drawIcon(ctx, name, x, y, size, color) {
  ctx.save();
  ctx.translate(x, y); ctx.scale(size / 120, size / 120);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  icons[name](ctx);
  ctx.restore();
}

// ---------- Banner (top section) ----------
async function banner() {
  const W = 2400, H = 560;
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  background(ctx, W, H);
  globe(ctx, 1980, 300, 285, 0.22);
  const logo = await loadImage(readFileSync('public/brand/iise-logo-white.png'));
  const lh = 118, lw = (logo.width / logo.height) * lh;
  ctx.drawImage(logo, 130, 92, lw, lh);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(130 + lw + 34, 100, 3, lh - 16);
  ctx.fillStyle = C.white; ctx.font = font(700, 46); ctx.textBaseline = 'alphabetic';
  ctx.fillText('AUB', 130 + lw + 66, 150);
  ctx.fillStyle = C.steel300; ctx.font = font(600, 34);
  ctx.fillText('Student Chapter', 130 + lw + 66, 194);
  ctx.fillStyle = C.white; ctx.font = font(700, 62);
  ctx.fillText('Engineers make things.', 130, 318);
  ctx.fillText('Industrial engineers make things better.', 130, 392);
  ctx.fillStyle = C.steel200; ctx.font = font(500, 34);
  ctx.fillText('Events  ·  Workshops  ·  Industry talks  ·  Weekly puzzle', 130, 456);
  ctx.fillStyle = C.steel300; ctx.fillRect(130, 488, 140, 8);
  writeFileSync(`${OUT}/banner.png`, c.toBuffer('image/png'));
}

// ---------- Section tiles ----------
const tiles = [
  ['1-about', 'info', 'About us'],
  ['2-join', 'join', 'Join IISE AUB'],
  ['3-events', 'events', 'Events'],
  ['4-puzzle', 'puzzle', 'Weekly puzzle'],
  ['5-explore', 'explore', 'Explore IE'],
  ['6-alumni', 'alumni', 'Alumni & companies'],
];
function tile(file, icon, title) {
  const W = 900, H = 600;
  const c = createCanvas(W, H), ctx = c.getContext('2d');
  background(ctx, W, H);
  globe(ctx, 760, 470, 300, 0.16);
  drawIcon(ctx, icon, 76, 120, 118, C.white);
  ctx.fillStyle = C.white; ctx.font = font(700, title.length > 14 ? 66 : 76); ctx.textBaseline = 'alphabetic';
  ctx.fillText(title, 76, 400);
  ctx.fillStyle = C.steel300; ctx.fillRect(78, 440, 110, 9);
  writeFileSync(`${OUT}/tile-${file}.png`, c.toBuffer('image/png'));
}

await banner();
for (const [file, icon, title] of tiles) tile(file, icon, title);
console.log(`Wrote ${OUT}/banner.png and ${tiles.length} tiles.`);
