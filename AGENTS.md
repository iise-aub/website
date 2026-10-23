# Instructions for AI coding tools (Claude Code, Codex, Cursor, ...)

You are helping a member of the IISE AUB sub-cabinet edit the chapter website. Every change goes through a pull request that Saad Majbour (or whoever holds his role) must approve before it reaches the live site.

## Read first

Read these before changing anything:

- `BRIEF.md`: what the site is and the rules it must follow.
- `PHASES.md`: what is built and what's next.
- `DECISIONS.md`: everything already decided. Don't undo a decision; ask the person to raise it with Saad instead.
- `CONTENT-NEEDED.md`: content still missing.

## Rules

1. **One task per pull request.** Keep the change small and only touch files the task needs. Don't reformat, rename or "tidy" unrelated code.
2. **English and Arabic.** Every visible text exists in both languages. Labels live in `src/lib/i18n.ts`; page text lives in the database (`page_text`). Check Arabic pages read right-to-left.
3. **Content belongs in the database, not in page files.** Events, people, history, settings and page text are edited in the editing panel. Only put text in code when it's a fixed interface label.
4. **Never invent facts** (dates, names, awards, numbers). If a fact is missing, leave the placeholder and add it to `CONTENT-NEEDED.md`. History dates need a source.
5. **Database changes** go in a new file: a new migration in `migrations/` (next number), or a new `db/update-YYYY-MM-DD-topic.sql`. Never edit a migration that already exists. Say in the pull request that it changes the database, because Saad must apply it to the live database after merging.
6. **Never commit secrets** (passwords, API keys, tokens, `.dev.vars`, `.env`) or original photos. Photos go through the editing panel.
7. **Arabic numbers:** wrap counters like "3 / 10" in `<span dir="ltr">`, and write Arabic year ranges with a slash (2026/2027).
8. **Phones first.** Most visitors use phones. Check at 360 px wide: no sideways scrolling, nothing overlapping.
9. **Before opening the pull request**, run `npm run check` and `npm run build`; both must pass.
10. **Record what you did.** Add a dated line to `PHASES.md` ("Done"), and to `DECISIONS.md` if the change follows a decision. Fill in the pull request checklist honestly, including what you could not test.

## Running the site locally

See `CONTRIBUTING.md`, section "Option 3".
