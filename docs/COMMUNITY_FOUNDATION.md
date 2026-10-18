# Community foundation — local review, 2026-10-18

Approved scope: HB1/KNUST SMS profiles and classmates, using fictional local accounts. The user's subsequent approval replaces the earlier separate Community editor with **one My Profile and an optional public view**. No feed, following, uploads, challenges, achievements or moderation engine was built.

## One student identity

- Avatar menu → My Profile and Community → My Profile open the same existing account panel. Community has no separate display-name/bio editor or second profile-registration step.
- Save profile covers display name, academic level/applicable semester, optional 160-character bio and the explicit Community visibility choice. Existing picture selection remains in that panel with its own confirmation; the form explains the save boundary. Preset avatars/initials persist; temporary personal-photo previews remain device/session-only and are never published.
- The public preview shows the student's current name draft, saved preset/initials, bio and HB1 cohort. A hidden profile is not published by previewing it or by editing its name/avatar. When sharing is enabled, saved name, bio and preset changes update the same public identity atomically.
- Classmates can browse without sharing their own profile. Shared cards and profile dialogs reuse the saved avatar/initials. Hide profile confirms first, removes only the shared view and preserves account, bio and private progress. Other students refresh to see updates/removals; this limited preview has no realtime directory subscription.
- Loading, errors/retry, explicit saving and eight-document cursor pagination remain. Community still lazy-loads via a React portal in the existing dashboard. Five tabs, course/quiz navigation, academic access and account isolation are preserved.

## Privacy and ownership

One identity does not mean exposing the private account document. Private `users/{auth.uid}` remains owner-protected. `communityProfiles/{auth.uid}` is a strictly limited public projection: **name, bio, preset avatar identifier, cohort, identityVersion:2, joinedAt and updatedAt**. No email, role, course selections, photo URL/blob, quiz answers or detailed progress are copied.

Only the authenticated owner can publish/edit/delete their projection. Local candidate rules require its name, bio and saved avatar to match the private profile after the same transaction, with visibility enabled. Direct attempts to maintain a different public identity or leave a stale shared card after identity/level changes are rejected. Ordinary learning/preferences saves remain independent. Shared reads require authenticated same-cohort access; list queries require the cohort filter and a maximum of eight records. HB1 is self-reported, not verified university enrolment.

Local level changes atomically withdraw an existing shared card. HB1 spelling normalization does not hide an unchanged cohort. There is no higher-year Community rollout in this milestone.

## Earlier separate Community cards

Earlier version-1 cards remain readable, but are marked for review in My Profile rather than silently opting the student into sharing the current account identity. On the next identity save or avatar change, an unreconfirmed old card is withdrawn and its previous name/bio retained privately in `legacyCommunityProfile`. The bio is carried into the private profile where no newer bio exists. Explicit Save profile confirms the new visibility choice; re-enabling visibility publishes the canonical current identity. A private review marker avoids repeating the migration prompt after confirmation. No ambiguous browser records are imported; no production migration ran.

## Local-only rollout boundary

`firestore.community.emulator.rules` is the local candidate; only `firebase.emulator.json` points at it. Production `firestore.rules`, `firebase.json`, `.firebaserc`, environment/project configuration are unchanged. The service requires dedicated emulator mode and both Firebase apps targeting `demo-dominance`; production displays an unavailable notice without Community requests. No production requests, live student publication or real accounts were used.

## Verified results

- 121 automated regression tests passed, zero failed/skipped, including the unified-entry render assertion. Models validate public-field projection, matching name limits, legacy reads, avatar allowlist, private-field omission, consent, production refusal and stale account handling. Render checks verify the disabled production UI and the absence of a second Community editor.
- Nine isolated integration tests passed (two top-level scenarios plus seven Community subtests). Coverage includes private bio saving, explicit sharing, atomic name/bio/avatar sync, joined-time preservation, ordinary learning writes, forged identity/invalid plain-text/extra-field rejection, pagination, cross-owner private reads/shared writes/deletes, hidden-profile retention, academic-level withdrawal, legacy review/private backup and sign-out/sign-in persistence. Expected PERMISSION_DENIED logs are negative security assertions.
- Lint passes with zero errors and the same eight existing dormant-screen warnings. Production build passes with the existing large-entry warning; Community UI/service remain on-demand chunks. No dependency was added.
- Browser inventory currently returns no available apps/browsers. Portal mounting, profile opening from Community, preview/confirmation focus, mobile touch, desktop layout, visual contrast and real UI retry flows remain unverified. Software tests do not constitute visual acceptance.
- Fictional emulator records may disappear when emulators stop. Live/cross-device photo persistence is not implemented.

## Manual review

Open http://127.0.0.1:5174/#community in the isolated preview:

1. Use a fictional HB1 account. Open My Profile from Community and from the avatar menu; confirm it is the same panel.
2. Edit name/bio while hidden, preview, save, reload and verify the directory still omits the account.
3. Enable visibility and Save profile. View the public card; change the saved preset/name and confirm they match. A temporary photo must remain private.
4. Hide the card, reload and switch accounts; private bio/progress should remain with the correct owner. Try a failed save/retry if practical.
5. Check phone/desktop layouts, keyboard Tab/Escape and normal course → lesson → Practice navigation.

Before any live release, review rules and data retention, moderation/reporting/blocking, institution/cohort verification, indexes and real accessibility/device flows. These are release gates, not completed features. Feed/following/messages/uploads/challenges and higher-year rollout need separate approval. No commit, push, merge, deployment or production rule/configuration changes were performed.
