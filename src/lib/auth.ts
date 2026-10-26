// Who is using the editing panel, and are they allowed to?
//
// Production: people sign in with a passkey (src/lib/panel-auth.ts), which gives them a session cookie.
// If the panel is ever put behind Cloudflare Access instead (ACCESS_TEAM_DOMAIN and ACCESS_AUD set),
// Access's signed JWT (header "Cf-Access-Jwt-Assertion") is accepted too; we verify its signature,
// audience, issuer and expiry before trusting the email inside. Anything missing or invalid is refused.
// Local development: DEV_ADMIN_EMAIL (in .dev.vars) signs you in, only on localhost.
//
// Being signed in is not enough: the email must hold the "editor" or "cabinet_admin" role in our
// own users table. Cabinet admins manage those roles in the panel (Panel access).
import { env } from 'cloudflare:workers';
import { db } from './db';
import { sessionUser } from './panel-auth';

export type Role = 'editor' | 'cabinet' | 'cabinet_admin' | 'member' | 'alumni' | 'sponsor' | 'treasurer';
export interface AdminUser { id: number; email: string; roles: Role[] }
export type AuthResult = { ok: true; user: AdminUser } | { ok: false; status: number; message: string };

const PANEL_ROLES: Role[] = ['editor', 'cabinet_admin'];

export const isCabinetAdmin = (user: AdminUser) => user.roles.includes('cabinet_admin');

export function isDevBypass(url: URL): boolean {
  return Boolean(env.DEV_ADMIN_EMAIL) && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}

export async function resolveAdmin(request: Request, devBypass: boolean, sessionToken?: string): Promise<AuthResult> {
  let email: string;
  const session = devBypass ? null : await sessionUser(sessionToken);
  const team = String(env.ACCESS_TEAM_DOMAIN || '');
  const aud = String(env.ACCESS_AUD || '');
  const accessToken = request.headers.get('Cf-Access-Jwt-Assertion');
  if (devBypass) {
    email = String(env.DEV_ADMIN_EMAIL).toLowerCase();
  } else if (session) {
    email = session.email.toLowerCase();
  } else if (team && aud && accessToken) {
    const claims = await verifyAccessJwt(accessToken, team, aud);
    if (!claims?.email) return { ok: false, status: 401, message: 'Your sign-in could not be verified. Please sign in again.' };
    email = String(claims.email).toLowerCase();
  } else {
    return { ok: false, status: 401, message: 'Please sign in.' };
  }

  const d = db();
  let user = await d.prepare('SELECT id, email FROM users WHERE email = ?').bind(email).first<{ id: number; email: string }>();

  // First cabinet admins come from settings (BOOTSTRAP_ADMINS), or the local developer.
  const bootstrap = String(env.BOOTSTRAP_ADMINS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
  if (devBypass) bootstrap.push(email);
  // Only on first sign-in, so a cabinet admin can later remove a bootstrap admin for good.
  if (!user && bootstrap.includes(email)) {
    await d.prepare('INSERT INTO users (email) VALUES (?)').bind(email).run();
    user = await d.prepare('SELECT id, email FROM users WHERE email = ?').bind(email).first<{ id: number; email: string }>();
    await d.batch(['editor', 'cabinet_admin'].map((role) =>
      d.prepare('INSERT OR IGNORE INTO user_roles (user_id, role, granted_by) VALUES (?, ?, ?)').bind(user!.id, role, 'bootstrap')));
  }
  if (!user) return { ok: false, status: 403, message: `${email} is not an editor yet. Ask a cabinet admin to add you in the panel.` };

  const { results } = await d.prepare('SELECT role FROM user_roles WHERE user_id = ?').bind(user.id).all<{ role: Role }>();
  const roles = results.map((r) => r.role);
  if (!roles.some((r) => PANEL_ROLES.includes(r))) {
    return { ok: false, status: 403, message: `${email} does not have editor access. Ask a cabinet admin to add you.` };
  }
  // Record the sign-in at most once an hour, to keep database writes low.
  await d.prepare(`UPDATE users SET last_sign_in_at = strftime('%Y-%m-%dT%H:%M:%SZ','now')
    WHERE id = ? AND (last_sign_in_at IS NULL OR last_sign_in_at < strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour'))`).bind(user.id).run();
  return { ok: true, user: { id: user.id, email: user.email, roles } };
}

// ---------- Cloudflare Access JWT verification (RS256, keys from the team's certs endpoint) ----------

let keyCache: { team: string; at: number; keys: Map<string, CryptoKey> } | null = null;

async function accessKeys(team: string): Promise<Map<string, CryptoKey>> {
  if (keyCache && keyCache.team === team && Date.now() - keyCache.at < 10 * 60 * 1000) return keyCache.keys;
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error(`Access certs: HTTP ${res.status}`);
  const { keys } = (await res.json()) as { keys: (JsonWebKey & { kid: string })[] };
  const map = new Map<string, CryptoKey>();
  for (const jwk of keys) {
    map.set(jwk.kid, await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']));
  }
  keyCache = { team, at: Date.now(), keys: map };
  return map;
}

const b64urlBytes = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
const b64urlJson = (s: string) => JSON.parse(new TextDecoder().decode(b64urlBytes(s)));

export async function verifyAccessJwt(token: string, team: string, aud: string): Promise<Record<string, unknown> | null> {
  try {
    const [h, p, sig] = token.split('.');
    if (!h || !p || !sig) return null;
    const header = b64urlJson(h);
    if (header.alg !== 'RS256') return null;
    let key = (await accessKeys(team)).get(header.kid);
    if (!key) { keyCache = null; key = (await accessKeys(team)).get(header.kid); }
    if (!key) return null;
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlBytes(sig), new TextEncoder().encode(`${h}.${p}`));
    if (!valid) return null;
    const claims = b64urlJson(p);
    const now = Math.floor(Date.now() / 1000);
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (!auds.includes(aud)) return null;
    if (claims.iss !== `https://${team}`) return null;
    if (typeof claims.exp !== 'number' || claims.exp < now) return null;
    if (typeof claims.nbf === 'number' && claims.nbf > now + 60) return null;
    return claims;
  } catch {
    return null;
  }
}
