// Weekly IE puzzle engine (current puzzle: Depot Drop).
// - A "week" starts Monday 00:00 Beirut time, e.g. "2026-W44".
// - Each week's puzzle is generated from a secret seed, so it is the same for everyone and can't be predicted.
// - The best possible answer is computed exactly on the server; scores are checked on the server too.
// - Time is measured by the server between "start" and "submit" (signed token), so it can't be faked.
import { env } from 'cloudflare:workers';
import { db } from './db';
import { beirutLocalToUtc } from './time';

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

// ---------- Depot Drop: place 3 warehouses so the city's deliveries travel the least total distance ----------
// The map is a W×H grid. Cell codes:
//   '.' empty land (warehouses go here)   '~' river   '=' bridge   '#' building
//   '1'-'5' a house needing that many deliveries
// Trucks move square by square (up/down/left/right); they cannot enter river or buildings.
// Each house is served by its nearest warehouse; cost = Σ deliveries × driving distance.

export const PUZZLE_TYPE = 'depot-drop';
export const W = 10, H = 10, DEPOTS = 3;

export interface DepotDrop { week: string; grid: string[]; best: number; bestDepots: number[] }

const passable = (c: string) => c !== '~' && c !== '#';
const isHouse = (c: string) => c >= '1' && c <= '9';

/** Driving distance from one cell to every cell (breadth-first search). Unreachable = Infinity. */
export function distancesFrom(grid: string[], start: number): Int32Array {
  const dist = new Int32Array(W * H).fill(-1);
  const queue = [start];
  dist[start] = 0;
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q], x = i % W, y = (i / W) | 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
      const j = ny * W + nx;
      if (dist[j] !== -1 || !passable(grid[ny][nx])) continue;
      dist[j] = dist[i] + 1;
      queue.push(j);
    }
  }
  return dist;
}

export const houses = (grid: string[]) => {
  const out: { cell: number; demand: number }[] = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isHouse(grid[y][x])) out.push({ cell: y * W + x, demand: Number(grid[y][x]) });
  return out;
};

export const isDepotCell = (grid: string[], i: number) => Number.isInteger(i) && i >= 0 && i < W * H && grid[(i / W) | 0][i % W] === '.';

/** Total weighted distance for a set of warehouse cells. */
export function depotCost(grid: string[], depots: number[]) {
  const maps = depots.map((d) => distancesFrom(grid, d));
  let total = 0;
  for (const h of houses(grid)) {
    const best = Math.min(...maps.map((m) => (m[h.cell] < 0 ? Infinity : m[h.cell])));
    total += h.demand * best;
  }
  return total;
}

/** Exact best placement: checks every combination of 3 empty cells, pruning hopeless ones early. */
function solve(grid: string[]) {
  const hs = houses(grid);
  const nh = hs.length;
  const cand: number[] = [];
  for (let i = 0; i < W * H; i++) if (isDepotCell(grid, i)) cand.push(i);
  // Weighted distance (demand × distance) from every candidate to every house, in one flat array.
  const rows = cand.map((c) => {
    const m = distancesFrom(grid, c);
    const r = new Int32Array(nh);
    for (let k = 0; k < nh; k++) r[k] = hs[k].demand * (m[hs[k].cell] < 0 ? 100000 : m[hs[k].cell]);
    return { cell: c, r, alone: r.reduce((s, v) => s + v, 0) };
  });
  // Try the best single locations first so a good answer is found early and most combinations are cut short.
  rows.sort((p, q) => p.alone - q.alone);
  const n = rows.length;
  const pair = new Int32Array(nh);
  let best = Infinity, bestDepots: number[] = [];
  for (let a = 0; a < n; a++) {
    const ra = rows[a].r;
    for (let b = a + 1; b < n; b++) {
      const rb = rows[b].r;
      for (let k = 0; k < nh; k++) pair[k] = ra[k] < rb[k] ? ra[k] : rb[k];
      for (let c = b + 1; c < n; c++) {
        const rc = rows[c].r;
        let t = 0;
        for (let k = 0; k < nh; k++) { t += pair[k] < rc[k] ? pair[k] : rc[k]; if (t >= best) break; }
        if (t < best) { best = t; bestDepots = [rows[a].cell, rows[b].cell, rows[c].cell]; }
      }
    }
  }
  return { best, bestDepots };
}

function generate(rand: () => number): string[] {
  const g = Array.from({ length: H }, () => Array<string>(W).fill('.'));
  const empty = () => { const out: [number, number][] = []; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] === '.') out.push([x, y]); return out; };
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];

  // A river winding from top to bottom (sometimes left to right), kept continuous so it really divides the city.
  const vertical = rand() < 0.7;
  let pos = 3 + Math.floor(rand() * 4);
  const riverCells: [number, number][][] = [];
  for (let t = 0; t < (vertical ? H : W); t++) {
    const row: [number, number][] = [];
    const set = (p: number) => { const [x, y] = vertical ? [p, t] : [t, p]; g[y][x] = '~'; row.push([x, y]); };
    set(pos);
    const step = rand() < 0.45 ? (rand() < 0.5 ? -1 : 1) : 0;
    const next = Math.max(2, Math.min((vertical ? W : H) - 3, pos + step));
    if (next !== pos) { set(next); pos = next; }
    riverCells.push(row);
  }
  // One or two bridges, never next to each other.
  const bridges = rand() < 0.35 ? 1 : 2;
  const used: number[] = [];
  while (used.length < bridges) {
    const t = 1 + Math.floor(rand() * ((vertical ? H : W) - 2));
    if (used.some((u) => Math.abs(u - t) < 3)) continue;
    used.push(t);
    for (const [x, y] of riverCells[t]) g[y][x] = '=';
  }
  // Sometimes a small pond.
  if (rand() < 0.5) {
    const [x, y] = pick(empty().filter(([x, y]) => x < W - 1 && y < H - 1));
    for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) if (g[y + dy][x + dx] === '.') g[y + dy][x + dx] = '~';
  }
  // Buildings: 6–9 blocks of one or two cells.
  const blocks = 6 + Math.floor(rand() * 4);
  for (let b = 0; b < blocks; b++) {
    const [x, y] = pick(empty());
    g[y][x] = '#';
    if (rand() < 0.5) { const [dx, dy] = rand() < 0.5 ? [1, 0] : [0, 1]; if (x + dx < W && y + dy < H && g[y + dy][x + dx] === '.') g[y + dy][x + dx] = '#'; }
  }
  // Houses: 11–13, demand 1–5 (small numbers more common).
  const count = 11 + Math.floor(rand() * 3);
  for (let h = 0; h < count; h++) {
    const [x, y] = pick(empty());
    const r = rand();
    g[y][x] = String(r < 0.3 ? 1 : r < 0.55 ? 2 : r < 0.75 ? 3 : r < 0.9 ? 4 : 5);
  }
  return g.map((row) => row.join(''));
}

/** Every house reachable, houses on both sides of the river, and enough room for warehouses. */
function valid(grid: string[]) {
  const hs = houses(grid);
  if (!hs.length) return false;
  const m = distancesFrom(grid, hs[0].cell);
  if (hs.some((h) => m[h.cell] < 0)) return false;
  let free = 0;
  for (let i = 0; i < W * H; i++) if (isDepotCell(grid, i) && m[i] >= 0) free++;
  if (free < 30) return false;
  // Unreachable empty cells would be useless warehouse spots: turn them into buildings.
  return true;
}

function tidy(grid: string[]) {
  const m = distancesFrom(grid, houses(grid)[0].cell);
  return grid.map((row, y) => [...row].map((c, x) => (c === '.' && m[y * W + x] < 0 ? '#' : c)).join(''));
}

const cache = new Map<string, DepotDrop>();

function makeDepotDrop(week: string): DepotDrop {
  const rand = mulberry32(hashString(`${secret()}|${PUZZLE_TYPE}|${week}`));
  let grid = generate(rand);
  while (!valid(grid)) grid = generate(rand);
  grid = tidy(grid);
  return { week, grid, ...solve(grid) };
}

/** This week's city: from memory, else from the database, else generated, solved and stored (once a week). */
export async function depotDrop(week: string): Promise<DepotDrop> {
  const hit = cache.get(week);
  if (hit) return hit;
  const row = await db().prepare('SELECT grid, best, best_answer FROM game_weeks WHERE week = ? AND puzzle = ?').bind(week, PUZZLE_TYPE)
    .first<{ grid: string; best: number; best_answer: string }>();
  const puzzle = row
    ? { week, grid: JSON.parse(row.grid) as string[], best: row.best, bestDepots: JSON.parse(row.best_answer) as number[] }
    : makeDepotDrop(week);
  if (!row) {
    await db().prepare('INSERT OR IGNORE INTO game_weeks (week, puzzle, grid, best, best_answer) VALUES (?, ?, ?, ?, ?)')
      .bind(week, PUZZLE_TYPE, JSON.stringify(puzzle.grid), puzzle.best, JSON.stringify(puzzle.bestDepots)).run();
  }
  cache.set(week, puzzle);
  return puzzle;
}

/** 1000 = the best possible layout; fewer points the further your total is from it, times the speed factor. */
export const scoreFor = (best: number, yours: number, speed = 1) => Math.max(0, Math.min(1000, Math.round(((1000 * best) / yours) * speed)));

// ---------- Speed ----------
// Saad, Oct 25 2026: time counts, so there's no time to work the answer out with AI. Full points for the
// first 45 seconds, then the score shrinks steadily (×0.75 at 2 min, ×0.55 at 3 min) down to ×0.25 from 4½ min.
// Starts with week 44 so that week 43's players keep the rules they played under.
export const SPEED = { fromWeek: '2026-W44', fullMs: 45_000, decayMs: 300_000, min: 0.25 } as const;
export const isTimedWeek = (week: string) => week >= SPEED.fromWeek;
export const speedFactor = (ms: number) =>
  ms <= SPEED.fullMs ? 1 : Math.max(SPEED.min, 1 - (ms - SPEED.fullMs) / SPEED.decayMs);

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
