// Start this week's puzzle: claims a nickname on first play, then returns the map and a signed start token.
// The map is only sent here, so nobody can study it before the clock starts.
import type { APIRoute } from 'astro';
import { loadSettings } from '../../../lib/db';
import { DEPOTS, H, W, cleanNickname, depotDrop, signStart, weekId } from '../../../lib/game';
import { PLAYER_COOKIE, createPlayer, getPlayer, myScore } from '../../../lib/game-db';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, cookies }) => {
  const settings = await loadSettings();
  if (settings.game_enabled !== '1') return json({ error: 'off' }, 403);
  const { nickname } = (await request.json().catch(() => ({}))) as { nickname?: string };

  // Embedded (Moodle): no cookie inside another site's frame, so the page sends the player id it stored.
  const embedded = request.headers.get('X-Embed') === '1';
  let player = await getPlayer(cookies.get(PLAYER_COOKIE)?.value ?? (embedded ? request.headers.get('X-Player') ?? undefined : undefined));
  if (!player) {
    const clean = cleanNickname(String(nickname ?? ''));
    if (!clean.ok) return json({ error: clean.error }, 400);
    const created = await createPlayer(clean.nickname, clean.key);
    if (created === 'taken') return json({ error: 'taken' }, 409);
    player = created;
    cookies.set(PLAYER_COOKIE, player.id, { path: '/', httpOnly: true, secure: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 400 });
  }

  const week = weekId();
  // Embedded pages keep the player id themselves (returned only when they ask, so normal pages never see it).
  const keep = embedded ? { player: player.id } : {};
  if (await myScore(week, player.id)) return json({ error: 'played', ...keep }, 409);
  const puzzle = await depotDrop(week);
  return json({
    nickname: player.nickname, ...keep,
    token: await signStart(week, player.id, Date.now()),
    grid: puzzle.grid, w: W, h: H, depots: DEPOTS,
  });
};
