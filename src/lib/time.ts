// All event times are stored in UTC and entered and shown in Asia/Beirut time.
import { locale, type Lang } from './i18n';

export const TZ = 'Asia/Beirut';

/** Minutes Beirut is ahead of UTC at a given moment (120 in winter, 180 in summer). */
export function beirutOffsetMinutes(at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const n = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(n('year'), n('month') - 1, n('day'), n('hour'), n('minute'), n('second'));
  return Math.round((asUtc - at.getTime()) / 60000);
}

/** "2026-11-12T17:00" typed in Beirut time → UTC ISO string. */
export function beirutLocalToUtc(local: string): string {
  const [date, time = '00:00'] = local.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const naive = Date.UTC(y, m - 1, d, hh, mm);
  // Two passes handle the daylight-saving switch correctly.
  let utc = naive - beirutOffsetMinutes(new Date(naive)) * 60000;
  utc = naive - beirutOffsetMinutes(new Date(utc)) * 60000;
  return new Date(utc).toISOString().replace('.000Z', 'Z');
}

/** UTC ISO string → "2026-11-12T17:00" in Beirut time (for form fields in the panel). */
export function utcToBeirutLocal(iso: string): string {
  const at = new Date(iso);
  const local = new Date(at.getTime() + beirutOffsetMinutes(at) * 60000);
  return local.toISOString().slice(0, 16);
}

export function formatDate(iso: string, lang: Lang, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat(locale(lang), {
    timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long', ...opts,
  }).format(new Date(iso));
}

export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
}

/** Milestone date: full date, month and year, or year only, depending on what is known. */
export function formatMilestoneDate(m: { year: number; month: number | null; day: number | null }, lang: Lang): string {
  const fmt = (o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(locale(lang), { timeZone: 'UTC', ...o }).format(new Date(Date.UTC(m.year, (m.month ?? 1) - 1, m.day ?? 1)));
  if (m.month && m.day) return fmt({ day: 'numeric', month: 'long', year: 'numeric' });
  if (m.month) return fmt({ month: 'long', year: 'numeric' });
  return fmt({ year: 'numeric' });
}
