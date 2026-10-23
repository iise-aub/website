# Setup guide: chapter accounts

For: whoever on the cabinet sets up the accounts. No coding needed. It takes about 30-45 minutes.
Do the steps in order, because each one needs the one before.

**Why this matters:** every account belongs to the chapter, never to one person. When the cabinet changes, access passes on without needing a developer.

---

## Before you start

- Choose **two cabinet members who will be the account admins**, for example the president and the tech lead. Write their names at the bottom of this file under "Record".
- Have a phone number ready for account recovery. Use the phone of one of the two admins.

---

## Step 1: Secure the chapter email (iiseaub@outlook.com)

The chapter already has an email: **iiseaub@outlook.com** (decided by Saad, Oct 22, 2026). Every website account is registered to it. Make sure it is safe and shared before using it:

1. Sign in at **outlook.live.com** with iiseaub@outlook.com.
2. Go to **account.microsoft.com** → **Security** → **Advanced security options**.
3. Turn on **Two-step verification**, using one admin's phone or the Microsoft Authenticator app.
4. Under **Ways to prove who you are**, add a recovery phone or email for **both** admins.
5. Create a **recovery code** (same page) and give a copy to the second admin.
6. If the password is weak or known to past cabinets, change it to a **long password** (at least 16 characters; a few unrelated words is easiest).
7. Store the password where **both admins** can reach it, such as a shared password-manager entry. Never post it in a group chat.

✅ Done when: both admins can sign in to iiseaub@outlook.com, and two-step verification is on.

---

## Step 2: Create the Cloudflare account

1. Go to **dash.cloudflare.com/sign-up**.
2. Sign up with the **chapter email (iiseaub@outlook.com)** from step 1, and a new, different long password. Store it the same way.
3. Confirm the email Cloudflare sends to the chapter email (iiseaub@outlook.com).
4. **Don't add a website or buy anything.** Close any "add a domain" screens. We don't need a domain yet.
5. In the left menu, open **Workers & Pages**. If it asks you to choose a **workers.dev subdomain**, type `iise-aub`. If that's taken, try `iiseaub`, and tell Saad which one you got.
6. Turn on two-factor login: profile icon (top right) → **My Profile** → **Authentication** → set up two-factor, and save the backup codes for both admins.
7. Add the second admin: **Manage Account** → **Members** → **Invite**, using that admin's email, with the **Super Administrator** role. If Cloudflare doesn't allow this on the free plan, skip it and write that down under "Record". Both admins then share the chapter login.

✅ Done when: the subdomain is chosen. The site's address will then be `www.iise-aub.workers.dev`.

---

## Step 3: Create the GitHub account and organization

GitHub stores the website's code.

1. Go to **github.com/signup** and create an account with the **chapter email (iiseaub@outlook.com)**. Username: something like `iise-aub-chapter`.
2. Turn on two-factor login: profile picture → **Settings** → **Password and authentication** → **Enable two-factor authentication**. Save the recovery codes for both admins.
3. Create a free organization: profile picture → **Your organizations** → **New organization** → **Free**.
   - Organization name: `iise-aub`, or the closest available.
   - Contact email: the chapter email (iiseaub@outlook.com).
   - "This organization belongs to": **My personal account**.
4. Invite the second admin's own GitHub account as an **Owner**: organization page → **People** → **Invite member** → role **Owner**.
5. Create one **empty** repository: organization page → **Repositories** → **New repository**.
   - Name: `website`.
   - Visibility: **Public** (recommended: on a free plan, the approval rule in Step 3b works only on public repositories; no secrets are stored in the code). Private works too if the organization gets a paid or education plan.
   - Don't add a README, .gitignore or licence (the project already has them).
6. Tell Claude the organization and repository names. Claude uploads the project; Git opens a browser window once to sign in to GitHub.

✅ Done when: the organization exists with two owners and the empty `website` repository exists.

---

## Step 3b: Approval rule, notifications and live previews (after Claude uploads the project)

**Only Saad's approval puts a change on the live site.**

1. Create the approvers team: organization page → **Teams** → **New team** → name `approvers`, visibility **Visible** → **Create team**. Add the chapter account (and later, whoever takes over Saad's role). Then repository → **Settings** → **Collaborators and teams** → **Add teams** → `approvers` → role **Maintain**. `.github/CODEOWNERS` already names this team.
2. Repository → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**:
   - Name: `protect main`. Enforcement: **Active**.
   - Target branches: **Add target** → **Include default branch**.
   - Tick **Restrict deletions** and **Block force pushes**.
   - Tick **Require a pull request before merging**: required approvals **1**, tick **Dismiss stale pull request approvals when new commits are pushed** and **Require review from Code Owners**.
   - Tick **Require status checks to pass** → **Add checks** → `check`.
   - **Bypass list:** add **Organization admin** (so Saad can still publish urgent fixes himself; GitHub doesn't let anyone approve their own pull request).
   - **Create**.
3. **Invite the sub-cabinet:** Settings → **Collaborators and teams** → **Add people** → their GitHub usernames → role **Write**. Write lets them open pull requests; the rule above stops anything going live without Saad.
4. **Notifications:** Saad, on github.com → profile picture → **Settings** → **Notifications**: keep **Email** on for "Participating, @mentions and custom" and watch the repository (**Watch** → **All Activity**). Install the **GitHub Mobile** app to review and approve from your phone.

**Approved changes go live automatically, and every pull request gets a preview link:**

5. Cloudflare dashboard → **Workers & Pages** → the `www` Worker → **Settings** → **Build** → **Connect** → **GitHub** (approve access for the organization, only the `website` repository).
   - Production branch: `main`. Build command: `npm run build`. Deploy command: `npx wrangler deploy`.
   - **Preview command** (builds for other branches): `npx wrangler versions upload`. Don't use the suggested `npx wrangler preview`: it's a beta with its own separate secrets, so the puzzle would break in previews.
6. Worker → **Settings** → **Domains & Routes**: make sure **Preview URLs** is enabled.

Each pull request then gets a preview link: in its checks list, **Details** next to **Workers Builds: www** (Cloudflare doesn't post it as a comment). The link is `https://<branch-name>-www.<account>.workers.dev`. Two things to know:

- Previews show the **live content** (same database), so they're for checking design and code, not for testing with fake data.
- If a pull request changes the database (a new file in `migrations/` or `db/`), approve it, then ask Claude to apply it to the live database (`npm run db:migrate:remote`, or the new `db/update-…sql` file).

✅ Done when: a test pull request shows the green `check`, a Cloudflare preview link, and can't be merged until Saad approves it.

---

## Step 4: Tell Saad

Send Saad:

- the Cloudflare workers.dev name you got
- the GitHub organization name
- whether the second admin could be added to Cloudflare

Saad passes these to Claude, who connects the site in the next session. Connecting needs one of the admins at a computer to approve a Cloudflare and a GitHub login in their browser. It takes about 10 minutes.

---

## Later, before Phase 2 (not now)

- Buy the domain through Cloudflare (the treasurer pays: about $8.50 for the first year and $11.20 a year after for a .org).
- Create a Resend account with the chapter email, for sign-in emails.
Claude will write a guide for these when the time comes.

---

## Record (fill in, never write passwords here)

| Item | Value |
|---|---|
| Account admin 1 | |
| Account admin 2 | |
| Chapter email address | |
| Where passwords are stored (place, not the password) | |
| Cloudflare workers.dev name | |
| Cloudflare second admin added? | |
| GitHub organization | |
| Date set up | |
