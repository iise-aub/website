// Serves uploaded photos from R2. File names are unique, so they can be cached for a year.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  const path = params.path ?? '';
  if (!/^uploads\/\d{4}\/[0-9a-f-]{36}-\d{2,4}\.webp$/.test(path)) return new Response('Not found', { status: 404 });
  const object = await env.MEDIA.get(path);
  if (!object) return new Response('Not found', { status: 404 });
  return new Response(object.body, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: object.httpEtag,
    },
  });
};
