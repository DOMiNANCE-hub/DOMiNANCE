# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

Draft integration PR: [#17](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/17). Input PRs: [#9](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/9), [#13](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/13), [#14](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/14), [#15](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/15), [#16](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/16).

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 31 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 85 | 345 | 27/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157 Units 9–10 not authored; Units 1–8 have substantial source-checked teaching drafts pending academic review.
- Cell: all 170 original rationales editorially improved and four review-only question revisions documented; remaining source figures, historical microscopy development, precise concept links, human approval and current-year official scope are unresolved.
- Computer: exact manual acceptance steps are prepared but all 15 Microsoft Office desktop scenarios remain unexecuted; four questions withheld; payroll/grading/exactly-40/version ambiguities and 342 unmapped package pages remain open.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

224 offline checks and 40 real local Auth/Firestore checks pass with Bio’s expanded 345-question bank, no skips/failures. Lint/build pass with ten existing warnings and the existing large-entry warning. Final Chromium traverses 85 Bio lessons/548 sections and 46 Cell lessons/277 sections at 390px, nineteen combined figures without clipped labels, Unit 5/6/7/8 exact source-feedback links, eight newer Cell citations and full-bank submissions (178/114/345), resume/retry/reload and three private progress panels. Eleven Bio PDF hashes/page counts and 380 literal anchors verified; 101 selected visual pages inspected. Previous Cell PDF/123-page evidence retained, not newly recertified by this enzyme batch. No production test or formal academic sign-off.

## Deployment

Existing Vercel project: `do-mi-nance`. Read-only inspection confirms existing Vite project prj_W0ZnmiQ9iO0oyeFPm4HAffXSiheO in the intended team and SSO protection enabled for all deployments. Six Firebase variables are shared across production and preview, with no RC-branch overrides; isolated preview Firebase is not established. No deployment or environment change performed.

## Exact next checkpoint

Read all 28 actual Lecture 9 pages and implement both Metabolic Pathways topics as a complete tested batch, then all 48 actual Lecture 10 pages and five Lipids topics with independent source-flag checks. Finish remaining Cell/Computer source and exact-concept gaps, human Office/academic decisions, auditable publication and isolated Firebase/Vercel preview readiness.

## Tested implementation checkpoints

- Five-PR integration and validation: [`dacbb15`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/dacbb154b59b3be2beb973dd98e780a99e98f03e)
- Bio Unit 3: [`34cfa83`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/34cfa8379afe675fac486b349b9544d2fed3bf09)
- Bio Unit 4: [`5e3323d`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/5e3323d594b1ea4c0f03ce2a6ab54e14d4203314)
- Cell rationales and verified corrections: [`b637032`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/b637032d0c766b72de99c5043d0371ffeae7a258)
- Bio Unit 5: [`1bc3d8d`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/1bc3d8d3e635b203dc7070c0952004784e0848d8)
- Office manual acceptance preparation: [`f0272e6`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/f0272e6f4341c77bceb20ddcc56bcf80033bf34b)
- Bio Unit 6: [`4bb8a37`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/4bb8a374060c677ea457e9feac68c18645050352)
- Bio Unit 7: [`5991d51`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/5991d514d2c1213b6744546e36c2a129e6a2252a)

Latest implementation CI: not recorded. Exact continuation: [CONTINUE.md](CONTINUE.md).

Microsoft Office remains 0/15 executed: [exact manual acceptance checklist](../csm177/MICROSOFT_OFFICE_ACCEPTANCE.md).

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
