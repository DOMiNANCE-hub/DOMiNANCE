# Five-PR release-candidate integration

Base: development `3b5368fda5659c13b8b4e9b533e52009dc628832`; all five input PR heads and CI results were re-fetched and inspected. This is a new isolated release-candidate branch; original branches remain intact. No development/main merge or deployment.

PR #15 includes PR #13's integrated UI fixes. Both are preserved in history. The prior local academic combination supplies the reviewed resolutions documented in `docs/biol157/COMBINED_INTEGRATION.md`; PR #16's final documentation commits were then included. The new automatic merge retained both the native academic engine and Antigravity's wrapper. We inspected that composition rather than treating a clean text merge as proof of correctness.

One compatibility defect was fixed: Antigravity's legacy adapter broadened global Cell reading validation even when the native engine already supported per-course state. The adapter now limits that fallback to legacy engines. A behavioral regression verifies that creating a Bio engine preserves the Cell validator and that Cell rejects Bio reading positions. Concept practice buttons also retain Antigravity's actual-question-count annotation.

Retained: per-course Firebase transaction handlers, text-free indices, full-bank limits, original source IDs, confirmed Home counts, reading positions, all three review middleware gates, formula-safe Markdown, chapters/read badges, result lesson labels and return navigation, five tabs, profile-picture/auth/mobile fixes and shared responsive styling.

Verification: 180 integrated offline checks and the new focused regression pass; 40 real emulator checks pass, lint/build pass with prior warnings. Chromium re-ran fictional signup/onboarding, ten-unit catalogue, notes before quiz, resume/retry/reload, exact Bio feedback link, 390px traversal, Cell all-178 and Computer all-114 submissions/source feedback, and all three progress panels. No page errors. Committed runner: `node tests/browser/three-course.mjs /path/to/playwright/index.mjs` against fixed loopback emulator Vite port 5179. Playwright/Chromium are test-environment capabilities, not app production dependencies.

Academic release gates remain active. No test result certifies scientific completeness, lecturer approval, physical-device behavior or deployed production settings. The next batches update the permanent readiness report and preserve this checkpoint's explicit scope.
