// Weekly IE puzzle engine.
// - A "week" starts Monday 00:00 Beirut time, e.g. "2026-W44".
// - Each week's puzzle is generated from a secret seed, so it is the same for everyone and can't be predicted.
// - The best possible answer is computed exactly on the server; scores are checked on the server too.
// - Time is measured by the server between "start" and "submit" (signed token), so it can't be faked.
import { env } from 'cloudflare:workers';
import { beirutLocalToUtc } from './time';

export const PUZZLE_TYPE = 'coffee-run';

// ---------- Weeks (Beirut time) ----------

function beirutYmd(at: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Beirut', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(at);
  const n = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return { y: n('year'), m: n('month'), d: n('day') };
}

/** ISO week id ("2026-W44") for the Beirut calendar date of `at`. */
export function weekId(at = new Date()): string {
  const { y, m, d } = beirutYmd(at);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day); // Thursday of this week decides the year
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

/** Monday 00:00 Beirut of the week containing `at`, as a UTC instant; and the next Monday. */
export function weekBounds(at = new Date()) {
  const { y, m, d } = beirutYmd(at);
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - (day - 1));
  const startLocal = date.toISOString().slice(0, 10);
  date.setUTCDate(date.getUTCDate() + 7);
  const endLocal = date.toISOString().slice(0, 10);
  return { start: beirutLocalToUtc(`${startLocal}T00:00`), end: beirutLocalToUtc(`${endLocal}T00:00`), startDate: startLocal };
}

export function previousWeekId(at = new Date()) {
  return weekId(new Date(at.getTime() - 7 * 864e5));
}

// ---------- Seeded randomness ----------

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const secret = () => {
  const s = String(env.GAME_SECRET || '');
  if (!s) throw new Error('GAME_SECRET is not set');
  return s;
};

// ---------- Coffee Run: deliver coffee to every stop and return to the cart (shortest route wins) ----------

export interface Stop { x: number; y: number; name: string }
export interface CoffeeRun { week: string; stops: Stop[]; best: number } // stops[0] is the coffee cart

const PLACES = [
  'Main Gate', 'College Hall', 'Jafet Library', 'West Hall', 'Bechtel', 'Nicely', 'Fisk Hall', 'Green Oval',
  'Medical Gate', 'Sea Gate', 'Hostler Center', 'Issam Fares', 'Ada Dodge', 'Van Dyck', 'Bliss Hall', 'Physics Lab',
];

export const dist = (a: Stop, b: Stop) => Math.hypot(a.x - b.x, a.y - b.y);

export function routeLength(stops: Stop[], order: number[]) {
  let len = 0, prev = 0;
  for (const i of order) { len += dist(stops[prev], stops[i]); prev = i; }
  return len + dist(stops[prev], stops[0]);
}

/** Exact shortest tour from the cart through all stops and back (Held-Karp; tiny for 9 stops). */
function shortestTour(stops: Stop[]) {
  const n = stops.length - 1; // stops other than the cart
  const full = (1 << n) - 1;
  const dp = Array.from({ length: 1 << n }, () => new Float64Array(n).fill(Infinity));
  for (let j = 0; j < n; j++) dp[1 << j][j] = dist(stops[0], stops[j + 1]);
  for (let mask = 1; mask <= full; mask++) {
    for (let j = 0; j < n; j++) {
      const cur = dp[mask][j];
      if (!(mask & (1 << j)) || cur === Infinity) continue;
      for (let k = 0; k < n; k++) {
        if (mask & (1 << k)) continue;
        const next = mask | (1 << k);
        const v = cur + dist(stops[j + 1], stops[k + 1]);
        if (v < dp[next][k]) dp[next][k] = v;
      }
    }
  }
  let best = Infinity;
  for (let j = 0; j < n; j++) best = Math.min(best, dp[full][j] + dist(stops[j + 1], stops[0]));
  return best;
}

const cache = new Map<string, CoffeeRun>();

export function coffeeRun(week: string): CoffeeRun {
  const hit = cache.get(week);
  if (hit) return hit;
  const rand = mulberry32(hashString(`${secret()}|${PUZZLE_TYPE}|${week}`));
  const count = 8 + Math.floor(rand() * 2); // 8 or 9 deliveries
  const pool = [...PLACES];
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  const names = pool.slice(0, count);
  const stops: Stop[] = [{ x: 50, y: 50, name: 'Coffee cart' }];
  // Spread stops out on a 100×100 map, far enough apart that names don't collide on a phone.
  let gap = 22, tries = 0;
  while (stops.length < count + 1) {
    const s = { x: 8 + rand() * 84, y: 8 + rand() * 84, name: names[stops.length - 1] };
    if (stops.every((o) => dist(o, s) > gap)) stops.push({ ...s, x: Math.round(s.x * 10) / 10, y: Math.round(s.y * 10) / 10 });
    if (++tries % 2000 === 0) gap -= 1; // never loop forever
  }
  const puzzle = { week, stops, best: shortestTour(stops) };
  cache.set(week, puzzle);
  return puzzle;
}

/** 1000 = the best possible route; fewer points the longer your route. */
export const scoreFor = (best: number, length: number) => Math.max(0, Math.min(1000, Math.round((1000 * best) / length)));

/** Display distance: the map is 100 units across ≈ 1 km. */
export const metres = (units: number) => Math.round(units * 10);

// ---------- Signed start tokens ----------

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function hmac(data: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

export async function signStart(week: string, playerId: string, startedAt: number) {
  const body = b64url(enc.encode(JSON.stringify({ w: week, p: playerId, t: startedAt })));
  return `${body}.${await hmac(body)}`;
}

export async function readStart(token: string): Promise<{ w: string; p: string; t: number } | null> {
  const [body, sig] = token.split('.');
  if (!body || !sig || (await hmac(body)) !== sig) return null;
  try { return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(body.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)))); } catch { return null; }
}

// ---------- Nicknames ----------

export function cleanNickname(raw: string): { ok: true; nickname: string; key: string } | { ok: false; error: string } {
  const nickname = raw.normalize('NFKC').replace(/\s+/g, ' ').trim();
  if (nickname.length < 2 || nickname.length > 20) return { ok: false, error: 'length' };
  if (!/^[\p{L}\p{N} _.-]+$/u.test(nickname)) return { ok: false, error: 'chars' };
  return { ok: true, nickname, key: nickname.toLowerCase() };
}
