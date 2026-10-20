# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 31 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 35 | 119 | 13/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157 Units 5–10 not authored; Units 1–4 have substantial source-checked teaching drafts pending academic review.
- Cell: all 170 original rationales editorially improved and four review-only question revisions documented; remaining source figures, historical microscopy development, precise concept links, human approval and current-year official scope are unresolved.
- Computer: four withheld questions, 15 unexecuted Microsoft Office desktop scenarios, payroll/grading/exactly-40 and version ambiguities; 342 package pages remain unmapped.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

193 combined offline checks and ordinary npm test pass; 40 real Auth/Firestore emulator checks pass. Lint/build pass with ten existing warnings and the existing large-entry warning. Chromium traverses all 35 Bio lessons/213 sections and 46 Cell lessons/277 sections at 390px, seven original figures without clipped labels, all eight newer Cell citations and all three full-bank submissions (178/114/119), feedback, resume/retry/reload and progress panels. Eleven Bio PDF hashes/page counts and 147 literal anchors verified, plus the Cell 410-page PDF and 123 selected text-page hashes/anchors. No production test or academic sign-off.

## Deployment

Existing Vercel project: `do-mi-nance`. Read-only inspection confirms existing Vite project prj_W0ZnmiQ9iO0oyeFPm4HAffXSiheO in the intended team and SSO protection enabled for all deployments. Six Firebase variables are shared across production and preview, with no RC-branch overrides; isolated preview Firebase is not established. No deployment or environment change performed.

## Exact next checkpoint

Complete BIOL157 Unit 5 Carbohydrates from all 58 actual Lecture 5 pages, including stereochemical/ring/reducing-end/test reasoning, then Units 6–10 as separate tested batches. Retain Cell source/figure and exact-concept review, Office 15 manual acceptance and four withheld questions, and auditable publication/Firebase preview gates.

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
