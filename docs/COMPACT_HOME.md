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

## Home navigation correction — cloud verification

Base: `checkpoint/pre-org-migration-2026-10-18` at
`a6cf100800d3a8012ac8f6ac7a4000219a4a5905`; local feature branch:
`fix/home-practice-navigation`.

The Home button's inline `homeUI.openPractice()` handler looked up a global,
but `homeUI` belongs to the `initializeDashboard` closure. The real browser
therefore raised `ReferenceError: homeUI is not defined`. The controller now
binds the actual `homePracticeAction` button to its existing `openPractice`
callback. That callback still uses the established `showView('practice')`
route/history path and the curriculum-aware Topic Questions entry. No global
controller, alternative router, academic access change or persistence change
was introduced.

The new regression checks the actual Home markup and its initialized click
handler, rather than calling only the controller API. It failed on the
checkpoint, then passed with the fix. An older assertion that required the
broken inline handler was removed; its other progress/empty-state checks remain.

Current verification:

- `npm test`: 122 passed, zero failures/skips; focused Home/navigation checks:
  37 passed, including the new regression.
- `npm run lint`: passed with eight existing dormant-screen warnings.
- `npm run build`, including content generation: passed, retaining the existing
  large-entry warning. Generated academic assets remain identical to the base.
- Chromium at 1440px and touch-emulated 390px: Home click/tap opens Topic
  Questions, activates Practice and commits `#practice`; browser Back restores
  Home; repeated activation and desktop Enter work; a quiz starts and an answer
  can be selected. No JavaScript page errors or horizontal overflow were found.
  These checks use fictional identity and memory storage with the real parent
  navigation adapter. They do not establish backend persistence or physical-phone
  acceptance.

### Firestore integration remains blocked

The active cloud proxy returns HTTP 403 for
`https://storage.googleapis.com/firebase-preview-drop/emulator/cloud-firestore-emulator-v1.22.0.jar`.
The official `setup:emulators:firestore` download command reproduces the failure
independently of listener-port conflicts. Java 21 and the pinned Firebase CLI
are installed; the emulator cache contains no Firestore JAR. Artifact checksum,
size and TLS verification remain enabled. No mirrors, direct network routes,
credential substitutions or production Firebase connections were used.

An additive configuration proposal preserved the existing Google Fonts domains
and added only `storage.googleapis.com`. The environment configuration tool
rejected the save with `stale_base`: this chat's draft predates the current
configuration version. Persistence and application of that network change are
not confirmed, so whether an applied allowlist addition resolves the download
cannot yet be verified. Do not retry the stale draft unchanged.

The proposed update, prior known setup instructions and helper files are
preserved outside the checkout in a transferable setup recovery bundle. Open a
new setup chat from the current environment settings, transfer that bundle, read
the new draft and reconcile the domain addition with its current policy. After
the supported settings flow applies the change, retry the normal demo-only
emulator launcher and `npm run test:emulators`. That integration suite was not
run in this verification because Firestore could not start. Use only the fixed
`demo-dominance` project, loopback endpoints and fictional accounts.

The fix is limited to Home wiring and regression coverage. Existing draft PRs
#1 and #2, production Firebase configuration/rules, dependency declarations and
academic content are unchanged. No push, merge or deployment is authorized.
