# Cell cytoskeleton teaching alignment

The original question assignments distribute six CY questions to each lesson, but some questions require teaching in a different CY lesson. All **24** now link to explicitly reviewed headings. Eleven corrections are recorded in `content/cell-structure/review/study-targets.json`, including original/destination lesson, reason and a SHA-256 binding the existing stem, four options and key. No keyword matching or fallback guessing chooses a destination.

| Existing question IDs | Preserved original assignment | Reviewed teaching destination | Evidence in existing notes |
|---|---|---|---|
| CYQ01/02/04/06 | CY01 | CY02, Core lesson | Filament diameters, subunits, mechanical properties |
| CYQ07 | CY02 | CY01, Actin-associated proteins | Red-cell actin/spectrin membrane architecture |
| CYQ16 | CY03 | CY02, Core lesson | Keratin defects and epidermolysis bullosa |
| CYQ17/18 | CY03 | CY04, Core lesson | Spindle chromosome movements and paclitaxel |
| CYQ21/22 | CY04 | CY02, Core lesson | Intermediate-filament diameter and microtubule motors |
| CYQ23 | CY04 | CY01, Core lesson | Dynamic filament-network definition |

Existing appended prose already teaches CYQ03/05 in CY01 and CYQ08–12 in CY02; these stay within their original lesson. New review practice pools contain **4/12/3/5** questions, each appearing once, and the full CY block still contains 24. This follows teaching content rather than preserving an arbitrary equal allocation. Other course pools retain their previous behavior. All question `lesson` fields remain intact for historical interpretation; the explicit teaching metadata controls new selections and explanation links.

Compilation rejects missing/duplicate/stale/cross-block correction entries, question-fingerprint changes, unknown lessons and ambiguous headings. Corrections validate before any target mutation. Default unreviewed cross-lesson mappings remain rejected, including Computer tests. Runtime accepts a correction only with matching original-lesson metadata and a known destination; existing course-policy navigation still validates the route. This metadata grants no authentication or publication privilege.

Regression evidence preserves all **178** pre-batch question objects after removing only the new optional target metadata. Original lesson text, section positions, source bytes, IDs, options, keys and prior protected revisions are unchanged. Native state accepts an older CY01 six-question draft, and its completed answers still score identically. The normal 46/170 student asset is unchanged; new review mappings remain local-emulator-only. No regrading, migration or Firebase write redesign occurs.

Four new tests exercise all 24 rendered feedback panels, semantic target prose, atomic validation failures, corrected pools and historical state/score preservation. The combined browser journey additionally practises CY02, opens the original CYQ01 feedback and returns to the actual CY02 teaching section. Final combined outcomes are recorded in READINESS.md. There remain **154 unmapped Cell questions**, teaching/source/figure gaps and human/current-year review. No new notes, diagrams, questions, current-year syllabus certification or academic approval is claimed.

Final evidence: **245 offline / 40 Auth–Firestore emulator checks passed**, zero failures/skips; lint/build passed with ten existing warnings and the large-entry warning. Chromium passed the new corrected CY02/CYQ01 journey, existing Excel/PowerPoint/Bio exact links, all three full banks, 390px Bio/Cell section traversal, 25 figures and all three progress panels. No page errors.
