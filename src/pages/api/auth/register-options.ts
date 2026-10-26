// Passkey setup, step 1: check the invite link and give the browser what it needs to create a passkey.
import type { APIRoute } from 'astro';
import { generateRegistrationOptions, type AuthenticatorTransportFuture } from '@simplewebauthn/server';
import { db } from '../../../lib/db';
import { CHALLENGE_COOKIE, cookieOptions, findInvite, relyingParty, saveChallenge } from '../../../lib/panel-auth';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request, url, cookies }) => {
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  const invite = await findInvite(String(token ?? ''));
  if (!invite) return json({ error: 'invite' }, 400);

  const { rpID, rpName } = relyingParty(url);
  const existing = (await db().prepare('SELECT id, transports FROM passkeys WHERE user_id = ?').bind(invite.user_id).all<{ id: string; transports: string }>()).results;
  const options = await generateRegistrationOptions({
    rpName, rpID,
    userName: invite.email,
    userDisplayName: invite.email,
    userID: new TextEncoder().encode(`iise-aub-panel-${invite.user_id}`),
    attestationType: 'none',
    authenticatorSelection: { residentKey: 'required', userVerification: 'preferred' },
    excludeCredentials: existing.map((c) => ({ id: c.id, transports: c.transports ? (c.transports.split(',') as AuthenticatorTransportFuture[]) : undefined })),
  });
  cookies.set(CHALLENGE_COOKIE, await saveChallenge(options.challenge, 'register', invite.token_hash), cookieOptions(300));
  return json(options);
};
