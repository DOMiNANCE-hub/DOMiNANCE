# Firebase administrator authorization

The 2026-10-19 correction is checked into `firestore.rules` and the separate local Community candidate. It has not been deployed. The tests load both exact files into the fixed loopback `demo-dominance` emulator, then restore the Community candidate in a `finally` block. Nothing in this workflow reads live accounts or changes their roles.

## Current authorization contract

Administrative checks require Firebase Authentication's signed ID-token `email_verified` claim to be the boolean `true`. Missing claims default to false; strings/numbers do not qualify. A profile field named `email_verified`, `admin` or `claims` cannot satisfy this check. The emulator alone accepts the unsigned mock tokens used for permission tests.

| Principal | Private profiles | Courses | Role grants |
| --- | --- | --- | --- |
| Signed out | No access | No access | Denied |
| Student, verified or unverified | Own profile and personal progress; protected role/email unchanged | Read | Denied |
| Unverified account with legacy `admin` / `superAdmin` label | Own profile only | Read | Denied |
| Verified delegated administrator (`users/{auth.uid}.role == admin`) | Own profile only | Read/create/update/delete | Denied |
| Verified configured owner email | Existing owner account-management access | Read/create/update/delete | Existing owner grant/revoke access |

A stored `superAdmin` label by itself does not authorize owner privileges. The owner must also match the configured email and have a verified signed token. Verified email alone does not authorize any other student. A verified administrator cannot list student profiles, inspect their results, promote peers or change their own role. Administrative verification requirements do not prevent ordinary unverified students from onboarding, studying or saving private activity.

Creation still requires ownership, the authenticated email and a student role (or the verified owner's existing bootstrap exception). Student updates must preserve both role and email; direct updates, whole-document replacements, field removal and batch self-promotion are denied. The delegated role comes from a UID-bound database record that only the verified owner can grant; revoking it denies subsequent course writes without waiting for a token refresh. These rules do not authorize Community publication in a deployed build; that remains in the emulator-only candidate.

## Provisioning and rollout

No student migration, account deletion, role rewrite or custom-claim provisioning is required by this compatible correction. Existing roles and records retain their formats. No live changes were performed.

Before an authorized future rules release, the operator must confirm the configured owner actually controls the intended Firebase Auth account and has verified its email. Delegated administrators must also verify ownership through a trusted Firebase Auth verification flow. Obtain a fresh ID token afterward (sign out/in or explicitly refresh it); an old token with `email_verified: false` remains unable to administer. Do not fabricate verification by editing Firestore profile fields or mark an address verified without checking ownership. The app currently does not provide a new administrator-verification UI in this change.

Audit existing administrator grants before enabling live administrative writes. If the old rules were deployed, an unverified owner could have granted roles; requiring verification now does not establish the provenance of those old grants. This audit must be a separately authorized operation: no existing accounts or documents were inspected or modified here. If all intended administrators already have verified emails and reviewed roles, no additional provisioning is needed. Rules deployment itself requires separate authorization and is deliberately not performed by this PR.

The checked-in correction does not prove which rules are currently deployed. Owner IAM access to Firebase Console and application-level authorization remain separate. UI role labels and dormant administrative screens are not an authorization boundary or evidence that those features are implemented.

## Custom claims assessment

Trusted server-managed custom claims are the preferred long-term replacement for the email bootstrap and database role labels: bind a narrowly scoped application role to an explicitly approved Auth UID, set claims only through a protected Admin SDK workflow, and remove the email fallback once administrators are provisioned. Claims in an Auth ID token cannot be set by a client profile write. Require verified ownership as defense in depth and keep course administrators separate from account/role administrators.

That migration is intentionally not implicit in this fix. It needs a reviewed UID inventory, an auditable privileged grant/revoke workflow, client token-refresh and display handling, and a cutover/rollback plan. Preserve unrelated claims when updating them. Claim changes affect new ID tokens; old tokens may remain valid until expiry, so define a session-revocation/enforcement strategy rather than promising immediate claim revocation. After cutover, remove the old authorization paths and rerun both grant/deny tests against the resulting rules. No custom claims or privileged service credentials were created or changed in this task.

## Local regression evidence

The security suite covers both checked-in files, including the deployable file's existing configured owner address as an unsigned emulator-only claim. It never registers an account for that address. All real Auth accounts created by the integration suite are fictional `example.invalid` students.

Run `npm run emulators`, then `npm run test:emulators` with Node 24 / Java 21 as described in `EMULATOR_TESTING.md`. The suite verifies verified/unverified owners and delegated administrators, malformed/missing claims, ordinary students, role immutability, batch escalation, profile-field spoofing, cross-account reads/writes/deletes/listing, course permissions, revocation and anonymous denial. The new regressions reproduced unverified-owner access in the old deployable rules and unverified delegated-administrator course writes in both old files before the correction.

Final verification: 35 combined emulator integration tests passed, including 24 security tests across the two exact rules files; 129 offline tests passed; lint and the production build passed with the existing eight lint warnings and large-entry build warning. Zero integration failures/skips in the final run.
