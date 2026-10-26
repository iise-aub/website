// Sign out of the editing panel on this browser.
import type { APIRoute } from 'astro';
import { SESSION_COOKIE, endSession } from '../../../lib/panel-auth';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  await endSession(cookies.get(SESSION_COOKIE)?.value);
  cookies.delete(SESSION_COOKIE, { path: '/' });
  return redirect('/admin/login?signed_out=1', 303);
};
