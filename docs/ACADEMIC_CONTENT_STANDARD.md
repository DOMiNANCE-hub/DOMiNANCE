# Reusable DOMiNANCE academic content standard

## Two independent pathways

Study opens course → official unit → topic → concept notes without requiring any questions. Practice filters the actual available bank, explains answers and links to the stable section that teaches the concept. A missing question is an assessment gap, not permission to omit notes. A catalogue title is not authored teaching. Read markers, reading positions and personal practice accuracy remain separate from mastery or official grades.

## Authoring contract

The working reference is BIOL157's `content/biological-chemistry/catalog.json`, its Markdown lessons and `questions.json`. `scripts/academic/content-contract.mjs` validates it; `public/dashboard/academic-contract.js` provides browser link resolution. This is an incremental contract around the existing Cell engine, not a database migration.

| Entity | Required relationship and evidence |
|---|---|
| Course | Stable ID, curriculum scope, official sources, status and explicit release policy. |
| Unit | Stable ID, official title, topic IDs, actual source-page references and separate authored status. |
| Topic | Stable ID, parent unit, official/editorial scope and source mapping. |
| Concept | Stable ID, parent topic/unit, explicit learning goals, lesson, stable teaching section, objective IDs, source references and reviewer/status. |
| Lesson | Stable route-safe ID, original Markdown, stable section IDs mapped to unique headings and individual authored status via its concept. |
| Question | Stable ID, concept/lesson/section, syllabus outcome, stem, four plausible distinct options, original correct-option mapping, teaching rationale, difficulty, cognitive level, source and review status. |
| Source | ID, actual PDF page count/hash or reliable URL, verification scope; no private file bodies or contact details in public assets. |
| Evidence / review | Exact page convention, selected literal/visual checks, differences, excluded claims and unresolved issues. Author verification is distinct from formal approval. |

Never recycle an ID for a different academic item after release. Preserve original answer indices in saved attempts when display options shuffle. For a verified correction, document historical interpretation and migration before changing a key. Existing Cell/Computer IDs stay intact; adopting this contract does not require renaming them.

Lesson section IDs are stable editorial anchors. Browser numeric `lesson:ID:part` routes are resolved from the matching current heading. Persisted reading positions remain the existing account-owned numeric format; appending content preserves old positions. Reordering a released lesson requires an explicit position/version migration, rather than assuming the same numeric index still identifies the same text.

## Content standard

Teach foundations, mechanisms, distinctions, examples and applications to the depth needed for unseen questions. Use equations, tables or original diagrams when they clarify reasoning. Include caveats, misconceptions, explicit-answer concept checks and takeaways where relevant. Do not impose a word or question quota. Use student errors and question review to identify notes gaps, while deriving complete teaching scope from the official outline and lecturer evidence.

Write original explanations rather than copying slides. Record actual PDF pages, not guessed offsets or printed labels. Inspect diagrams where meaning depends on the visual. Independently check doubtful science and record disagreements; exclude unresolved claims from assessed answers. Avoid official examination, completeness, current-year approval or clinical claims without evidence.

Coverage reports separately list official outcomes, notes concepts/lessons, questions and gaps. “draft partial”, “not authored” and “approved” must remain different. Passing structural tests cannot determine scientific correctness, plausible distractors or completeness; a qualified reviewer must assess those.

## Integration contract for Antigravity

Reuse the five-tab interface and existing reader/practice views. `DominanceCellLearning.create(blocks)` creates per-course mappings; `questionsFor(data,'concept:ID')` returns an actual concept pool. `DominanceAcademicContract.sectionRoute`, `questionRoute`, `sectionConcept` and `relatedQuestions` provide teaching links without coupling notes availability to bank size. `academic-courses.js` selects a per-course engine and closure-owned state; it never stores account records in global content objects.

`sectionRoute` returns null for an invalid mapping, rather than routing to arbitrary text. `questionReferences` formats source labels and actual page ranges. The result explanation offers Study this concept; the reader offers Practise this concept. This checkpoint uses existing accessible controls, not final Study Area visual polish. Antigravity can reuse these hooks without changing content IDs or persistence.

The parent `createDashboardStorage` allowlists each course key. Transactions merge completed attempts and reading locations using the course's text-free ID/answer index. Confirmed completions feed Home; pending drafts and skipped answers do not inflate answered counts. The authenticated owner adapter clears on account changes; Firebase owner rules remain unchanged. Student-editable personal results are not trusted examination records.

## Release and validation

Unapproved BIOL157 content lives outside `public`. Normal builds emit an empty blocked content asset plus catalogue titles and text-free validation IDs. Only fixed demo emulator serve mode provides the full draft through no-store middleware; emulator mode cannot be built. There is no client query parameter that enables review content. Do not deploy the review server. Academic approval is a separate documented release change, not an environment flag.

CI checks graph relationships, unique IDs/stems/options, key validity, source bounds, exact teaching links, check parsing and blocked-release behaviour. Behavioral tests cover study with zero questions, concept practice, feedback links, reload/merge, answer shuffling and acknowledgement/account boundaries. Real loopback Auth/Firestore tests verify persistence and denied cross-account access; browser tests verify actual combined workflows and mobile reading. Test source hashes/anchors locally when authorised PDFs are available; CI only validates the committed evidence ledger.

For each batch: update original material and evidence, regenerate coverage/assets, run focused regressions, full tests, emulators, lint/build and supported browser checks, then commit/push a separate draft PR. Report exact authored scope and academic blockers. Do not merge, change rules or deploy without separate authorization.

## Combining the academic drafts

PR #9 owns Computer content, source crosswalk, withheld items and Office evidence; PR #14 owns Cell instructional additions. The BIOL157 branch is based directly on shared development and reuses the same generic reader/state hooks. During integration retain all course definitions, parent allowlisted keys/merge functions, Home confirmed-history inputs, and each emulator-only content middleware. Keep the dynamic question-pool validation ceiling from PR #14. Resolve shared `index.html`, Vite plugin lists, package scripts and transaction selection by combining each course's changes; never discard Antigravity's merged controls or replace the whole dashboard with an older copy. Re-run the combined three-course suite before integration. These isolated branch checks alone do not establish that a future merge is conflict-free.
