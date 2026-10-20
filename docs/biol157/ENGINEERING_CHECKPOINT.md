# BIOL157 engineering checkpoint

Based directly on development `3b5368fda5659c13b8b4e9b533e52009dc628832`. Reuses the generic academic registry/state/reader hooks developed in PR #9, with optional Computer support so this draft remains independent of that content branch. Preserves merged Antigravity UI Sprints 01–05, Cell's 46 lessons/170 IDs, account identity and private history. The only added CSS is the exact reader-scoped section-picker shrink rule already used in #9/#14.

The account shell imports only text-free BIOL157 catalogue/index/state code. Full notes/questions live in `content/biological-chemistry`, served only by `npm run dev:emulator`. Normal build emits an empty blocked asset. No source PDF, ZIP, private contact details or credentials are included. A normal build can preserve preview history through the index but cannot resume preview teaching/questions; fictional review accounts should remain in review mode.

Local commands:

- `npm run content:biol157`: validate hierarchy/links/source bounds, compile text-free public assets and coverage.
- `node scripts/academic/verify-biol157-sources.mjs /path/to/authorised/lecturer_sources`: compare eleven hashes/page counts and 48 exact anchors without copying PDFs into Git. Requires pdftotext.
- `npm test`, `npm run lint`, `npm run build`.
- Fixed demo emulators and `npm run test:emulators`; no production configuration is used.

Validation results and PR commit are recorded after the final verification run. Automated checks establish structural/software behavior, not final academic approval. Physical-device smoothness, screen-reader acceptance and external lecturer approval remain unverified.

## Verified results — 2026-10-20

- 148 individual offline checks pass (`node --test --test-isolation=none tests/*.test.js tests/*.test.cjs`); the ordinary `npm test` runner also passes all 18 test files.
- 37 real loopback Auth/Firestore checks pass, including full 34-question Bio draft/completion transactions, saved reading position, relogin, retained history and denied cross-account reads/writes. Existing Cell/account/community/permission tests are included.
- Lint passes with the existing eight dormant React warnings; production build passes with the existing large-entry warning. Normal generated Bio content remains an empty blocked asset.
- Actual Chromium fictional signup/onboarding, all ten unit cards, honest unauthored unit, independent notes, concept practice, exit/resume, exact question-to-notes link, all-34 submission, retry, reload/resume and existing Cell reader/practice/results pass. All 14 Bio lessons / 84 sections open at 390px without document overflow or page errors. Desktop journey checked at 1440px.
- Eleven PDF hashes/page counts and all 48 literal anchors match the authorised attachment. Six selected figure pages were separately inspected; original figures remain outside Git.
- Re-fetched development before commit: still `3b5368f`. No source/rules/production changes. The three-branch combination is a separate integration check, not implied by these isolated branch results.

The first browser retries exposed shared Vite dependency-cache invalidation between concurrently running worktrees. A temporary configuration outside Git gave this test server its own cache; the final complete run passes. No application change was needed for that test-environment issue.
