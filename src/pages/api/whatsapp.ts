// Returns the WhatsApp invite link only after a valid Cloudflare Turnstile token.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { loadSettings } from '../../lib/db';

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } });

export const POST: APIRoute = async ({ request }) => {
  const { token } = (await request.json().catch(() => ({}))) as { token?: string };
  if (!token || token.length > 4096) return json({ error: 'missing token' }, 400);
  const secret = String(env.TURNSTILE_SECRET_KEY || '');
  if (!secret) return json({ error: 'not configured' }, 503);
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.append('remoteip', ip);
  const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const result = (await check.json().catch(() => ({}))) as { success?: boolean };
  if (!result.success) return json({ error: 'check failed' }, 403);
  const { whatsapp_url } = await loadSettings();
  if (!whatsapp_url) return json({ error: 'no link' }, 404);
  return json({ url: whatsapp_url });
};
