// Editing panel sign-in with passkeys: one-time invite links, signed-in sessions, and passkey challenges.
//
// - Invites and sessions are random tokens; only their SHA-256 hash is stored, so a database leak
//   can't be used to sign in.
// - The session cookie is HttpOnly, Secure and SameSite=Lax; deleting the row signs that browser out.
// - Passkeys are bound to the panel's address (the "relying party"). Moving the panel to a new domain
//   means everyone gets a new invite link and saves a new passkey.
import { db } from './db';
import { now } from './admin';

export const SESSION_COOKIE = 'iise_panel';
export const CHALLENGE_COOKIE = 'iise_panel_challenge';
export const SESSION_DAYS = 7;
export const INVITE_DAYS = 3;
const CHALLENGE_MINUTES = 5;

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
export const sha256 = async (s: string) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));
export function randomToken(bytes = 32) {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const inFuture = (ms: number) => new Date(Date.now() + ms).toISOString().replace(/\.\d{3}Z$/, 'Z');

/** The passkey "relying party" is the exact address the panel is served from. */
export const relyingParty = (url: URL) => ({ rpID: url.hostname, origin: url.origin, rpName: 'IISE AUB editing panel' });

export const cookieOptions = (maxAgeSeconds: number) => ({
  path: '/', httpOnly: true, secure: true, sameSite: 'lax' as const, maxAge: maxAgeSeconds,
});

// ---------- Invites ----------

export async function createInvite(userId: number, createdBy: string) {
  const token = randomToken();
  await db().prepare('INSERT INTO panel_invites (token_hash, user_id, created_by, expires_at) VALUES (?, ?, ?, ?)')
    .bind(await sha256(token), userId, createdBy, inFuture(INVITE_DAYS * 864e5)).run();
  return token;
}

/** A usable invite (not used, not expired), with the person's email. */
export async function findInvite(token: string) {
  if (!token || token.length > 100) return null;
  const hash = await sha256(token);
  const row = await db().prepare(`SELECT i.token_hash, i.user_id, u.email FROM panel_invites i JOIN users u ON u.id = i.user_id
     WHERE i.token_hash = ? AND i.used_at IS NULL AND i.expires_at > ?`).bind(hash, now()).first<{ token_hash: string; user_id: number; email: string }>();
  return row ?? null;
}

// ---------- Sessions ----------

export async function createSession(userId: number) {
  const token = randomToken();
  await db().prepare('INSERT INTO panel_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256(token), userId, inFuture(SESSION_DAYS * 864e5)).run();
  return token;
}

/** The signed-in user for a session cookie, or null. */
export async function sessionUser(token: string | undefined) {
  if (!token || token.length > 100) return null;
  const hash = await sha256(token);
  const d = db();
  const row = await d.prepare(`SELECT s.user_id, u.email FROM panel_sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ? AND s.expires_at > ?`).bind(hash, now()).first<{ user_id: number; email: string }>();
  if (!row) return null;
  // Note activity at most once an hour, to keep database writes low.
  await d.prepare(`UPDATE panel_sessions SET last_seen_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
     WHERE token_hash = ? AND (last_seen_at IS NULL OR last_seen_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour'))`).bind(hash).run();
  return { id: row.user_id, email: row.email };
}

export async function endSession(token: string | undefined) {
  if (token) await db().prepare('DELETE FROM panel_sessions WHERE token_hash = ?').bind(await sha256(token)).run();
}

// ---------- Passkey challenges ----------

export async function saveChallenge(challenge: string, purpose: 'login' | 'register', inviteHash: string | null = null) {
  const id = randomToken(18);
  const d = db();
  await d.batch([
    d.prepare('DELETE FROM auth_challenges WHERE expires_at < ?').bind(now()),
    d.prepare('INSERT INTO auth_challenges (id, challenge, purpose, invite_hash, expires_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, challenge, purpose, inviteHash, inFuture(CHALLENGE_MINUTES * 6e4)),
  ]);
  return id;
}

/** Use a challenge once: returns it and deletes it, or null if missing, expired or for another purpose. */
export async function takeChallenge(id: string | undefined, purpose: 'login' | 'register') {
  if (!id || id.length > 60) return null;
  const row = await db().prepare('DELETE FROM auth_challenges WHERE id = ? AND purpose = ? AND expires_at > ? RETURNING challenge, invite_hash')
    .bind(id, purpose, now()).first<{ challenge: string; invite_hash: string | null }>();
  return row ?? null;
}

/** A short, readable description of the device a passkey was saved on (from the browser's user agent). */
export function deviceName(userAgent: string | null) {
  const ua = userAgent ?? '';
  const os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Device';
  const browser = /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : '';
  return browser ? `${os} · ${browser}` : os;
}
