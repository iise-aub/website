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
5. Don't create a repository. Claude sets that up in the next session.

✅ Done when: the organization exists with two owners.

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
