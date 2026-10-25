# Phases

Current phase: **Phase 1 (Essentials)**. Started Oct 22, 2026 when Saad said "move to phase 1".

## Done

- 2026-10-22: Project folder set up. BRIEF.md saved in the repo root, CLAUDE.md, PHASES.md, DECISIONS.md and CONTENT-NEEDED.md created, local git repository initialised (no commits yet, no GitHub remote yet).
- 2026-10-22: Phase 1 plan written ([PLAN.md](PLAN.md)), covering all three phases. Prices checked on providers' pricing pages the same day.
- 2026-10-22: CONTENT-NEEDED.md filled with the full Phase 1 list.
- 2026-10-22: Domain deferred by Saad. Plan updated to launch on the free `workers.dev` address (PLAN.md section 3b).
- 2026-10-22: PLAN.md approved by Saad. SETUP-GUIDE.md written (chapter email, Cloudflare, GitHub).
- 2026-10-22: Foundations built and running locally:
  - Astro with the Cloudflare adapter.
  - D1 database structure (`migrations/0001_initial.sql`) and placeholder content (`db/seed-placeholders.sql`).
  - English and Arabic, with right-to-left layout and English fallback.
  - Beirut time helpers.
  - Layout: header, mobile menu, language switch remembered by cookie, footer.
  - 404 page.
- 2026-10-22: Homepage built: hero with Join button, automatic next-event banner (falls back to social links), history journey map, three doors. Checked at desktop and 360 px, in English and Arabic. Type check clean; production build passes.

- 2026-10-22: Checkpoint 1 feedback from Saad applied:
  - Retheme to the IISE logo colours on white.
  - Journey map rebuilt in the style of bssaub.com.
  - New hero with a CRN registration card (copy button tested), CRN chip in the header.
  - Redesigned event banner (date block), numbered doors, new mobile menu and footer.
  - Checked at desktop and 360 px, in English and Arabic. Type check clean; build passes.

- 2026-10-22: Checkpoint 1 round 2 feedback applied: card removed, logo globe in the hero (vector, animated orbit, IE fields), IISE logo in header and footer, fonts changed to Source Sans 3 / Noto Sans Arabic, exact logo colours. Checked at desktop and 360 px, English and Arabic; type check clean; build passes.

- 2026-10-22: AUB registration link set; headline changed to Saad's line; Join page built (CRN + copy, term, draft steps, AUB link); history fill-in sheet added (`content-templates/history-milestones.csv`). Type check clean; build passes.

- 2026-10-22: **Checkpoint 1 passed:** homepage design approved by Saad. Contact links and email saved to settings (from linktr.ee/IISE.AUB).
- 2026-10-22: **Editing panel built** (`/admin`, deployed separately as admin.iise-aub.workers.dev):
  - Overview: what's still to fill in, plus a recent-changes log.
  - Events: list, create, edit, delete. Beirut times, cover photo, draft/published, history-map flag, internal Gold category.
  - History map: list, create, edit, delete. Show/hide, reorder within the same date, photo, source rule.
  - Page text (English/Arabic side by side), Settings & links (with validation), People & access (cabinet admins).
  - Photo upload: resized in the browser, stored in R2, served at `/media/...`.
  - Sign-in: Cloudflare Access token verification in production; local bypass on localhost only.
  - Tested locally:
    - Pages load.
    - A photo upload shows on the homepage map right after saving.
    - The "confirmed needs a source" rule blocks the save, and the uploaded photo is kept after a failed save.
    - Event times convert correctly to UTC.
    - An invalid link and an end-before-start are rejected.
    - The change log records edits.
    - The panel is usable at 375 px.
  - Type check clean; build passes. Test data removed.
  - **Not yet tested:** the real Cloudflare Access sign-in, and `/admin` returning 404 on the public Worker. Both need the deployed site.

- 2026-10-22: Cabinet 2026-27 (from Instagram) and the six teams (confirmed by Saad) loaded. **All remaining Phase 1 pages built**, in English and Arabic:
  - Team, Events list, event pages with `.ics` "Add to calendar", Members (WhatsApp behind Turnstile), Contact.
  - Sponsors, About, Why join, New to IE, History (full-page map), Privacy, 404.
  - Panel sections added: Cabinet & people (roles over time, one-click cabinet handover), Teams, Sponsors (with "agreed to be listed" check).
  - The Overview now also lists teams without descriptions and people without photos or bios.
  - Tested locally:
    - All 28 public URLs return 200 (en + ar), and missing events return 404.
    - The `.ics` file is valid.
    - WhatsApp link: absent from the page until the Turnstile test check passes, then revealed.
    - People and teams editing shows on the Team page.
    - No sideways scroll at 360 px; Arabic year ranges and alignment fixed.
  - Type check clean; build passes.

- 2026-10-22: Saad's changes:
  - **Sponsors removed:** `/companies` contact page, redirect from `/sponsors`, migration 0002.
  - **Weekly puzzle "Coffee Run" built:** `/en/game`; APIs `/api/game/start` and `/api/game/submit`; this-week and this-term leaderboards; last week's winner; teaser on homepage and Members page; panel section "Weekly puzzle"; menu item "Puzzle".
  - Tested locally:
    - A full round plays and scores (947/1000, best route computed, rank shown).
    - Blocked: a second try the same week, a taken nickname from another device, bad nickname characters, a forged token.
    - Arabic at 360 px: board stays left-to-right, labels readable after spacing fix, no sideways scroll.
  - Test data removed. Type check clean; build passes.

- 2026-10-22: Teams renamed with draft descriptions. **Weekly puzzle replaced with "Depot Drop":**
  - Pieces: generator, exact solver, `game_weeks` cache (migration 0003), new board UI with live total and coloured routes, keyboard support, last week's best layout panel, new teaser art, updated text (EN/AR).
  - Tested: a full round (747/1000, 79 vs 59 blocks); the solver matches brute force on 6 cities; Arabic at 375 px with no sideways scroll and 31 px squares.
  - Type check clean; build passes. Test data removed.

- 2026-10-22: **Preview published: https://www.s-majbour.workers.dev** (temporary, on Saad's personal account, hidden from search engines).
  - Done: database created, migrations 0001-0004 applied, all content and photos loaded, secrets set.
  - Checked live: 28 pages (en + ar) return 200; `/` and `/sponsors` redirect; `/admin` and unknown pages return 404; `.ics` works; 9/9 portraits load; WhatsApp link not in page; noindex header on; the puzzle generated and solved this week's city (request about 0.5 s). Test player removed.

- 2026-10-22: Team "join" text set (positions open each fall). **Alumni section built and published:** `/alumni` page, Panel → Alumni, migration 0005. Tested locally: the consent rule hides entries without consent, the filters work, EN/AR labels are correct. Test entries removed. Live: /en/alumni and /ar/alumni return 200 and show "coming soon".

- 2026-10-22: **"Where can IE take you?" page built and published** (`/en/fields`, `/ar/fields`; migration 0006; Panel → IE fields). Tested: quiz scoring, no sideways scroll, Arabic at 375 px, and number order in Arabic counters fixed (also on the puzzle week badge).

- 2026-10-23: "Careers" added to the top menu (8 items; no wrapping at 1000 px and up, English or Arabic). About page, New to IE "IE at AUB" and history stations (1948, 1990, 2014, 2015) filled from official AUB and IISE pages. Applied and deployed to the preview; live pages checked (200, new text present).
- 2026-10-23: GitHub collaboration prepared: `AGENTS.md`, `CONTRIBUTING.md`, pull request checklist, `CODEOWNERS`, `check` workflow, and SETUP-GUIDE Steps 3 and 3b (repository, approval rule, notifications, Cloudflare previews). Tested on a clean copy: install, type check and build pass. Pushed to **github.com/iise-aub/website** (public since Oct 23; Node pinned to 24 in `.node-version` because Astro needs at least 22.23.4) with the chapter account `IISEAUB` on Oct 23, 2026. Step 3b done the same day: `approvers` team (Maintain), ruleset "Protect Main" active (pull request, 1 Code Owner approval, stale approvals dismissed, `check` required, no deletion or force push, org admins may bypass; verified through the GitHub API), and the `www` Worker connected to the repository in Cloudflare (production branch `main`; previews with `npx wrangler versions upload`, not the beta `wrangler preview`, so previews keep the live secrets). From now on the site is published from GitHub, not with `npm run deploy` from a laptop.
- 2026-10-23: **Approval flow tested end to end** with [iise-aub/website#1](https://github.com/iise-aub/website/pull/1) (adds `README.md`), opened by Saad's personal account `SaadMajbour` (Write) as a stand-in for a sub-cabinet member: the review-request email reached iiseaub@outlook.com; `check` and the Cloudflare build passed; branch preview link loaded; merge was blocked until `IISEAUB` approved; Cloudflare published 36 seconds after the merge. Test branch deleted.
- 2026-10-23: **Preview comment** added (`.github/workflows/preview-link.yml`): every pull request gets one comment with preview and live links (English and Arabic), updated on each push. Tested with demo [iise-aub/website#2](https://github.com/iise-aub/website/pull/2) (blue headline): comment posted, preview showed the blue headline, live stayed navy (checked in the browser). Saad saw it and closed it without merging; branch deleted.
- 2026-10-23: Homepage: "Where would you like to start?" moved above the history map, with a new door 02 "Where can IE take you?" (to `/fields`), so first and second years find careers straight away. Later the same day the Companies door was removed from the homepage (page kept, in the footer): three doors, 1 column on phones, 3 from 860 px. Text in `db/update-home-careers-door-2026-10-23.sql` (applied locally and live). Local dev server hung on start (Windows issue), so checked on a Cloudflare branch preview instead: order correct, English desktop and Arabic at 375 px, no sideways scroll.
- 2026-10-23: **History map jump fix** (Saad: clicking a date showed the picture cut in half, "Today" showed nothing). Cause: jumps scrolled the station under the sticky date bar (2 rows, 96 px on phones), mid-reveal animation. Now a click computes the position itself (header + date bar + 16 px), shows the station whole straight away, and sets `scroll-margin-top` for links opened directly. Checked on a branch preview: phone (375 px) and laptop (1280 px), home and History pages; every station lands 16 px below the bar, fully visible. (The hidden browser pane doesn't run smooth scrolling, so the laptop check forced instant scrolling.)
- 2026-10-23: Join page: the "Term to be confirmed" badge removed (Saad); the term line only shows when a term is set.
- 2026-10-25: Coffee with IISE described as a podcast with people working in the field (Members page text and team description; `db/update-coffee-podcast-2026-10-25.sql`, live).
- 2026-10-25: Podcast link set to the chapter Instagram (`db/update-podcast-link-2026-10-25.sql`, live): the "Listen to the episodes" button now shows on the Members page.
- 2026-10-25: **Companies page** filled (`db/update-companies-offer-2026-10-25.sql`, live): why work with us (AUB 9,759 students from 90 countries as of Oct 15 2025, 82,000+ alumni; sourced from aub.edu.lb Facts and Figures) and what we offer (social media exposure, brand recognition, engagement). Checked at 375 px in English and Arabic.
- 2026-10-23: **Join steps** replaced with Saad's real steps (`db/update-join-steps-2026-10-23.sql`, live); AUB's button and term names kept in English in the Arabic version, as they appear on AUB's system.

## In progress

- Team: SETUP-GUIDE.md (Cloudflare and GitHub with iiseaub@outlook.com).
- Cabinet photos: done (Oct 22, 2026). Team page checked: all 9 portraits load, in both sizes.
- Known local issue: the local Cloudflare runtime sometimes crashes on this Windows machine after about a minute (exit code 3221226505). Just restart `npm run dev`. It doesn't affect the deployed site.
- Team: content listed in CONTENT-NEEDED.md (33 items show in the panel's "Still to fill in").

## Next

1. **Checkpoint 2:** Saad reviews all pages (locally until the preview link exists).
2. "How to edit content" guide for non-programmers (including history milestones, and the Arabic year-range tip).
3. Once accounts exist:
   - Create the D1 database and R2 bucket, then deploy both Workers.
   - Set up the Cloudflare Access application for the admin Worker, and set ACCESS_TEAM_DOMAIN, ACCESS_AUD and BOOTSTRAP_ADMINS. Add these steps to SETUP-GUIDE.md.
   - Test sign-in, and that `/admin` returns 404 on the public site.
   - Set secrets on both Workers: `GAME_SECRET` (long random text) and `TURNSTILE_SECRET_KEY`; create the real Turnstile widget and replace the test site key.
   - Load the cabinet photos: `npm run media:cabinet:remote` (after seeding the remote database).
   - Deploy to `www.iise-aub.workers.dev` and switch the review to that preview link.
   - Verify the "(verify at setup)" items in PLAN.md.
   - ~~Push the repo to the chapter GitHub organization.~~ Done Oct 23, 2026 (github.com/iise-aub/website).
3. Remaining pages and the rest of the panel. Checkpoint 2.
4. Content, Arabic review, "how to edit" guide, non-programmer test.
5. Checkpoint 3: launch review against "Definition of done". Lighthouse hasn't been run yet; it needs the deployed site.

## How to run locally (for whoever continues)

1. `npm install`
2. `npm run db:migrate:local`, then `npm run db:seed:local` (first time only)
3. `npm run dev`, then open http://localhost:4321

## Open questions

See "Open questions for Saad" in DECISIONS.md.
