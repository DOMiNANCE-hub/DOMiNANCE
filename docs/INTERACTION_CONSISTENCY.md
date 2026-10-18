# Interaction and visual consistency — 2026-10-18

Status: implemented locally, awaiting visual acceptance. Existing uncommitted selector/header refinements preserved. No commit, push, merge or deployment; no production Firebase settings/rules or academic content changes.

## Concrete implementation findings and fixes

- Shared dashboard CSS previously loaded appearance/refinement twice and appended polish/appearance/refinement dynamically during setup. The active sheets now load exactly once in the head, in explicit order: polish → appearance → refinement → Cell Structure → shared choices → shared interaction contract. This prevents late stylesheet arrival from changing an already-visible workspace. Existing base layout CSS remains; this is not a claim that every historical style has been rewritten or removed.
- Opening the Cell Structure course previously called its renderer before and inside showView. Navigation now delegates one render to showView; a behavioural regression verifies one call.
- Progress save notifications previously refreshed hidden Home and Progress DOM. Those hooks now update only the visible destination; opening the destination still renders current acknowledged data. This changes rendering work, not which data is saved or trusted.
- The choice-menu observer previously scanned for selects after every text/presentation mutation. It now filters unrelated mutations and responds only to select-containing additions/removals and disabled state changes. The parent account document does not start the dashboard observer. Picker disposal removes its source listener; inherited fieldset disabled state is respected.
- The React wrapper mounts and refreshes its selector before browser paint (SSR keeps the effect fallback), reducing the native-control → custom-control flash. Saved account appearance applies in a layout effect before paint. These lifecycle changes preserve controlled native values and normal change handlers.

## Shared design contract

public/dashboard/workspace-ui.css is shared by the React shell and iframe and owns control dimensions, corner radii, spacing, interaction timing and focused-study surfaces. It uses existing six-palette semantic tokens rather than a new theme system. Cards, destination descriptions, lessons, menus, answer controls and results have consistent geometry; hover does not translate cards or change their dimensions.

Focused reading and quizzes use solid surfaces without backdrop blur. Mobile cards/account panels avoid blur; existing wallpaper and motion preferences remain. View/section entrances use a 140ms opacity-only animation, with no movement or delayed interaction; reduced-motion settings disable it. This is an implementation improvement, not a measured FPS/performance result.

Routine saving appears in a reserved small header text slot, with no vertical strip and no notice covering reading or answers. Retryable failures retain the existing non-layout status notice and Retry control. Selected answers use accent/tick/pressed state; separate keyboard focus remains visible without the old inset gold box shadow.

## Preserved behaviour

Five tabs; exactly three course and four Practice destinations; profile editing, sign-out, recovery and theme drafts; academic eligibility; all 46 original lessons, 170 MCQs and 51 checks; read markers and saved section positions; changeable answers, Previous/Next, review/submission/results; account-owned storage and existing draft compatibility. No source scientific text or unavailable-feature status was changed.

## Verification and limits

- 107/107 automated tests passed, zero failed/skipped. New checks cover stylesheet order/single loading, one-pass course rendering, hidden-view refresh suppression and bounded menu observation. Existing quiz, curriculum, account, source-integrity, contrast and reduced-motion tests remain.
- Lint: zero errors, eight existing warnings in dormant React code. Production build passes with the existing large-bundle warning. Git diff whitespace check passes.
- Isolated real Auth/Firestore integration checks cover profile persistence, recovery, account switching, private draft/result/location reload and expected cross-owner denials; final result recorded in ROADMAP.md.
- Browser policy previously denied localhost inspection. No alternative browser/automation route was used to bypass it. Current visual rendering, physical touch, real nested-dialog keyboard interaction, first-paint screenshots and measured layout/performance need independent validation. The user is currently unable to perform that review; implementation must not be described as visually accepted or proven equally smooth as the reference app.
- The reference app was inspected only through account/setup screens because its onboarding returned permission-denied. No claim about its full dashboard performance or generator was made, and no reference code/assets were copied.

Local preview: http://127.0.0.1:5174/ (PC and isolated emulators must be running).

When visual access is available: compare all five browsing tabs, then Course → Study Blocks → Lesson → Section → Practice → Results at desktop and 390px; test palette/mode changes, keyboard menus/Escape, saved-theme reload, answer selection at a stable scroll position, account switching and failure/retry feedback. Validate perceived smoothness on an actual phone before wider release.
