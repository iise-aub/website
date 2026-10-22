// Weekly puzzle: players, scores and leaderboards.
import { db } from './db';
import { previousWeekId } from './game';

export const PLAYER_COOKIE = 'iise_player';

export interface Player { id: string; nickname: string; hidden: number }
export interface BoardRow { player_id: string; nickname: string; score: number; duration_ms: number; result: number; rank: number }
export interface TermRow { player_id: string; nickname: string; total: number; weeks: number; rank: number }
export interface MyScore { score: number; result: number; best: number; duration_ms: number }

export const getPlayer = (id: string | undefined) =>
  id ? db().prepare('SELECT id, nickname, hidden FROM game_players WHERE id = ?').bind(id).first<Player>() : Promise.resolve(null);

export async function createPlayer(nickname: string, key: string): Promise<Player | 'taken'> {
  const id = crypto.randomUUID();
  const res = await db().prepare('INSERT OR IGNORE INTO game_players (id, nickname, nickname_key) VALUES (?, ?, ?)').bind(id, nickname, key).run();
  if (!res.meta.changes) return 'taken';
  return { id, nickname, hidden: 0 };
}

export const myScore = (week: string, playerId: string) =>
  db().prepare('SELECT score, result, best, duration_ms FROM game_scores WHERE week = ? AND player_id = ?').bind(week, playerId).first<MyScore>();

const visible = 's.hidden = 0 AND p.hidden = 0';

/** This week's ranking: higher score first, then faster. */
export async function weekBoard(week: string, limit = 20): Promise<BoardRow[]> {
  const { results } = await db().prepare(
    `SELECT s.player_id, p.nickname, s.score, s.duration_ms, s.result,
            RANK() OVER (ORDER BY s.score DESC, s.duration_ms ASC) AS rank
       FROM game_scores s JOIN game_players p ON p.id = s.player_id
      WHERE s.week = ? AND ${visible} ORDER BY rank LIMIT ?`).bind(week, limit).all<BoardRow>();
  return results;
}

/** A player's rank this week (even if outside the top list). */
export async function weekRank(week: string, playerId: string): Promise<{ rank: number; players: number } | null> {
  return db().prepare(
    `WITH r AS (SELECT s.player_id, RANK() OVER (ORDER BY s.score DESC, s.duration_ms ASC) AS rank
                  FROM game_scores s JOIN game_players p ON p.id = s.player_id WHERE s.week = ? AND ${visible})
     SELECT rank, (SELECT COUNT(*) FROM r) AS players FROM r WHERE player_id = ?`).bind(week, playerId).first();
}

/** Term ranking: total points across all weeks since the term started. */
export async function termBoard(termStart: string, limit = 20): Promise<TermRow[]> {
  const { results } = await db().prepare(
    `SELECT s.player_id, p.nickname, SUM(s.score) AS total, COUNT(*) AS weeks,
            RANK() OVER (ORDER BY SUM(s.score) DESC, SUM(s.duration_ms) ASC) AS rank
       FROM game_scores s JOIN game_players p ON p.id = s.player_id
      WHERE s.created_at >= ? AND ${visible}
      GROUP BY s.player_id ORDER BY rank LIMIT ?`).bind(`${termStart}T00:00:00Z`, limit).all<TermRow>();
  return results;
}

export async function winner(week: string) {
  return (await weekBoard(week, 1))[0] ?? null;
}

/** Data for the puzzle teaser on the homepage and the Members page. */
export async function loadGameTeaser() {
  const d = db();
  const [text, on] = await d.batch([
    d.prepare("SELECT block, text_en, text_ar, needs_content FROM page_text WHERE page = 'game' AND block IN ('eyebrow', 'title', 'cta_title', 'cta_text')"),
    d.prepare("SELECT value FROM settings WHERE key = 'game_enabled'"),
  ]);
  const enabled = (on.results[0] as { value?: string } | undefined)?.value === '1';
  return {
    enabled,
    text: Object.fromEntries((text.results as { block: string; text_en: string; text_ar: string }[]).map((r) => [r.block, r])),
    lastWinner: enabled ? await winner(previousWeekId()) : null,
  };
}
