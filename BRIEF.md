# IISE AUB Website: Build Brief

Owner: Saad Majbour (or whoever takes over his role). Last revised: Oct 22, 2026.
Save this file in the repo root as `BRIEF.md`. Add one line to `CLAUDE.md`: "Read BRIEF.md, PHASES.md, DECISIONS.md and CONTENT-NEEDED.md at the start of every session."

---

## 1. About us

IISE AUB is the student chapter of the Institute of Industrial and Systems Engineers at the American University of Beirut, Lebanon. Every event time, check-in window and deadline uses the **Asia/Beirut** timezone.

- **Audiences:** students new to industrial engineering (IE), current members, companies and sponsors, and alumni (from Phase 2).
- **How people arrive:** mostly on phones, through our Instagram, TikTok and WhatsApp links.
- **Languages:** English and Arabic. Every page exists in both.
- **Who maintains it:** a student tech team that changes every year and may include no programmers. Claude writes all the code. The team edits content through an editing panel and follows written guides.
- **Approvals:** only Saad Majbour, or whoever takes over his role, can say "move to phase X" or approve plans and designs.

## 2. Glossary

- **IE:** industrial engineering.
- **CRN:** the number students enter in AUB's system to register for the club. Currently **5029**. It may change each term, so it must be editable, and it is shown together with the term it applies to.
- **Coffee with IISE:** our podcast.
- **Gold Award:** IISE's top recognition for chapters, based on a yearly report (details in Phase 2).
- **Dynamic:** see section 3.

## 3. What "dynamic" means (applies to the whole site)

Nothing the team may need to change is hardcoded in page files. All content lives in the database and is edited through the panel. A change shows on the live site within a few minutes, with no developer and no redeploy.

Concretely:

- **Content-driven pages.** Every page's text, images, links, lists and ordering come from the database in both languages.
- **Automatic sections.** Sections fill and update themselves from shared records: the next-event banner, upcoming events, calendar, recaps, the history journey map, cabinet and team lists, sponsors, and (later) attendance, alumni and shop stock.
- **Automatic states.** Time-based behaviour (event banner switching to social links, check-in windows, "this term's CRN", past vs upcoming events) is computed from data and the Asia/Beirut clock, never edited by hand.
- **Live settings.** The CRN, term, WhatsApp link, social links and contact details are editable settings, not code.
- **Motion and interactivity** (scroll animation, the journey map, filters) must still meet the performance and accessibility checks in "Definition of done". If an effect hurts a score, simplify the effect.

## 4. How Claude should work

Build in three phases, in order. Start a phase only when Saad says "move to phase X".

1. **Plan, then build.** Each phase opens with a short written plan that Saad approves before any building. Phase 1's plan covers all three phases (section 5). Plan for later phases, but do not build them early.
2. **Checkpoints.** Show work in steps: the plan, then the homepage design on a preview link, then the remaining pages, then a launch review. Later phases follow the same rhythm for each feature.
3. **One shared, private GitHub repo.** Every session starts by reading `BRIEF.md` and the files below, and updates them before it ends:
   - `PHASES.md`: done, in progress, next, open questions.
   - `DECISIONS.md`: what was decided, by whom, and why.
   - `CONTENT-NEEDED.md`: what the team must provide, with a name next to each item.
4. **Chapter-owned accounts.** Register every service (domain, hosting, GitHub, database, email, analytics) to a shared chapter email with at least two admins, never a personal account. Cabinet access must pass to the next cabinet without a developer.
5. **Ask, don't guess.** When this brief is unclear or contradicts itself, ask, then record the answer in `DECISIONS.md`.
6. **No invented facts.** Use clearly marked placeholders for missing content. Never invent names, numbers, dates, quotes or testimonials about the chapter. Every historical date shown on the site must have a recorded source in `DECISIONS.md` or `CONTENT-NEEDED.md` before launch.
7. **Content list first.** When a phase starts, fill `CONTENT-NEEDED.md` so the team can gather photos, bios and dates while you build.
8. **Write for non-programmers.** Setup steps and guides go step by step and assume no coding knowledge.
9. **End of each phase.** Run every check in "Definition of done", summarize what was built, update the guides, and list what is still missing.

## 5. What the Phase 1 plan must decide

The plan compares two or three ways to build the site and recommends one, **checked against current pricing pages, not memory**. The site is custom-coded: accounts, check-in, the dashboard, the shop, the journey map and Arabic go beyond what site builders handle well.

The recommended setup must:

- Cost nothing beyond the domain (about $10-15 a year, paid by the treasurer). Everything else stays on free plans. Flag any limit that could bite, such as a database that pauses when unused, email sending caps, build limits, or photo storage.
- Let non-programmers edit, in both languages, through a web panel: events, cabinet and team profiles, photos, page text, history milestones, the CRN and term, and the WhatsApp link.
- Make edits go live without a redeploy (section 3).
- Support right-to-left (RTL) Arabic layouts on every page from the start, including the journey map.
- Use one login system with roles (editor, cabinet, member, alumni, and sponsor if needed), even though only editors use it in Phase 1.
- Run small server-side logic and a database by Phase 2: check-in windows, the dashboard, exports, submissions and orders.
- Keep all data exportable, so the chapter is never locked in.

The plan also sets the sitemap and URLs for all three phases, the user roles, and this shared data model:

- **Events:** one record per event feeds the homepage banner, upcoming list, calendar, recaps, check-in and dashboard. Fields include English and Arabic text, date and time (Asia/Beirut), location, photos, recap, an internal Gold report category, and a **"show on history map"** flag.
- **Milestones:** one record per history entry (see Phase 1, History journey map). Fields: English and Arabic title and text, date (year, or full date when known), category (IE worldwide, AUB, chapter, award), photo(s), source note, order, and visibility. Events and awards flagged "show on history map" appear automatically alongside milestones.
- **People:** one person can hold several roles over time: member, cabinet, alumni.
- **Attendance before check-in exists:** the cabinet logs it in a spreadsheet with the same columns, for import later.

---

## Phase 1: Essentials (launch-ready site)

Phase 1 launches a complete bilingual, dynamic site that non-programmers can keep up to date.

### Homepage

- **Join button** at the top. It opens a short Join page: AUB's club registration link, the current CRN with a copy button and the term it applies to, and the steps to register.
- **Next-event banner**, filled automatically from the events. When nothing is scheduled, it shows our social links instead.
- **History journey map** (see below), placed right after the banner and before the three doors.
- **Three doors:**
  - **New to IE:** what industrial engineering is, the IE path at AUB (the major and where it leads), our mission, and why and how to join.
  - **Current members:** upcoming events, how to join a team, the WhatsApp group and the Coffee with IISE podcast.
  - **Companies & sponsors:** why partner with us, what we offer, past partners and how to reach us.

### History journey map (moved up from Phase 2)

An interactive, scroll-driven "journey map" of our story: a path with stations, one per milestone, running from the earliest milestone to today.

- **Starting milestones (the team confirms every date and wording):**
  1. When IISE was established worldwide.
  2. When AUB introduced industrial engineering.
  3. When IISE AUB was founded.
  4. Best Society award, 2024 (exact award name and awarding body to be confirmed).
  5. Further chapter milestones the team provides (CONTENT-NEEDED.md).
- **Behaviour:**
  - The path draws or advances as the visitor scrolls. Tapping a station opens a card with title, date, text and photo.
  - Stations are generated from the Milestones records plus events/awards flagged for the map. Adding, editing, reordering or hiding a station happens in the panel and updates the map automatically, with no code.
  - The map can be zoomed out to "all years" and the newest station is highlighted. The most recent year is always reachable.
  - Design is decided: a roadmap through time, a winding path the visitor travels from the earliest milestone to today. It is not a geographic map. Record this in `DECISIONS.md` as decided by Saad.
- **Requirements:**
  - Mobile first, comfortable at 360 px wide, touch-friendly.
  - Mirrors correctly in Arabic (path direction, card placement, year order read right to left).
  - Keyboard accessible, with focus order following the timeline, and readable by screen readers as an ordered list.
  - Respects "reduce motion": falls back to a clean vertical timeline with the same content.
  - Light enough to keep the homepage within the Lighthouse targets (lazy-load photos, no heavy map libraries unless justified in the plan).
- **Phase 2 extension:** more detail and photos per milestone year, and automatic stations from recaps. No rebuild needed.

### Pages

- About and mission.
- Why join (member benefits) and how to register. For the club: the CRN and AUB's steps. For IISE membership: a link to IISE's join page, without copying fees or steps that change.
- Meet the cabinet and the teams, including how to join a team.
- Upcoming events, each with "add to calendar".
- Sponsors page, behind the "Companies & sponsors" door.
- Contact: links to Instagram, TikTok, email and WhatsApp, plus LinkedIn if we have a page. No contact form.
- Navigation menu, footer, a 404 page and a short privacy note.

### WhatsApp group link

- Never in plain page text. It appears only after a quick "I'm not a robot" check, which stops bots that scan sites for group links.
- The group has WhatsApp's "Approve new participants" setting on, so admins approve everyone who joins through the link.

### Arabic

- English opens first, with an "عربي" switch on every page that is remembered for the next visit.
- Claude drafts the Arabic in formal Arabic (فصحى). A native-speaking team member approves it before launch.
- If an editor leaves an Arabic field empty, the English shows instead of a blank.
- Layouts mirror correctly right to left, with an Arabic font that matches the brand.

### Quality

- Mobile first, fast and accessible, following IISE's branding guidelines and our logo files.
- Basic SEO in both languages, with link previews that look right on WhatsApp and Instagram.
- Privacy-friendly analytics from launch day, ideally needing no cookie banner.
- A one-page "how to edit content" guide, including how to add and edit history milestones.
- Custom domain on a free hosting plan.

---

## Phase 2: Important additions

Phase 2 builds accounts first, then check-in and the cabinet dashboard on top of them.

### Accounts (build first)

- Sign-in by a one-time link sent by email. No passwords.
- Anyone with a verified email can have an account, including alumni and sponsors.
- Students sign up with their AUB email and expected graduation year, which marks them as current students.
- After the graduation date, the student moves to alumni automatically. Each academic year, the site also emails a one-click "still a student?" link to their AUB address. Anyone who doesn't confirm loses the student label until they do.
- Once accounts exist, the WhatsApp link moves behind login.

### QR check-in

- The dashboard makes a QR code per event, shown on a phone or projector. It changes every minute, so a photo shared in a group chat soon stops working.
- Check-in opens 15 minutes before the start and closes 30 minutes after (Asia/Beirut).
- Attendees scan, sign in if needed, and are checked in once per event.
- Everyone counts the same for now. Telling members from non-members comes later, for example by matching emails to AUB's registration list if the university can export it.

### Cabinet dashboard (cabinet role only)

- Attendance per event and across the year.
- Gold Award figures, with a one-click export that matches the form the chapter submits. IISE's awards page currently ties Gold status to a Chapter Progress and Performance (CPP) report due March 15, plus documented minimums: at least four meetings, monthly contact with members, at least two graduates becoming Young Professional members, and two named officers for next year. Older material calls the report the UCAR. Re-check IISE's awards page when the phase starts, and build the export from the actual form the team provides.
- A cabinet admin adds and removes cabinet access without code.
- An analytics summary, or a link to it.

### Alumni careers

- A filterable list and country-level map, by role, company, industry and country.
- "How I got here" notes, with a LinkedIn link only if the alumnus opts in.
- Alumni submit through a form. Entries go public only after cabinet approval, and alumni can ask to be removed.

### Recaps and podcast

- Past events as recap posts, built from the same event records. "Newsletter" means these posts, not email.
- A Coffee with IISE page that links to or embeds episodes from where they are published.

### Event calendar

A month view, plus a calendar feed members can subscribe to.

### Maintenance guide for future cabinets

Every account and who owns it, yearly handover steps, renewal dates and costs, and fixes for common problems, written for non-programmers.

---

## Phase 3: Extras

Phase 3 adds member profiles, games and a merch shop with our own checkout.

- **Member profiles:** career goals, companies and IE fields of interest, and saved favorites (events, alumni stories, companies). They build on the Phase 2 accounts.
- **Games:** IE-themed puzzles, with scores saved to accounts and a leaderboard. How they work is decided with the team before Phase 3 starts, so do not design or build games until then. Every puzzle is original, not a copy of an existing game.
- **Merch shop (our own checkout):**
  - A catalog with sizes, plus a cart and order flow we build ourselves.
  - Stock counts are visible only to the cabinet. Shoppers see "sold out" when a size runs out.
  - Pre-order drops with a deadline, and pickup on campus.
  - Payment by cash at pickup, or by a Whish or OMT transfer that the treasurer marks as paid in the dashboard.
  - Room to add card payments later. Card gateways in Lebanon generally require a registered company, so this needs a merchant account through AUB or another registered entity. Verify current requirements when this phase starts.
  - Buyers get an order confirmation. The treasurer gets an order list and an export.

---

## Definition of done

A phase is done only when every check below passes, in both English and Arabic.

- Mobile Lighthouse scores of 90 or more in every category on the key pages (the homepage with the journey map included).
- WCAG 2.2 AA: keyboard navigation, alt text, color contrast, visible focus, readable text sizes, and reduced-motion support.
- Tested at 360 px wide on iPhone Safari, Android Chrome, and the Instagram and TikTok in-app browsers.
- Link previews look right when shared on WhatsApp and Instagram.
- No broken links. Every form and flow tested end to end.
- **Dynamic check:** an editor changes an event, a milestone, the CRN and an Arabic text in the panel, and each change appears on the live site within minutes with no developer.
- A non-programmer on the team completes a content update using only the guide.
- From Phase 2: check-in tested for opening and closing times, repeat scans, an expired QR and a first-time user. Roles tested, so a member cannot open the dashboard.
- Saad reviews everything on a preview link before it goes live.

---

## Reference sites

Borrow structure and feature ideas from these sites. Write our own text and use our own photos and branding.

| Site | What to borrow |
|---|---|
| IISE Purdue (main benchmark) | Its menu: membership, a leadership board section with an application page, professional development, and events with newsletters and a photo gallery. Strong photos and "What is IE?" on the homepage. |
| IISE at UMN | Sponsor pages: current sponsors and sponsorship opportunities. |
| IISE at UIUC | Event calendar and photo cards for recent events. |
| UWaterloo IISE | A clean menu, a homepage led by the latest achievement, and blog-style recaps. |
| IISE at WSU | The "why join" list. Also a warning: without a handover, a site goes stale. |

None of these appears to have check-in, a dashboard, an alumni map, a journey-style history or games, so those features are ours to design.

---

## Still open

These stay open until the team answers. Claude asks about any that block the current phase.

**Decisions**

- Budget: domain only (about $10-15 a year, paid by the treasurer). Claude must not assume any monthly fee. If a free plan runs out, Claude flags it and Saad decides.
- History facts: exact dates, wording and sources for IISE worldwide, AUB's introduction of IE, IISE AUB's founding, and the 2024 Best Society award (name and awarding body).
- AUB student email domain: confirm it (possibly @mail.aub.edu).
- Games: how they work, decided before Phase 3.
- Coffee with IISE: where episodes are published (Spotify, YouTube or elsewhere).
- LinkedIn: whether the chapter has a page.

**Team actions**

- [ ] Turn on "Approve new participants" in the WhatsApp group settings.
- [ ] Create a shared chapter email, if there isn't one, to own every account.
- [ ] Get the Gold report form the chapter submits to IISE, from the faculty advisor or last year's cabinet.
- [ ] Collect IISE's branding guidelines and our logo files.
- [ ] Collect history milestones with dates, sources and photos (feeds the journey map).
