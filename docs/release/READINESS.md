# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 31 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 59 | 222 | 20/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157 Units 7–10 not authored; Units 1–6 have substantial source-checked teaching drafts pending academic review.
- Cell: all 170 original rationales editorially improved and four review-only question revisions documented; remaining source figures, historical microscopy development, precise concept links, human approval and current-year official scope are unresolved.
- Computer: exact manual acceptance steps are prepared but all 15 Microsoft Office desktop scenarios remain unexecuted; four questions withheld; payroll/grading/exactly-40/version ambiguities and 342 unmapped package pages remain open.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

208 combined offline checks and ordinary npm test pass; 40 real Auth/Firestore emulator checks pass with the expanded Bio 222-question bank. Lint/build pass with ten existing warnings and the existing large-entry warning. Chromium traverses all 59 Bio lessons/361 sections and 46 Cell lessons/277 sections at 390px, twelve original figures without clipped labels, Unit 5/6 concept/source/exact-section practice, all eight newer Cell citations and all three full-bank submissions (178/114/222), resume/retry/reload and progress panels. Eleven Bio PDF hashes/page counts and 252 literal anchors verified, plus the Cell 410-page PDF and 123 selected text-page hashes/anchors. No production test or academic sign-off.

## Deployment

Existing Vercel project: `do-mi-nance`. Read-only inspection confirms existing Vite project prj_W0ZnmiQ9iO0oyeFPm4HAffXSiheO in the intended team and SSO protection enabled for all deployments. Six Firebase variables are shared across production and preview, with no RC-branch overrides; isolated preview Firebase is not established. No deployment or environment change performed.

## Exact next checkpoint

Complete BIOL157 Unit 7 Proteins from all 71 actual Lecture 7 pages and three official outline subtopics, including amino-acid ionisation/calculations, peptide chemistry and protein structure; then Units 8–10 as separate tested batches. Finish Cell source/figure and exact-concept review, Computer remaining supported objectives and Office/manual academic decisions, auditable publication and isolated Firebase/Vercel preview readiness.

Microsoft Office remains 0/15 executed: [exact manual acceptance checklist](../csm177/MICROSOFT_OFFICE_ACCEPTANCE.md).

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
