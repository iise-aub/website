// Make a one-time sign-in link for the editing panel from the command line (for the very first admin,
// or if every admin has lost their passkeys). Normally links are made in the panel: Panel access → Sign-in link.
// Usage:  node scripts/panel-invite.mjs <email> --remote [--admin] [--url https://admin.example.org]
//         node scripts/panel-invite.mjs <email> --local --admin --url http://localhost:4321
// --admin gives cabinet admin access (manages who can sign in); without it the person is an editor.
// The link works once and expires in 3 days. Only a hash of it is stored.
import { execFileSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const email = (args.find((a) => !a.startsWith('--') && a.includes('@')) ?? '').toLowerCase();
const where = args.includes('--remote') ? '--remote' : '--local';
const admin = args.includes('--admin');
const urlArg = args[args.indexOf('--url') + 1];
const base = args.includes('--url') ? urlArg : where === '--remote' ? 'https://admin.s-majbour.workers.dev' : 'http://localhost:4321';
if (!/^[^\s@']+@[^\s@']+\.[^\s@']+$/.test(email)) { console.error('Give a valid email address.'); process.exit(1); }

const token = randomBytes(32).toString('base64url');
const hash = createHash('sha256').update(token).digest('hex');
const expires = new Date(Date.now() + 3 * 864e5).toISOString().replace(/\.\d{3}Z$/, 'Z');
const roles = admin ? ['editor', 'cabinet_admin'] : ['editor'];
const sql = [
  `INSERT OR IGNORE INTO users (email) VALUES ('${email}');`,
  ...roles.map((r) => `INSERT OR IGNORE INTO user_roles (user_id, role, granted_by) SELECT id, '${r}', 'panel-invite script' FROM users WHERE email = '${email}';`),
  `INSERT INTO panel_invites (token_hash, user_id, created_by, expires_at) SELECT '${hash}', id, 'panel-invite script', '${expires}' FROM users WHERE email = '${email}';`,
].join('\n');
const file = join(tmpdir(), `panel-invite-${process.pid}.sql`);
writeFileSync(file, sql + '\n');
try {
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['wrangler', 'd1', 'execute', 'iise-aub-db', where, `--file=${file}`, '--yes'],
    { stdio: 'pipe', shell: process.platform === 'win32' });
} finally {
  rmSync(file, { force: true });
}
console.log(`${email} (${admin ? 'cabinet admin' : 'editor'}): ${base}/admin/invite/${token}`);
