# IISE AUB website

The website of IISE AUB, the student chapter of the Institute of Industrial and Systems Engineers at the American University of Beirut. English and Arabic.

- **Want to suggest an edit?** Read [CONTRIBUTING.md](CONTRIBUTING.md). Every change goes through a pull request and is published only after the chapter's approver says yes.
- **Using an AI tool** (Claude Code, Codex, Cursor)? It must follow [AGENTS.md](AGENTS.md).
- **Everyday content** (events, people, page text, photos) is edited in the editing panel, not here.

## Project documents

| File | What it holds |
| --- | --- |
| [BRIEF.md](BRIEF.md) | What the site is and the rules it follows |
| [PHASES.md](PHASES.md) | What's built and what's next |
| [DECISIONS.md](DECISIONS.md) | Everything already decided, with dates |
| [CONTENT-NEEDED.md](CONTENT-NEEDED.md) | Content the team still needs to provide |
| [SETUP-GUIDE.md](SETUP-GUIDE.md) | Chapter accounts: Cloudflare, GitHub, approvals |

## Run it on your laptop

Needs [Node.js](https://nodejs.org) 24 and [Git](https://git-scm.com).

```bash
npm install
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Then open http://localhost:4321. This uses a practice database on your laptop and never touches the live site.

Built with Astro on Cloudflare Workers, with a D1 database.
