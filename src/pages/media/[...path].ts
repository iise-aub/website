// Serves uploaded photos (from R2 or the database). File names are unique, so they can be cached for a year.
import type { APIRoute } from 'astro';
import { getFile } from '../../lib/media-store';

export const GET: APIRoute = async ({ params }) => {
  const path = params.path ?? '';
  if (!/^uploads\/\d{4}\/[0-9a-f-]{36}-\d{2,4}\.webp$/.test(path)) return new Response('Not found', { status: 404 });
  const file = await getFile(path);
  if (!file) return new Response('Not found', { status: 404 });
  return new Response(file.body as BodyInit, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      ETag: file.etag,
    },
  });
};
