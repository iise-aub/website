// Start this week's puzzle: claims a nickname on first play, then returns the map and a signed start token.
// The map is only sent here, so nobody can study it before the clock starts.
import type { APIRoute } from 'astro';
import { loadSettings } from '../../../lib/db';
import { cleanNickname, coffeeRun, signStart, weekId } from '../../../lib/game';
import { PLAYER_COOKIE, createPlayer, getPlayer, myScore } from '../../../lib/game-db';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const settings = await loadSettings();
  if (settings.game_enabled !== '1') return json({ error: 'off' }, 403);
  const { nickname } = (await request.json().catch(() => ({}))) as { nickname?: string };

  let player = await getPlayer(cookies.get(PLAYER_COOKIE)?.value);
  if (!player) {
    const clean = cleanNickname(String(nickname ?? ''));
    if (!clean.ok) return json({ error: clean.error }, 400);
    const created = await createPlayer(clean.nickname, clean.key);
    if (created === 'taken') return json({ error: 'taken' }, 409);
    player = created;
    cookies.set(PLAYER_COOKIE, player.id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 400 });
  }

  const week = weekId();
  if (await myScore(week, player.id)) return json({ error: 'played' }, 409);
  const puzzle = coffeeRun(week);
  return json({
    nickname: player.nickname,
    token: await signStart(week, player.id, Date.now()),
    stops: puzzle.stops,
  });
};
