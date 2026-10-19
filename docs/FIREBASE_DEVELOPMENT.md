# Firebase development readiness

The approved development project is `dominance-d310e`. Its owners confirm Email/Password is enabled, Firestore exists, and the project contains only development/testing accounts or none. This is owner-provided information, not a claim that deployed configuration or rules were inspected. No production data is needed for this workflow.

## Secure Web app configuration

A Web app already exists. In Firebase Console → Project settings → General → Your apps → that Web app → SDK setup and configuration, copy these values into **cloud environment settings**, never chat or Git:

| Web configuration field | Cloud environment variable |
| --- | --- |
| apiKey | VITE_FIREBASE_API_KEY |
| authDomain | VITE_FIREBASE_AUTH_DOMAIN |
| projectId | VITE_FIREBASE_PROJECT_ID |
| storageBucket | VITE_FIREBASE_STORAGE_BUCKET |
| messagingSenderId | VITE_FIREBASE_MESSAGING_SENDER_ID |
| appId | VITE_FIREBASE_APP_ID |

Use the values from that single Web app; projectId must be `dominance-d310e`. The six fields are required by the current application startup contract. Realtime Database URL and Analytics measurement ID are optional; do not enable extra products to satisfy these tests. An ignored `.env.local` is also supported for local development. Real values must not be committed.

Web configuration is delivered to browsers by Vite. It identifies the Firebase app; security depends on Auth and Firestore rules. Never put service-account JSON, private keys, Firebase CLI tokens, Gemini or Text-to-Speech secrets in `VITE_*`. Ordinary Web SDK signup/login tests need no Firebase Owner credential or Admin SDK. The cloud platform's Google credential is not evidence of access to this Firebase project and must not be reused as an owner identity.

Run `npm run firebase:check`: it reports missing/example variable **names**, checks the approved project and makes no network request. Restart Vite after environment changes; rebuild every preview because Vite embeds values at build time. Copied `your_…` examples no longer initialize Firebase. Reusing a live Firebase app with different Web configuration requires a reload.

## Network and emulator prerequisites

Keep existing package-manager and font allowances. Required additions for environment settings are:

- `storage.googleapis.com`: official checksum-validated Firestore emulator JAR.
- `identitytoolkit.googleapis.com`: Email/Password signup and login.
- `securetoken.googleapis.com`: Auth token refresh.
- `firestore.googleapis.com`: private profile and quiz progress access.
- `dominance-d310e.firebaseapp.com`: Auth helper domain for browser provider/redirect flows.

Do not disable TLS/checksum verification, use mirrors, or bypass the configured proxy. Firebase CLI login/deployment and other providers may require additional destinations later; they are not needed to test the Web SDK now.

Verified on 2026-10-19 after the environment was republished: all six required variables are ready, present and nonempty; `npm run firebase:check` passes without displaying values. The enforced policy includes `storage.googleapis.com`. The official Firestore v1.22.0 JAR downloaded successfully, passed CLI size/MD5 validation, and independently matched the SHA-256 recorded by the installed Firebase CLI. The earlier HTTP 403 / `stale_base` download blocker is resolved. No live Auth or Firestore request was needed.

After applying the network settings, retry the official download through the configured proxy:

```bash
env -u FIREBASE_TOKEN -u GOOGLE_APPLICATION_CREDENTIALS \
  FIREBASE_EMULATORS_PATH=/workspace/.cache/firebase/emulators \
  node node_modules/firebase-tools/lib/bin/firebase.js setup:emulators:firestore \
  --project demo-dominance --config firebase.emulator.json
```

For a fresh restricted cloud checkout, install locked dependencies with `npm ci --cache /tmp/dominance-npm-cache --no-audit --no-fund` so npm does not need to write outside the workspace. Set `XDG_CONFIG_HOME=/tmp/dominance-config` and retain `FIREBASE_EMULATORS_PATH=/workspace/.cache/firebase/emulators` for both download and launcher commands. Grant the execution tool network access for downloads and loopback integration commands; restricted execution without it can report file-level Node test success without executing individual tests. Check the individual test names and counts.

Then use Node >=24.12 and Java 21, `LOCALAPPDATA=/tmp/dominance-local npm run emulators`, and, in a second terminal, `npm run test:emulators`. The launcher removes privileged credentials and fixes localhost and `demo-dominance`. Confirm both Auth 9099 and Firestore 8080 are ready. Existing unrelated listeners must not be terminated. `npm run dev:emulator` is for local browser checks; emulator mode cannot be built for deployment and never falls back to real services.

The integration suite exercises real emulator Auth/Firestore: fictional signup, login, profile editing, saved quiz/resume/preferences, account switching, student isolation, opt-in Community identity and permissions. The new permission scenarios test anonymous/student/admin/verified-superAdmin access and deny unverified-owner elevation. Mock Auth claims are confined to the fixed loopback emulator, never sent to Firebase. The full suite passed in this published cloud instance: 17 tests (four top-level scenarios plus 13 subtests), zero failures/skips. Coverage includes real Auth-backed onboarding through the application profile helper, rejection of caller-supplied privilege/identity/sharing fields, server-confirmed quiz persistence, concurrent history merges, sign-in restoration, student isolation, Community privacy, and local administrator permissions. All 129 offline regressions also passed. Lint passed with eight existing warnings; the production build passed with the existing large-entry warning. No application defect was reproduced; the added integration regression closes a coverage gap.

## Bounded development-project smoke test

Only after the six variables and service access work, run:

```bash
DOMINANCE_ALLOW_FIREBASE_DEV_TESTS=true npm run test:firebase:development -- \
  --execute --project dominance-d310e
```

The opt-in gate is required and rejects a different project, Auth domain, missing/example configuration, or emulator redirects before initializing an SDK. Node 24 uses the configured environment proxy. The test uses the ordinary Web SDK and creates exactly two new `cloud-check-…@example.invalid` users with a random, memory-only password. It creates only their private profiles, saves fictional quiz progress through the application's storage adapter, signs out/in, verifies server persistence, and checks cross-account access and self-promotion denial. It lists no accounts/collections and reads no pre-existing records. The new fixtures remain: no user/document deletion is performed. Failed runs may leave partially created fixtures. Never point this command at a future production project or enable it automatically in PR CI.

Administrator grants are exercised only with emulator fixtures. Do not promote a real account or ask for a cofounder's password to test permissions.

## Permission findings and release gates

- New application profiles now always use the authenticated email and `role: student`; caller-supplied role/email/sharing fields are ignored. Existing records and roles are not migrated.
- Checked-in deployable `firestore.rules` trusts a hardcoded administrative email without requiring `email_verified`. An unverified signup using that address can receive elevated rules permissions if these rules are deployed and the address is not already owned. The client change does **not** close that backend risk. Actual deployed rules were not fetched or assumed to match this file.
- Only `firestore.community.emulator.rules` now requires a verified fictional administrative email. This candidate passed the real emulator suite. A separate authorization design/review and explicit approval are still required before any rules deployment. `firestore.rules`, `firebase.json` and `.firebaserc` remain unchanged.
- Firebase Console Owner IAM access and application administrator permissions are separate. Prefer a trusted server-managed custom-claim/role bootstrap for approved cofounder UIDs, with auditable grants and revocation. Never derive roles from a form, URL, browser storage, or unverified email. Application admin screens remain largely placeholders; rules testing does not prove those screens are functional.
- Community directory/unified public profile publication remains emulator-only and disabled for a normal deployed build. A preview with Community needs a separately reviewed environment switch and matching restricted rules/indexes. Private profile editing and personal quiz storage are distinct from Community publication.

Do not deploy the permissive baseline or enable content/admin writes until the authorization review and integration suite pass. No live student data was accessed; no rules, billing or application deployment changes were made. Draft PR #3 remains the review vehicle. The optional live development-project smoke test was deliberately not run: emulator verification satisfies this task without accessing live Firebase services.

## Protected phone-accessible PR previews

Recommended approach: Vercel builds the existing Vite app (`npm ci`, `npm run build`, output `dist`) for trusted PRs, with Deployment Protection configured for every preview URL/alias. Confirm the chosen plan protects HTTPS previews on phones; use explicit collaborator access or a short-lived shared credential. Firebase Hosting preview channels are compatible with the static build but their URLs alone are not an access-control boundary. Firebase Auth also does not protect the publicly shipped static academic assets.

Use a dedicated Firebase **preview** project (or the owner-confirmed development project only while it remains entirely disposable). Keep production values out of preview scope. Separate projects isolate data; separate hosting channels against one project do not. Use the six Web variables scoped to Preview, reviewed least-privilege rules, fictional accounts and no sensitive content. Do not use emulator mode in a public build or expose emulator ports.

Practical rollout, with approval before connecting/publishing anything:

1. Fix and review backend role authorization, run the complete emulator suite, and verify the existing development project with the guarded smoke test.
2. Choose protected hosting/access policy and a separate preview Firebase project. Owners configure Email/Password, Firestore and exact required Auth authorized domains. Custom domains are optional. Do not broadly authorize arbitrary PR hosts; stable approved aliases reduce domain churn. Google sign-in remains unverified and is not required for Email/Password testing.
3. Configure trusted CI to run offline tests, emulator tests, lint and build before preview publication. Use scoped GitHub deployment identities or hosting integration, protected environment approvals and least privilege. Never expose privileged secrets to fork PRs or execute untrusted PR code with `pull_request_target` credentials. Web config itself is public; privileged deployment tokens/keys are not.
4. After explicit deployment approval, publish a protected preview and verify owner/cofounder access from actual phones, unauthorized-access denial, signup/login, two-account isolation, refresh/persisted quiz progress, responsive navigation and removal/expiry of preview access. Set retention/cleanup policy separately; no existing data deletion is authorized here.

Software build success is not Firebase, academic-content, production-security, physical-phone or deployment acceptance. Current-instance checks and remaining blockers are recorded in ROADMAP.md.
