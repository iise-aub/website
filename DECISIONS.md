# Decisions

Format: date, decision, decided by, why.

## Decided

- **2026-10-22. History journey map design: a roadmap through time.** A winding path the visitor travels from the earliest milestone to today. It is not a geographic map. Decided by Saad (BRIEF.md, Phase 1). Why: tells the chapter's story as a journey, and stays light enough for the performance targets.
- **2026-10-22. Budget: domain only** (about $10-15 a year, paid by the treasurer). Everything else on free plans. If a free plan runs out, Claude flags it and Saad decides. Decided by Saad (BRIEF.md).
- **2026-10-22. Timezone: Asia/Beirut** for every event time, check-in window and deadline. Decided by Saad (BRIEF.md).
- **2026-10-22. English opens first**, with an "عربي" switch remembered for the next visit. Arabic drafted in formal Arabic (فصحى) and approved by a native-speaking team member before launch. Decided by Saad (BRIEF.md).
- **2026-10-22. No contact form.** Contact is by Instagram, TikTok, email, WhatsApp (and LinkedIn if a page exists). Decided by Saad (BRIEF.md).
- **2026-10-22. History journey map moved from Phase 2 to Phase 1.** Decided by Saad (BRIEF.md).

- **2026-10-22. Phase 1 started.** Decided by Saad ("move to phase 1").
- **2026-10-22. No custom domain for now; launch on a free hosting address.** Decided by Saad. Why: settle on a domain later. Claude recommended Cloudflare's free `workers.dev` address over Render. Render's free web services sleep after 15 minutes and take about a minute to wake, and its free databases are deleted after 30 days. Consequences: editors sign in with Cloudflare Access one-time codes until a domain exists, and **the domain must be bought before Phase 2**, because member sign-in emails (Resend) need a verified domain. Recorded in PLAN.md section 3b.

- **2026-10-22. PLAN.md approved.** Decided by Saad. This covers:
  - Build setup: Option C, all on Cloudflare (Workers + Astro, D1 database, R2 photos, Turnstile, Web Analytics, later Registrar), our own editing panel, and Resend for login emails once a domain exists. Why: the only option compared whose free plan allows the Phase 3 shop (Vercel Hobby bans selling products), no database pausing (Supabase free pauses after a week), and one login system and one account to hand over.
  - URLs: `/en/...` and `/ar/...` with English slugs.
  - Awards stored as milestones with the category "award", not a separate list.
  - Separate short Join page and fuller Why join page.
- **2026-10-22. Free address name: `iise-aub`.** Decided by Saad. Cloudflare addresses have the form `<site-name>.<account-name>.workers.dev`, so Claude set the account name to `iise-aub` and the site name to `www`, giving `www.iise-aub.workers.dev` instead of the repetitive `iise-aub.iise-aub.workers.dev`. Saad can change this.
- **2026-10-22. No chapter email exists yet.** Reported by Saad. No accounts get created until it does (BRIEF.md section 4). Meanwhile Claude builds and previews on the local computer, and the team follows SETUP-GUIDE.md to create the email and accounts.

- **2026-10-22. Homepage shown before the editing panel.** Decided by Claude. Why: design feedback is the most expensive thing to get late, and nothing in the panel depends on the design. The plan's step order otherwise stands.
- ~~2026-10-22. Provisional look (navy and orange).~~ Replaced by the next entry.
- **2026-10-22. Theme: IISE logo colours and white.** Decided by Saad (checkpoint 1 feedback, sharing the IISE logo).
  - Colours: navy, slate and steel blues from the logo's globe tiles, the logo's grey for secondary text, on white.
  - Type: letterspaced small caps labels (echoing "INSTITUTE OF"). Fonts were later changed in round 2 (see below).
  - The logo's globe linework appears as faint background texture in the journey section and footer.
  - All colours are tokens in `src/styles/global.css`.
- **2026-10-22. Journey map rebuilt to resemble bssaub.com.** Decided by Saad. A thin road winds down the middle between alternating photo and story blocks. The road draws itself as you scroll, with a glowing trail and a bead at its tip; reached stations fill in. On phones the road runs down the side.
  - **Change from the brief, approved by following Saad's reference:** station content (date, title, text, photo) is shown directly, as on BSS, instead of opening only on tap.
  - **"All years" is a pinned year rail.** A strip of every station sits under the header while you read the journey. It highlights where you are, marks the newest station "Latest", and ends with "Today". This replaces the earlier "All years" grid toggle and "Today" button, and keeps the most recent year one tap away.
  - Stations without a photo show a designed navy panel (globe linework plus the year or category) labelled "Photo to come".
  - Reduced motion or no JavaScript: one clean vertical column with a straight line, and nothing moves.
- **2026-10-22. Checkpoint 1, round 2 feedback (Saad).**
  - **Registration card removed** from the hero ("we do not have a card"). The CRN stays as a chip in the header.
  - **Hero shows the globe from the IISE logo** instead. It is redrawn as a vector with the same 4×4 tiles, colours and white gutters, measured from the logo file. A thin orbit with three nodes circles it. Up to five IE fields float around it on wide screens and sit as chips below it on phones. The fields are editable in the panel (`home / hero_fields`), and the wording is a Claude draft.
  - **The logo is in the top-left corner** (cropped from the PNG Saad shared), with "AUB | Student Chapter" beside it on screens wider than 560 px. A white version, made from the same file, is used in the navy footer.
  - **Fonts changed:** Source Sans 3 (very close to the Myriad-style lettering in the logo) for English, Noto Sans Arabic for Arabic. Both self-hosted, free and variable-weight.
  - **Exact logo colours:** navy #1a3668, slate #334d77, mid-blue #4c6589, steel #68809c and grey #717372, sampled from the logo pixels and set as the site tokens.
- **2026-10-22. CRN up front (idea borrowed from bssaub.com).** Round 2: the hero card part was removed (see above); the header chip stays. Decided by Claude. The header shows a "CRN: 5029" chip linking to the Join page (on screens 640 px and wider). The hero shows a registration card with the CRN, its term, a Copy button and "How to register". Both read from the panel settings.
- **2026-10-22. Fixed interface labels live in code, not the database.** Decided by Claude. Labels like "Add to calendar", "Menu" and "Date to be confirmed" are in `src/lib/i18n.ts`. Why: the team never needs to change them, and keeping them out of the panel keeps the panel simple. All page content (headlines, texts, events, milestones, settings) stays editable in the panel.
- **2026-10-22. Arabic dates use Western digits and Levantine month names** (for example "12 تشرين الثاني"), as is common in Lebanon. Decided by Claude, **for the Arabic reviewer to confirm**.
- ~~2026-10-22. Journey map details (snake rows with expanding cards).~~ Replaced by the bssaub.com-style rebuild above. What still holds: it ends at a "Today: the next station is yours" stop with a Join button, awards get a diamond marker, placeholder stations show "Date to be confirmed", and no map library is used.

- **2026-10-22. AUB registration link:** https://sturegss.aub.edu.lb/StudentRegistrationSsb/ssb/registration. Decided by Saad. Stored in the panel setting "AUB club registration link". The Join button opens our Join page (as the brief says), and its main button goes to this link in a new tab.
- **2026-10-22. Homepage headline:** "Engineers make things. Industrial engineers make things better." Decided by Saad. The previous line ("Engineering better systems, together.") was a Claude draft, not an IISE standard motto. Arabic draft: "المهندسون يصنعون الأشياء، والمهندسون الصناعيون يجعلونها أفضل." (for the Arabic reviewer).
- **2026-10-22. Join page built early** so the Join button works. It shows the CRN (with copy button), its term, the steps and the AUB link. **The steps are a Claude draft, marked Placeholder,** until the team confirms AUB's exact steps.

- **2026-10-22. Checkpoint 1 passed: homepage design approved** ("great for now"). Decided by Saad.
- **2026-10-22. Contact details**, given by Saad from https://linktr.ee/IISE.AUB:
  - Instagram @iise_aub, TikTok @iise_aub, the WhatsApp group invite, and the sub-cabinet application form (Microsoft Forms).
  - Chapter email: iiseaub@outlook.com.
  - All are stored as panel settings. The WhatsApp link was saved without the Linktree tracking parameters.
  - The Linktree has no LinkedIn, so none is shown unless the team adds one.
- **2026-10-22. Note on the WhatsApp link:** the brief keeps it behind a robot check on our site, but it is already public on the Linktree, so bots can find it there anyway. The real protection is WhatsApp's "Approve new participants" setting (team action). Raised with Saad.

- **2026-10-22. Chapter email for all accounts: iiseaub@outlook.com.** Decided by Saad. SETUP-GUIDE.md step 1 now secures this account (two-step verification, recovery for two admins) instead of creating a Gmail.
- **2026-10-22. The editing panel is a separate Worker: admin.iise-aub.workers.dev.** Decided by Claude.
  - Why: Cloudflare Access can protect a whole `workers.dev` Worker but not one path, and we have no domain. Same code and the same database and photo store, deployed twice (`npm run deploy` for the public site, `npm run deploy:admin` for the panel).
  - The public Worker never serves `/admin` (404).
  - Sign-in: Cloudflare Access sends a one-time code by email, which needs no domain. The Access policy lets any email request a code.
  - Who may edit is decided by our own users table (editor / cabinet admin), managed in the panel under "People & access". Cabinet handover needs no Cloudflare dashboard and no developer.
  - The first cabinet admins come from the `BOOTSTRAP_ADMINS` setting, on first sign-in only.
  - The panel verifies Access's signed token (signature, audience, issuer, expiry) and refuses everything if Access isn't configured.
- **2026-10-22. Panel language: English only.** Decided by Claude. Editors are AUB students, and the brief's "every page in both languages" is about the public site. Every content field still has English and Arabic side by side.
- **2026-10-22. Photos:** resized in the editor's browser to WebP at 480 and 960 px (plus 1600 px when the original is large enough), then stored in R2. Alt text (English) is asked for on every photo.
- **2026-10-22. History rule enforced in the panel:** a station can only be marked "confirmed" when its source is filled in. Unconfirmed stations show "Date to be confirmed" on the site.
- **2026-10-22. Gold Award categories on events are provisional** (Chapter meeting, Professional development, Community service, Social, Outreach / recruitment, Competition, Other). They are internal only and will be replaced by the categories on the actual Gold report form in Phase 2.

- **2026-10-22. Cabinet 2026-27** loaded from the Instagram post "Meet the IISE Cabinet 2026-2027" (Sep 16, 2026), shared by Saad: Shayene Kamel (President), Maria Moarbes (VP), Maria Hajjar (Head of Growth), Saad Majbour (Secretary), Georges Ghanem (Treasurer), Gabriela Rizkallah (Communications Officer), Clara Samaha (PR Officer), Lynn Cortas (Event Officer), Clara Espiro (Member at Large).
- **2026-10-22. Teams confirmed by Saad:** Technical, Media, Coffee with IISE, Social, PR, IISE & Beyond. Descriptions are placeholders until the team writes them.
- **2026-10-22. Arabic job titles left empty** (the English shows instead) because Arabic titles are gendered. The Arabic reviewer fills them in per person. Decided by Claude.
- **2026-10-22. Arabic year ranges use a slash** ("2026/2027"). With a dash, right-to-left text displays the years reversed. This goes in the editing guide. Decided by Claude.
- **2026-10-22. Simple text formatting in the panel:** in long texts, a blank line starts a new paragraph and lines starting with "- " become a bulleted list. No HTML. Decided by Claude.
- **2026-10-22. Sponsors need consent:** a new sponsor can only be added after ticking "The company agreed to be listed". Decided by Claude.
- **2026-10-22. No "Why join" or "New to IE" in the top menu.** They are reached through the homepage doors and the Join page, keeping the menu short on phones. Decided by Claude; easy to add.

- **2026-10-22. Sponsor list removed; "Companies" kept as a contact page.** Decided by Saad. The Sponsors page became `/companies` (why work with us, what we offer, email button). Old `/sponsors` links redirect there. The sponsors table and its panel section were removed (migration 0002). The homepage's third door is now "Companies".
- **2026-10-22. Weekly game moved forward from Phase 3 to now.** Decided by Saad (the brief planned games for Phase 3, to be designed with the team first; Saad chose the format):
  - **Format: "Coffee Run", a weekly IE puzzle** (Saad chose "IE puzzle"). Deliver coffee to 8-9 stops and return to the cart; shortest route wins, faster time breaks ties. It is an original route-planning (travelling salesman) puzzle.
  - **A new map every Monday 00:00 Beirut,** generated from a secret seed (`GAME_SECRET`). It is the same for everyone and needs no work from the team.
  - **Checked on the server:** the exact best route is computed there, and it recomputes every submitted route, the score and the time (signed start token). One scored try per player per week. Score = 1000 × best ÷ yours.
  - **Players: nicknames for now** (Saad: "AUB email check later"). A random player id is kept in a cookie and nicknames are unique. Easy to play twice by clearing cookies, so fine for fun but not prizes. In Phase 2, players link to verified AUB-email accounts (`game_players.user_id`).
  - **Leaderboards (Saad chose all three):** this week, this term (since a date set in the panel), and last week's winner (on the puzzle page, homepage teaser and Members page).
  - **Panel → Weekly puzzle:** switch on/off, term start date, hide a score or a nickname.
  - Built so more puzzle types (e.g. job scheduling, box packing) can be added later.
- **2026-10-22. Puzzle map uses AUB place names** (Main Gate, College Hall, Jafet Library…) on a stylised, not-to-scale grid. Decided by Claude, for flavour.

- **2026-10-22. History year strip shows every station at once, with no sideways scrolling.** Decided by Saad. On wide screens it spans the full width, stations share it equally, and long titles are shortened with "…" (full title on hover). On phones only the years show, wrapping to a second row if needed.

## Open questions for Saad

These come from the "Still open" list in BRIEF.md. The history facts block launch, not the plan.

0. Domain name and ending (.org or .com). Deferred; needed before Phase 2.

1. History facts: exact dates, wording and sources for IISE worldwide, AUB's introduction of IE, IISE AUB's founding, and the 2024 Best Society award (name and awarding body).
2. AUB student email domain (possibly @mail.aub.edu). Needed by Phase 2.
3. Coffee with IISE: where episodes are published.
4. LinkedIn: does the chapter have a page?
5. ~~Shared chapter email~~ Answered: iiseaub@outlook.com owns all accounts (Saad, Oct 22, 2026).
6. Games: how they work. Needed before Phase 3.
