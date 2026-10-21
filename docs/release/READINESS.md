# Three-course release readiness

Branch: `release/hb1-three-course-rc-20261020`. This report separates draft teaching from academic approval. No student release is authorised.

Draft integration PR: [#17](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/17). Input PRs: [#9](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/9), [#13](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/13), [#14](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/14), [#15](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/15), [#16](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/16).

| Course | Draft lessons | Review MCQs | Official coverage | Student release |
|---|---:|---:|---|---|
| Cell Structure | 46 | 178 | 31 available 2025 objectives; current-year scope unverified | Blocked |
| Computer Appreciation | 18 | 114 | Official syllabus unavailable; 18 source-derived lesson objectives | Blocked |
| Biological Chemistry | 107 | 431 | 34/34 topics with draft notes | Blocked |

## Remaining blockers

- No formal academic sign-off for the final student-visible content.
- BIOL157: all ten units and 34 listed topics have substantial source-checked drafts; independent human academic review and explicit publication approval remain outstanding.
- Cell: 178-question instructional review is local-emulator-only, but the normal asset still retains the legacy 46-lesson/170-question bank. Its formal approval is not independently established here; the publication process must account for it before any RC deployment. Remaining source figures/history, 154 remaining feedback targets and current-year scope remain unresolved.
- Computer: exact manual acceptance steps are prepared but all 15 Microsoft Office desktop scenarios remain unexecuted; four questions withheld; payroll/grading/exactly-40/version ambiguities and 342 unmapped package pages remain open.
- Protected preview requires verified existing Vercel project configuration and isolated test Firebase; production rules/auth domains/data separation/rollback not yet verified.

## Verification

245 offline and 40 real local Auth/Firestore checks pass with the 431-question Bio bank, no skips/failures. Lint/build pass with ten existing warnings and the large-entry warning. Chromium traverses all ten authored Bio units, 107 lessons/713 sections and 46 Cell lessons/277 sections at 390px, twenty-five combined figures without clipped labels, Unit 5–10 exact feedback links and real Excel/PowerPoint plus corrected Cell cytoskeleton result-to-section returns, eight newer Cell citations and full banks (178/114/431), resume/retry/reload and three private progress panels. Eleven Bio PDF hashes/page counts and 452 literal anchors verified; 131 selected visual pages inspected. Previous Cell PDF/123-page evidence retained, not newly recertified here. No production test or formal academic sign-off.

## Deployment

Existing Vercel project: `do-mi-nance`. Read-only inspection confirms existing Vite project prj_W0ZnmiQ9iO0oyeFPm4HAffXSiheO in the intended team and SSO protection enabled for all deployments. Six Firebase variables are shared across production and preview, with no RC-branch overrides; isolated preview Firebase is not established. No deployment or environment change performed.

## Exact next checkpoint

Complete the remaining 154 Cell feedback mappings and verified microscopy/centrifugation teaching gaps; complete supported Computer lookup teaching; implement auditable human approval/publication and isolated Firebase/Vercel preview readiness. Preserve all 114 Computer mappings and 24 Cell cytoskeleton targets/corrections. Office execution and academic decisions require documented human evidence.

## Tested implementation checkpoints

- Five-PR integration and validation: [`dacbb15`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/dacbb154b59b3be2beb973dd98e780a99e98f03e)
- Bio Unit 3: [`34cfa83`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/34cfa8379afe675fac486b349b9544d2fed3bf09)
- Bio Unit 4: [`5e3323d`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/5e3323d594b1ea4c0f03ce2a6ab54e14d4203314)
- Cell rationales and verified corrections: [`b637032`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/b637032d0c766b72de99c5043d0371ffeae7a258)
- Bio Unit 5: [`1bc3d8d`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/1bc3d8d3e635b203dc7070c0952004784e0848d8)
- Office manual acceptance preparation: [`f0272e6`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/f0272e6f4341c77bceb20ddcc56bcf80033bf34b)
- Bio Unit 6: [`4bb8a37`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/4bb8a374060c677ea457e9feac68c18645050352)
- Bio Unit 7: [`5991d51`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/5991d514d2c1213b6744546e36c2a129e6a2252a)
- Bio Unit 8: [`7c83ea5`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/7c83ea56b5006049e475f358f49eef2a8ccc18f0)
- Bio Unit 9: [`d55b924`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/d55b924160901706e04e8fded89624d145e3843d)
- Bio Unit 10: [`6c84fa7`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/6c84fa75400ec457e61a18acfd3f83512f0804e6)
- PowerPoint exact feedback links: [`8dab397`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/8dab397b1ecdf6eb36c833549ad475b0bd4a8965)
- All Excel feedback links: [`bbc08e4`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/bbc08e43344070de2bd797bb0c5dc52a74ec8f6c)
- Cell cytoskeleton teaching alignment: [`54fa7bb`](https://github.com/DOMiNANCE-hub/DOMiNANCE/commit/54fa7bbb6426611be981d75133f17e496e3b7db6)

Latest implementation CI: [success](https://github.com/DOMiNANCE-hub/DOMiNANCE/actions/runs/39645148378). Exact continuation: [CONTINUE.md](CONTINUE.md).

Microsoft Office remains 0/15 executed: [exact manual acceptance checklist](../csm177/MICROSOFT_OFFICE_ACCEPTANCE.md).

Detailed course checklists, source limitations, test evidence and original PR head SHAs: [READINESS.json](READINESS.json). Regenerate with `node scripts/report-three-course-release.mjs` after every content batch.
