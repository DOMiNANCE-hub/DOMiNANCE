# Compact Home preview — 2026-10-18

Implemented locally for manual review. Existing themes, five tabs, account controls, learning content and private persistence are preserved.

## Layout

Greeting → Continue Learning / Quick Practice → weekly practice summary → study toolkit → smaller spotlight → optional goal, Weekly Revision, featured courses, Community and assistant previews. Phone study actions stack; Quick Practice is a compact action strip. Toolkit uses two columns on phones/tablets and four on wide desktops.

Speed Race, LAMLA, My Weak Spots and The Arena stay visible. Their entry points explain what is planned through an accessible native in-app dialog with a close action and focus return. They do not claim working races, recommendations, rankings or backend connections. The existing verified-race adapter remains the future path for scheduled/live sessions. Flashcards and Mock Exams remain in Practice. Weekly Revision and the assistant remain visible lower on Home. Future implementation can connect these entry points without replacing the Home layout.

Quick Practice opens the existing Topic Questions selection via the current curriculum guard. Continue Learning retains the authenticated saved-location path; its note shows an available section number and removes the outdated claim that reading resume is still coming later.

## Actual activity

Home now reads confirmed, account-owned Cell Structure state through the existing parent storage adapter, validates it with the shared state validator and combines completed attempts with the existing demo activity. Unfinished drafts, malformed/foreign records and invalid future records are excluded. Skipped questions do not count as answered; an all-skipped completed session contributes a session but no questions/accuracy. Accuracy is question-weighted, not a mastery score. Existing optional daily goals use the same confirmed activity and preserve sync-acknowledgement guards. No records are rewritten or migrated.

## Verification

- Full suite: 117 passed, zero failed/skipped, including five new compact Home/progress/tool tests.
- Final focused Home/model/navigation suite: 46 passed after the final accessibility/tablet CSS refinements.
- Lint: zero errors, same eight dormant-screen warnings.
- Production build: passed; existing large-entry warning remains.
- Isolated Auth/Firestore integration: one scenario passed. The first run failed because localhost Auth/Firestore were stopped; after restarting the approved demo-only emulators the retry passed. No production requests or settings/rules changes.
- Visual verification is pending for this version. The browser tool reported that IAB was unavailable and its inventory contained no browsers. This is an unavailable automation surface, not evidence of a rendering failure or the earlier website-policy block. No desktop/mobile screenshot, touch, keyboard-in-browser or contrast acceptance is claimed for the new layout.

## Changed files in this milestone

public/dashboard/index.html — Home ordering, compact markup, toolkit/dialog, direct practice adapter and saved-section note.
public/dashboard/home-ui.js — tool entry behaviour, real practice destination, confirmed pilot metrics and sync-aware goals.
public/dashboard/home-model.js — validated pilot activity aggregation and central planned-tool descriptions.
public/dashboard/cell-structure.js — expose the existing guarded Topic Questions screen as a navigation hook.
public/dashboard/workspace-ui.css — compact responsive Home/card/dialog styling and tablet breakpoints.
tests/home-compact.test.js — five new behaviour/model/layout-contract regressions.
tests/dashboard-progress.test.cjs — update the existing navigation expectation for direct practice.
AGENTS.md, ROADMAP.md and this document — reconcile the approved direction and verified status.

All earlier uncommitted work is retained. No commits, pushes, merge, deployment, new dependencies, academic changes, Firebase configuration/rules changes or HB2 work.

Preview: http://127.0.0.1:5174/#home while the PC/local services are running. Review the hierarchy at desktop/phone widths, try each Coming Soon entry and its close/Escape behaviour, then Continue Learning and Practise now. Browser verification and physical-device smoothness remain outstanding.
