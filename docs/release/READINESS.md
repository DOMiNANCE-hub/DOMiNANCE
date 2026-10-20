# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 21 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 23 | 68 | 9/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157 Units 4–10 not authored; Units 1–3 have source-checked teaching drafts pending human academic review.
- Cell: 74 remaining rationales and underdeveloped lessons/figures need targeted completion; current-year official scope unverified.
- Computer: four withheld questions, 15 unexecuted Microsoft Office desktop scenarios, payroll/grading/exactly-40 and version ambiguities; 342 package pages remain unmapped.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

185 individual offline checks and ordinary npm test pass; 40 real Auth/Firestore emulator checks pass with the expanded 68-question Bio bank. Lint/build pass with existing warnings. Chromium traverses 23 Bio lessons/138 sections at 390px and verifies all three course pools (178/114/68), feedback, resume/retry/reload and progress panels. Eleven private source hashes/page counts and 92 literal anchors verified locally; ten selected visual pages inspected across Lectures 1–3.

## Deployment

Existing Vercel project: `do-mi-nance`. Not deployed in this task. Project configuration, preview protection and isolated test Firebase prerequisites still require inspection.

## Exact next checkpoint

Complete BIOL157 Unit 4 from Lecture 4 (71 actual pages): bonding, molecular forces, isomerism/stereochemistry and functional groups. Read and inspect stereochemical/geometry figures before authoring; deliver substantial worked structures and tested concept-linked questions. Cell and Computer documented completion batches remain pending.

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
