// Runs before every request.
// - /admin and /api/admin: only on the admin Worker (or on localhost in development), and only for editors.
// - Same-origin check on every form POST (protects against cross-site form submissions).
// - Basic security headers everywhere; the panel is never cached or indexed.
import { defineMiddleware } from 'astro:middleware';
import { env } from 'cloudflare:workers';
import { isDevBypass, resolveAdmin } from './lib/auth';

const isPanelPath = (p: string) => p === '/admin' || p.startsWith('/admin/') || p.startsWith('/api/admin/');

function plainPage(status: number, title: string, message: string) {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><body style="font-family:system-ui,sans-serif;max-width:560px;margin:15vh auto;padding:0 20px;color:#142c58">
<h1 style="font-size:1.6rem">${title}</h1><p style="color:#555;line-height:1.6">${message.replace(/</g, '&lt;')}</p></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

export const onRequest = defineMiddleware(async (ctx, next) => {
  const { pathname } = ctx.url;
  const devBypass = isDevBypass(ctx.url);
  const adminWorker = env.APP_ROLE === 'admin';

  if (ctx.request.method !== 'GET' && ctx.request.method !== 'HEAD') {
    const origin = ctx.request.headers.get('Origin');
    if (origin && origin !== ctx.url.origin) return plainPage(403, 'Not allowed', 'This form was sent from another site.');
  }

  // The admin Worker's home is the panel.
  if (adminWorker && pathname === '/') return ctx.redirect('/admin', 302);

  let response: Response;
  if (isPanelPath(pathname)) {
    if (!adminWorker && !devBypass) return ctx.rewrite('/404');
    const auth = await resolveAdmin(ctx.request, devBypass);
    if (!auth.ok) return plainPage(auth.status, auth.status === 503 ? 'Not set up yet' : 'No access', auth.message);
    ctx.locals.user = auth.user;
    response = await next();
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  } else {
    response = await next();
    if (adminWorker) response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  return response;
});
