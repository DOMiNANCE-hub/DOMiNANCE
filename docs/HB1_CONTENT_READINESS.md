# HB1 first-semester academic readiness — 19 October 2026

Development baseline: `7274bb73452291aadf1e286a0e9528351b2acbbe`, including Antigravity Sprint 01 and CI. Cell reliability is a separate draft PR based on development; Computer Appreciation is stacked on that branch to reuse the fixes. No main merge or deployment.

## What is implemented

Computer Appreciation adds 12 source-based lessons and 72 MCQs with explanations: spreadsheet data entry/editing/fill; formulas, references and precedence; date/common/statistical/text/logical functions and financial periods; formatting/printing/files; charts; sorting/filtering; PowerPoint layouts/themes/files, objects/media, and presenting/printing/effects. Four blocks, three lessons and 18 questions per block. Every lesson has three foundation and three application questions. [Source record, lesson inventory, editorial decisions and remaining depth](../content/computer-appreciation/README.md).

Both courses use the existing section reader, safe Markdown renderer, shuffled-option mapping, review-before-submit workflow and confirmed private progress. Practice switches between actual course pools; each course retains its own unfinished draft. Computer results and read markers reload from the existing user document, and confirmed answered questions contribute to Home/goals with skipped questions excluded. Course and Home resume links validate the correct course's lesson identifiers. No global stylesheet or navigation redesign is included.

Cell Structure preserves all 46 supplied lessons, 170 MCQs and 51 concept checks. Its four verified reliability defects are fixed separately; [evidence and academic review limits](HB1_CELL_RELIABILITY.md).

## Coverage evidence

The repository configures nine HB1 first-semester courses. Two now have source-based review content; seven have no implemented academic lessons or course-specific question bank. This describes repository implementation, not accreditation or syllabus completeness. Dormant React examples, the three-question generic demo, unavailable tools and labelled historical demonstration code are excluded from counts.

See the [generated course table](HB1_CONTENT_COVERAGE_TABLE.md) and [lesson-level JSON inventory](HB1_CONTENT_COVERAGE.json). Regenerate with `npm run content:coverage`; a regression compares the committed report against real content and curriculum definitions.

| Course without implemented content | Verified state and next dependency |
|---|---|
| Basic Medical Chemistry | Eligible course; unavailable study destinations. Needs reviewed source selection and current topic outline. |
| Biological Chemistry | Same unavailable course implementation; no lessons/MCQs to validate yet. |
| Medical Genetics | Same unavailable course implementation; no lessons/MCQs to validate yet. |
| Ghanaian Sign Language | Same unavailable implementation; requires approved teaching/media material and a suitable reviewed assessment format. |
| Communication Skills | Same unavailable course implementation; no lessons/MCQs to validate yet. |
| Algebra | Same unavailable course implementation; no lessons/MCQs to validate yet. |
| Statistical Methods | Same unavailable course implementation; no lessons/MCQs to validate yet. |

The original Computer Appreciation checkout also had only these unavailable destinations. Its new lessons are grounded in the 542-page CSM 177 lecturer PDF discovered in connected Drive, with exact source identity/hash and citations. That document covers Excel/PowerPoint; it is not a verified current syllabus. Relevant source sections were inspected and selected facts/examples reconciled for these lessons; no complete slide-by-slide or official-syllabus coverage claim is made. Remaining source depth is listed in the content README. Current lecturer-outline verification and academic sign-off remain outstanding for both courses.

## Verification and limits

- 143 individual offline checks pass (130 baseline, four Cell regressions, nine Computer/coverage checks). `npm test` also passes; the environment's isolated Node runner reports file-level results, so individual counts use `--test-isolation=none`.
- 37 full Auth/Firestore emulator checks pass against fixed loopback `demo-dominance`, including the new stale-draft completion regression, independent Computer reading/draft/result persistence, concurrent result merges, relogin, account isolation and existing security scenarios. Both exact checked-in rules files are exercised without editing them.
- Lint passes with eight existing dormant React warnings. Production build passes with the existing large-entry warning. Generated source assets reproduce deterministically.
- Chromium desktop/390px checks: fictional registration, course reader/read marker, exit/reload/resume, submission, explanations with citations, confirmed progress after reload and Home answered-question totals. All 12 lessons / 60 sections opened at 390px without document overflow or page errors; setup offers 5/10/all 72 questions. Exhaustive traversal reproduced a 446px-wide section-picker track at a 390px viewport for CA02's long heading. A rule scoped to the academic section picker now lets its grid/control shrink; no global stylesheet changed.

No real accounts, production requests, Firebase security-rule/configuration changes, Antigravity branch edits, global styling changes, merge or deployment. Pending writes remain memory-only, one draft per course uses existing last-writer behavior, history stays bounded and static source assets are publicly fetchable. Physical devices, screen readers, practical Office execution/marking and academic acceptance are not established by passing software checks. Summaries, LAMLA, verified past papers, flashcards and mocks remain unavailable.
