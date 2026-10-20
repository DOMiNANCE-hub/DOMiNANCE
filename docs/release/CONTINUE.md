# Exact continuation from the tested three-course RC

Use the existing official repository and branch `release/hb1-three-course-rc-20261020`, draft PR [#17](https://github.com/DOMiNANCE-hub/DOMiNANCE/pull/17), targeting `dev/firebase-development-readiness`. Latest tested implementation: **4bb8a374060c677ea457e9feac68c18645050352**, GitHub CI [39503719577](https://github.com/DOMiNANCE-hub/DOMiNANCE/actions/runs/39503719577) passed. Development was refetched after the Unit 6 push and remains `3b5368fda5659c13b8b4e9b533e52009dc628832`. Re-fetch before further integration; preserve the original review branches and all existing content/history. Do not restart the five-PR integration.

## Delivered and retained

- PRs 9/13/14/15/16 are integrated with Antigravity UI, per-course native state, Firebase transactions, stable IDs, original source bytes and academic gates preserved. Compatibility and citation defects are fixed and tested.
- Cell: 46 lessons, 178 review MCQs, all 170 original rationales improved, 34 lessons expanded, 88 answered checks, 277 sections and two original diagrams. Four explicit protected question revisions retain keyed option strings and indices. Thirty-one source objectives and selected page evidence are recorded; current-year scope, remaining figures/history and precise concept links remain open.
- Computer: existing 18 lessons/114 MCQs retained, including 36 PowerPoint questions. Original 12/72 IDs/history preserved. Four withheld questions remain outside the bank; 342 package pages unmapped. Exact 15-case Office checklist is prepared; **0/15 executed in Microsoft Office**. Prior 22 LibreOffice alternatives are not Office passes. Policy/version decisions remain unresolved.
- Bio: Units 1–6 have 59 notes/222 MCQs/118 answered checks/361 sections/ten original figures. Twenty of 34 outline topics have drafts. Source identities/page conventions, 252 literal anchors and 55 selected visual pages are documented. All drafts have reviewer null; nothing here is formal academic approval.
- Latest combination: 208 offline checks, 40 real local Auth/Firestore checks, lint/build and Chromium journeys pass. Ten pre-existing lint warnings and large-entry build warning remain. All current Bio/Cell sections and twelve combined figures checked at 390px; Unit 5/6 exact feedback links and full 178/114/222 pools pass. Production was not tested.

## Next implementation batch

1. Read **all 71 actual Lecture 7 pages**, not only headings, and the official outline's three protein subtopics. Inventory/inspect diagrams before adapting structural facts. Source review is currently only inventory for Lectures 7–10.
2. Develop complete original amino-acid, peptide and protein-structure lessons. Explain ionisation/charge and supplied-pKa calculations, stereochemical exceptions, peptide chemistry and structural mechanisms with examples, comparisons, diagrams and answered concept checks. Do not impose arbitrary word/question quotas.
3. Add original four-option MCQs only for supported concepts, with explanations, meaningful distractors, explicit objective/concept/source/status and exact note-section routes. Preserve all earlier notes, concepts, figures, IDs and answer meanings; extend the existing previous-bank hash evidence pattern.
4. Deliver Unit 7 as a tested commit before Unit 8 Enzymes, then Unit 9 Metabolic Pathways and Unit 10 Lipids. Read each actual lecturer source. Check historical enzyme-classification and Unit 10 kit flags independently rather than repeating errors.
5. Complete remaining Cell source/figure/history/precise-concept and Computer source-supported objective gaps in appropriate separate commits. The Office checklist remains an external desktop requirement, not a reason to stop feasible development.

## Reuse the implementation

`content/biological-chemistry/catalog.json`, `lessons/`, `questions.json`, `unit-reviews/` and `source-evidence.json` are the authoring sources. `scripts/import-biological-chemistry.mjs` validates and writes text-free indices/catalogue plus blocked normal student content. Use stable concept/section metadata; don't alter earlier numeric presentation positions. Original vector figures use the constrained `academic-figures.js` contract and include accessible descriptions/model limits. No source images/PDFs enter Git or student assets.

Private source extraction may already exist at `/tmp/dominance-biol157-source/lecturer_sources`; treat that as a local convenience, not a repository asset. If unavailable, use the authorised attached kit identified in `ATTACHMENT_VERIFICATION.json`; the reattached kit is byte-identical. All PDF identities/page counts are in the catalogue. Do not invent source references or assume printed numbering is actual PDF numbering.

After a coherent batch: regenerate content/coverage/readiness, run `npm test`, `npm run lint`, `npm run build`, fixed demo-dominance emulators and `npm run test:emulators`, optional private-source verifier and available Chromium runner. Run emulator permission tests and browser interactions sequentially. The committed browser runner expects the local emulator Vite server on 127.0.0.1:5179 and an available Playwright module/Chromium; it exercises honest pending units, so move that fixture to the next genuinely unauthored unit. Do not certify an older combination as the latest one. Update PR #17, checkpoint SHAs, evidence and this continuation after pushing tested work.

## Release work still required

Implement an auditable human approval/publication process and ensure only explicitly approved snapshots can be student-visible. Do not bypass academic gates through URLs, flags, routes or public preview assets. Existing local emulator review is permitted; it is not a deployed protected reviewer service.

Only use existing Vercel `do-mi-nance` (project prj_W0ZnmiQ9iO0oyeFPm4HAffXSiheO). Read-only inspection found SSO protection on all deployments but six Firebase variables shared across production/preview and no RC-branch overrides. Isolated preview Firebase is **not established**. No deployment or environment change occurred. Production rules/auth domains/data separation/rollback still require verification. Do not use real students or create another hosting project.

Formal academic sign-off and final human production-release confirmation remain required before public release. Do not merge, deploy production, change Firebase security rules or claim launch readiness from CI alone. Continue implementation until these concrete content and engineering prerequisites are complete; report only actual remaining human/external blockers.
