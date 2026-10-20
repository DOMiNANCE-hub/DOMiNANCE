# Cell Structure instructional review — 20 October 2026

Separate branch `academic/hb1-cell-instruction-20261020`, based on shared development `3b5368f`, including merged UI Sprints 01–05 and prior Cell reliability fixes. This is a tested editorial checkpoint, not final academic approval or a complete-source certification.

## Teaching and questions

All **46 lessons** were audited for coverage basis, terminology, explanation, mechanisms, comparisons, examples/checks, connections and figure/source limitations. [Per-lesson assessment](../../content/cell-structure/review/lesson-audit.json) records each result. Correct existing material is retained; 23 targeted lessons receive original instructional additions only in the local emulator review.

The expansions explain image-quality distinctions, numerical-aperture calculations, bright/dark/phase light paths, preparation compatibility, staining charge/contrast, oxidation/peroxide control, lysosomal mechanisms, storage versus injury, membrane packing/gradients, track versus motor, microtubule dynamics, fraction tracing and analytical interpretation. Original comparison/flow tables and numerical examples make the reasoning inspectable.

- Original **170 question IDs, stems, options and answer letters remain intact**; 96 internal-review rationales now teach mechanisms and relevant distinctions. The other 74 are explicitly retained for future targeted improvement, not declared fully reviewed.
- **Eight new candidate questions** address resolving-distance calculation, unit/image interpretation, solvent replacement sequence, opposing electrochemical influences, fraction tracing, equilibrium band density, supplementary absorbance calculation and an offset-origin Rf calculation.
- Internal review: **46 lessons / 178 questions / 74 explicit-answer concept checks / 263 sections**. Original student bank: 46/170 with its 51 checks. New material is neither a past paper nor approved assessment.
- The duplicated human-uricase notes are consolidated in the presentation compiler into one qualification, retaining both organism scope and the unique human purine endpoint. The original source Markdown remains unchanged. This consolidation is the only academic-text presentation change in the normal student asset; new teaching/rationales/questions remain gated.

## Source and objective evidence

The actual **410-page BIOL151 lecturer PDF (2025)** was found in connected Drive, downloaded outside the repository and text-extracted. [Source identity/hash, selected page anchors and visual decisions](../../content/cell-structure/review/source-evidence.json) are recorded. Actual PDF pages are used; printed slide numbering is not substituted.

Seven broad outcomes and fourteen microscopy-specific outcomes are paraphrased from actual pp.15–21. [Objective map](../../content/cell-structure/review/objectives.json). The historical-development outcome remains only partly represented, and biochemical-analysis chapter coverage is identified as an editorial extension without separate verified official outcome wording. The general organelle objective does not prove every organelle topic is fully covered. Current-year outline/assessment rules are not verified.

Six selected visual checks were performed: p.89 NA table; pp.303–304 packing/temperature; p.358 blood-fraction illustration; pp.407/410 TLC diagram/printed solution. The full NA table is available in the local review. The TLC printed ratios are confirmed as 0.18, 0.78 and 0.53; they are not described as new pixel-exact measurements. The blood figure's 4% white-cell/platelet label is flagged and not adopted as a normal reference or question. No original figure is republished.

Independent verification supports the existing [human uricase qualification](https://pubmed.ncbi.nlm.nih.gov/2594778/), [HEXA/GM2 relationship](https://www.ncbi.nlm.nih.gov/books/NBK22250/) and [conditional membrane-fluidity comparison](https://openstax.org/books/biology-2e/pages/5-1-components-and-structure). These checks do not certify every clinical/source claim.

Unreviewed ray diagrams, typical-cell labels and remaining figures stay open. The unidentified wall-digestion agent and analytical “no comparison standards” scope remain flagged. Supplementary Beer–Lambert/Svedberg reasoning is labelled separately from explicit lecturer wording. The 2025 Cell pass-mark statement is not transferred to Computer Appreciation or treated as current institutional policy.

## Safeguards and verification

Vite middleware supplies the enriched Cell asset only in fixed local emulator serve mode, with an internal-review label. Normal builds retain the original 170-question bank. The text-free validation index accepts old/new review IDs for transaction validation without exposing new teaching or question text. Fictional review accounts should continue in review mode; returning such an account to the smaller normal bank preserves its records but cannot reopen a draft containing review-only questions. No silent migration/deletion is introduced.

- 147 individual offline checks, `npm test`, lint and build pass. Existing eight lint warnings and large-entry build warning remain.
- 37 real loopback Auth/Firestore checks pass, including a new old/new-ID transaction, completion, relogin and denied cross-account read/write scenario. Rules/configuration are exercised without edits.
- Chromium: fictional signup, reader, exit/resume, submit and explanations; all **46 lessons / 263 sections** at 390px without page errors/document overflow. Desktop was checked on the same flow.
- Browser traversal reproduced a 434px section-selector track at a 390px viewport. The exact reader-scoped shrink rule already used in PR #9 fixes it here; Antigravity global styles/navigation remain unchanged.
- Original 46 Markdown files and 170-question source JSON retain their hashes. Generated reports are reproducible; `node scripts/report-cell-instruction.mjs` refreshes the coverage inventory.

No final academic approval, real student/production writes, security-rule changes, Antigravity branch edits, merge or deployment. Physical-device, assistive-output and classroom effectiveness acceptance remain unverified.

## Exact continuation

Review the 23 expansions/96 rationales/eight candidates academically; improve the remaining 74 short rationales and audited lesson gaps; complete the remaining figure/source review; verify current course outcomes. Reuse the stable concept-link contract when integrating future Study Area frontend work rather than renumbering existing sections or replacing progress records.

Full-bank follow-up: reproduced the inherited 170-question state-validation ceiling, replaced it with the available question-ID pool size, and verified saving/reloading all 178 questions in real emulator transactions. Chromium started, reviewed and submitted All Available (178), then traversed all 263 sections at 390px. All 147 offline checks and 37 emulator checks pass; lint/build pass with existing warnings.
