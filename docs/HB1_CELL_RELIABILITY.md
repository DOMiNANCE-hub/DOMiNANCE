# HB1 Cell Structure reliability — 19 October 2026

Based on `7274bb73452291aadf1e286a0e9528351b2acbbe` on `dev/firebase-development-readiness`, including merged Antigravity Sprint 01 and CI. All original academic lessons and questions, global styles, navigation structure, Firebase configuration and rules are preserved.

## Reproduced defects and fixes

Four behavioral regressions failed before the change and pass after it:

1. A legacy lesson link could borrow the section number saved for another lesson in its block. Opening a different lesson now starts its own first section.
2. An obsolete saved section number generated an invalid resume link. Resume links clamp to the last existing section without rewriting stored history. Non-string route inputs return false safely.
3. Practice setup cached its initial draft state. Returning after exit could leave a Start action instead of Resume; a zero-question selection removed the resume action entirely. Draft identity/completion changes invalidate setup, and a saved draft remains resumable even for an empty selection. Answer changes do not rebuild selectors.
4. A stale transaction could restore an already completed draft. The existing transaction merge now retains the completed attempt and clears that draft. A real emulator transaction verifies this with preserved read markers and reading locations.

The course description refers to supplied material pending review, without asserting a complete academic structure.

## Content review

All 46 supplied lessons, 170 MCQs and 51 embedded checks remain intact. Every lesson has MCQs. Block counts: Microscopy 18, Cellular Organization 24, Cell Organelles 35, Cytoskeleton 24, Cell Membranes 24, Cell Disruption & Fractionation 20, Biochemical Analysis 25.

Microscopy has only one MCQ per lesson; this is shallow question coverage, not evidence of missing lecture topics. Approved diagrams, signed question-level review, and the 38 nonduplicate clarity concerns in `EDUCATIONAL_REVIEW.md` remain open. The primary lecturer PDF and a current outline were not in the repository, so this pass makes no claim of full syllabus reconciliation or academic certification. Correct supplied content is preserved.

## Verification

- 134 individual offline checks pass with `node --test --test-isolation=none tests/*.test.js tests/*.test.cjs` (130 baseline plus four regressions).
- `npm test` passes; this environment's isolated Node runner summarizes file-level results. Individual counts above come from the explicit in-process run.
- Existing full Firebase emulator suite: 35 checks pass. The added stale-transaction scenario and existing account persistence/isolation scenario also pass against fixed loopback `demo-dominance`.
- Lint: no errors; eight existing dormant React warnings. Production build passes with the existing large-entry warning. Source lesson and question files are unchanged.
- Chromium desktop/390px verification results are recorded in the draft PR. Physical-device, screen-reader and academic acceptance remain separate review gates.

No production requests, deployment, merge or migration. Private state version 1, legacy drafts, pending-sync behavior and bounded history remain compatible.
