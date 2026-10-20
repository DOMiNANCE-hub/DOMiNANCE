# Local combined academic verification — 20 October 2026

The isolated review branches were combined **only in a separate local test worktree**, without changing any remote base or merging into development/main:

| Input | Exact tested commit |
|---|---|
| Shared development | 3b5368fda5659c13b8b4e9b533e52009dc628832 |
| Computer PR #9 | 5992e99550295ad853912fd10830f75b006fa827 |
| Cell instruction PR #14 | b601602f06c97419f97a625ad8022d037e97cded |
| BIOL157 PR #16 implementation | c4b0061ff5581d638d7ee962f1cea4fa5d2f3dbe |

Local branch: `academic/local-hb1-integration-20261020`, worktree `/workspace/DOMiNANCE-academic-integration`. Local merge checkpoints `81840d9` then `7654b12` are test-only and unpushed. No academic content was combined into one remote PR.

## Conflict resolutions tested

The independent drafts modify the same generic reader and account hooks. They cannot be combined by blindly choosing one branch's files. Tested resolutions:

- Preserve both Computer and Cell ROADMAP entries and Bio continuation; combine all course content scripts and all emulator test files in package.json.
- Keep per-course learning in state/merge functions and the actual `questions.size` validation ceiling, rather than the old 170 limit.
- Use the generic registry with Cell, optional Computer and Bio definitions; use each course's own text-free index for history-only state. Notes availability depends on lessons, not question count.
- Keep generic course selection, review labels, honest unauthored units, concept filtering and exact feedback-to-core links in the renderer.
- Include each course's script tags in dashboard/index.html. Preserve the merged Antigravity five-tab, header, selector, focus and history controls. No global CSS change.
- Combine parent course imports, allowlisted keys and transaction selection: Cell, Computer and Bio use their respective merge functions. Preserve confirmed-only Home records, including Bio additional-history inputs and pending-write guards.
- Enable all three emulator-only content middleware plugins; retain the build prohibition for emulator mode and blocked normal assets.

## Results

- **178 individual offline checks pass** in the combined tree. Lint/build pass with the same eight dormant React warnings and existing large-entry warning.
- **40 real loopback Auth/Firestore checks pass**, including each course's persistence/transaction tests, owner isolation, authentication, Community and permissions. Fictional accounts only; no production request or rule-file change.
- Actual Chromium: Bio ten-unit catalogue, explicit pending unit, notes before quiz, concept practice, exit/resume, exact feedback link, all-34 submission, retry/reload. All 14 Bio lessons / 84 sections at 390px without document overflow.
- In that same browser/account: existing Cell reading and practice, full **178-question** review/submission; Computer PowerPoint lesson/practice/source feedback and full **114-question** review/submission. All three private progress panels visible. No page errors.
- Normal combined build: Computer and Bio assets have empty lessons/questions; Cell additions remain review-only. No draft content release was enabled.

These results verify the specifically resolved local combination, **not an automatic conflict-free merge of the original drafts**. An integrator must retain the resolutions above and rerun checks after any new upstream changes. Private source PDFs are absent from Git; their evidence was verified locally. Academic correctness/completeness approval, all 15 Microsoft Office checks and unresolved policy/source issues remain outstanding. No merge or release is authorised by this document.
