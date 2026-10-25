// Check and record a submitted answer. Everything is recomputed on the server: the total distance,
// the best possible total, the time taken and the score (layout × speed). One scored try per player per week.
import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { DEPOTS, PUZZLE_TYPE, depotCost, depotDrop, isDepotCell, isTimedWeek, readStart, scoreFor, speedFactor, weekId } from '../../../lib/game';
import { PLAYER_COOKIE, getPlayer, myScore } from '../../../lib/game-db';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const { token, depots } = (await request.json().catch(() => ({}))) as { token?: string; depots?: unknown };
  const player = await getPlayer(cookies.get(PLAYER_COOKIE)?.value);
  const start = token ? await readStart(token) : null;
  if (!player || !start || start.p !== player.id) return json({ error: 'invalid' }, 400);
  if (start.w !== weekId()) return json({ error: 'week-ended' }, 409);

  const puzzle = await depotDrop(start.w);
  // Exactly 3 different warehouses, each on an empty land square.
  if (!Array.isArray(depots) || depots.length !== DEPOTS || new Set(depots).size !== DEPOTS
      || !depots.every((i) => isDepotCell(puzzle.grid, i as number))) return json({ error: 'incomplete' }, 400);

  const duration = Date.now() - start.t;
  if (duration < 3000) return json({ error: 'too-fast' }, 400);

  const existing = await myScore(start.w, player.id);
  if (existing) return json({ error: 'played', ...existing }, 409);

  const cost = depotCost(puzzle.grid, depots as number[]);
  // The time comes from the signed start token, so it can't be changed in the browser.
  const score = scoreFor(puzzle.best, cost, isTimedWeek(start.w) ? speedFactor(duration) : 1);
  await db().prepare('INSERT OR IGNORE INTO game_scores (week, puzzle, player_id, score, result, best, duration_ms) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(start.w, PUZZLE_TYPE, player.id, score, cost, puzzle.best, duration).run();
  return json({ score, cost, best: puzzle.best, duration_ms: duration });
};
