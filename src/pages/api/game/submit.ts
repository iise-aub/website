// Check and record a submitted route. Everything is recomputed on the server: the route length,
// the best possible length, the score and the time taken. One scored try per player per week.
import type { APIRoute } from 'astro';
import { db } from '../../../lib/db';
import { PUZZLE_TYPE, coffeeRun, readStart, routeLength, scoreFor, weekId } from '../../../lib/game';
import { PLAYER_COOKIE, getPlayer, myScore } from '../../../lib/game-db';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const { token, order } = (await request.json().catch(() => ({}))) as { token?: string; order?: unknown };
  const player = await getPlayer(cookies.get(PLAYER_COOKIE)?.value);
  const start = token ? await readStart(token) : null;
  if (!player || !start || start.p !== player.id) return json({ error: 'invalid' }, 400);
  if (start.w !== weekId()) return json({ error: 'week-ended' }, 409);

  const puzzle = coffeeRun(start.w);
  const n = puzzle.stops.length - 1;
  // The order must visit every stop exactly once (stop 0 is the cart).
  if (!Array.isArray(order) || order.length !== n || new Set(order).size !== n
      || !order.every((i) => Number.isInteger(i) && i >= 1 && i <= n)) return json({ error: 'incomplete' }, 400);

  const duration = Date.now() - start.t;
  if (duration < 3000) return json({ error: 'too-fast' }, 400);

  const existing = await myScore(start.w, player.id);
  if (existing) return json({ error: 'played', ...existing }, 409);

  const length = routeLength(puzzle.stops, order as number[]);
  const score = scoreFor(puzzle.best, length);
  await db().prepare('INSERT OR IGNORE INTO game_scores (week, puzzle, player_id, score, result, best, duration_ms) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(start.w, PUZZLE_TYPE, player.id, score, length, puzzle.best, duration).run();
  return json({ score, length, best: puzzle.best, duration_ms: duration });
};
