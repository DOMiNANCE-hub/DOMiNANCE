# DOMiNANCE — UI smoothness and performance upgrade

Verified locally on 2026-10-18. Preserves the existing uncommitted interaction/account work. No commit, push, merge or deployment. HB1 First Semester remains the academic priority.

## Audit and changes

The active app uses React 18, Vite 5, Firebase Authentication/Firestore and an authenticated HTML dashboard iframe. This remains the architecture.

- Account startup imported and initialized unused Realtime Database and Storage SDKs. No active source consumer uses either export. Their existing initialization is retained in `src/firebase-optional.js` for a future explicit on-demand import; the active account module now initializes only Auth and Firestore. Project configuration values, emulator barriers and production rules are unchanged.
- Preferences and picture/cropping code was downloaded with every initial account visit. It is now split into two on-demand chunks, with a stable loading message and Retry on a failed download. Code imports are deduplicated; rejected requests can retry. Unmounted panels ignore late resolutions, and no private account data is cached in the loader.
- Section navigation repeatedly reparsed the same Markdown. A WeakMap caches frozen academic sections, keyed by lesson object and the exact Markdown string. Changed academic text invalidates the entry; this cache contains no accounts, answers or reading progress.
- Results eagerly created all hidden explanations. They now create each explanation on first expansion and retain it, without duplicate content on subsequent toggles. All scoring, wording and saved attempts remain unchanged.
- Added quiet opacity-only question/dialog entrances with reduced-motion overrides. Answer selection remains immediate, without moving controls. Existing shared typography, spacing, focus, brand colours and themed menus remain.
- Added an explicit study-space loading message, reserved panel loading space, contained menu scrolling, 16px menu/form input text, bounded content/table widths and safe-area-aware bottom-navigation clearance. Ambient decorative animation is disabled at mobile widths. No animation library or other dependency was added.

## Reproducible measurements

Run `npm run build`, then `node scripts/measure-ui-performance.mjs`. Sizes are decimal bytes, measured from actual production files; gzip is calculated locally. The script follows static entry imports through Vite's generated build manifest.

| Measurement | Before | After |
| --- | ---: | ---: |
| Initial React account-shell JavaScript | 1,093,145 bytes | 908,231 bytes |
| Same JavaScript, gzip | 283,388 bytes | 241,735 bytes |
| On-demand preferences/photo chunks | 0 | 12,060 bytes (4,424 gzip) |
| Repeated section parsing, median of five runs, 13,800 calls/run | 606.81 ms | 2.78 ms |

Startup JS is 16.9% smaller before compression and 14.7% smaller gzip. The parsing microbenchmark demonstrates reuse of already-parsed academic sections; it does not measure first-ever lesson rendering, network latency or whole-app speed. Node timings on this PC are not Android timings. The public iframe scripts, HTML, styles and fonts are outside the React entry-size comparison. No before/after Web Vitals, FPS, CPU-throttled or network-throttled measurements were captured. The remaining entry is still large and produces Vite's existing bundle warning.

For a completed practice of N questions, the result explanation loop initially creates only N summaries rather than N summaries plus 4N hidden content nodes. Explanation nodes are constructed when requested. Scoring and result accuracy are unaffected.

## Verification

- Full automated suite: 112 passed, zero failures/skips. Includes five additional regressions for import sharing/retry/invalid exports, cache reuse/invalidation/immutability and lazy explanation expansion without duplication.
- Lint: zero errors; the same eight warnings in dormant legacy React screens remain. No new warnings remain.
- Production build: passed; remaining large-entry warning reported above.
- Isolated real Auth/Firestore integration: one scenario passed, zero failures/skips, including profile persistence, account switching, private progress reload and rejection of unauthorized writes. Expected PERMISSION_DENIED logs are negative-test successes. Only demo-dominance loopback endpoints were used.
- Browser UI: 390×844 and 360×800 phone-sized viewports, plus 1366×900 desktop. Checked Home, My Courses → Cell Structure → blocks → lessons → sections, themed section picker and Escape/focus return, profile/picture controls and preferences on-demand loading, changeable quiz answers, Previous/Next restoring a selection, review/submission/results, explanation expansion, exit confirmation safe default/Escape/confirmed exit and acknowledged pilot progress.
- Horizontal-overflow spot checks: parent 390/390 and dashboard 380/380; parent 360/360 and dashboard 350/350 (scroll width/client width). Desktop result scroll width did not exceed the viewport. No clipping of the tested content was observed. Browser viewport override was reset afterwards.
- The existing fictional emulator account was used. One-question test completion and a new resumable five-question draft were exercised; no real student records were touched.
- No standalone type-check command or TypeScript project is configured. Vite build and lint validate the existing JavaScript/JSX setup.

## Files changed in this upgrade

| File | Purpose |
| --- | --- |
| `src/DominanceApp.jsx` | On-demand account panels and study-space loading feedback |
| `src/deferred-panel.jsx` | Accessible asynchronous panel/loading/retry lifecycle |
| `src/deferred-module.js` | Shared code-load promise cache with retry after failure |
| `src/firebase.js` | Remove unused SDK initialization from active startup; retain configuration and emulator checks |
| `src/firebase-optional.js` | Preserve optional service initialization outside startup |
| `public/dashboard/cell-learning.js` | Cache immutable academic section parsing |
| `public/dashboard/cell-structure.js` | Build result explanations on demand |
| `public/dashboard/workspace-ui.css` | Responsive, safe-area, loading and reduced-motion interaction rules |
| `vite.config.js` | Emit build manifest for reproducible entry-size measurements |
| `scripts/measure-ui-performance.mjs` | Bundle/gzip and section-parsing measurement |
| `tests/deferred-module.test.js` | Code-load sharing and failure/retry regression checks |
| `tests/cell-structure.test.js` | Cache and result-expansion regression checks |
| `AGENTS.md`, `ROADMAP.md`, this report | Current safeguards, implementation and verified results |

Earlier uncommitted files remain intact; the complete working tree also contains prior selector/header/dialog refinements. No original lesson Markdown, questions, source diagrams, Firebase configuration values, environment files, firebase.json, .firebaserc or production firestore.rules were changed.

## Remaining work and limits

- Physical affordable Android devices, actual touch gestures, slow-network behaviour, screen-reader use and quantitative Web Vitals still need validation. Successful viewport checks are not equivalent to those tests.
- The main account bundle still includes substantial Auth/Firestore code. A larger architecture rewrite or new dependencies were deliberately avoided.
- The first request for a profile/preferences chunk adds a small network fetch. Loading/retry is implemented; import-failure retry is unit-tested, but live offline/online recovery was not simulated through the browser.
- Home momentum and the generic demo totals still exclude Cell Structure pilot results; the separate pilot panel in My Progress correctly shows them. Consolidating those existing progress presentations is a subsequent product/data-model task, not silently changed here.
- Existing legacy CSS layering, dormant screens and eight lint warnings remain. Academic review of the supplied content remains separate from software verification. No HB2 or unrelated feature development was started.

Preview: http://127.0.0.1:5174/ while the PC, Vite server and local emulators are running.

Follow-up: docs/COMPACT_HOME.md supersedes the Home pilot-total limitation listed above; confirmed Cell Structure practice is now included in Home. The performance measurements remain historical results for that upgrade.
