# Computer Appreciation review candidate

Twelve authored learning lessons (3,743 words), 72 authored MCQs and answer explanations, organised into four study blocks. Every lesson has three foundational and three application questions. These are topic practice questions, not reproduced or certified past examination questions.

## Source and approval status

The teaching source is **Computer Appreciation — CSM 177 Lecturer Notes.pdf**, found in the user's connected Google Drive. Its title page identifies **CSM 177 HB1 — Microsoft Excel and PowerPoint 2016**. The 542-page source, Drive reference and SHA-256 are recorded in `manifest.json`. Page numbers refer to PDF pages, including the opening title pages. No original PDF, slide image, private source dump, assignment submission or past paper is copied into this public repository.

The lecturer notes establish a source for drafting; they do not establish a current official syllabus or academic approval of this adaptation. Status remains `academic-review-pending` for user/Ofobi review. Peer revision notes and labelled past-question documents were discovered but are not the authority for this answer key.

## Lessons and boundaries

| Block | Lessons | MCQs |
|---|---|---:|
| Spreadsheet Foundations | CA01 data entry; CA02 editing/fill; CA03 formulas/references | 18 |
| Spreadsheet Functions | CA04 common/date functions; CA05 statistics/counting; CA06 text/logical/financial arguments | 18 |
| Data Handling & Charts | CA07 formats/printing/files; CA08 charts; CA09 sorting/filtering | 18 |
| Presentations | CA10 layouts/themes/files; CA11 objects/media; CA12 views/printing/effects | 18 |

Lessons include goals, explanations, worked examples and fictional-data exercises. Lesson metadata gives the source ranges; every question has an individual source-page reference, displayed with its result explanation. The broad lesson ranges indicate relevant sections, not a claim that every detail on every page is taught or tested.

Remaining depth: complete function catalogues (including lookup/reference, advanced statistical, trigonometric and financial functions), named-range workflows, 3-D references, custom lists, workbook consolidation, full print/protection settings, chart subtypes, media compatibility and assessed practical assignments. These require further source review and lecturer priorities. Hardware, operating systems and other possible course topics are not invented as official requirements.

## Source issues handled explicitly

- PDF p.23 states a 255-character cell limit. No cell-character-limit fact or MCQ is published from that statement; confirm current specifications before adding one.
- PDF p.169 has apparently interchanged AVERAGE/AVERAGEA descriptions. Lessons use numeric-only mean examples and do not adopt its text/logical-value claims. COUNT/COUNTA uses p.170.
- PDF p.163 labels COMBIN but shows COMB in an example. That example is not reused.
- PDF pp.298 and 424 contain version-sensitive default-sheet/file-format wording. No fixed default worksheet count or “97–2016” format claim is taught.
- PDF p.427's PDF sharing description is not treated as protection against editing. The lesson calls PDF a fixed-layout copy and retains the editable deck.
- PDF pp.532–535 use a legacy Animations-tab transition workflow. The lesson teaches the object-animation/between-slide-transition distinction from p.531 and flags interface-version differences.

These editorial decisions avoid propagating questionable statements; software checks are not independent academic certification.

## Build and validation

`npm run content:computer` deterministically generates the student asset and a text-free validation index. `npm run build` recompiles both courses. Validation checks IDs, lesson/block coverage, four distinct options, A–D keys, explanations, question types and page references within their lesson's cited source ranges. Tests also protect worked answer keys, actual reader/practice handlers, course isolation, persistence and Home totals.

The existing authenticated parent saves additive private `dashboardState.computerAppreciation` state through the same Firestore transaction/acknowledgement path as Cell Structure. Each course has its own draft and bounded result history. No rules change, migration, deployment or official assessment system is introduced. Static lesson/question assets are public; they are not a secure exam bank.
