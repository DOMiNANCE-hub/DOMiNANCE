# DOMiNANCE Frontend Architecture & Developer Handover

This document provides the complete technical architecture, stylesheet and token contract, reusable Study Area and Practice engine specification, and maintenance checklist for the DOMiNANCE student workspace so subsequent development (by Codex and the engineering team) can extend HB1–HB3 courses and maintain UI quality without regressions.

---

## 1. System Architecture & Runtime Boundary

DOMiNANCE uses a two-layer authenticated frontend architecture:

1. **React Account & Session Shell (`src/`)**
   - **Entry flow**: `src/main.jsx` → `src/App.jsx` → `src/DominanceApp.jsx`.
   - **Authentication & Profile Isolation (`src/account-session.js`)**: Coordinates Firebase Authentication and Firestore `users/{uid}` profile loading, clears stale state immediately on account switch or sign-out, and ignores late callbacks from previous accounts.
   - **Authenticated Storage Adapter (`src/dashboard-session.js`)**: Provides `createDashboardStorage` for private per-account `users/{uid}.dashboardState` persistence (`cellStructure`, `computerAppreciation`, `preferences`, `lastPlace`, `dailyGoal`, `avatar`). Tracks memory-only pending sync keys, exposes `getConfirmedItem(key)` for durable progress reporting, and merges concurrent history (`mergeCellHistory`, `mergeComputerHistory`) without resurrecting completed drafts.
   - **Parent Account Controls**:
     - `AuthGate` (`src/DominanceApp.jsx`, `src/auth.css`): Sign-in, account creation, and password recovery.
     - `OnboardingModal`: Collects student name, academic level (`HB1`–`HB3`), and semester (`First`/`Second` for `HB1`; `Annual` for `HB2`/`HB3`).
     - `AccountBar` & `AccountDialog` (`src/account.css`): Top bar with DOMiNANCE wordmark, sync status banner, avatar trigger, and modal dialog separating **My Profile** (unified profile + optional HB1 Community directory visibility), **Preferences** (`src/account-preferences-panel.jsx` — Theme Studio draft preview, explicit Save/Cancel), **Profile Picture** (`src/profile-photo-panel.jsx` — preset portraits, initials, and session-only local crop preview), and **Account & Security**.

2. **Embedded Student Learning Workspace (`public/dashboard/index.html`)**
   - Rendered inside `PrototypeDashboard`'s `<iframe>` with no URL identity or role parameters.
   - Initialized via `window.initializeDashboard(session)` and updated via `window.replaceDashboardSession(session)` and `window.updateAcademicProfile(profile)`.
   - **Primary Browsing Navigation (5 Tabs)**:
     1. **Home** (`#home.home-compact`, `public/dashboard/home-ui.js`, `public/dashboard/home-model.js`): Continue Learning hero card, Quick Practice launcher, confirmed Weekly Practice Momentum stats, Daily Study Goal card/modal, Future Study Toolkit (`Speed Race`, `LAMLA`, `My Weak Spots`, `The Arena` — honest `Coming Soon` dialogs), and auto-advancing Spotlight carousel (7s interval with Pause/Play, hover/focus/hidden-tab/reduced-motion guards, and 7s post-interaction grace period).
     2. **My Courses** (`#courses`, `#topic`, `#study`): Academic scope switcher (`public/dashboard/curriculum.js`), course catalog cards, course destinations (`Study Blocks`, `Summaries`, `LAMLA`), block overview, numbered lesson lists, and the focused Section Reader (`#cellSection`).
     3. **Practice** (`#practice`, `#quizArea`): Practice destinations (`Topic Questions`, `Past Questions`, `Flashcards`, `Mock Exams`), course/block/lesson question setup, untimed MCQ runner with review-before-submit, and expandable explanation results.
     4. **Community** (`#community`, `src/community-directory.js`): Emulator-guarded HB1 opt-in classmate directory and unified profile card preview.
     5. **My Progress** (`#progress`): Confirmed practice statistics, course review progress panels (`#cellProgress`, `#computerProgress`), and session history.

---

## 2. Stylesheet Cascade & Semantic Token Contract

### 2.1 Dashboard Stylesheet Load Order (`public/dashboard/index.html`)

The embedded dashboard loads exactly six stylesheets in `<head>` before `<body>` renders (enforced by `tests/interaction-ui.test.js`):

1. `/dashboard/polish.css` — Base layout grid, typography defaults, and legacy card structure.
2. `/dashboard/appearance.css` — Palette and mode custom properties (`--app-bg`, `--app-surface`, `--app-ink`, `--app-muted`, `--app-accent`, `--app-secondary`, `--app-line`, `--app-focus`, `--app-nav`, `--panel-*`) across 6 palettes (`signature`, `atlantic`, `emerald`, `amber`, `rose`, `slate`), Light/Dark modes (`html[data-mode="light"|"dark"]`), visual intensity (`bold`, `balanced`, `calm`), and medical-study SVG wallpaper.
3. `/dashboard/refinement.css` — Home, spotlight, daily goal, and community base styles.
4. `/dashboard/cell-structure.css` — Study Blocks, Section Reader (`#cellSection`), Concept Checks, and focused reading/quiz layout modes (`html.section-reader`, `html.focused-quiz`).
5. `/dashboard/workspace-choice.css` — Progressive choice picker button (`.workspace-choice`) and modal dialog (`.workspace-choice-dialog`).
6. `/dashboard/workspace-ui.css` — **Master UI rhythm and interaction contract** shared between the React shell and the embedded dashboard.

### 2.2 React Shell Stylesheet Order (`src/DominanceApp.jsx`)

- `src/auth.css` — `AuthGate` sign-in, registration, and password recovery surfaces.
- `src/account.css` — `AccountBar`, `AccountDialog`, `OnboardingModal`, Theme Studio, and Profile Picture Picker.
- `public/dashboard/appearance.css`, `public/dashboard/workspace-choice.css`, `public/dashboard/workspace-ui.css` — Shared tokens and component rules.

### 2.3 Key CSS & Layout Invariants

- **Never inject duplicate stylesheets dynamically** (`workspacePolish`, `appearanceSheet`, `refinementSheet` must remain absent).
- **Hidden attribute enforcement**: `.account-dialog [hidden], .account-dialog input[hidden] { display: none !important }` must be preserved so author `display` rules on form inputs never override the HTML `hidden` attribute (e.g., hidden `<input type="file" hidden>` in the Profile Picture Picker).
- **Programmatic focus vs keyboard focus**: Headings focused programmatically on view/step transitions (`h1[tabindex="-1"]`, `h2[tabindex="-1"]`, `h3[tabindex="-1"]`) suppress focus outlines while interactive controls (`button`, `select`, `input`, `summary`, `.course[role="button"]`) display a high-contrast `outline: 3px solid var(--app-focus)` on `:focus-visible`.
- **Responsive breakpoints**:
  - `<= 1080px`: Background attachment switches to `scroll`; 3-column destination grids collapse to 2 columns.
  - `<= 680px`: Single-column course/destination/community grids; bottom navigation bar (`height: calc(68px + env(safe-area-inset-bottom, 0px))`); safe-area content padding; dark-mode active bottom-nav uses only the bottom gold indicator (`box-shadow: none !important`).
  - `<= 400px` (tested down to `360px`): Compact padding (`18px 14px`), stacked Quick Practice action button, and 3-column segmented account dialog tabs (`11px`).
- **Reduced Motion**: Both `[data-motion="reduced"]` and `@media (prefers-reduced-motion: reduce)` disable view entrance animations, spinner rotation, spotlight auto-advance, and button transitions.

---

## 3. Reusable Study Area & Practice Engine

The Study Area is designed as a **complete, self-contained learning resource** where students can study comprehensive syllabus notes, tables, worked examples, and inline self-checks independently of quizzes, and move seamlessly between lessons, practice questions, and concept explanations.

### 3.1 Module Responsibilities

- **`public/dashboard/cell-learning.js` (`DominanceCellLearning`)**:
  - Defines syllabus `blocks` (and optional `block.chapters` such as Microscopy's `Optical foundations`, `Imaging methods`, and `Specimen preparation`).
  - `sections(lesson)`: Partitions a lesson's Markdown into natural-length sections cached in a `WeakMap` (immutable academic text only; never caches user state). Classifies each section into `explanation`, `clarification` (`Understanding Note`), `essentials` (`Slide Essentials`), or `connections` (`Concept Connections`).
  - `parts(markdown)`: Separates prose/tables from inline `Optional Concept Check` / `Quick checks` items (`{kind: 'check', question, answer}`) so answers remain hidden behind a `Reveal Answer` toggle until requested.
  - `route(id, data)` & `resumePart(saved, lesson)`: Validates `block:<id>` and `lesson:<id>:<part>` routes and clamps obsolete saved section indices safely.

- **`public/dashboard/cell-state.js` (`DominanceCellState`)**:
  - Validates private account-owned course state (`version: 1`, `lessons` read timestamps, `attempts` up to 100, `draft` format 2 with `responses` map and `phase: 'answer' | 'review'`, and per-block `reading` position `{section, part, offset, updatedAt}`).
  - `merge(existing, incoming, data)`: Deduplicates completed attempts by ID, merges read markers, picks the newest reading position per block, and clears any stale draft whose ID is already in `attempts`.

- **`public/dashboard/cell-structure.js` (`DominanceCellStructure`)**:
  - **Safe Markdown Renderer (`markdown`, `inline`)**:
    - Escapes all HTML entities first (`&`, `<`, `>`, `"`, `'`) so raw HTML, `<script>`, `<img>`, and links never execute.
    - Renders Markdown tables inside `.cell-table` (`<div class="cell-table"><table>...</table></div>`) with `white-space: nowrap` column headers and horizontal scroll containment (`overflow-x: auto; overscroll-behavior-x: contain`).
    - Renders inline backticked expressions (`` `=B2*$F$1` ``) as `<code>=B2*$F$1</code>` monospace pills.
    - Protects multiplication asterisks (`*`) in un-backticked arithmetic and spreadsheet formulas (`=10/5*2 gives 4, whereas =10/(5*2) gives 1`, `Price * Quantity with A1*B1`) so they are never consumed as `<em>` emphasis delimiters, while preserving standard Markdown italics (`*retention factor*`) and bold (`**bold**`).
  - **Study Area Enhancements (`enhanceCreate`)**:
    - **Multi-Course Support**: Accepts `ctx.data.course`, `ctx.stateKey`, `ctx.progressId`, `ctx.learning`, and `ctx.model` so the same engine powers **Cell Structure** (`cellStructure`), **Computer Appreciation** (`computerAppreciation`), and future HB1–HB3 courses.
    - **Chapter Grouping & Read Badges**: In `block:<id>` lesson lists, inserts `<h3 class="cell-chapter-heading">` headings when `block.chapters` is defined, and marks read lessons with `data-read="true"` and `.topicrow-read` (`Read · →`) without mutating button `textContent` (`Lesson N — Title`).
    - **Question Count Metadata**: Annotates `Practise this lesson` with `data-questions="<count>"`.
    - **Seamless Lesson ↔ Question ↔ Explanation Navigation**:
      - In `Practice results` (`#quizArea`), appends the lesson label (`· Lesson N — Title`) to each question's `<summary>` so students immediately see which lesson a question and its explanation belong to.
      - Enhances `Return to study` (`data-target-topic`) to exit focused quiz mode (`ctx.focus(false)`), clear `#quizArea`, open the course in the Study Area, and navigate directly to:
        - `lesson:<lessonId>:0` when the practice session covered a single lesson,
        - `block:<blockId>` when the practice session covered a single study block, or
        - `@blocks` when the session covered multiple blocks.
      - When a session covers 2–6 lessons, appends `.cell-related-lessons` action buttons (`Study Lesson N — Title`) so students can jump directly from the results screen into any practiced lesson.

### 3.2 Critical Test Invariants to Preserve

When modifying or extending the Study Area and Practice UI, preserve these behavioral contracts verified by `tests/cell-structure.test.js`:

1. **`#cellSection` first child**: `document.getElementById('cellSection').children[0]` must remain the `<h2>` section title element.
2. **Question `<details>` children count in `#quizArea`**: For standard Cell Structure questions, each `<details>` element in `resultView` must have `1` child (`<summary>`) before expansion and `5` children (`<summary>`, `<h3>` question, `<p>` your answer, `<p>` correct answer, `<p>` explanation) after expansion (`details.open = true; details.ontoggle()`), plus an optional 6th `<p>` child when `q.pages` is provided (e.g., Computer Appreciation PDF page citations).
3. **Lesson button labels**: Lesson buttons inside `.lesson-list` must keep `textContent` starting with `'Lesson '` (`Lesson N — Title`); use `dataset` attributes (`data-read="true"`, `data-lesson`, `data-chapter`) and CSS pseudo-elements (`::after`) for visual badges.
4. **Practice landing buttons**: `#cellPractice` on the landing view must render the 4 destination buttons (`Open Topic Questions`, `Open Past Questions`, `Open Flashcards`, `Open Mock Exams`).

---

## 4. Adding or Extending Academic Courses (Guide for Codex)

To add a new course or integrate a new content package:

1. **Content Compilation & Validation**:
   - Store source Markdown lessons and question JSON under `content/<course-slug>/`.
   - Compile student-facing assets into `public/dashboard/<course>-content.js` (stripping internal QA/provenance metadata while keeping `references`, `attribution`, and optional `pages`).
2. **Learning & State Descriptors**:
   - Create `public/dashboard/<course>-learning.js` defining the course's `blocks` (and optional `chapters`) via `DominanceCellLearning.create(blocks)` or the shared learning interface.
   - Create `public/dashboard/<course>-state.js` delegating `state`, `merge`, and `score` to `DominanceCellState` with the course's learning descriptor, and register the storage key in `src/dashboard-session.js`.
3. **Dashboard Registration**:
   - Pass `{owner, data, learning, model, stateKey, progressId, ...}` to `DominanceCellStructure.create(ctx)` (or via `DominanceAcademicCourses` in `public/dashboard/academic-courses.js`).
   - All Study Area styling, responsive tables, inline code pills, concept checks, searchable section/question pickers (`DominanceChoices`), and Lesson↔Question navigation work automatically.

---

## 5. Verification Commands & Quality Gates

Run the following commands before committing or updating any PR:

```bash
# 1. Unit & behavioral test suite (Node test runner)
npm test

# 2. ESLint static analysis
npm run lint

# 3. Production Vite build (note: prebuild runs content:cell)
npm run build

# 4. Firebase Emulator integration tests (when touching rules, auth, or Firestore adapters)
npm run test:emulators
```

> **Note on `npm run build`**: The `prebuild` script runs `npm run content:cell`, which regenerates `public/dashboard/cell-content.js` and `public/dashboard/cell-index.js`. Always check `git status` after `npm run build` and restore those generated files if your branch is not intentionally modifying Cell Structure content.
