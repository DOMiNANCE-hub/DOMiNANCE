# Computer Appreciation academic review

The preserved baseline contains 12 lessons and 72 explained MCQs. The incremental internal review contains **18 lessons and 114 MCQs**, including six new lessons and 18 additional PowerPoint questions. These are source-based practice candidates, not certified past examination questions or a verified complete syllabus.

## Release status

**Student publication is blocked pending academic approval.** Normal development, preview and production builds receive an empty Computer content asset. The full internal review bank is supplied only by Vite middleware in fixed local emulator serve mode (`npm run dev:emulator`), with a visible review label. Emulator mode cannot be built for deployment. No URL/environment override approves a release.

A text-free ID/answer-letter index preserves validation of existing private drafts/history and confirmed Home totals without reopening held lessons or questions. Existing account records are not migrated or deleted. A future student release requires an explicitly reviewed approval/allowlist implementation; changing a flag alone cannot publish it.

## Source and reconciliation

The available **Computer Appreciation — CSM 177 Lecturer Notes.pdf** identifies CSM 177 HB1, Microsoft Excel and PowerPoint 2016. Its 542-page identity/hash and Drive reference are in `manifest.json`. Citations use actual PDF page numbers including title pages. No original PDF, slide image, complete uploaded package, assignment submission or past paper is copied into the app.

The expanded package contains 58 lessons, 270 candidate MCQs and four withheld items. Its claimed original 541-page PDF is absent. Text-anchor matching establishes **199 package-to-actual page matches**, with 342 pages unresolved; 32 actual-PDF fact anchors support the incremental questions. These are overlapping evidence counts, not full source coverage. No blanket page offset is applied.

[Current evidence, exact coverage and academic holds](../../docs/csm177/READINESS.md) · [Page crosswalk](../../docs/csm177/source-page-reconciliation.json) · [58-lesson / 270-candidate dispositions](review/package-disposition.json).

## Internal lesson inventory

| Block | Preserved baseline | Incremental lessons | Review MCQs |
|---|---|---|---:|
| Spreadsheet Foundations | CA01 data entry; CA02 editing/fill; CA03 formulas/references | CA13 custom lists; CA14 named ranges; CA15 cross-sheet/3-D references | 30 |
| Spreadsheet Functions | CA04 common/date; CA05 statistics/counting; CA06 text/logical/financial arguments | CA16 lookup/reference glossary | 22 |
| Data Handling & Charts | CA07 formats/printing/files; CA08 charts; CA09 sorting/filtering | CA17 consolidation; CA18 print titles/headers/page breaks | 26 |
| Presentations | CA10 layouts/themes/files; CA11 objects/media; CA12 views/printing/effects | Source-linked extensions within CA10–12 | 36 |

The original lesson/question files and all 72 answer mappings remain unchanged. Review additions live separately in `review/`. Of the 42 incremental questions, 24 selectively adapt package candidates with preserved candidate correct-option mappings, and 18 are newly authored source-based questions. Four overlapping objectives are excluded; 242 candidates remain unimported and pending review. The four withheld items remain in `review/withheld-questions.json`, outside both compiled banks and the validation index.

All six new lessons have four questions with foundational and application contexts. PowerPoint has 12 per lesson. Learning goals, examples, fictional-data exercises, answer explanations and actual-PDF citations are included. Broad cited ranges identify relevant source sections, not every taught detail.

## Remaining academic work

The full function catalogue, detailed lookup syntax, advanced statistics/trigonometry/finance, chart subtypes, protection dialogs, media compatibility and assessed practical assignments remain incomplete. A current lecturer outline and subject approval are still needed; hardware/operating-system topics are not invented as official requirements.

Payroll screenshot/text tax rules, institutional grading cutoffs and exactly-40 policy remain unresolved. TODAY/DATE contradictions, terse MATCH wording, F11/Alt+F1 placement, legacy tab names, the cell-limit statement, AVERAGE/AVERAGEA and COMBIN table issues are recorded rather than silently treated as authoritative. No official payroll rate, grade boundary or target-version behavior is invented.

All **15 Microsoft Office desktop scenarios remain unexecuted in Microsoft Office**. The environment completed 22 explicitly labelled LibreOffice/document alternatives; these do not certify Office dialogs, shortcuts, playback/timing or physical printing. See the [practical register](review/practical-checks.json) and [actual alternative-engine results](../../docs/csm177/office-alternative-results.json).

## Build and verification

`npm run content:computer` generates only the blocked student stub and text-free index. `compileComputer({includeReview:true})` supplies internal review data to the emulator-only middleware and tests. `npm run build` recompiles both courses. `npm run content:coverage` inventories review content and student availability separately.

Validation checks stable IDs, unique stems/options, source/page containment, block coverage, candidate answer mappings, held-item exclusion and question explanations/types. Regression and real loopback Auth/Firestore tests cover reader/practice flows, old/new drafts, confirmed scoring, relogin, course isolation and account isolation. The existing Firebase transaction/acknowledgement path is reused; no security rules change is required. See the readiness report for exact results and limits.
