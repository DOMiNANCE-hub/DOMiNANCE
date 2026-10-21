# DOMiNANCE Frontend Architecture & Handover Guide (for Claude & Codex)

This document provides the complete technical architecture, three-course integration specification (**Cell Structure**, **Computer Appreciation**, and **Biological Chemistry**), stylesheet and token contract, reusable Study Area and Practice engine guide, and verification checklist for the DOMiNANCE frontend. All essential frontend work is committed directly to GitHub so **Claude** (and Codex) can maintain and extend the application with zero reliance on local Antigravity files.

---

## 1. System Architecture & Runtime Boundary

DOMiNANCE uses a two-layer authenticated frontend architecture:

1. **React Account & Session Shell (`src/`)**
   - **Entry flow**: `src/main.jsx` → `src/App.jsx` → `src/DominanceApp.jsx`.
   - **Authentication & Profile Isolation (`src/account-session.js`)**: Coordinates Firebase Authentication and Firestore `users/{uid}` profile loading, clears stale state immediately on account switch or sign-out, and ignores late callbacks from previous accounts.
   - **Authenticated Storage Adapter (`src/dashboard-session.js`)**: Provides `createDashboardStorage` for private per-account `users/{uid}.dashboardState` persistence (`cellStructure`, `computerAppreciation`, `biologicalChemistry`, `preferences`, `lastPlace`, `dailyGoal`, `avatar`). Tracks memory-only pending sync keys, exposes `getConfirmedItem(key)` for durable progress reporting, and merges concurrent history (`mergeCellHistory`, `mergeComputerHistory`, `mergeBiologicalHistory`) idempotently without resurrecting completed drafts.
   - **Parent Account Controls**:
     - `AuthGate` (`src/DominanceApp.jsx`, `src/auth.css`): Sign-in, account creation, and password recovery with accessible focus states and action buttons.
     - `OnboardingModal`: Collects student name, academic level (`HB1`–`HB3`), and semester (`First`/`Second` for `HB1`; `Annual` for `HB2`/`HB3`).
     - `AccountBar` & `AccountDialog` (`src/account.css`): Top bar with the typographic `DOMiNANCE` wordmark, sync status indicator, avatar trigger, and modal dialog separating **My Profile** (unified profile + optional HB1 Community directory visibility), **Preferences** (`src/account-preferences-panel.jsx` — Theme Studio visual draft preview with explicit Save/Cancel), **Profile Picture** (`src/profile-photo-panel.jsx` — bundled preset portraits, initials, and session-only local crop preview), and **Account & Security**.

2. **Embedded Student Learning Workspace (`public/dashboard/index.html`)**
   - Rendered inside `PrototypeDashboard`'s `<iframe>` with no URL identity or role parameters. Direct standalone navigation (`window.parent === window`) renders an explicit sign-in prompt and refuses to initialize unauthenticated state.
   - Initialized via `window.initializeDashboard(session)` and updated via `window.replaceDashboardSession(session)` and `window.updateAcademicProfile(profile)`.
   - **Primary Browsing Navigation (5 Tabs)**:
     1. **Home** (`#home.home-compact`, `public/dashboard/home-ui.js`, `public/dashboard/home-model.js`): Continue Learning hero card (with exact saved lesson/section metadata from `cellPilot.resumeInfo`), Quick Practice launcher, confirmed Weekly Practice Momentum stats (aggregating validated sessions across Cell Structure, Computer Appreciation, and Biological Chemistry), Daily Study Goal card/modal, Future Study Toolkit (`Speed Race`, `LAMLA`, `My Weak Spots`, `The Arena` — honest `Coming Soon` dialogs), and auto-advancing Spotlight carousel (7s interval with Pause/Play, hover/focus/hidden-tab/reduced-motion guards, and 7s post-interaction grace period).
     2. **My Courses** (`#courses`, `#topic`, `#study`): Academic scope switcher (`public/dashboard/curriculum.js`), course catalog cards, course destinations (`Study Blocks`, `Summaries`, `LAMLA`), block/unit overview, numbered lesson lists with chapter groupings and read badges, and the focused Section Reader (`#cellSection`).
     3. **Practice** (`#practice`, `#quizArea`): Practice destinations (`Topic Questions`, `Past Questions`, `Flashcards`, `Mock Exams`), multi-course/block/lesson question setup (`#cellPractice`), untimed MCQ runner with review-before-submit, and expandable explanation results with source citations and direct concept/lesson links.
     4. **Community** (`#community`, `src/community-directory.js`): Emulator-guarded HB1 opt-in classmate directory and unified profile card preview.
     5. **My Progress** (`#progress`): Confirmed practice statistics, per-course review progress panels (`#cellProgress`, `#computerProgress`, `#biologicalProgress`), and session history.

---

## 2. Three-Course Integration Architecture (`HB1 · First Semester`)

The student learning workspace integrates three HB1 First Semester courses through a unified multi-course coordinator (`public/dashboard/academic-courses.js`) and contract layer (`public/dashboard/academic-contract.js`) built around the shared Study Area and Practice engine (`public/dashboard/cell-structure.js`):

| Course | State Key | Progress Panel ID | Student Build Asset (`npm run build`) | Emulator Review Asset (`npm run dev:emulator`) |
| :--- | :--- | :--- | :--- | :--- |
| **Cell Structure** (`BIOL 151`) | `cellStructure` | `#cellProgress` | `46` lessons · `170` MCQs (`public/dashboard/cell-content.js`) | `46` lessons (with 23 instructional expansions) · `178` MCQs (`scripts/academic/cell-review-plugin.mjs`) |
| **Computer Appreciation** (`CSM 177`) | `computerAppreciation` | `#computerProgress` | Release-blocked (`0` lessons / `0` MCQs in `public/dashboard/computer-content.js`; index metadata in `computer-index.js`) | `18` lessons (`4` blocks) · `114` MCQs (`scripts/academic/computer-review-plugin.mjs`) |
| **Biological Chemistry** (`BIOL 157`) | `biologicalChemistry` | `#biologicalProgress` | Release-blocked (`0` lessons / `0` MCQs in `public/dashboard/biological-content.js`; catalog/index in `biological-catalog.js`, `biological-index.js`) | `10` official units (`6` authored units = `59` lessons, `4` unauthored units) · `222` MCQs (`scripts/academic/biological-review-plugin.mjs`) |

### 2.1 Academic Release Safeguards (Critical Constraint)

- **Do not bypass academic release gates**: `Computer Appreciation` and `Biological Chemistry` (and the 8 new `CELL-RQ001`–`CELL-RQ008` review questions in `Cell Structure`) are served **only** when Vite runs in `emulator` serve mode (`vite --mode emulator`, i.e., `npm run dev:emulator`) via their respective Vite middleware plugins (`scripts/academic/*-review-plugin.mjs`).
- In normal `npm run dev` and `npm run build`, `public/dashboard/computer-content.js` and `public/dashboard/biological-content.js` contain empty `lessons: []` and `questions: []` arrays (`status: 'academic-release-blocked'`), while `computer-index.js` and `biological-index.js` allow `historyOnly` preservation so any previously synced student progress remains readable without exposing unapproved academic text.

### 2.2 Multi-Course Coordinator (`public/dashboard/academic-courses.js`)

- `DominanceAcademicCourses.create(ctx)` instantiates one `DominanceCellStructure` engine per registered course (`Cell Structure`, `Computer Appreciation`, `Biological Chemistry`).
- Routes `course()` and `lesson(id)` calls to the engine matching `ctx.context().course`, and routes `practice()` / `openTopics()` / `landing()` calls to the currently active or selected practice course.
- `historyEntries()` supplies confirmed `biologicalChemistry` state and index metadata to `DominanceHome.records(...)` so Home momentum and daily goals include confirmed Biological Chemistry practice alongside Cell Structure and Computer Appreciation.

### 2.3 Concept & Reference Contract (`public/dashboard/academic-contract.js`)

- `DominanceAcademicContract.sectionRoute(concept, data, learning)`: Resolves a Biological Chemistry concept object to its exact `core` teaching section (`lesson:<lessonId>:<partIndex>`).
- `DominanceAcademicContract.questionRoute(question, data, learning)`:
  - When `data.concepts` is present (**Biological Chemistry**), resolves `question.conceptId` to its exact core section (`lesson:BC0101:1`).
  - When `data.concepts` is absent (**Cell Structure** and **Computer Appreciation**), resolves `question.lesson` to the lesson's opening section (`lesson:<lessonId>:0`).
  - Powers the per-question **`Study this concept`** button inside every expanded `<details>` explanation across all three courses.
- `DominanceAcademicContract.questionReferences(question, data)`:
  - Formats structured `sourceRefs` (**Biological Chemistry**) with source file name and PDF page ranges (`BIOL 157_Lecture 1.pdf · PDF p. 3`).
  - Formats `question.pages` for **Cell Structure** (`BIOL 151 lecturer PDF p. 81, p. 91` for integer page arrays `[81, 91]`) and **Computer Appreciation** (`CSM 177 lecturer PDF p. 21–28` for range tuples `[[21, 28]]`).

---

## 3. Reusable Study Area & Practice Engine (`cell-learning.js`, `cell-state.js`, `cell-structure.js`)

The Study Area is a **complete, self-contained learning resource** where students can study comprehensive syllabus notes, tables, worked examples, and inline self-checks independently of quizzes, and move seamlessly between lessons, practice questions, and concept explanations.

### 3.1 Module Responsibilities

- **`public/dashboard/cell-learning.js` (`DominanceCellLearning`)**:
  - Defines syllabus `blocks` (and optional `block.chapters` such as Microscopy's `Optical foundations`, `Imaging methods`, and `Specimen preparation`) and exposes `DominanceCellLearning.create(blocks)` for other courses (`computer-learning.js`, `biological-learning.js`).
  - Normalizes Windows CRLF (`\r\n` → `\n`) in both `parts(markdown)` and `parseSections(lesson)` so checkouts on Windows with `core.autocrlf=true` never fail section validation.
  - `sections(lesson)`: Partitions a lesson's Markdown (or pre-structured `lesson.sections` in Biological Chemistry) into natural-length sections cached in a `WeakMap` (immutable academic text only; never caches user state). Classifies each section into `explanation`, `clarification` (`Understanding Note`), `essentials` (`Slide Essentials`), or `connections` (`Concept Connections`).
  - `parts(markdown)`: Separates prose/tables from inline `Optional Concept Check` / `Quick checks` items (`{kind: 'check', question, answer}`) so answers remain hidden behind an accessible `Reveal Answer` toggle until requested.
  - `route(id, data)` & `resumePart(saved, lesson)`: Validates `block:<id>` and `lesson:<id>:<part>` routes and clamps obsolete saved section indices safely.

- **`public/dashboard/cell-state.js` (`DominanceCellState`)**:
  - Validates private account-owned course state (`version: 1`, `lessons` read timestamps, `attempts` up to 100, `draft` format 2 with `responses` map and `phase: 'answer' | 'review'`, and per-block `reading` position `{section, part, offset, updatedAt}`).
  - Exposes `DominanceCellState.create(learning)` so each course (`computer-state.js`, `biological-state.js`) strictly validates its own block and lesson IDs and rejects foreign course IDs.

- **`public/dashboard/cell-structure.js` (`DominanceCellStructure`)**:
  - **Safe Markdown Renderer (`markdown`, `inline`)**:
    - Normalizes `\r\n` to `\n` and escapes all HTML entities first (`&`, `<`, `>`, `"`, `'`) so raw HTML, `<script>`, `<img>`, and links never execute.
    - Renders Markdown tables inside `.cell-table` (`<div class="cell-table"><table>...</table></div>`) with `white-space: nowrap` column headers and horizontal scroll containment (`overflow-x: auto; overscroll-behavior-x: contain`).
    - Renders inline backticked expressions (`` `=B2*$F$1` ``) as `<code>=B2*$F$1</code>` monospace pills.
    - Protects multiplication asterisks (`*`) in un-backticked arithmetic and spreadsheet formulas (`=10/5*2 gives 4, whereas =10/(5*2) gives 1`, `Price * Quantity with A1*B1`) so they are never consumed as `<em>` emphasis delimiters, while preserving standard Markdown italics (`*retention factor*`) and bold (`**bold**`).
  - **Study Area & Practice Enhancements (`enhanceCreate`)**:
    - **Unauthored Unit Cards**: Marks `.cell-block-card` units that have `0` authored lessons (such as Biological Chemistry Units 3–10) with `data-empty="true"`, styling them with a subtle dashed border so students can distinguish authored units from upcoming syllabus units at a glance.
    - **Chapter Grouping & Read Badges**: In `block:<id>` lesson lists, inserts `<h3 class="cell-chapter-heading">` headings when `block.chapters` is defined, and marks read lessons with `data-read="true"` and `.topicrow-read` (`Read · →`) without mutating button `textContent` (`Lesson N — Title`). Also sets `data-read="true"` on the active `Lesson marked as read` button in the Section Reader.
    - **Question Count Metadata**: Annotates `Practise this lesson` / `Practise this concept` with `data-questions="<count>"`.
    - **Multi-Course `#cellPractice` Cache Guard**: Tracks `parent.dataset.course = courseName` on `#cellPractice` so switching between courses in `My Courses` and `Practice` always invalidates stale DOM from a previously viewed course.
    - **Empty History Feedback**: Adds a clear empty-state note (`No completed practice attempts yet for this course.`) inside `Previous results` when `attempts.length === 0`.
    - **Seamless Lesson ↔ Question ↔ Explanation Navigation**:
      - In `Practice results` (`#quizArea`), appends the lesson label (`· Lesson N — Title`) to each question's `<summary>` so students immediately see which lesson a question and its explanation belong to.
      - Inside each expanded `<details>` item, renders the source PDF page citation (when present) and a **`Study this concept`** button (when `DominanceAcademicContract` is loaded) that exits focused quiz mode and opens the exact concept section or lesson.
      - Enhances the bottom **`Return to study`** button (`data-target-topic`) to navigate directly to `lesson:<lessonId>:0` (single-lesson session), `block:<blockId>` (single-block session), or `@blocks` (multi-block session).
      - When a session covers 2–6 lessons, appends `.cell-related-lessons` action buttons (`Study Lesson N — Title`) so students can jump directly from the results screen into any practiced lesson.

### 3.2 Critical Test Invariants to Preserve

When modifying or extending the Study Area and Practice UI, preserve these behavioral contracts verified by `tests/cell-structure.test.js`, `tests/biological-chemistry.test.js`, `tests/computer-appreciation.test.js`, `tests/interaction-ui.test.js`, and `tests/release-integration.test.js`:

1. **`#cellSection` first child**: `document.getElementById('cellSection').children[0]` must remain the `<h2>` section title element.
2. **Question `<details>` children count in `#quizArea`**:
   - In standalone `tests/cell-structure.test.js` (where `DominanceAcademicContract` is not loaded and base Cell Structure questions have no `pages`), each `<details>` element in `resultView` must have `1` child (`<summary>`) before expansion and `5` children (`<summary>`, `<h3>` question, `<p>` your answer, `<p>` correct answer, `<p>` explanation) after expansion (`details.open = true; details.ontoggle()`).
   - When `DominanceAcademicContract` is loaded (in `public/dashboard/index.html`, `tests/biological-chemistry.test.js`, and `tests/release-integration.test.js`), expanded `<details>` also append the optional `Source: ...` `<p>` and the `Study this concept` `<button>`.
3. **Lesson button labels**: Lesson buttons inside `.lesson-list` must keep `textContent` starting with `'Lesson '` (`Lesson N — Title`); use `dataset` attributes (`data-read="true"`, `data-lesson`, `data-chapter`) and CSS pseudo-elements (`::after`) for visual badges.
4. **Practice landing buttons**: `#cellPractice` on the landing view must render the 4 destination buttons (`Open Topic Questions`, `Open Past Questions`, `Open Flashcards`, `Open Mock Exams`).

---

## 4. Stylesheet Cascade & Semantic Token Contract

### 4.1 Dashboard Stylesheet Load Order (`public/dashboard/index.html`)

The embedded dashboard loads seven stylesheets in `<head>` before `<body>` renders (the relative order of the first six is enforced by `tests/interaction-ui.test.js`):

1. `/dashboard/polish.css` — Base layout grid, typography defaults, and legacy card structure.
2. `/dashboard/appearance.css` — Palette and mode custom properties (`--app-bg`, `--app-surface`, `--app-ink`, `--app-muted`, `--app-accent`, `--app-secondary`, `--app-line`, `--app-focus`, `--app-nav`, `--panel-*`) across 6 palettes (`signature`, `atlantic`, `emerald`, `amber`, `rose`, `slate`), Light/Dark modes (`html[data-mode="light"|"dark"]`), visual intensity (`bold`, `balanced`, `calm`), and medical-study SVG wallpaper.
3. `/dashboard/refinement.css` — Home, spotlight, daily goal, and community base styles.
4. `/dashboard/cell-structure.css` — Study Blocks, Section Reader (`#cellSection`), Concept Checks, and focused reading/quiz layout modes (`html.section-reader`, `html.focused-quiz`).
5. `/dashboard/workspace-choice.css` — Progressive choice picker button (`.workspace-choice`) and modal dialog (`.workspace-choice-dialog`).
6. `/dashboard/workspace-ui.css` — **Master UI rhythm and interaction contract** shared between the React shell and the embedded dashboard (including consistent styling for `#cellProgress, #computerProgress, #biologicalProgress`, `.cell-block-card[data-empty=true]`, `.cell-actions button[data-read=true]`, responsive tables, inline `<code>` pills, and mobile safe-area layout).
7. `/dashboard/community.css` — HB1 Community directory cards and privacy controls.

### 4.2 Key CSS & Layout Invariants

- **Never inject duplicate stylesheets dynamically** (`workspacePolish`, `appearanceSheet`, `refinementSheet` must remain absent).
- **Hidden attribute enforcement**: `.account-dialog [hidden], .account-dialog input[hidden] { display: none !important }` must be preserved so author `display` rules on form inputs never override the HTML `hidden` attribute (e.g., hidden `<input type="file" hidden>` in the Profile Picture Picker).
- **Programmatic focus vs keyboard focus**: Headings focused programmatically on view/step transitions (`h1[tabindex="-1"]`, `h2[tabindex="-1"]`, `h3[tabindex="-1"]`) suppress focus outlines while interactive controls (`button`, `select`, `input`, `summary`, `.course[role="button"]`) display a high-contrast `outline: 3px solid var(--app-focus)` on `:focus-visible`.
- **Responsive breakpoints**:
  - `<= 1080px`: Background attachment switches to `scroll`; 3-column destination grids collapse to 2 columns.
  - `<= 680px`: Single-column course/destination/community grids; bottom navigation bar (`height: calc(68px + env(safe-area-inset-bottom, 0px))`); safe-area content padding; dark-mode active bottom-nav uses only the bottom gold indicator (`box-shadow: none !important`).
  - `<= 400px` (verified down to `360px`): Compact padding (`18px 14px`), stacked Quick Practice action button, and 3-column segmented account dialog tabs (`11px`).
- **Reduced Motion**: Both `[data-motion="reduced"]` and `@media (prefers-reduced-motion: reduce)` disable view entrance animations, spinner rotation, spotlight auto-advance, and button transitions.

---

## 5. Verification Commands & Handover Checklist for Claude

Run the following commands before committing or updating any PR:

```bash
# 1. Unit & behavioral test suite (209 tests across all 3 courses, UI, auth, and state)
npm test

# 2. Static analysis (oxlint)
npm run lint

# 3. Production Vite build (runs prebuild -> content:cell, content:computer, content:biol157)
npm run build

# 4. Local Emulator Review Server (enables full review banks for all 3 courses on 127.0.0.1:5174)
npm run dev:emulator

# 5. Firebase Emulator integration tests (when touching rules, auth, or Firestore adapters)
npm run test:emulators
```

> **Windows Git Note**: Keep `git config core.autocrlf false` in Windows worktrees so source files in `content/cell-structure/lessons/*.md` retain exact LF SHA-256 hashes verified by `tests/cell-instruction.test.js`. Both `public/dashboard/cell-learning.js` and `public/dashboard/cell-structure.js` also normalize `\r\n` at runtime for cross-platform resilience.

### Remaining Non-Frontend Release Gates (Outside Frontend Scope)

1. **Academic Sign-Off**:
   - **Cell Structure**: Formal lecturer/academic sign-off on the 23 instructional expansions and 8 review questions (`CELL-RQ001`–`CELL-RQ008`), tracked in `docs/EDUCATIONAL_REVIEW.md` and `docs/cell-structure-instruction-report.md`.
   - **Computer Appreciation**: Academic approval to promote the 18 lessons and 114 questions from emulator-only review (`reviewOnly: true`) to student release (`docs/computer-appreciation-instruction-report.md`).
   - **Biological Chemistry**: Authoring of the remaining 4 syllabus units (`U07`–`U10`) and academic review of Units 1–6 (`59` lessons, `222` MCQs), tracked in `docs/biol157/coverage.json` and `docs/biol157/integration-report.md`.
2. **Production Firebase Deployment**:
   - Production rules (`firestore.rules`) and hosting deployment remain intentionally untouched until academic approval and release review are complete.
