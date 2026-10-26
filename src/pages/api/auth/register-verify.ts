// Passkey setup, step 2: check the new passkey, save it, use up the invite and sign the person in.
import type { APIRoute } from 'astro';
import { verifyRegistrationResponse, type RegistrationResponseJSON } from '@simplewebauthn/server';
import { isoBase64URL } from '@simplewebauthn/server/helpers';
import { db } from '../../../lib/db';
import { logChange, now } from '../../../lib/admin';
import { CHALLENGE_COOKIE, SESSION_COOKIE, SESSION_DAYS, cookieOptions, createSession, deviceName, findInvite, relyingParty, takeChallenge } from '../../../lib/panel-auth';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, url, cookies }) => {
  const body = (await request.json().catch(() => ({}))) as { token?: string; response?: RegistrationResponseJSON };
  const invite = await findInvite(String(body.token ?? ''));
  const challenge = await takeChallenge(cookies.get(CHALLENGE_COOKIE)?.value, 'register');
  cookies.delete(CHALLENGE_COOKIE, { path: '/' });
  if (!invite) return json({ error: 'invite' }, 400);
  if (!challenge || challenge.invite_hash !== invite.token_hash || !body.response) return json({ error: 'expired' }, 400);

  const { rpID, origin } = relyingParty(url);
  let info;
  try {
    const result = await verifyRegistrationResponse({
      response: body.response, expectedChallenge: challenge.challenge, expectedOrigin: origin, expectedRPID: rpID, requireUserVerification: false,
    });
    if (!result.verified) return json({ error: 'failed' }, 400);
    info = result.registrationInfo;
  } catch {
    return json({ error: 'failed' }, 400);
  }

  const { credential } = info;
  const device = deviceName(request.headers.get('User-Agent'));
  const d = db();
  await d.batch([
    d.prepare('INSERT INTO passkeys (id, user_id, public_key, counter, transports, device) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(credential.id, invite.user_id, isoBase64URL.fromBuffer(credential.publicKey), credential.counter, (credential.transports ?? []).join(','), device),
    d.prepare('UPDATE panel_invites SET used_at = ? WHERE token_hash = ?').bind(now(), invite.token_hash),
    logChange(invite.email, 'users', invite.user_id, 'update', `Saved a passkey (${device})`),
  ]);
  cookies.set(SESSION_COOKIE, await createSession(invite.user_id), cookieOptions(SESSION_DAYS * 86400));
  return json({ ok: true });
};
