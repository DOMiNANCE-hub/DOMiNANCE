# DOMiNANCE roadmap

Updated 2026-10-15. Current status below supersedes historical milestone entries. Phase 1 is checkpointed at 89d982a; Phase 2 is on codex/hb1-cell-structure-content in Draft PR #1, based on pj/student-experience-foundation. No merge or deployment.

## Current verified state — stabilization and course/practice architecture

- Five primary tabs remain: Home, My Courses, Practice, Community, My Progress. Home/Profile remain intact. Account reliability 1A–1C and Phase 1 were manually accepted.
- Every available course opens Study Blocks, Summaries and LAMLA. Cell Structure Study Blocks contains seven blocks, 46 numbered lessons and one-section-at-a-time reading. Other courses have honest unavailable destinations.
- Practice independently opens Topic Questions, Past Questions, Flashcards and Mock Exams. Only Topic Questions has content: the 170 supplied Cell Structure MCQs. Other destinations are Coming Soon; no invented papers, decks or exam formats.
- Section reading supports contents, Previous/Next, explicit read markers, 51 revealable checks, source disclosures and approximate account-owned section resume. Focused reading/quiz hides primary navigation but retains clear exits and the account header.
- Practice supports actual-pool five/ten/all counts, stable shuffled choices, changeable answers, Previous/Next, jump/status, review before submission, unanswered marking, explanations, history and retry. Existing drafts resume without replacement.
- Signup/onboarding no longer has a course/favourites picker. Existing course preferences remain intact; curriculum visibility follows year/semester eligibility. No new compulsory assignment implemented.
- Theme Studio previews are scoped to its miniature. Explicit Save acknowledges an atomic owner-profile write before applying globally. Failure preserves the draft for retry. Cancel/close discards unsaved preview.
- Reproduced theme leakage and 42px sync-induced layout movement are fixed. Remaining claims and before/after evidence are in docs/STABILIZATION_REPORT.md.
- All 92 educational components reviewed: 50 effective, 34 useful but unclear, 4 questionable and 4 exact duplicates. Formatting applied; four exact repeated connections link to their shared original. Substantive academic revisions await approval. All original lesson Markdown and MCQ JSON remain unchanged.
- Verification: 100 automated tests and one real local Auth/Firestore integration scenario pass; lint has eight existing legacy warnings and zero errors; build passes with the existing bundle-size warning. Desktop/390px journeys checked. Physical-device touch, screen-reader audit, complete source reconciliation and question-by-question certification remain outstanding.

## Next approval gates and planned work

1. User/Ofobi review of this Draft PR and the academic proposals in docs/EDUCATIONAL_REVIEW.md. No automatic merge or deployment.
2. Approve and prepare seven block summaries separately; Slide Essentials are not approved block summaries.
3. Define and academically review LAMLA (Last-Minute Learning Association), verified past papers, flashcards and mock assessment rules before implementing content/workflows.
4. Future curriculum catalogue maintenance and compulsory-course personalization remain separate from eligibility visibility. Handbook 2024 needs current lecturer-outline verification.
5. Community, Weekly Revision, Speed Race, Mistake Bank and an actual source-grounded assistant remain planned; no fabricated activity or working integration claims.
6. Resolve pilot capacity/offline/concurrent-draft limitations before wider release. Protect licensed content and authoritative assessments server-side if introduced.

Historical entries below record what was true at each earlier milestone; later verified status above takes precedence.

## Product direction

Build an understandable, trustworthy medical study space for Ghanaian KNUST students. Preserve DOMiNANCE branding, its clean typographic DOMiNANCE wordmark (lowercase i, no caduceus or decorative D), blue-and-gold default and existing slogans. Keep phone use, keyboard access and readable themes central.

Application functionality and foundations come first. HB1 is the first eventual academic-content priority because materials exist for both semesters. Academic preparation is a parallel workflow, potentially coordinated by Ofobi with team support; ownership and review procedures still need agreement. Cell Structure supplied materials are now a versioned review candidate; no automatic question generation or resource uploads are implemented.

The SMS Handbook 2024 provides curriculum context. Verify current lecturer outlines before treating it as 2026/27 course content. HB2 has paired semester course codes despite annual student navigation; HB3 has five core course groups. Preserve codes and source editions in a future maintained curriculum catalogue rather than rewriting screens. Handbook title/credit inconsistencies require verification. Clinical years remain future scope.

## Current architecture

React/Vite handles Firebase authentication and Firestore users/{uid} onboarding. The active learning interface is public/dashboard/index.html in an iframe. public/dashboard/curriculum.js shares academic navigation policy with React onboarding. src/account-session.js now coordinates authentication/profile subscriptions; parent-owned account controls use authenticated state.

Stage 1C: the parent bootstraps the dashboard from authenticated UID and loaded profile, with no identity URL parameters. New demo history, resume and preferences persist in allowlisted dashboardState fields of the private users/{uid} document. Older device-local URL-scoped records are preserved but not imported. Older React learning/admin components remain unreachable after the iframe return. Firebase service initialization does not establish a working PDF, AI or administration feature.

Target: incremental consolidation into one React application, shared stable course/topic/content models, trusted identity and routes, reviewed resources, then cloud progress. Preserve existing records during migrations.

## Historical baseline before account milestones

- Four primary tabs: Home, My courses, Practice and My progress, with mobile navigation.
- Practice groups quizzes, flashcards and LAMLA. Flashcards is explicitly coming soon; LAMLA remains a Home shortcut. Topic assistant identifies itself as a disconnected preview.
- Shared academic policy: HB1 Semester 1 sees Semester 1; Semester 2 can revise Semester 1. HB2/HB3 use annual navigation and previous-year revision. No future-year placeholders.
- Home features selected current-period courses. Courses, Practice and LAMLA share the chosen curriculum scope. Profile labels use actual level/period; permitted earlier-year resume records are retained.
- Onboarding asks for semester only in HB1, filters selected courses and shows save errors. HB3 current-year courses are honestly empty pending catalogue work.
- Progress replaces fabricated study time/streaks/completion with recorded demo sessions, answered questions and weighted accuracy. Attempts have IDs, timestamps and explicit demo labels; legacy undated records remain visible as chronologically unknown.
- Completion refreshes totals/history/course counts; stored text is escaped, damaged history and storage failures do not overwrite records, and failed saves can be retried.
- LAMLA locks completed answers and prevents repeat submission, retaining the course/topic used when the sheet was built. Quick practice has three unique generic demo questions. Corrupt resume is ignored; HB3 practice has a useful empty state.
- Earlier browser checks covered tabs, Practice/LAMLA return navigation, assistant placement, HB2 annual courses and HB1 revision. Thirteen dashboard regression tests currently pass. Theme/card override consistency and wider mobile review remain pending.

## Account and Profile Reliability — locally implemented and manually accepted

### Stage 1A — locally verified and manually accepted

- Profile & Settings is a keyboard-accessible parent dialog, available during onboarding and throughout the embedded dashboard.
- Read-only name, authenticated email and academic scope; visible sign-out and password recovery. Sign-in also provides Forgot password.
- Authentication/profile loading, retryable errors, a loading timeout, friendly action errors and duplicate-action guards.
- Clear previous profile immediately on account changes, unsubscribe old listeners, reject stale callbacks, bind loaded profile identity to authenticated UID and remount the dashboard per account.
- Existing onboarding and academic access policy are retained. Academic editing is not included.
- Verification: 27 offline regression checks passed, plus one actual Auth/Firestore integration scenario covering account creation, sign-in, missing/existing profiles, recovery link creation, sign-out, switching and denied cross-student reads/writes.
- Actual app browser checks passed fictional HB1 and HB2 onboarding, sign-in, invalid password, reload persistence, password recovery, sign-out, switching both ways, loading transitions, denied profile loading and successful Retry after restoring emulator access. The denied-load screen did not display another profile or reopen onboarding.
- Phone-width account controls had no horizontal overflow; dialog centering was corrected. Basic keyboard access, Escape focus restoration and native modal behavior were checked. Duplicate account/dashboard keys and legacy invalid-password error feedback found during testing were corrected.
- Lint now runs successfully with eight warnings confined to legacy unreachable React screens. Regular production build passes with its large-bundle warning; an attempted emulator-mode build fails deliberately. Production Firebase behavior and comprehensive accessibility testing remain unverified.

Firebase isolation: real-project environment values remain absent. The dedicated emulator mode ignores any real values, fixes demo-dominance, uses a distinct checked Firebase app, explicitly connects to local Auth/Firestore, and disables Storage/Realtime Database. A development-only browser connection policy allows only local endpoints, and emulator builds are refused. All emulator ports were confirmed bound to 127.0.0.1. firebase.json, .firebaserc and firestore.rules are unchanged; the existing rules were exercised locally and temporary in-memory failure overrides were restored. No production requests or student records were used.

Tooling: firebase-tools and oxlint are local development dependencies. Official portable Java was checksum-verified without changing system Java. Windows AF_UNIX socket initialization initially failed; the launcher uses OpenJDK TCP-loopback fallback for this environment. npm certificate errors were resolved by using Windows system trust, without disabling TLS validation. See EMULATOR_TESTING.md.

**Acceptance:** Stage 1A was manually accepted using the local emulator experience. Recovery links stay in the emulator; real inbox delivery, Google provider configuration, deployed rules and production behavior remain unverified. Loading timeout/stale-callback edge cases are additionally covered by mocked tests; a full browser outage test is still pending. Production configuration, email delivery and student-data writes require separate approval. Do not proceed automatically to Stage 1B.

Onboarding proposal from discussion: compulsory courses should come automatically from level/semester; optional favourites may personalize Home. This is a recommendation for a separately approved onboarding/profile stage. Existing course-selection behavior remains unchanged in Stage 1A.

### Stage 1B — locally verified and manually accepted

Approved scope: edit display name, level and applicable semester. Preserve existing featured-course selection and filtering; no automatic assignment. Saves reflect through the existing profile subscription into account details, avatar and dashboard. Course-selection editing is not added in this stage.

### Stage 1C — locally verified and manually accepted

Replace URL-driven identity assumptions with authenticated application state throughout account-specific integrations. Verify forged parameters cannot authorize student/admin actions. Test switching accounts, persistence, errors and overall student flow. Security applies in every stage, not only here.

## Subsequent functional priorities — agree scope incrementally

- Improve Home content, course/topic navigation and search, and the connection from study resources to relevant practice.
- Define useful settings: theme/mode, font size, language and other student needs; implement only options with working behavior. Remove redundant controls and clarify navigation/back behavior.
- Define the Medic Companion within the study flow and the purpose, entry points and duration-based behavior of Last Minute Learning (LAMLA). Current assistant and LAMLA content are demonstrations.
- Migrate active dashboard views incrementally to React; remove unreachable duplicates only after replacement verification. Consolidate routes, styles and models.
- Prepare a maintained curriculum catalogue with stable identifiers, handbook/lecturer source references and review status. HB1 first, HB2 next, HB3 later; catalogue work is not the current milestone.
- Choose the first real course based on available reviewed materials; Cell Structure remains a candidate, not a committed pilot. Deliver PDF reading, referenced summaries/topic breakdowns, relevant questions and explanations, accurate resume and topic-linked progress.
- Add permission-controlled resource/question/flashcard administration, emulator-tested access and cloud attempt/resume synchronization with an explicit local-record migration strategy.
- Add secure server-side, source-grounded AI with source/page references and honest missing-context responses; implement saved flashcard review scheduling. Expand coverage only after the pilot meets the review and usability standard.

## Known limitations and release gates

- Generic demo quizzes/LAMLA are not course mastery. PDF uploads/readers, grounded AI, real flashcards and active content administration are incomplete.
- URL role/account parameters still affect dashboard presentation/local storage; they must never authorize trusted operations. Curriculum visibility is navigation policy, not backend access control.
- Lint dependency is repaired; eight legacy warnings remain. Build warns about the large application bundle. npm audit currently reports 18 dependency vulnerabilities (13 high, 5 moderate), including existing Firebase/Vite and new emulator-tool transitive dependencies. Suggested fixes include major-version changes/downgrades; no blanket audit fix was applied. Plan a separate reviewed dependency-maintenance task before release.
- Run focused tests and builds for code changes; verify relevant mobile/keyboard behavior and loading/empty/error states. Check permissions in an isolated emulator environment before enabling real content/admin writes.
- Report implemented, mocked, browser-tested and live-verified behavior distinctly. Preserve uncommitted work. Commits, pushes, merges, deployment and Firebase settings/rules require explicit approval.

## Account & Navigation Polish — implemented locally (2026-10-13)

User-approved interlude before Stage 1B. Stage 1A was manually reviewed by the user.

- Brand: clean typographic DOMiNANCE, distinctive lowercase i; no caduceus or standalone decorative D in the active header/navigation/sign-in interface. Wordmark and deep-blue header remain consistent across workspace themes.
- One responsive authenticated header replaces stacked headers. The desktop avatar shows the student's name; mobile uses an accessible initials avatar. Four student navigation areas remain Home, My Courses, Practice and My Progress.
- Account menu groups My Profile (read-only existing details), Preferences (existing four colour themes and light/dark controls), and Account & Security (on-demand recovery and sign-out). Recovery Back returns to security; Escape restores focus to the avatar.
- Existing theme functions and per-account device storage are reused. No new theme system, profile editing or automatic course assignment. Account changes remount workspace appearance state. Preferences waits until workspace functions are ready.
- Redundant embedded branding/header/sidebar account summary and the nonfunctional bell are hidden/removed. The watermarked wallpaper is removed from presentation. Existing desktop/admin presentation remains reachable separately from the four student tabs.
- Cohesive DM Sans/Manrope typography, standard outline navigation icons, readable supporting text, consistent corners/spacing and keyboard focus styling. Dark-mode contrast issues found in review were corrected. No learning content or progress model changes.
- Browser checks: desktop and 390px phone layouts; four navigation states; new menu and three categories; on-demand local recovery; keyboard dismissal/focus; all four existing colour themes; reload persistence; Ama/Kojo account switching with distinct academic details and preferences; denied profile loading and successful retry after emulator access restored.
- Automated checks: 27 offline regression checks and one real local Auth/Firestore integration scenario passed. Lint succeeds with the eight existing legacy warnings; production build succeeds with the existing large-bundle warning. Basic keyboard/responsive checks do not constitute a comprehensive accessibility audit. Production integrations remain unverified.

### Future personalization — pending

Preserve current working light/dark and four colour choices. Later support system appearance, curated accessible workspace themes and accent colours, with contrast checks, account-aware persistence and a consistent official wordmark. Do not add nonfunctional preference switches. Broader Home/banner and learning-screen refinements remain separate incremental work.

**Next:** user manually reviews Account & Navigation Polish. Stage 1B and compulsory-course assignment require separate approval.

## Browsing and focused study — approved navigation direction

- Keep Home, My Courses, Practice and My Progress accessible while browsing courses/topics. Profile & Settings remains in the parent avatar menu, including focused study.
- Implemented in this polish milestone: the existing untimed quiz demo hides desktop/sidebar and mobile/bottom navigation, removes unrelated practice choices, focuses its Exit button on entry, and confirms before discarding an unfinished attempt. Cancelling retains answers; completed scores retain existing account-scoped storage. The interface explicitly says unfinished answers are not saved on exit/reload.
- Pending separate functional milestones: focused reading, working flashcards, mocks, Speed Race and LAMLA sessions. Their current placeholders/setup remain browsing views; do not imply functioning readers, timers or resumable assessments.
- Reading/flashcards should preserve position/progress where supported. Before implementing timed assessments, define interruption/resume policy, timer behavior during backgrounding/reload, automatic submission, save failures and confirmation before abandoning. Provide clear Back/Exit, restore focus appropriately, and consistent mobile/desktop behavior. No obstructive floating controls.

Navigation verification: 28 offline checks passed; lint succeeds with eight existing warnings and regular build succeeds with the existing bundle warning. Actual browser entry verified hidden primary navigation, visible parent avatar, focused Exit, and explicit unsaved-answer copy. Browser automation stalled at the native confirmation dialog; interactive confirmation/cancellation and fresh mobile checks remain for manual review. No Firebase or account implementation changed.

### In-app practice exit confirmation — verified locally

Replaced the native browser confirm with a reusable native HTML dialog styled to existing themes. Keep practising is focused by default; Escape/cancel preserves answers and restores Exit focus. Explicit Exit practice alone discards the unfinished demo and restores Practice focus. Tab/Shift+Tab stay within both actions. Named heading/description, responsive stacked phone actions and theme-aware colours are included. Desktop and 390px browser checks passed cancellation, selected-answer preservation, Escape, confirmed exit and focus restoration. 29 offline checks passed; lint/build pass with existing warnings. No other alert/confirm/prompt calls were found in src/public. Full screen-reader and cross-browser audits remain unverified. Firebase untouched; Stage 1B remains pending. This supersedes the earlier native-confirmation testing limitation.

## Updated V1 direction and sequence — planning reference

Target five primary tabs: Home, My Courses, Practice, Community and My Progress. Current interface remains four tabs until the separately approved five-tab/Home milestone. Profile/settings stays in the avatar menu. Stage 1C precedes that milestone; then an HB1 reviewed Study Space/question-bank pilot, Mistake Bank and Weekly Revision, limited Community, scheduled Speed Race, and reviewed LAMLA/mocks. Home will progressively include Continue Learning, Quick Practice, contextual Race state, Weekly Revision reminders, compact Community activity and meaningful progress.

Automatic compulsory-course assignment is an explicit later curriculum-personalization requirement; optional featured courses remain separate. Weekly Revision selects Monday–Friday topics manually, supports Friday–Sunday sessions, recall/mixed practice and saved progress. Community starts with opt-in public profiles separate from private account records; classmates/following, challenges, achievements/streaks and moderated sharing follow tested permissions. Speed Race requires trustworthy schedules/timing/scoring, context-sensitive live states, reduced-motion-compatible brief attention animations, limited leaderboards and private detailed performance. No implementation of these features in Stage 1B.

### Stage 1B verification (2026-10-13)

32 offline tests plus the real local Auth/Firestore integration scenario passed, including edited-profile persistence across sign-in, preserved role/email, and denied cross-student access. Desktop UI verified whitespace validation, name/semester edits, account/dashboard updates and reload. Phone UI verified HB2 annual editing; an emulator-only write denial retained the draft and displayed an error, then restored rules allowed retry. Sign-out/sign-in restored edited values. Save disables fields and locks duplicate submissions; authenticated UID is checked before updateDoc and only profile fields are written. Existing URL-based dashboard presentation is reused without adding identity dependencies; Stage 1C remains pending. Saving profile changes reloads the existing iframe, so unfinished demo sessions are not preserved; completed local records remain intact.

Lint passes with eight pre-existing warnings; build passes with its existing bundle warning. Production Firebase settings/rules untouched and temporary emulator overrides restored. Full screen-reader/cross-browser review, offline-long-running save behavior and production integration remain unverified. Account switch persistence/isolation is tested with emulators; no new two-account browser switching run was performed in this stage. Next: user manual review; do not start Stage 1C or five-tab/Home work automatically.

## Stage 1C — Trusted Identity & Persistence Foundation (2026-10-13)

- Manually accepted Stage 1B. Authenticated React parent now initializes the existing iframe with its account profile and a UID-bound storage adapter. No dashboard URL identity/role parsing or direct browser storage access remains. Standalone/forged dashboard URLs show sign-in guidance. Parent account actions retain authenticated identity; the learning iframe never receives credentials or a generic Firestore client.
- New demo attempts, study location and theme/mode use users/{authenticated UID}.dashboardState. Reads come from the authenticated profile subscription; adapter writes allow only five bounded keys and guard current UID/lifecycle. Existing owner rules were tested locally, not edited. Demo attempt arrays merge transactionally by stable ID to retain concurrent completions; corrupt/oversized histories fail rather than overwrite. Preferences/resume use last-write-wins semantics. These are editable personal demo records, not secure assessment scores or mastery evidence.
- Saving/sync failure status and Retry sync are visible. Pending drafts stay in session memory, not localStorage; closing/reloading before successful sync may lose unsynced activity. Extended offline operation is not a completed feature. Signed-out/previous-account adapters refuse reads and new writes. Already dispatched writes remain subject to Firebase authentication/rules.
- Stable iframe URL fixes profile-save reloads. Name edits preserve an active demo question. Level/semester changes update filtering in place and return to My Courses to avoid continuing a now-inaccessible context; unfinished assessment resume is not implemented. The four tabs, account editing, theme functions, quiz and LAMLA demonstrations remain. No five-tab/Home implementation.
- Migration decision: legacy dominance:* and unscoped device records are left byte-for-byte untouched and excluded from new account history. A UID-looking key cannot establish ownership because it was editable. No silent migration. Any future import/export needs an explicit reviewed provenance strategy and user approval; legacy theme preferences also are not automatically imported.
- Verification: 37 offline tests passed; actual local Auth/Firestore integration passed account/profile persistence, cross-account read/write/listener denials, storage refusal after switching and concurrent transaction retention. Browser verified actual demo completion/reload, Ama→Kojo→Ama separation, profile name save preserving question 2, forged URL sign-in guidance, denied activity sync then restored-access Retry/reload, and 390px progress display. Lint/build pass with eight pre-existing warnings and the existing large-bundle warning. Temporary in-memory emulator overrides restored; production Firebase files unchanged.
- Remaining: production rules/service verification and rollout approval, full accessibility/cross-browser checks, robust offline recovery, large-history storage model, timed assessment policies and comprehensive multi-device UI testing. Firebase SDK local caches/browser developer tools are not a privacy boundary against someone with control of the browser; private server access is enforced by rules. Future question/race authority belongs on the server.

Stage 1C and the quiz selection fix were manually accepted. Five-tab/Home was subsequently approved; see the current milestone below.

### Demo quiz answer-selection fix — manually accepted

User's earlier polish acceptance covered Exit Practice only, not answer selection. Current browser reproduction found clicks updated the selected-answer state/class while selected and unselected backgrounds/borders remained identical. Existing !important theme/mode rules overrode the original selection style; buttons also lacked an accessible pressed state. No claim is made about which milestone introduced the issue.

Fixed quiz-selected specificity with a consistent blue fill, gold border and visible check/Selected label, plus aria-pressed on every option, exclusive state updates, invalid-index guards and phone-sized targets. Answers remain changeable before advancing and locked after completion. Added a behavioral selection→change→completion regression test. 38 tests plus the isolated Auth/Firestore integration passed; lint/build pass with existing warnings. Actual desktop browser clicks verified state/visual colour differences, change of answer, completion, reload and Ama/Kojo/Ama history separation. 390px interactions, completion and Space-key selection passed. Exit cancellation/Escape retained answers and explicit exit returned to Practice. Physical touchscreen input and comprehensive cross-browser/screen-reader testing remain unverified; phone-width checks use the available browser's pointer controls. No persistence/security/Firebase rules changes. The user subsequently confirmed the fix works.

## Current milestone — Five-Tab Navigation & Home Foundation (2026-10-14)

Implemented locally, pending manual review. Historical four-tab descriptions above document earlier stages; current navigation is five tabs.

- Home, My Courses, Practice, Community and My Progress have working destinations, active aria-current states, desktop sidebar and five evenly sized mobile bottom controls. Keyboard course/topic actions and view-heading focus were added. Account profile/settings remains in the authenticated parent menu.
- Parent-owned browsing history uses primary-view hashes with account-tagged presentation context, never identity/permissions from the URL. Back/forward restores valid course/topic routes; foreign-account history resets to Home. Unfinished demo history exits use the existing safe-default dialog. Cancelling a browser-back exit replaces the popped history entry with the current practice route; this intentionally keeps the attempt, but does not guarantee preservation of every cancelled history entry.
- Home replaces rotating banners with Continue Learning (actual validated saved location, or My Courses fallback), functional three-question Quick Practice, actual private recorded demo totals/history, selected current-period courses (or explicit no-selection fallback), Community entry and honest Speed Race/Weekly Revision previews. Recent Home history is capped visually to three attempts. Nothing automatically selects compulsory courses or fabricates social activity/mastery.
- Weekly Revision reminder text uses Africa/Accra and distinguishes the Friday–Sunday revision window. Engine/topic tracking is unavailable. Community is informational only; Speed Race has no backend, live states or leaderboards. Course resources/assistant/flashcards remain incomplete as previously documented; existing LAMLA is a demo.
- Existing palette controls/light/dark preserved; readable new headings, keyboard targets, no horizontal overflow in the 390px review and reduced-motion rules. No rotating Home animation or new decorative logo/watermark.
- Small architecture scope: existing React account shell and HTML iframe preserved. Added src/dashboard-navigation.js, with UI history hooks passed on both initialization paths. Same-account development reinitialization refreshes adapters safely without reloading the iframe. Source changes also in src/DominanceApp.jsx, public/dashboard/index.html and polish.css; regression changes in tests/dashboard-navigation.test.js and dashboard-progress.test.cjs.
- Verification: 43 offline tests and the isolated Auth/Firestore integration pass. Lint passes with eight existing warnings, regular build with the existing large-bundle warning. Browser checked Community/back/forward, Home fallback/resume with keyboard course/topic selection, Quick Practice selection/completion, back-exit cancellation retaining answers, reload, private totals, profile save access and dark/light Preferences. Desktop 1440px and phone 390px layouts inspected. Account switching showed Kojo's zero history/own selection instead of Ama's history/resume. Production Firebase files/settings/rules unchanged; no new cloud resources or deployment.
- Remaining: physical touchscreen and comprehensive screen-reader/cross-browser audits; long-offline sync recovery and genuine reviewed academic content remain future milestones. Preview data is local emulator-only and disposable; production behavior remains unverified.

Next: manual review at http://127.0.0.1:5174/. Inspect all five tabs, Continue Learning fallback/resume, Quick Practice, account/profile/preferences and phone navigation. Stop here until approval for another milestone.

## Current milestone — Home Tab Complete Implementation (2026-10-14)

Implemented locally, awaiting manual review. This supersedes the foundation's next-step status and earlier future-personalization entry; historical stage verification remains recorded above.

- Home now has adaptive welcome messaging, a prominent validated Continue Learning location/fallback, Quick Practice linking to existing Practice selection/general demo, a manual learning spotlight carousel, optional daily goals, seven-calendar-day learning momentum, selected-course links and truthful Weekly Revision/Community/Race availability. No automatic course assignment, fabricated social counts or academic mastery claims.
- Shared appearance spans the parent account shell and iframe: Signature, Aurora, Sunset, Ocean, Bloom and Midnight palettes; independent Light/Dark/System, Calm/Balanced/Vibrant and Reduced/Smooth/Expressive controls. Operating-system reduced motion takes priority. Subtle static ambient shapes, responsive cards and visible keyboard focus replace inconsistent legacy presentation. Old account-owned palette aliases normalize safely; no ambiguous device-local records are imported.
- Goals default off and support session/question targets, editing, pause/resume and removal without deleting activity. Students may choose a valid time zone, default Africa/Accra. Totals use acknowledged completed records only, deduplicate IDs and reject corrupt, undated, future or impossible counts. Goals reset by calendar date in the chosen zone; momentum covers today and the preceding six calendar days. Accuracy is weighted by questions, explicitly includes demo practice and is not mastery.
- Appearance and goals use the existing authenticated UID-owned dashboardState adapter, not a new collection or browser storage. Firestore metadata distinguishes pending local writes from acknowledged records. Failed writes retain memory-only drafts with Retry sync; closing/reloading before acknowledgement can lose changes. Corrupt enabled goals safely become off; no ambiguous migration is performed. Existing transactional attempt merge and account disposal guards are preserved.
- Welcome uses real completion/resume timestamps and onboarding context; inactivity threshold is 14 days. Reader-position resume is not implemented. Carousel has native horizontal scrolling, arrows and keyboard support, no autoplay. Race presentation supports future verified state transitions with brief finite motion, but runtime has no race source/join operation. This is presentation preparation, not race authorization/backend implementation.
- Verification: 59 offline tests passed, no skips/failures; one actual isolated Auth/Firestore integration scenario passed, including private goal/appearance persistence and cross-account denial. Expected PERMISSION_DENIED logs belong to negative access tests. Lint passed with eight existing legacy warnings; regular build passed with the existing large-bundle warning. git diff --check passed; tracked production Firebase configuration/rules have no changes.
- Browser checks: all six palettes in both modes, independent appearance settings, manual carousel arrows/keyboard, goal validation/edit/pause/resume/remove, acknowledged completion, reload, quiz selection/completion and safe exit cancellation, profile access, account separation, denied goal write followed by restored-emulator Retry/reload and Continue Learning. Desktop and phone-width layouts inspected; a 60-character unbroken name fit at 320px. Contrast token checks cover all 12 palette/mode combinations. No new dependency was added for Home.
- Limitations: physical touch/swipe, actual OS setting changes, comprehensive screen-reader/cross-browser accessibility and low-end-device performance remain manual verification; OS-change handlers and reduced-motion behavior have automated coverage. A desktop screenshot was saved; the browser capture service failed to save a phone screenshot despite a successful phone DOM inspection. Production services were not contacted/tested. Extended offline durability and large-history scaling remain future work.
- Major modules: public/dashboard/home-model.js (validated activity/goals/welcome/race state), home-ui.js (Home interactions), appearance.js and appearance.css (shared themes), index.html (Home integration); src/appearance.css, DominanceApp.jsx and dashboard-session.js (account controls/shared appearance/acknowledgement). Focused Home/storage/dashboard/emulator tests cover regressions.

Review: in separate terminals at the existing repository, run npm run emulators and npm run dev:emulator; open http://127.0.0.1:5174/#home. Use fictional local emulator accounts. Checks: npm test, npm run test:emulators, npm run lint, npm run build. No commit, push, merge or deployment performed. Stop for user review; no other-tab implementation begins automatically.


## Current milestone — Phase 1 Home & Profile Experience Refinement (2026-10-14)

Implemented locally, pending product-owner review. This supersedes the previous Home milestone's manual-only carousel and immediate-save Preferences as current product direction; historical results remain above.

### Implemented and verified locally

- Live Theme Studio: six miniature theme thumbnails, a meaningful workspace preview, independent palette/display/intensity/motion groups and immediate unsaved application-wide preview. Apply writes through the existing private account adapter. Cancel, Escape, closing the dialog and leaving Preferences restore the last applied appearance. Preview-only changes do not write storage. Existing aliases and OS appearance/reduced-motion handlers are retained. Initial appearance now reads normalized account preferences before the iframe finishes loading.
- Shared visual depth: theme-responsive multilayer gradients, genuinely translucent panels (76% surface in Vibrant, 83% in Balanced), 12px controlled backdrop blur, translucent borders/highlights/shadows and gentle transform-only decorative motion. Calm removes ambient complexity; Reduced/OS reduced motion disables animation independently. Opaque fallback remains for unsupported blur. Focused quizzes suppress ambient decorations. Readability checks include composited glass over the richest theme backgrounds, not only opaque token colours.
- Home: spotlight moved directly after the adaptive welcome, smaller returning welcome, asymmetric primary actions, compact momentum and unavailable Race/Revision/Community states. Disabled goals become a small optional entry; enabled goals retain their existing real-count controls. Continue Learning remains independent of the carousel. Course selections, genuine/demo disclosures and curriculum access policy remain intact. No other tab functionality was developed.
- Hybrid spotlight: seven-second automatic advancement, previous/next, keyboard arrows, native swipe/scroll, pagination and Pause/Play. Hover, pointer interaction, keyboard focus, hidden tab, inactive Home and reduced motion block auto-advance. Deliberate Pause survives route/content/motion changes for the current page lifetime; reload starts a fresh page. Manual interaction gets a seven-second grace period. Auto movement never navigates or fabricates recommendations. Automatic updates do not trigger live-region announcements.
- Profile organization: clear profile/academic summary and editor, Profile Picture section and collapsed featured-course detail, existing Preferences and Account & Security destinations preserved.
- Local photo processing: JPEG/PNG/WebP up to 5 MB, decoded image limits (64–8192 pixels), zoom and horizontal/vertical square crop controls, 320px JPEG output via Blob, and consistent authenticated header/profile-menu/profile avatars. Replace/remove restore initials correctly. Account ownership is checked before accepting late results; object URLs are revoked on replacement/removal/unmount. The local preview is explicitly temporary and disappears on reload/sign-out.

### Incomplete infrastructure-dependent functionality

Persistent photo upload, upload progress/retries and cross-device photo loading are NOT implemented. Existing isolated mode disables Firebase Storage and has no Storage emulator or tested storage rules. The explicitly permitted device-processing fallback was used. docs/PROFILE_PHOTO_STORAGE_PLAN.md contains owner-only object-path requirements, proposed non-deployed rules and emulator/server-validation test requirements. No new production service, bucket, configuration, rules, billing or requests were used. The proposed rules have not been tested and must not be described as operational security.

Live Speed Race, Weekly Revision and Community still depend on their separately approved future systems. Phase 2's first reviewed academic pilot is CELL STRUCTURE (HB1 First Semester); no content integration/extraction/questions/uploads began here.

### Verification and remaining limits

- 71 automated tests passed, zero failures/skips: appearance draft/Apply/Cancel/isolation, actual iframe preview not writing storage, all six palette/mode token and composite-glass contrast, controlled autoplay/loop/pause/hover/focus/pointer/hidden/reduced behavior, compact goal-off state, photo limits/crop/late-account guard and existing academic/account/quiz/navigation regressions.
- One actual isolated Auth/Firestore integration scenario passed private persistence, switching and cross-account access denials. Expected PERMISSION_DENIED logs come from negative tests. No Storage upload integration test exists because uploads remain unavailable.
- Lint passed with exactly eight pre-existing legacy warnings; production build passed with the existing large-bundle warning; git diff --check passed. No package/dependency or Firebase configuration/rules changes were made in this refinement milestone; prior uncommitted changes remain preserved.
- Actual browser: all six preview palettes, light/dark preview, independent settings, Cancel/Close/Escape restoration, Apply followed by acknowledged sync/reload, private Kojo settings versus Ama settings, no cross-account avatar, invalid-image decode feedback, photo selection/crop/local application/replacement/removal, profile saving, quiz answer selection/safe exit cancellation and 3/3 completion, genuine completion count, Continue Learning fallback and browser back/forward. Phone 390px body width equals scroll width; desktop 1440px and phone layouts captured and visually inspected. Computed card fill confirmed translucent alpha .76 with blur(12px).
- Physical touchscreen swipe, real OS setting toggles, comprehensive screen-reader/cross-browser audit, low-end-device performance and persistent/cloud upload behavior remain unverified. Autoplay pauses are covered by deterministic automated tests; browser confirmed the available pause control and manual movement. Session-only photo processing has no upload progress because it does not upload. Longer-term offline durability remains unchanged and incomplete.

### Major files and review

src/appearance-studio.jsx and appearance-draft.js implement preview transactions; src/profile-photo.jsx and profile-photo.js implement bounded local image processing; src/DominanceApp.jsx integrates authenticated account controls. public/dashboard/refinement.css (imported by src/refinement.css) supplies shared depth and compact responsive styling. public/dashboard/home-ui.js and index.html integrate controlled autoplay and Home hierarchy. Tests in refinement.test.js, home-ui.test.js and dashboard-progress.test.cjs extend the existing suite. No unrelated files were reset or discarded.

Review in the existing repository: run npm run emulators and npm run dev:emulator in separate terminals, then open http://127.0.0.1:5174/#home. Use fictional local accounts. Verification commands remain npm test, npm run test:emulators, npm run lint and npm run build. Nothing committed, pushed, merged, deployed or published. Next: product-owner manual review of Home, Theme Studio and the clearly labelled local photo experience; stop until approval for further work.


### Avatar-first profile interaction adjustment — 2026-10-14

Approved after product-owner review. Photo selection/cropping now starts by tapping the avatar or Change photo at the top of My Profile, beside the student's name and academic period. Replace/Remove controls remain there; no photo section follows Save profile. Crop cancellation restores avatar focus. Header avatar continues opening the account menu. Save profile remains after the name/academic editor and explicitly describes its persistent scope; Use local preview is separate and temporary. Future persistent storage should support a confirmed photo draft and one coherent Save profile action, with cancellation before saving; that infrastructure is not implemented here.

Verification: 71 automated checks passed, lint/build passed with the existing eight lint and bundle-size warnings. Actual browser verified avatar selection, crop cancellation/focus return and profile saving. Firebase configuration, rules, identity and persistence paths unchanged. Physical touch and comprehensive accessibility audits remain manual. Preserve all earlier uncommitted work; no commits/deployment or next milestone.


### Preset avatar / photo / initials picker — 2026-10-14

Approved and implemented locally. My Profile picture opens a picker containing six bundled SVG portrait avatars, Upload photo (explicitly a temporary local preview) and Use initials. Preset selection is a draft until Use avatar; Cancel does not change the saved picture. Use avatar and Use initials save a small allowlisted ID via the existing authenticated account adapter at users/{uid}.dashboardState.avatar. No remote image URL or image data is stored. Invalid identifiers fall back to initials. Existing documents require no migration. Header/menu/profile use one shared AvatarVisual component. Photo preview overlays the saved avatar; removing it restores the saved avatar/initials. Save profile still saves name and academic details separately; eventual persistent photo/profile draft integration remains future work.

Verification: 73 automated tests passed, one actual isolated Auth/Firestore scenario passed including avatar restoration after sign-in and denied foreign-account writes. Lint/build passed with the existing eight lint warnings and bundle-size warning. Browser verified Cancel, save/reload, photo overlay/removal, initials, a 390px picker without horizontal overflow, and Kojo-to-Ama-to-Kojo isolation/restoration. Physical touch and comprehensive accessibility audit remain unverified. Persistent photo upload remains unavailable. No production Firebase configuration/rules changes, commitments or deployment. Stop for manual review.


### Three-choice focused picture flow — 2026-10-14

Approved after review of the combined picker. Change picture now first shows only Personal photo, Avatar and Initials. Each choice opens a dedicated focused subpanel within My Profile; the academic form and featured-course details are hidden while choosing. Avatar opens the gallery and confirmation; Initials opens its preview and confirmation; Personal photo opens selection/cropping with the existing local-only limitation. Back returns to the chooser and discards unconfirmed photo/preset drafts; Cancel/Escape returns to My Profile without saving and restores avatar focus. Escape keeps the outer account panel open. The header menu and saving semantics remain unchanged.

Verified: all 73 automated checks, lint and production build pass with existing warnings. Actual local browser checked each destination, hidden academic form, Back, crop discard, Cancel/focus restoration, Escape keeping the account panel open, and a 390px chooser without horizontal overflow. Persistent avatar/initials security paths are unchanged; the earlier emulator integration result remains valid but was not rerun for this presentation-only adjustment. No production Firebase changes, commits, pushes, merges or deployment. Manual review remains next; no further stage started.


### Home ambient motion, carousel controls and welcome polish — 2026-10-14

Approved and implemented locally. Returning welcome now reads YOUR STUDY SPACE with Your courses. Your pace. beneath the greeting; the contextual hint is Pick up where you left off. Ambient decorations now have clearer softly outlined organic shapes, theme tint/glow and slow drift. Calm hides them; Reduced/OS reduced motion disables movement; focused quizzes still suppress decoration. Pointer events remain none and effects stay behind content.

Spotlight controls now form one compact glass rail below the cards with SVG chevrons, tappable page indicators (44px hit targets) and an icon pause/play button with accessible labels/tooltips. The counter is visually hidden but retains manual-change announcements. Mobile retains native swipe/scroll and accessible fallback buttons; desktop has the same coherent controls. No automatic navigation or restart after deliberate Pause was added. All earlier autoplay guards remain intact.

Verification: 73 automated tests, lint and build pass with the existing eight lint warnings and bundle warning. Actual browser checked page indicators, previous/next, desktop pause/play, current ambient animation and pointer-events:none, and 390px layout without horizontal overflow. Desktop and phone screenshots inspected. Physical swipe/device and full accessibility audit remain manual. Existing Firebase identity/storage/account/profile/navigation paths unchanged; production files and rules untouched. No commit, push, merge or deployment. Await manual review.


### Account menu outside-tap dismissal — 2026-10-14

Implemented locally at user request. The initial avatar/account menu closes on a pointer interaction starting and ending outside its dialog bounds, with focus restored to the avatar trigger. Inside interactions remain open. Profile/Preferences/Security editing panels retain explicit Close/Escape behavior so accidental backdrop taps do not discard drafts. The pointer-start guard avoids dismissing from a drag that begins inside the menu.

Browser verified outside dismissal, inside tap preservation, protected profile panel, focus restoration and 390px phone-width behavior. Lint/build pass with existing warnings; Firebase/configuration/persistence unchanged. No commits or deployment. Physical touch remains a manual check.

### Shared scrollbar polish — 2026-10-14
User clarified that arrow bars meant vertical scrollbars. Shared parent/iframe CSS now uses thin theme-coloured rounded thumbs, transparent tracks and no WebKit arrow buttons; forced-colours retains native colours. Browser verified computed thin styling and keyboard scrolling in the profile dialog. Lint/build and diff check pass with existing warnings. No functionality, Firebase configuration/rules, commits or deployment changed. Browser/OS native scrollbar rendering can vary.


### Shared medical-study browsing wallpaper — 2026-10-14

Approved and implemented in the application, superseding the preview-only/Home-only wallpaper direction. Original SVG study doodles now form a shared noninteractive background for Home, My Courses, Practice browsing, Community and My Progress. Theme palette tokens tint the pattern; Balanced/Vibrant and light/dark determine restrained opacity. A fade softens the heading region. Calm and forced-colours modes hide it. Native theme-aware glass, navigation and account panels remain consistent; forms avoid extra wallpaper clutter. Theme Studio's miniature workspace also previews the pattern without saving draft choices.

Focused demo quizzes suppress the pattern; study/reading contexts and LAMLA also stay quiet, with a focused-study class reserved for future readers/assessments. This is appearance integration only: no unfinished study tools, curriculum content or other-tab features were built. Existing account-owned preferences, navigation and quiz exit protection are preserved. The header wordmark is unchanged; no caduceus was introduced.

Files: public/dashboard/medical-study-pattern.svg, shared refinement.css, index.html and these development documents. Verification: 73 automated tests passed, lint passed with eight existing warnings and build with the existing large-bundle warning. Actual emulator-mode browser checked all five tabs, palette inheritance, pointer-events:none, quiz suppression and protected exit, Calm in both workspace/Studio, Vibrant live preview and Cancel restoration, plus 1440px desktop and 390px phone layouts without horizontal overflow. Physical-device/performance and comprehensive accessibility audits remain unverified. No Firebase/account persistence code changed, so the emulator integration scenario was not rerun for this styling-only update. No production Firebase configuration/rules changes, commits, pushes, merges or deployment.

Review the actual app at http://127.0.0.1:5174/#home, including the other browsing tabs and Preferences. The separate 5189 concept remains a design exploration, not the application. Await manual review; no next milestone started.

### Phase 2 — Cell Structure pilot (2026-10-14)

Phase 1 is accepted and committed as 89d982a on pj/student-experience-foundation. The approved integration stays in DOMiNANCE-gls/DOMiNANCE with Firebase; the kit's Supabase/other-repository directions are superseded by the user's explicit instruction. Feature branch: codex/hb1-cell-structure-content. Draft PR only; no merge or deploy.

Implemented locally: versioned 46-lesson/170-question source package; deterministic validated compiler; safe lesson rendering and search; lesson/course practice with explanations and correct shuffle mapping; changeable selections before checking; private saved drafts/read markers/completed results; existing account-bound transaction persistence; My Progress pilot panel and Home validated lesson resume. Generic demonstrations remain intact. No diagrams, original slides, QA CSVs, generated academic material, automatic course-assignment rewrite, full flashcards, LAMLA engine or Community work added.

No production configuration/rules changes or schema migration. Academic approval by the user and Ofobi remains required. Static content assets are not confidential/secure assessment delivery. Private learning records remain owner-protected; results are not authoritative grading or mastery. Pilot capacity and offline/concurrent-draft limitations are documented in docs/CELL_STRUCTURE_INTEGRATION.md. Final verification results will be recorded with the feature commit/PR.

Clarified next onboarding correction: choose year and applicable semester only; curriculum courses appear automatically. My Courses already lists eligible courses independently of favourites, but the optional Home-favourites onboarding step and related empty-state wording still need removal/reconciliation. Preserve existing course access and student data when making that follow-up change.

Final local verification: 83 automated tests passed; isolated real Firebase Auth/Firestore scenario passed with expected cross-account denials; lint passed with eight existing legacy React warnings; build passed with the existing bundle warning. Desktop/390px interface checks covered catalogue/search/reader, selection/explanation/completion, reload/resume, exit cancellation/confirmation, saved results, Home resume and two-account isolation. Source schema and compact shared validation keep academic text out of the account bundle. Review captures and precise limitations are in docs/CELL_STRUCTURE_INTEGRATION.md. Await draft-PR academic review; no merge or deployment.

### Phase 2 learning-experience refinement — 2026-10-15

Approved within Draft PR #1: seven-block continuous reading replaces the 46-item entry list while preserving every source section/question. Microscopy chapters cover optical foundations, imaging methods and specimen preparation. Sticky contents/overview, validated approximate section-relative resume, explicit section read markers and optional next-block transitions are implemented. Read markers and position estimates are separate from scores/mastery.

The 51 existing embedded checks now reveal/hide supplied answers on demand without grading or blocking reading. All currently have identifiable answers; no missing explanation was invented. Blocks with no embedded checks remain without them. Source OR01 duplicate uricase notes and unapproved diagrams remain academic-review items; editorial cover/figure-placement metadata is excluded from student output only.

Practice This Block reuses the existing engine, with five/ten/all mapped questions, sampling without duplicates, existing-draft protection, explanations and saved block-labelled results. Lesson-level and course-level practice remain. Original 46 lesson files and 170-question JSON are unchanged. No Firebase configuration/rules changes or ambiguous-data migration.

Active iframe assistant/chat/launch functions are removed; old assistant destinations return Home. One noninteractive AI Study Assistant — Coming Soon item appears on Home. Five primary tabs and Phase 1 Home/Profile remain. Dormant unreachable React code is not a live assistant. Favourites-picker removal remains a separate onboarding correction.

Verification and screenshots: docs/CELL_STRUCTURE_INTEGRATION.md. Draft academic-review candidate only; no merge, private-testing deployment or production deployment performed.

Refinement verification: 93 tests passed, isolated real Auth/Firestore integration passed with reading-position persistence/relogin and expected cross-account denials, lint/build passed with existing warnings. Actual desktop/mobile-width UI checks covered seven-block navigation, continuous text, reveal/hide checks, reload/section resume, five-question block practice, interruption/resume/completion, separate accounts and preserved original full-course draft. Full notes and screenshots are in docs/CELL_STRUCTURE_INTEGRATION.md. Source 46/170 unchanged. Physical-device, screen-reader and final academic/diagram reviews remain outstanding. Await review in Draft PR #1; no deployment or merge.
