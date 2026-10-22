# IISE AUB Website: Plan (covers Phases 1-3)

Status: **draft, waiting for Saad's approval.** Nothing gets built until it is approved.
Written: Oct 22, 2026. All prices and limits below were checked on the providers' own pricing pages that day (links at the end). Anything not checked is marked **(verify at setup)**.

---

## 1. Summary

**Recommendation: Option C, "All on Cloudflare".** The site runs on Cloudflare's free plan. One database holds all content and accounts. Photos live in Cloudflare's file storage. We build our own editing panel at `/admin`.

**No domain for now (Saad, Oct 22, 2026).** The site launches on Cloudflare's free address, which looks like `iise-aub.<chapter-name>.workers.dev`. **It costs nothing.** We add a custom domain later in a few clicks, without rebuilding, and the old address redirects to the new one. Section 3b explains what changes until then. When we do buy one, Cloudflare sells domains at cost: $8.50 for the first year and $11.20 a year after that for a .org, or $10.46 a year for a .com.

Why this option:

1. **It is the only option with no rule against the Phase 3 shop.** Vercel's free plan bans "advertising the sale of a product or service" and taking payments, so the merch shop would break its terms. Cloudflare's free plan has no such rule.
2. **It doesn't fall asleep.** The Supabase free database pauses after a week without activity, which would happen over summer. Cloudflare's database doesn't pause.
3. **One account, one login system, one place for data.** That makes the handover to each new cabinet simpler, and exporting everything is one button.
4. **It suits our visitors.** Most people arrive on phones from Instagram, TikTok and WhatsApp. This setup sends very little code to the phone, which keeps pages fast and Lighthouse scores high.

The cost of this choice: there is no ready-made editing panel, so I build one. That is more work for me, not for the team. The brief already has me writing all the code.

---

## 2. The three options compared

| | **A. Next.js + Payload CMS on Vercel** | **B. Sanity (hosted editor) + Supabase** | **C. All on Cloudflare (recommended)** |
|---|---|---|---|
| Editing panel | Payload's ready-made admin. Polished, with English/Arabic fields built in. | Sanity Studio, hosted and polished. | Our own panel at `/admin`, built for exactly our records and our guide. |
| Edits live without a redeploy | Yes | Yes | Yes. A save clears the cache, so the change is live within about a minute. |
| One login system with roles | Yes | **No.** Sanity logins for editors, Supabase logins for members. Sanity's free plan has only 2 roles (Administrator, Viewer), so every editor would be a full admin. | Yes. Editor, cabinet, cabinet admin, member, alumni and sponsor in one system. |
| Database pauses when unused | Neon pauses after 5 minutes and wakes on the next visit (about a second's delay). It doesn't delete data. | **Supabase pauses after 1 week without activity.** Someone has to unpause it by hand. | No pausing. |
| Shop allowed on the free plan (Phase 3) | **No.** Vercel Hobby is "personal, non-commercial use". It bans selling products and taking payments. | Yes, if hosted on Cloudflare | Yes |
| Shared chapter ownership | **Weak.** Vercel Hobby is a personal account; teams need the paid Pro plan. | Three providers to hand over. | One Cloudflare account, plus GitHub. |
| Backups on the free plan | Neon: 6-hour restore window | **Supabase: no automatic backups** | Weekly automatic export to our file storage, plus an "Export everything" button (see section 7). |
| Page weight on phones | Heavier (Next.js) | Light | Light (Astro) |
| Amount of code I write | Least | Medium | Most (the panel) |

**Why not A:** The terms block Phase 3, and a Hobby account can't be co-owned by two admins.
**Why not B:** Two login systems go against the brief. Every editor would be a full admin, and the member database pauses each summer.

---

## 3. Recommended setup in detail

| Job | Service | Free plan limits (checked Oct 22, 2026) |
|---|---|---|
| Website and server logic | Cloudflare Workers, running **Astro** | 100,000 requests a day. 10 ms of computing time per request. Unlimited free requests for static files (fonts, scripts, styles). |
| Database (content, accounts, later attendance and orders) | Cloudflare **D1** | 5 GB storage. 5 million rows read and 100,000 rows written a day. Resets daily at 00:00 UTC (2-3 am Beirut). |
| Photos | Cloudflare **R2** | 10 GB storage, 1 million uploads and 10 million reads a month, no download charges. |
| "I'm not a robot" check before the WhatsApp link | Cloudflare **Turnstile** | Free, unlimited checks, up to 20 widgets. |
| Analytics | Cloudflare **Web Analytics** | "Available on all plans" and privacy-focused. I'll confirm it sets no cookies before launch **(verify at setup)**. |
| Editor sign-in, until we have a domain | Cloudflare **Access** with one-time PIN: Cloudflare emails a code to approved editors. No domain needed. | Free plan user limit **(verify at setup)**. |
| Login emails (one-time sign-in links), once we have a domain | **Resend**. It only sends from a domain we own, so it waits for the domain. | 100 emails a day, 3,000 a month. |
| Web address | Free `workers.dev` address now. **Cloudflare Registrar** later. | Free now. Later at cost: .org $8.50 first year, then $11.20 a year; .com $10.46 a year. |
| Code storage | **GitHub**, a free organization owned by the chapter email, with one private repo | Free plan limits for private repos and automatic deploys **(verify at setup)**. |

**How the pieces fit:** visitors load pages from Cloudflare, which reads the content from D1. Pages are cached for a short time to stay fast and inside the 10 ms limit, and saving in the panel clears the cache. Editors sign in at `/admin` with a link sent to their email. Phase 2 member accounts use the same login system and database.

### Free-plan limits that could bite

| Limit | Risk | What we do |
|---|---|---|
| **10 ms of computing time per request** (Workers) | Medium. A heavy page could go over. | Serve pages from the cache and keep pages light. If it ever runs out, Workers Paid costs $5 a month, and **Saad decides**. I'll flag it the moment I see it in testing. |
| **100 login emails a day** (Resend) | None in Phase 1, since only editors log in. **Real in Phase 2:** a big event with many first-time sign-ins at check-in could hit it. | Keep people signed in for months, so most sign in only once. Re-check email providers when Phase 2 starts. |
| **10 GB of photo storage** (R2) | Low. Photos are shrunk in the editor's browser before upload (to about 200-400 KB each), so that's roughly 25,000+ photos. | Videos are not uploaded. Link to Instagram, TikTok or YouTube instead. |
| **Daily database caps** (D1) | Very low for a club site | None needed. |
| **Database backups** | Free-plan backup history is unconfirmed **(verify at setup)**. | Weekly automatic export to R2, plus a manual "Export everything" button. |
| **Cloudflare free accounts and multiple admins** | Not confirmed that a free account allows two full admins **(verify at setup)**. | If it doesn't, both admins share the chapter email's login, with the password kept by two people. |

### 3b. Running without a domain for now

**Why not Render:** I checked Render's free plan (https://render.com/docs/free).

- **The site sleeps.** Free web services shut down after 15 minutes without visitors and take about **a minute** to wake up. Most visitors arrive from an Instagram or WhatsApp link, so many would get a blank minute, and the Lighthouse target would fail.
- **The database gets deleted.** Free Render databases expire after 30 days and are deleted 14 days later. They have no backups.

Cloudflare's free address has neither problem and keeps the same setup we'll use with a domain.

**What changes until we add a domain:**

| Area | Without a domain | When we add one |
|---|---|---|
| Web address | `iise-aub.<chapter-name>.workers.dev`. It's long, so we share it as a link rather than type it. | The new domain. The old address redirects, so shared links keep working. |
| Editor sign-in | Cloudflare Access sends approved editors a one-time code by email. Our own role system reads which editor is signed in. Editor access is still managed by cabinet admins without code. | Switches to our own email sign-in links. Needed before Phase 2 accounts. |
| Phase 2 accounts | **Blocked.** Sign-in emails to members need a domain, so the domain must be bought before Phase 2 starts. | Works. |
| Link previews, SEO, analytics | Work as normal. | Search engines move to the new address through the redirect. |
| Chapter email address | Must be a free mailbox such as Gmail. | Could later be `info@` our domain. Not needed. |

**Risks:**

- Cloudflare says `workers.dev` addresses are meant for hobby projects and recommends a custom domain for important sites. That is fine for a launch, but another reason to buy the domain before Phase 2.
- Whether Cloudflare Access can protect the editing panel on a `workers.dev` address isn't confirmed **(verify at setup)**. If it can't, the fallback is sign-in with the editor's Google account. That also needs no domain.

---

## 4. Sitemap and URLs

Every page exists in English and Arabic under `/en/` and `/ar/`, with the same English slugs, for example `/ar/events`. The bare address `/` opens the language the visitor last chose (English by default).

### Phase 1

| URL | Page |
|---|---|
| `/en/` | Homepage: Join button, next-event banner, history journey map, three doors |
| `/en/join` | Short Join page: AUB club registration link, current CRN with copy button and its term, steps |
| `/en/why-join` | Member benefits, and IISE membership (links to IISE's join page) |
| `/en/new-to-ie` | Door 1: what IE is, the IE path at AUB, our mission, why and how to join |
| `/en/members` | Door 2: upcoming events, how to join a team, WhatsApp group (behind the robot check), podcast |
| `/en/sponsors` | Door 3: why partner, what we offer, past partners, how to reach us |
| `/en/about` | About and mission |
| `/en/history` | Full-page journey map, with "all years" view |
| `/en/team` | Cabinet and teams, and how to join a team |
| `/en/events` | Upcoming events |
| `/en/events/[event]` | One event, with "Add to calendar" (`/events/[event].ics`) |
| `/en/contact` | Instagram, TikTok, email, WhatsApp, LinkedIn if any |
| `/en/privacy` | Short privacy note |
| (any wrong address) | 404 page |
| `/admin` | Editing panel (editors only) |
| `/sign-in` | Sign-in by email link |

### Phase 2 (planned, not built yet)

`/account` (my account), `/check-in/[event]` (QR check-in), `/dashboard` (cabinet only), `/en/alumni` (list and map), `/en/alumni/share` (alumni submission form), `/en/recaps` (past events; each recap is the same `/en/events/[event]` page after the event), `/en/podcast`, `/en/calendar` (month view), `/calendar.ics` (subscribable feed).

### Phase 3 (planned, not built yet)

`/en/profile`, `/en/shop`, `/en/shop/[item]`, `/en/cart`, `/en/orders`, `/dashboard/shop` (treasurer). `/en/games` is a placeholder until the team decides how games work.

---

## 5. User roles

One login system. A person can hold several roles at once, and roles change over time.

| Role | Can do | Phase |
|---|---|---|
| **Editor** | Edit all public content in the panel | 1 |
| **Cabinet** | Everything an editor can, plus the dashboard (attendance, Gold Award figures, exports, approving alumni entries) | 2 |
| **Cabinet admin** | Everything above, plus giving and removing editor and cabinet access. At least two people. | 1 (manages editors), 2 |
| **Member** (current student) | Account, check-in, WhatsApp link | 2 |
| **Alumni** | Account, career entry | 2 |
| **Sponsor** | Only if needed later | 2+ |
| **Treasurer** (a cabinet member with an extra permission) | Shop orders, marking payments as received | 3 |

---

## 6. Shared data model

All text fields come in an English and an Arabic version. **An empty Arabic field shows the English instead.** All times are stored precisely and entered and shown in **Asia/Beirut** time.

- **Settings:** CRN, the term it applies to, AUB club registration link, WhatsApp link, Instagram, TikTok, email, LinkedIn.
- **Page text:** every editable heading, paragraph, button label and image on each page, as named blocks (for example "Homepage > New to IE door > text").
- **Events:** title, summary and full text, start and end (Beirut time), location, cover photo and gallery, recap text (Phase 2), internal Gold report category, a "show on history map" flag, and published or draft.
- **Milestones:** title, text, date (year only, or full date when known), category (IE worldwide, AUB, chapter, award), photos, **source note** (required before launch), order, and visible or hidden.
  - **Awards are milestones with the category "award".** This replaces a separate awards list. (Needs your OK, see section 10.)
  - The journey map shows visible milestones, plus events flagged "show on history map", in date order.
- **People:** name, photo, short bio, optional LinkedIn link, graduation year, and a link to their account (from Phase 2).
- **Roles over time:** person, role (member, cabinet, alumni), position (for example "Vice President"), team, start and end. This is how one person is a member, then cabinet, then alumni.
- **Teams:** name, description, how to join, order.
- **Sponsors and partners:** name, logo, link, current or past, years, order, visible.
- **Photos:** the stored file in several sizes, plus English and Arabic alt text (required).
- **Change log:** who changed what and when, for accountability across cabinets.
- **Phase 2:** attendance, alumni career entries, submissions.
- **Phase 3:** products, sizes and stock, pre-order drops, orders.

### Attendance before check-in exists

The cabinet logs attendance in a spreadsheet with exactly these columns, so it imports directly in Phase 2:

`event_title | event_date (YYYY-MM-DD) | full_name | email | aub_student (yes/no) | source (manual)`

I'll add a template file to the repo once the plan is approved.

---

## 7. How key requirements are met

- **No developer for edits:** every piece of text, image, list and setting comes from the database. Saving clears the cache, and the change shows within about a minute.
- **Automatic states:** the next-event banner, "upcoming vs past", and the switch to social links when nothing is scheduled are all worked out from the event dates and the Beirut clock on every page view. Nobody switches them by hand.
- **Arabic:** right-to-left layout on every page from the start. Layouts use direction-neutral styling, so they mirror automatically. Arabic font: a self-hosted Arabic typeface matching the brand, chosen once we have IISE's branding guidelines. **IBM Plex Sans Arabic** is my starting candidate. I draft the Arabic in فصحى, and a native-speaking team member approves it.
- **The editing panel:** English and Arabic fields sit side by side, with a preview before publishing. Upload a photo and it is resized automatically, and alt text is required. Milestones and team lists reorder by drag and drop. Plain words, no technical terms.
- **WhatsApp link:** never in the page code. The browser receives it only after passing Turnstile's robot check. In Phase 2 it moves behind login.
- **Exports:** an "Export everything" button in the panel (spreadsheet files plus photos), and a weekly automatic copy. The chapter is never locked in.
- **SEO and link previews:** page titles, descriptions and share images in both languages, with language links between the English and Arabic versions.

### The history journey map

- **Built without a map library:** a drawn line (SVG) with a few kilobytes of code. Photos load only when a card opens or comes near the screen.
- **On phones (360 px):** a winding path running down the page. On wide screens it winds across.
- **As you scroll,** the line draws itself up to where you are. Tapping a station opens a card with title, date, text and photo.
- **"All years" button** zooms out to show every station at once. The newest station is highlighted, and a "Today" button jumps to it.
- **In Arabic,** the path, card placement and year order mirror right to left.
- **For screen readers** the stations are an ordered list, and keyboard focus follows the timeline.
- **With "reduce motion" on,** it shows a plain vertical timeline with the same content.

---

## 8. Phase 1 steps and checkpoints

1. **Setup (with the team):** chapter email, Cloudflare account, the free web address, GitHub organization and repo. The domain and Resend come later, before Phase 2. I write a step-by-step setup guide; the team clicks through it.
2. **Foundations:** database, login, the editing panel for settings, events and milestones, English/Arabic and right-to-left support.
3. **Checkpoint 1: homepage design** on a preview link, including the journey map with placeholder milestones (clearly marked).
4. **Remaining pages** and the rest of the panel (people, teams, sponsors, page text).
5. **Checkpoint 2: all pages** on the preview link.
6. **Content goes in, Arabic review, the "how to edit" guide,** and a non-programmer tests the guide.
7. **Checkpoint 3: launch review** against every item in "Definition of done", in both languages. Then it goes live on the domain.

## 9. Phase 2 and 3 notes (planning only)

- **Phase 2:** accounts first, using the same login system with sign-in links. Then QR check-in: the code changes every minute, and check-in is open from 15 minutes before to 30 minutes after the start, Beirut time. Then the dashboard, with the Gold export built from the actual form. Then alumni, recaps, the podcast page and the calendar. The daily cron jobs (graduation → alumni, the yearly "still a student?" email, backups) fit within Cloudflare's 5 free scheduled jobs. **Re-check the email sending limits before building.**
- **Phase 3:** the shop runs on the same database. Payment is cash or a Whish/OMT transfer marked as paid by the treasurer, with the order flow designed so card payments can be added later through a registered entity. Games wait for the team's decision.

## 10. What I need from you

**To approve:**

1. **Option C (all on Cloudflare)** as the build setup.
2. **URL pattern** `/en/...` and `/ar/...` with English slugs.
3. **Awards as milestones** with the category "award", rather than a separate list.
4. **Separate Join and Why join pages** (short Join page for the CRN and steps, and a fuller Why join page for benefits and IISE membership).

**To answer:**

5. ~~Domain name~~ **Deferred (Saad, Oct 22, 2026).** We launch on the free `workers.dev` address. The domain must be bought **before Phase 2**.
6. **Shared chapter email:** does one exist? Accounts can't be created until it does. Without a domain, it will be a free mailbox such as Gmail.
7. **A name for the free address,** for example `iise-aub`. It becomes part of `iise-aub.<chapter-name>.workers.dev`, so short and recognisable is best.

## Sources (checked Oct 22, 2026)

- Supabase pricing: https://supabase.com/pricing
- Vercel pricing: https://vercel.com/pricing and fair use / commercial use: https://vercel.com/docs/limits/fair-use-guidelines
- Cloudflare Workers, D1, R2, KV pricing: https://developers.cloudflare.com/workers/platform/pricing/
- Cloudflare Workers limits: https://developers.cloudflare.com/workers/platform/limits/
- Cloudflare Turnstile plans: https://developers.cloudflare.com/turnstile/plans/
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/
- Cloudflare Registrar (at cost): https://www.cloudflare.com/products/registrar/ and prices: https://cfdomainpricing.com/
- Render free plan: https://render.com/docs/free
- Cloudflare workers.dev addresses: https://developers.cloudflare.com/workers/configuration/routing/workers-dev/
- Cloudflare Access one-time PIN: https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/
- Resend needs a verified domain to send: https://resend.com/docs/dashboard/domains/introduction
- Neon pricing: https://neon.com/pricing
- Sanity pricing: https://www.sanity.io/pricing
- Resend pricing: https://resend.com/pricing
- Netlify pricing (considered as a host; its 300-credit free plan didn't clearly state what happens at the limit): https://www.netlify.com/pricing/
- Payload on Cloudflare: its template recommends Cloudflare's paid plan, which is why Payload isn't combined with option C.
