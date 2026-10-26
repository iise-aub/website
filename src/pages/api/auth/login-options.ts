// Sign in, step 1: a fresh challenge for the browser to sign with any passkey saved for this panel.
import type { APIRoute } from 'astro';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { CHALLENGE_COOKIE, cookieOptions, relyingParty, saveChallenge } from '../../../lib/panel-auth';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ url, cookies }) => {
  const { rpID } = relyingParty(url);
  const options = await generateAuthenticationOptions({ rpID, userVerification: 'preferred' });
  cookies.set(CHALLENGE_COOKIE, await saveChallenge(options.challenge, 'login'), cookieOptions(300));
  return json(options);
};
