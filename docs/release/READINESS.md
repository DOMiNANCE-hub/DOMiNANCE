# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 21 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 14 | 34 | 6/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157 Units 3–10 not authored; first two units remain review drafts.
- Cell: 74 remaining rationales and underdeveloped lessons/figures need targeted completion; current-year official scope unverified.
- Computer: four withheld questions, 15 unexecuted Microsoft Office desktop scenarios, payroll/grading/exactly-40 and version ambiguities; 342 package pages remain unmapped.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

181 individual offline checks (180 combined + strict-course regression), 40 real Auth/Firestore emulator checks, lint/build and actual Chromium all-178/114/34 submissions, feedback, progress panels and 14 Bio lessons/84 sections at 390px pass. Existing eight dormant React warnings and large-entry warning remain. Later content changes require their own batch verification.

## Deployment

Existing Vercel project: `do-mi-nance`. Not deployed in this task. Project configuration, preview protection and isolated test Firebase prerequisites still require inspection.

## Exact next checkpoint

Complete BIOL157 Unit 3 from the fully read 54-page Lecture 3 in one coherent source-checked batch, including correction ledger and independent periodic-trend checks; test before proceeding to Unit 4. Cell/Computer completion batches remain explicitly pending.

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
