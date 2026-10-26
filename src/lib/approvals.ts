// Approval step for the editing panel.
//
// Only cabinet admins publish directly. When an editor sends any panel form, the middleware stores the
// submission (queueChange) instead of running it. The admin reviews it: we load the same panel page as it is
// now (readLiveForm) and compare its current values with the submitted ones, field by field, using the form's
// own labels. Approving re-sends the stored form to the same page with the admin's session (applyChange), so
// every check the page normally does still runs. No page needs to know about approvals.
import { env } from 'cloudflare:workers';
import { db } from './db';
import type { AdminUser } from './auth';

export interface PendingChange {
  id: number; user_id: number | null; email: string; path: string; fields: string; page: string; item: string; button: string;
  status: 'pending' | 'approved' | 'rejected' | 'failed'; note: string; created_at: string; decided_by: string | null; decided_at: string | null;
}
export type Fields = [string, string][];

// Pages editors can't use anyway (they check for admins themselves), so their forms are never queued.
const ADMIN_ONLY = ['/admin/access', '/admin/approvals'];
export const needsApproval = (user: AdminUser, method: string, path: string) =>
  method === 'POST' && !user.roles.includes('cabinet_admin') && path.startsWith('/admin/') && !ADMIN_ONLY.some((p) => path === p || path.startsWith(`${p}/`));

/** Store an editor's form submission. Returns the page to send them back to. */
export async function queueChange(user: AdminUser, pathWithQuery: string, form: FormData) {
  const get = (k: string) => String(form.get(k) ?? '').slice(0, 200);
  const fields: Fields = [];
  for (const [k, v] of form.entries()) if (typeof v === 'string' && !k.startsWith('_review_')) fields.push([k, v]);
  await db().prepare('INSERT INTO pending_changes (user_id, email, path, fields, page, item, button) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(user.id, user.email, pathWithQuery, JSON.stringify(fields), get('_review_page'), get('_review_item'), get('_review_button')).run();
  const path = pathWithQuery.split('?')[0];
  return path.endsWith('/new') ? path.slice(0, -4) : path;
}

export const pendingCount = async () =>
  (await db().prepare("SELECT COUNT(*) AS n FROM pending_changes WHERE status = 'pending'").first<{ n: number }>())?.n ?? 0;

// ---------- Calling the panel itself ----------

/** The admin Worker reaches itself through a service binding (a Worker can't fetch its own workers.dev address). */
function selfFetch(req: Request) {
  const self = (env as unknown as { SELF?: { fetch: (r: Request) => Promise<Response> } }).SELF;
  return self ? self.fetch(req) : fetch(req);
}

/** Re-send the stored form as the approving admin. ok = the page accepted it (it redirects after saving). */
export async function applyChange(change: PendingChange, origin: string, cookie: string) {
  const body = new URLSearchParams();
  for (const [k, v] of JSON.parse(change.fields) as Fields) body.append(k, v);
  const res = await selfFetch(new Request(origin + change.path, {
    method: 'POST', redirect: 'manual', body,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookie, Origin: origin },
  }));
  return { ok: res.status >= 300 && res.status < 400, status: res.status, location: res.headers.get('Location') ?? '' };
}

// ---------- Reading the page's form as it is now ----------

export interface LiveForm {
  values: Map<string, string>; types: Map<string, string>; labels: Map<string, string>;
  options: Map<string, Map<string, string>>;
}

const decode = (s: string) => s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|#39|nbsp);/gi, (m, e: string) => {
  const k = e.toLowerCase();
  if (k[0] === '#') return String.fromCodePoint(k[1] === 'x' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10));
  return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' } as Record<string, string>)[k] ?? m;
});
const clean = (s: string) => decode(s).replace(/\s+/g, ' ').replace(/\s*\*$/, '').trim();

/** Load a panel page as the admin and read every POST form on it: values, field types, labels and select options. */
export async function readLiveForms(path: string, origin: string, cookie: string): Promise<LiveForm[]> {
  const res = await selfFetch(new Request(origin + path, { headers: { Cookie: cookie }, redirect: 'manual' }));
  if (res.status !== 200) return [];
  const forms: LiveForm[] = [];
  let form: LiveForm | null = null;
  const idToName = new Map<string, string>(), labelById = new Map<string, string>();
  let legend = '', legendText = '', inLegend = false, groupDepth = 0;
  const groupOf = new Map<string, string>();
  let label: { for: string | null; text: string; name: string | null } | null = null;
  let textarea: string | null = null;
  let select: { name: string; first: string | null } | null = null;
  let option: { value: string | null; text: string; selected: boolean } | null = null;

  const name = (el: Element) => el.getAttribute('name');
  const remember = (el: Element, n: string) => {
    const id = el.getAttribute('id'); if (id) idToName.set(id, n);
    if (groupDepth > 0 && legend) groupOf.set(n, legend);
    if (label && !label.for && !label.name) label.name = n;
  };
  const rewriter = new HTMLRewriter()
    .on('form', { element(el) {
      if ((el.getAttribute('method') ?? '').toLowerCase() !== 'post') return;
      form = { values: new Map(), types: new Map(), labels: new Map(), options: new Map() };
      forms.push(form);
      el.onEndTag(() => { form = null; });
    } })
    .on('fieldset', { element(el) { groupDepth++; el.onEndTag(() => { groupDepth--; if (!groupDepth) legend = ''; }); } })
    .on('legend', {
      element(el) { inLegend = true; legendText = ''; el.onEndTag(() => { inLegend = false; legend = clean(legendText); }); },
      text(t) { if (inLegend) legendText += t.text; },
    })
    .on('label', {
      element(el) { label = { for: el.getAttribute('for'), text: '', name: null }; el.onEndTag(() => {
        if (!label) return;
        // Keep labels short in the review: drop a trailing explanation in brackets.
        const text = clean(label.text).replace(/\s*\([^)]*\)\.?$/, '');
        if (label.for) labelById.set(label.for, text); else if (label.name && form && !form.labels.has(label.name)) form.labels.set(label.name, text);
        label = null;
      }); },
      text(t) { if (label) label.text += t.text; },
    })
    .on('input', { element(el) {
      const n = name(el); if (!form || !n) return;
      const type = (el.getAttribute('type') ?? 'text').toLowerCase();
      remember(el, n);
      if (type === 'checkbox' || type === 'radio') {
        form.types.set(n, type);
        if (el.hasAttribute('checked')) form.values.set(n, decode(el.getAttribute('value') ?? 'on'));
        else if (!form.values.has(n)) form.values.set(n, '');
      } else {
        form.types.set(n, el.hasAttribute('data-photo-id') ? 'photo' : type);
        form.values.set(n, decode(el.getAttribute('value') ?? ''));
      }
    } })
    .on('textarea', {
      element(el) { const n = name(el); if (!form || !n) return; remember(el, n); form.types.set(n, 'textarea'); form.values.set(n, ''); textarea = n; el.onEndTag(() => { textarea = null; }); },
      text(t) { if (form && textarea) form.values.set(textarea, (form.values.get(textarea) ?? '') + t.text); },
    })
    .on('select', { element(el) {
      const n = name(el); if (!form || !n) return; remember(el, n);
      form.types.set(n, 'select'); form.options.set(n, new Map()); select = { name: n, first: null };
      el.onEndTag(() => { if (form && select && !form.values.has(select.name)) form.values.set(select.name, select.first ?? ''); select = null; });
    } })
    .on('option', {
      element(el) { if (!form || !select) return; option = { value: el.getAttribute('value'), text: '', selected: el.hasAttribute('selected') };
        el.onEndTag(() => {
          if (!form || !select || !option) return;
          const v = decode(option.value ?? option.text.trim()); const text = clean(option.text);
          form.options.get(select.name)!.set(v, text);
          if (select.first === null) select.first = v;
          if (option.selected) form.values.set(select.name, v);
          option = null;
        }); },
      text(t) { if (option) option.text += t.text; },
    });
  await rewriter.transform(res).text();

  for (const f of forms) {
    for (const [n, v] of f.values) if (f.types.get(n) === 'textarea') f.values.set(n, decode(v).replace(/^\n/, ''));
    for (const [id, text] of labelById) { const n = idToName.get(id); if (n && f.types.has(n) && !f.labels.has(n)) f.labels.set(n, text); }
    for (const n of f.types.keys()) {
      const group = groupOf.get(n);
      if (!group) continue;
      const lang = n.endsWith('_en') ? 'English' : n.endsWith('_ar') ? 'Arabic' : '';
      if (lang) f.labels.set(n, `${group} · ${lang}`);
      else if (!f.labels.has(n) || f.types.get(n) === 'photo') f.labels.set(n, group);
    }
  }
  return forms;
}

// ---------- Comparing ----------

export interface DiffRow { name: string; label: string; type: string; current: string; proposed: string; currentText: string; proposedText: string }

const norm = (s: string) => s.replace(/\r\n/g, '\n').trim();

/** The fields the editor changed, comparing their submission with the page's form as it is now. */
export function diff(fields: Fields, forms: LiveForm[]): { rows: DiffRow[]; matched: boolean } {
  const submitted = new Map<string, string>();
  for (const [k, v] of fields) submitted.set(k, submitted.has(k) ? `${submitted.get(k)}, ${v}` : v);
  const names = [...submitted.keys()].filter((k) => !k.startsWith('_'));
  // The form they used is the one on the page that shares the most field names.
  let best: LiveForm | null = null, score = 0;
  for (const f of forms) {
    const s = names.filter((n) => f.types.has(n)).length;
    if (s > score) { best = f; score = s; }
  }
  const rows: DiffRow[] = [];
  const all = new Set([...names, ...(best ? [...best.types.keys()] : [])]);
  for (const n of all) {
    const type = best?.types.get(n) ?? 'text';
    if (n.startsWith('_') || n === 'id' || (type === 'hidden')) continue;
    const isBox = type === 'checkbox' || type === 'radio';
    const proposed = submitted.get(n) ?? (isBox ? '' : null);
    if (proposed === null) continue;
    const current = best?.values.get(n) ?? '';
    if (norm(current) === norm(proposed)) continue;
    const show = (v: string) => isBox ? (v ? 'Yes' : 'No') : type === 'select' ? (best?.options.get(n)?.get(v) ?? v) : v;
    rows.push({ name: n, label: best?.labels.get(n) ?? n, type, current, proposed, currentText: show(current), proposedText: show(proposed) });
  }
  return { rows, matched: Boolean(best) };
}
