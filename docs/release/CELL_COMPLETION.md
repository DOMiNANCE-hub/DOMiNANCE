# Cell Structure rationale and teaching completion batch

On `release/hb1-three-course-rc-20261020`, built on PR #14 without changing its branch or rewriting history. This batch improves all 74 previously retained short rationales: all 170 original questions now have editorial teaching explanations, alongside the eight existing review candidates. No new scored question was added just to increase a count. Human academic approval remains pending.

Thirteen lessons received targeted additions (eleven newly expanded and two extended): CO01–CO04, OR02/05/06/07, CY01/02/04 and CM01/03. The resulting review has **46 lessons, 178 MCQs, 88 explicit-answer concept checks, 277 sections and two original diagrams**; 34 lessons have additions in total. It teaches cellular exceptions, mechanical applications, fixed-volume geometric comparison, carbon-pathway distinctions, nuclear transport/chromosome counting, ribosome assembly, basal-body/axoneme architecture, actin-associated proteins, red-cell support, skeletal-muscle sliding/ATP/calcium, drug mechanisms and membrane classification/orientation. Correct original teaching and all prior section positions are retained.

## Explicit question revisions

`content/cell-structure/review/question-revisions.json` records expected original fields, replacement fields, source pages, rationale, pending review and historical limitations. The compiler refuses stale originals, duplicate/unknown revisions or a changed keyed answer. Changes apply only in the emulator review:

| ID | Verified issue | Review correction | Key |
|---|---|---|---|
| CO-Q003 | B and C both express the structure–function principle, p.194 | Replace the overlapping distractor with composition alone regardless of organisation | B unchanged |
| CO-Q005 | “Every cell” overstates a general framework; differentiated exceptions exist | Ask about the lecturer's general-function framework | D unchanged |
| CO-Q012 | Near-duplicate recall of CO-Q008, p.200 | Apply mechanical action to a compressed cell | C unchanged |
| CYQ19 | Both paclitaxel and vincristine are anticancer drugs, pp.283–284 plus NCI | Specify inhibition of microtubule assembly | B unchanged |

Original 46 Markdown files and source 170-question JSON retain their hashes. IDs, option positions and correct-answer strings are unchanged; recorded selections and attempts are neither deleted nor regraded. The earlier ambiguous questions are not academically certified. The explanations explicitly identify the earlier ambiguity where a historical record cannot establish which wording a student saw. Normal 170-question assets retain their previous text; this is a protected correction proposal, not silent publication.

## Source verification and limits

The 410-page 2025 PDF identity and **123 selected text-page hashes/anchors** were rechecked using `scripts/academic/verify-cell-sources.mjs /path/to/authorised.pdf`. Actual PDF pages are used. The 74 rationale-specific page mappings are recorded separately from inaccurate or overly broad original ranges: glycosomes are listed on p.206, microtubule protofilaments are described on pp.273–274, and the diameter list is on p.260. No printed-page offset was guessed.

The objective inventory now includes **31 available source objectives**: seven broad, fourteen microscopy and ten cytoskeleton outcomes, the latter actually stated on p.246. This is not a current-year official outline certification or proof that all outcomes are complete. Actin/red-cell/muscle mechanisms are labelled supplements. NCBI search-returned passages/abstract supported red-cell connections; direct NCBI opens were incomplete/CAPTCHA, so full-chapter review is not claimed. OpenStax mechanism paragraphs and NCI paclitaxel entry were opened. Source p.271's sole-cause Alzheimer wording, p.287's every-organelle membrane generalisation, and inaccurate supplementary captions about central axonemal doublets/calcium binding are explicitly not adopted.

Original diagrams explain surface area at fixed total volume and α/β-tubulin orientation, with accessible descriptions and model limits. They contain no copied source image. Source figures not previously inspected remain open, including typical-cell labels and optical ray diagrams. Historical microscopy development is still partly covered; current-year scope, unidentified wall-digestion agent and analytical “no standards” wording need human/source review. All source uncertainty and clinical qualifications remain visible in the evidence ledger.

## App verification

Fixed the verified citation-format mismatch: new Cell candidate pages are flat actual-page arrays, whereas Computer uses page ranges. Cell feedback now handles both forms, carries the correct Cell source label and does not throw when the eight candidate explanations open. Tests cover the format compatibility, explicit revisions, original-file/answer/history invariants, geometric calculations, source-objective mapping and safe figure isolation.

193 combined offline checks and ordinary `npm test` pass; 40 real loopback Auth/Firestore tests pass, including full banks, account switching and denied cross-account access. Lint passes with ten existing warnings (two unused parameters in older Computer tests and dormant React issues); build passes with its existing large-entry warning. Chromium traversed 35 Bio lessons/213 sections and 46 Cell lessons/277 sections at 390px, all original figures without clipping, all eight new Cell citations, and all three full-bank submissions (178/114/119), source feedback, resume/retry/reload and progress panels. No page errors. No production/Firebase rules change or deployment.

Next: BIOL157 Unit 5 from all 58 actual Lecture 5 pages, preserving this tested checkpoint. Cell academic sign-off and remaining source/figure/precise-concept-link checks remain explicit release requirements.
