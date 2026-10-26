// Sign in, step 2: check the passkey's signature, then start a session if the person still has panel access.
import type { APIRoute } from 'astro';
import { verifyAuthenticationResponse, type AuthenticationResponseJSON, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { db } from '../../../lib/db';
import { now } from '../../../lib/admin';
import { CHALLENGE_COOKIE, SESSION_COOKIE, SESSION_DAYS, cookieOptions, createSession, relyingParty, takeChallenge } from '../../../lib/panel-auth';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
type Key = { id: string; user_id: number; public_key: string; counter: number; transports: string };

export const POST: APIRoute = async ({ request, url, cookies }) => {
  const response = (await request.json().catch(() => null)) as AuthenticationResponseJSON | null;
  const challenge = await takeChallenge(cookies.get(CHALLENGE_COOKIE)?.value, 'login');
  cookies.delete(CHALLENGE_COOKIE, { path: '/' });
  if (!challenge || !response?.id) return json({ error: 'expired' }, 400);

  const d = db();
  const key = await d.prepare('SELECT id, user_id, public_key, counter, transports FROM passkeys WHERE id = ?').bind(response.id).first<Key>();
  if (!key) return json({ error: 'unknown' }, 400);

  const { rpID, origin } = relyingParty(url);
  let newCounter: number;
  try {
    const result = await verifyAuthenticationResponse({
      response, expectedChallenge: challenge.challenge, expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false,
      credential: {
        id: key.id, publicKey: isoBase64URL.toBuffer(key.public_key), counter: key.counter,
        transports: key.transports ? (key.transports.split(',') as AuthenticatorTransportFuture[]) : undefined,
      },
    });
    if (!result.verified) return json({ error: 'failed' }, 400);
    newCounter = result.authenticationInfo.newCounter;
  } catch {
    return json({ error: 'failed' }, 400);
  }

  const access = await d.prepare("SELECT 1 FROM user_roles WHERE user_id = ? AND role IN ('editor', 'cabinet_admin') LIMIT 1").bind(key.user_id).first();
  if (!access) return json({ error: 'no-access' }, 403);
  await d.prepare('UPDATE passkeys SET counter = ?, last_used_at = ? WHERE id = ?').bind(newCounter, now(), key.id).run();
  cookies.set(SESSION_COOKIE, await createSession(key.user_id), cookieOptions(SESSION_DAYS * 86400));
  return json({ ok: true });
};
