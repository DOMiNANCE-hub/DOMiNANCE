# Computer Appreciation integration and academic release — 20 October 2026

Subsequent instructional checkpoint: [18 expanded lessons, 114 rewritten rationales and current verification](INSTRUCTIONAL_SPRINT.md). This supersedes the earlier section/check counts below while preserving the source crosswalk, practical register and academic release holds.

PR #9 continues on `academic/hb1-computer-appreciation-20261019`. Development `3b5368f` (merged UI Sprints 02–05 and Cell reliability) was merged as `7a0c1eb`. The resolution preserves Antigravity's card-rendering optimization, refresh behavior and exact merged global styles. Firebase rules/configuration remain unchanged.

## Implementation and release decision

**Software is prepared for integration with the academic release gate intact. Student content release remains blocked.** Keep PR #9 in draft for review; no merge or deployment was performed.

- Baseline preserved: 12 lessons and 72 MCQs, including their stable lesson/question IDs and answer mappings. No existing account history is migrated or deleted.
- Incremental local review: **18 lessons / 114 MCQs**. Six new lessons and 42 additional questions; 24 questions adapted selectively from the candidate bank, 18 newly authored source-based applications/questions. Every added question has an inspected actual-PDF text anchor and a current-PDF page citation.
- PowerPoint: **18 → 36 questions**, covering text containers/alignment, background styles, list numbering, table navigation/insertion, picture sizing/borders, audio volume, handouts/notes/ranges, effect order and automatic advance. These concepts are source-grounded; required desktop operation is not certified.
- Four overlapping package objectives were explicitly excluded, retaining the original precedence, Slide Sorter, object-animation and transition items. The other **242 candidate questions were not imported** and remain pending review. No claim that all 270 are validated academically.
- Four withheld questions remain in `content/computer-appreciation/review/withheld-questions.json`, outside both the compiled review bank and student validation index. No original or adapted ID may bypass that check.

| New lesson | Added depth | Questions |
|---|---|---:|
| CA13 | Custom list import versus typed-list creation | 4 |
| CA14 | Named cells/ranges, Name Box and Name Manager | 4 |
| CA15 | Cross-sheet quoting and 3-D worksheet-span references | 4 |
| CA16 | Lookup/reference glossary, with labelled MATCH clarification | 4 |
| CA17 | Consolidation sources/destination and fixed versus linked results | 4 |
| CA18 | Print titles, headers and manual page breaks | 4 |

The [58-lesson / 270-item disposition inventory](../../content/computer-appreciation/review/package-disposition.json) distinguishes baseline-related material, these six targeted adaptations, duplicate objectives and unselected work. It is not a complete-course approval or a claim of full coverage of every packaged lesson.

## Student publication gate

The earlier Computer draft was labelled review-pending but still compiled academic text to the public asset. This continuation closes that gap: normal development/preview/production builds now receive an empty, `academic-release-blocked` Computer asset. No pending Computer lesson/question text is copied to `public/` or `dist/`.

Only the fixed local **emulator serve mode** supplies the full internal review bank through Vite middleware, with a visible internal-review label and no-store responses. Emulator mode cannot be built for deployment. Neither URL parameters nor environment flags approve a student release. A future release requires an explicit reviewed approval/allowlist implementation.

The text-free index preserves old and new private IDs for history validation and scoring. Normal builds retain a saved-activity panel and confirmed Home/goal totals; they do not reopen held Computer lessons or drafts for practice. Records remain intact for an approved future release. Cell learning/practice remains available through its existing path.

## Source reconciliation: verified and unresolved

The uploaded package has 153 entries, with **152/152 declared file hashes and sizes matching**. Its claimed original PDF is 541 pages, SHA-256 `ac0ca56a22876fee8420ef36ef2b7d5df3ec1b1e96887f2764bb3eddeeaec4d0`. That original full PDF is absent from the upload and was not found by the CSM 177 Drive search; its hash cannot be independently verified here.

The actual available lecturer PDF is 542 pages, SHA-256 `524055ed4568892581fb7a5fe8f545f155901d3101d28b420d6f4b331e47d17c`.

`scripts/academic/reconcile-csm177.py` compares packaged source excerpts against text extracted from every actual PDF page. It requires at least 85% unique four-token overlap and a 10-percentage-point lead over every other page. It records evidence and page hashes rather than assuming a blanket shift.

- **199 package pages uniquely matched**: 148 at the same number and 51 at +1 in the actual PDF.
- **342 remain unmapped**: 27 have supplied excerpts without a unique match; 315 have no usable first-page excerpt in the bank. Rendering thumbnails does not fill this evidence gap.
- Examples: package p.104 → actual p.104; package p.401 → actual p.402; package p.459 → actual p.460. Same-number matches extend through p.309; observed shifted matches begin at p.311. The cause and every intervening/image-only page are not inferred.
- **32 actual-PDF facts/pages were directly inspected and anchored** for the incremental questions. Those anchors overlap the crosswalk; the counts must not be added together as independent coverage.

See [complete crosswalk](source-page-reconciliation.json) and [direct fact anchors](../../content/computer-appreciation/review/source-fact-checks.json). This reconciles selected citations and available text anchors; it does **not** establish a complete 541-to-542 page mapping or full lecturer-slide academic approval.

## Practical checks

All **15 required Microsoft Office desktop scenarios remain NOT EXECUTED in the required software**. The environment has LibreOfficeDev 26.8 headless, not the lecturer's Windows Excel/PowerPoint installation. No historical 80-case CSV result is re-labelled as a new run.

Feasible alternatives were actually executed: **22 headless engine/document checks passed**. These include supplied payroll variants, a changed-tax calculation, weighted marks, UNSET grades, the 40 boundary, TODAY/NOW/DATE, relative/absolute reference arithmetic, a 3-D total, a MATCH position, PDF header/orientation export and PPTX table/text round-trip/rendering. They do not certify Office shortcuts, dialogs, timing, playback or physical printing.

| Required scenario | Actual alternative evidence | Required Office status |
|---|---|---|
| EX-01 screenshot payroll | Recalculated I7 and I23 | Unexecuted; no fresh Excel/screenshot GUI comparison |
| EX-02 tax change and undo | Modified-copy E7/I7 recalculation | Unexecuted; no Excel edit/undo interaction |
| EX-03 written payroll | Recalculated I7 and I23 | Unexecuted in Excel |
| EX-04 weighted marks | E6/C28/C29/C30 values | Unexecuted in Excel |
| EX-05 missing grade cutoffs | F6 remains UNSET | Unexecuted; authoritative cutoffs unavailable |
| EX-06 filter boundary | <40 false and <=40 true at 40 | Unexecuted AutoFilter UI; failure policy unresolved |
| EX-07 date/time functions | TODAY/NOW and DATE serial 40449 | Unexecuted in Excel |
| EX-08 F11 / Alt+F1 | None | Unexecuted keyboard/version check |
| EX-09 fill/reference shortcuts | Reference arithmetic only | Ctrl+D, Ctrl+R, F4/copy UI unexecuted |
| EX-10 protection options | None | Unexecuted protection/encryption dialogs |
| EX-11 print setup | Header and landscape PDF export | Excel preview/scaling/gridlines/physical print unexecuted |
| PP-01 audio insertion/playback | None | Unexecuted |
| PP-02 automatic timing | None | Unexecuted |
| PP-03 grouping/object ordering | None | Unexecuted |
| PP-04 layout/table/master/save | Headless table/text round-trip and PDF render | PowerPoint UI, positions and slide master unexecuted |

[Required register](../../content/computer-appreciation/review/practical-checks.json) · [Actual engine results/version/fixture hash](office-alternative-results.json). The independent script preserves the source fixture, creates only fictional local variants and clearly identifies alternatives.

## Academic ambiguities held open

- Payroll source text and screenshot disagree on tax-rate sets; source cell-address instructions also differ. Both calculation variants are preserved as examples. No official rate set or payroll answer is selected.
- Exactly 40 marks: operator behavior is clear, institutional fail/pass policy is not. No official failure threshold or missing letter-grade boundaries are invented.
- TODAY's source wording contradicts itself; DATE's printed serial differs from actual recalculation. The technical clarification stays explicit, and the package's TODAY assessment item stays withheld.
- F11 versus Alt+F1 placement remains version/source dependent; both related withheld items remain out.
- MATCH's source glossary wording is terse. Its position interpretation is labelled a technical clarification and checked in the alternative engine, not attributed as a detailed lecturer syntax tutorial.
- Legacy menu/tab wording, image-only controls, font/cell limits, function-table typos and media/timing operation still need target-version and subject review. No diagram/thumbnail is published as approved teaching material.

## Verification

- **155 offline checks passed**, including content/citation integrity, duplicate rejection, withheld-item exclusion, review middleware gating, saved-history preservation, new four-question lesson flows, PowerPoint pools and all merged Sprint/Cell regressions.
- **38 real Auth/Firestore emulator checks passed**, including old/new Computer drafts/results/read positions, relogin, cross-account denial, unchanged Cell state and existing security suites. Fixed loopback `demo-dominance` only; rules are exercised without changing checked-in files.
- `npm test`, lint and build pass; lint retains eight existing dormant React warnings and build retains the existing large-entry warning.
- Chromium: all **18 lessons / 90 sections** traversed at 390px without page errors/document overflow; 5/10/all 114 options, signup/read marker, exit/reload/resume, submit/explanations, confirmed progress and Home totals. Practice widths 360/430/768/1440 and dark mode also checked.
- Actual built student asset: held reader/practice inaccessible, old draft/history preserved and prior confirmed activity counted. This used a local memory-adapter fixture and blocked non-loopback requests; it did not initialize a production Firebase client.
- Cell Structure: fresh fictional emulator signup, reader, practice exit/resume, submit/explanations, desktop/390px; no page errors. Original Cell academic files are unchanged.
- The student-build browser check reproduced an unavailable-course click error (`openUnavailableCourseArea` missing from the window exports). The handler is now exported and the same built-asset flow passes.

Physical devices, assistive output, full source-version reconciliation, all candidate questions, lecturer policy and final subject approval remain unverified. The PR is reviewable as gated software integration, not an academic release.

## Reproduce locally

Run `npm test`, `npm run lint`, `npm run build`, and the fixed local emulators plus `npm run test:emulators`. Use `npm run dev:emulator` for the internal course preview. `npm run preview -- --host 127.0.0.1 --port 4173` serves the blocked student build; `scripts/academic/verify-student-gate.mjs` optionally accepts a locally installed Playwright module path and uses Chromium.

The source/Office scripts accept the uploaded ZIP and actual PDF paths explicitly. They need Python/openpyxl/python-pptx, pdftotext/pdfinfo and LibreOffice for the alternative run; neither copies original PDFs or rendered slide images into the app.
