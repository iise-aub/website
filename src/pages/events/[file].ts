// "Add to calendar": /events/<slug>.ics, a standard calendar file that phones and Google/Outlook open.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { loadEvent } from '../../lib/db';

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const stamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// Lines longer than 75 bytes must be folded (RFC 5545).
function fold(line: string) {
  const out: string[] = [];
  let cur = '';
  for (const ch of line) {
    if (new TextEncoder().encode(cur + ch).length > 74) { out.push(cur); cur = ' ' + ch; } else cur += ch;
  }
  out.push(cur);
  return out.join('\r\n');
}

export const GET: APIRoute = async ({ params }) => {
  const match = /^([a-z0-9-]+)\.ics$/.exec(params.file ?? '');
  if (!match) return new Response('Not found', { status: 404 });
  const { event: e } = await loadEvent(match[1]);
  if (!e) return new Response('Not found', { status: 404 });
  const site = String(env.SITE_URL || '');
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IISE AUB//Website//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${e.slug}@iise-aub`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(e.starts_at)}`,
    `DTEND:${stamp(e.ends_at)}`,
    `SUMMARY:${esc(e.title_en)}`,
    e.summary_en && `DESCRIPTION:${esc(e.summary_en)}`,
    e.location_en && `LOCATION:${esc(e.location_en)}`,
    site && `URL:${site}/en/events/${e.slug}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean) as string[];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `inline; filename="${e.slug}.ics"`,
      'Cache-Control': 'public, max-age=300',
    },
  });
};
