# DOMiNANCE development guidance

## Purpose and brand

DOMiNANCE helps Ghanaian HB1–HB3 medical students study, recall, and apply their course material. Build a focused, trustworthy study space that works well on phones.

- Use the clean typographic DOMiNANCE wordmark, preserving the lowercase i. Do not use a caduceus, decorative standalone D, or replacement medical logo. The wordmark stays consistent across workspace themes.
- Use blue and gold as the default brand palette. Optional themes must remain readable and accessible.
- Preserve existing slogans: "READY TO DOMINATE?!", "Absolute DOMiNANCE.", and "Get locked in, dominate."
- Write clear, encouraging copy. Avoid exaggerated claims about mastery or readiness.

## Current architecture

- React and Vite: src/main.jsx → src/App.jsx → src/DominanceApp.jsx.
- Firebase Authentication handles sign-in; Firestore stores student profiles and roles.
- src/account-session.js coordinates authentication and profile loading, clears stale account data, and ignores callbacks from previous accounts. Parent-owned avatar menu separates My Profile, Preferences and Account & Security, with recovery on demand and sign-out.
- The active authenticated interface is public/dashboard/index.html, embedded by PrototypeDashboard in an iframe.
- New dashboard demo attempts, resume and preferences use an authenticated parent adapter and private users/{uid}.dashboardState fields. Legacy localStorage records are preserved but not imported. The iframe URL has no identity/role parameters. Demo records are not trusted official scores.
- Older React learning and admin components remain in DominanceApp.jsx but are unreachable after the PrototypeDashboard return.
- public/dashboard/curriculum.js shares curriculum definitions and student-facing academic navigation rules between React onboarding and the HTML dashboard. HB1 uses semesters; HB2/HB3 use annual courses and can revise previous years.
- src/firebase.js initializes Firebase services from VITE_FIREBASE_* configuration. Service initialization does not mean the corresponding feature is implemented.
- firestore.rules defines database access; firebase.json configures hosting from dist.
- PDF reading, uploads, source-grounded AI, content administration, and active flashcards are incomplete. Demo scoring must not be described as a complete learning system.

## Development principles

- Show actual recorded data and useful empty states. Never invent study time, streaks, activity, or completion percentages.
- Label demo content and demo attempts explicitly. Accuracy measures answered questions, not course mastery.
- Use reviewed educational content with references to the relevant source and page where applicable.
- Explain quiz answers and connect questions to their actual course and topic.
- Respect the student's year, semester, and selected courses consistently.
- Do not imply that AI, PDFs, uploads, or integrations are connected until they work.
- Prefer one React application, shared curriculum definitions, and shared learning-data models. Migrate incrementally while preserving useful behavior.
- Keep scope small and changes reviewable; avoid unrelated redesigns and cleanup.

## Security and data

- Derive identity and permissions from authenticated state and enforce access through Firebase rules or server checks.
- Never authorize operations using URL account or role parameters, hidden controls, or browser storage.
- Keep AI and other privileged service credentials on a secure server or Cloud Function. Never place secrets in VITE_* variables or browser code.
- Validate persisted data on reads and writes; recover gracefully from invalid JSON and storage failures.
- Escape untrusted values before rendering HTML; prefer React text rendering or DOM textContent over HTML interpolation.
- Preserve existing student records when changing data formats; define and verify migration behavior.

## Working rules

- Read the current Git status and relevant code before editing. Preserve pre-existing uncommitted changes.
- Treat ROADMAP.md as the work inventory and update statuses only with evidence.
- Distinguish source implementation, local verification, and live-service verification in reports.
- Obtain explicit user authorization before committing, pushing, merging, or deploying.
- Do not clone, recreate, or replace this repository unless explicitly requested.

## Verification

- Run npm run lint and npm run build for application changes when the environment supports them.
- Add focused behavioral checks for meaningful changes: progress arithmetic, invalid stored data, duplicate submissions, course/year/semester selection, and account isolation.
- Check mobile layouts, keyboard access, readable contrast, loading/error states, and empty states when affected.
- Verify permissions with Firebase emulator checks before enabling real content or admin writes.
- Never use production writes or deployment as a test without authorization.
- For documentation-only changes, inspect the documents and Git diff/status; application builds are unnecessary.

## Current milestone and academic context

- Account reliability stages 1A, 1B and 1C are implemented locally and manually accepted, including the visible quiz-answer fix. Keep authenticated parent identity, private account-owned persistence, profile editing and existing theme/quiz behaviour intact.
- Phase 1 Home & Profile Experience Refinement is complete and accepted; existing Home and five-tab foundations are retained. Primary destinations are Home, My Courses, Practice, Community and My Progress, with responsive browsing navigation. Profile/settings remains in the avatar menu. Focused quiz exits use the accessible in-app confirmation.
- Browsing history stores presentation only. Validate course/topic context against the authenticated student's academic policy; never authorize using hashes/history state, URL parameters or browser storage.
- Do not silently migrate legacy browser records. New demo records are private personal activity, not official assessment scores or mastery. Pending sync remains memory-only: communicate errors/retry and do not claim complete offline support.
- Preserve featured-course selection; do not automatically assign compulsory courses. Automatic curriculum assignment is a later separately approved milestone.
- Speed Race, Weekly Revision and Community social features remain honest unavailable previews. Do not fabricate race states, student activity, countdowns, rankings or mastery. Weekly reminders use Ghana time and a Friday–Sunday window.
- Dedicated emulator testing is approved with fictional accounts only: npm run emulators, npm run dev:emulator, npm test and npm run test:emulators. Use fixed demo-dominance and loopback endpoints; see EMULATOR_TESTING.md. Never use the production .firebaserc default, import production data or expose credentials. Production requests/configuration/rules changes require separate approval. Restore temporary emulator overrides.
- Application foundations remain the priority. HB1 is the first eventual academic-content priority; materials may be prepared separately by Ofobi/team, without extraction, question generation or uploads in this milestone. SMS Handbook 2024 is context requiring current lecturer-outline verification.
- Stop after this milestone for manual review. No full Community, Speed Race, Weekly Revision engine, Study Space or mocks; no next milestone without approval. No commit, push, merge or deployment.
- Application appearance uses shared palette tokens in React and the iframe: six palettes, independent Light/Dark/System, intensity and motion preferences. Respect operating-system reduced motion; never continuously animate urgency.
- Optional goals are off by default, account-owned and based only on acknowledged valid completed activity. Never count pending drafts or silently repair a corrupt enabled goal into an achieved target. Demo totals are habit information, not academic mastery.

- Theme Studio drafts are visual only. Apply alone writes account preferences; Cancel, Escape, Close or leaving Preferences must restore the last applied appearance. Keep the four preference groups independent. Do not persist or transfer another account's draft.
- The approved spotlight now auto-advances at seven seconds with deliberate Pause/Play, interaction/hover/focus/hidden-tab/reduced-motion guards and a seven-second grace period after interactions. Do not restore the earlier manual-only direction as a current requirement.
- Profile photo support currently means session-only device processing, crop and Blob URL preview, explicitly labelled. No uploads, base64 Firestore storage or cross-device persistence. See docs/PROFILE_PHOTO_STORAGE_PLAN.md before proposing emulator or cloud integration. Do not claim the proposed rules have been deployed or tested.
- CELL STRUCTURE (HB1 First Semester) is the approved first content pilot for Phase 2, not this refinement milestone. Stop for review before starting it.

- Profile picture picker supports bundled preset portraits and initials saved as validated private dashboardState.avatar identifiers. Never store external avatar URLs or image blobs there. Temporary photo previews overlay the saved selection and must clear on account switching; removing a preview restores that account's saved preset/initials. Cancel never persists a draft selection.

- Medical-study SVG wallpaper is shared across browsing tabs, inherits theme colours and visual intensity, and remains noninteractive. Calm and forced colours hide it. Focused quizzes, study/reading contexts and LAMLA use quieter backgrounds. No caduceus is included. Preserve consistent themes in account panels while keeping forms readable.

## Phase 2 authorization — 2026-10-14

The user approved adapting the Cell Structure kit to this existing DOMiNANCE/Firebase repository, committing Phase 1 and working on a separate feature branch with a draft PR. This supersedes the earlier Phase 1 stop/no-content/no-commit restrictions for this pilot only. Do not switch to Supabase, change repositories, merge or deploy. Keep production Firebase configuration and rules unchanged. The Phase 1 checkpoint is 89d982a on pj/student-experience-foundation. Keep the Phase 2 PR based on that branch for a focused review.

Academic content remains a review candidate: 46 lessons and 170 supplied questions, unchanged originals in content/cell-structure. Recompile with npm run content:cell. Strip internal QA/provenance from the student asset; do not publish source slide images. No generated replacement academic material or mastery claims. Private cellStructure state is personal review activity, not authoritative assessment data. Academic approval by the user and review by Ofobi are merge gates.

## Current stabilization authorization — 2026-10-15

The user approved the comprehensive stabilization pass and additional information architecture within existing Draft PR #1. This supersedes historical continuous-reading, separate favourites-correction and no-commit restrictions for this pass. Commit/push to codex/hb1-cell-structure-content; preserve base pj/student-experience-foundation and Draft status. Never merge/deploy or change production Firebase rules/configuration.

- My Courses → course → exactly Study Blocks, Summaries, LAMLA. Study Blocks → seven blocks → numbered lessons → one natural-length section at a time. Summaries await academic approval; do not republish Slide Essentials as block summaries. LAMLA means Last-Minute Learning Association and remains Coming Soon.
- Practice → exactly Topic Questions, Past Questions, Flashcards, Mock Exams. Topic Questions reuses the existing MCQ engine and actual available pools; the other destinations remain unavailable until authentic approved content/workflows exist. No generic topic-reading grid on Practice.
- All original 46 lesson Markdown files, 170 questions and 51 checks remain intact. Source IDs stay internal. Formatting/consolidation must preserve unique scientific text. Substantive rewrites/corrections/new claims need academic approval; see docs/EDUCATIONAL_REVIEW.md and its 92-row inventory.
- Theme drafts never change parent/iframe workspace tokens. Only acknowledged explicit Save applies appearance globally; failed saves preserve draft/retry. Closing/cancelling discards draft.
- Onboarding asks name, level and applicable semester, without a course picker. Preserve existing courses fields; automatically expose eligible courses but do not implement new compulsory assignment.
- Private cellStructure version 1 accepts legacy drafts and format:2 response maps; upgrade only already-account-owned drafts on explicit resume. Optional reading.part is a zero-based section; older offsets are not guessed onto a different section layout. Never import ambiguous device records or delete history.
- Read position, self-marked read lessons and practice accuracy are distinct, never mastery. One draft/account, bounded history, memory-only pending sync and static-public content limitations remain explicit.
- Preserve five tabs, Home/Profile, authenticated identity and account isolation. Focused reading/quiz retains clear exits and the on-demand account header. Assistant remains one noninteractive Home Coming Soon item.
- Capture evidence before fixing reproducible timing issues and distinguish observed root causes from code-only risks. Use loopback demo-dominance emulators only. Restore temporary in-memory emulator rule overrides immediately.
- Run regressions, real emulator integration, lint/build and desktop/390px browser checks. Passing software tests does not constitute academic approval. Stop for manual and academic review after updating the draft PR.
