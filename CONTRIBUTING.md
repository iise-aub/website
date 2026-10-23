# How to suggest an edit to the website

For sub-cabinet members. You never change the live site directly. You suggest an edit, Saad gets an email, looks at it (with a preview link of the site), and approves or rejects it. Only approved edits go live, about a minute after approval.

**First:** make a free GitHub account with your own email and send Saad your username. He adds you to the project.

**Is it everyday content?** Events, team bios, photos, page text, history stations, the CRN and links are edited in the **editing panel**, not here. Ask Saad for panel access.

---

## Option 1: small text fix, in the browser (no tools)

1. Open the project on github.com and find the file (use the `t` key to search by name).
2. Click the **pencil** icon (Edit).
3. Make your change.
4. Click **Commit changes…** and choose **"Create a new branch for this commit and start a pull request"**. Give the branch a short name, like `fix-team-typo`.
5. Click **Propose changes**, fill in the checklist, then **Create pull request**.

## Option 2: with an AI tool in the browser (no installs)

Use **Claude Code on the web** (claude.ai/code) or **Codex in ChatGPT**:

1. Connect it to GitHub when it asks, and pick the `iise-aub` website repository.
2. Describe one task clearly, for example: "On the Events page, make the date bigger on phones. Keep the Arabic version working."
3. Ask it to open a pull request when it's done.
4. Open the pull request on GitHub, check the checklist, and wait for the preview link.

The AI reads `AGENTS.md` (Codex) or `CLAUDE.md` (Claude), which hold our rules.

## Option 3: on your own laptop (for Technical Development)

Install once: [Node.js](https://nodejs.org) (LTS version) and [Git](https://git-scm.com). Then:

```bash
git clone https://github.com/iise-aub/website.git
cd website
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Open http://localhost:4321. This uses a practice database on your laptop; nothing you do there touches the live site. Photos of the cabinet don't load locally unless you also run `npm run media:cabinet:local` with the photo files, which are not in the repository; that's fine.

The editing panel also works locally at http://localhost:4321/admin.

Then work with Claude Code, Codex or by hand:

1. Make a branch: `git switch -c short-name-of-task`
2. Make the change. Before finishing, run `npm run check` and `npm run build`.
3. Push and open a pull request: `git push -u origin short-name-of-task`, then click the link Git prints. (Claude Code and Codex can do this step for you.)

---

## After you open a pull request

- **Automatic checks** run. A red ✗ means something is broken; open "Details" to see what, fix it, and push again.
- **A preview link** appears as a comment after a minute or two. Open it on your phone, in English and Arabic.
- **Saad reviews it.** He may approve it, ask for changes (fix them on the same branch; the pull request updates by itself), or close it.

## Good pull requests

- One task each. A typo fix that touches 40 files gets rejected.
- Say what you changed and why, in plain words, with a screenshot if it's visual.
- Mention it if your change needs anything else: a database change, a new setting, new content.
