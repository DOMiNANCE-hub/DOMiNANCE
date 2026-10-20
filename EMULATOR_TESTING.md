# Isolated Stage 1A review

Run from the existing DOMiNANCE repository. No Firebase login or real project credentials are needed.

1. Use Node 24 and Java 21. The launcher automatically uses the checksum-verified portable runtime installed at %LOCALAPPDATA%/DOMiNANCE/emulator-java when available; otherwise Java must be on PATH.
2. Terminal one: npm run emulators. This launcher fixes the project to demo-dominance and loads firebase.emulator.json. Do not use the bare Firebase CLI against the default .firebaserc project for these tests.
3. Terminal two: npm run dev:emulator. Open http://127.0.0.1:5174/ (the app root, not the standalone dashboard).
4. Confirm LOCAL EMULATOR / LOCAL TEST appears. Use fictional emails ending in @example.invalid and disposable passwords only.
5. npm test runs offline regression tests. npm run test:emulators runs actual Auth/Firestore integration checks against loopback only, creating fictional records.

The dedicated Vite mode ignores real VITE_FIREBASE_* values, uses a separate Firebase app and hardcoded demo project, explicitly connects Auth at 127.0.0.1:9099 and Firestore at 127.0.0.1:8080, and makes Storage/Realtime Database unavailable. A development-only Content Security Policy blocks browser fetch/XHR outside local endpoints. Mode cannot be used in a production build. Missing emulators cause errors/timeouts; there is no fallback to live services.

firebase.json, .firebaserc and firestore.rules remain unchanged. The emulator reads the existing rules locally; this does not prove deployed rules match. Emulator data is disposable and normally disappears when the emulators stop. Browser Auth persistence may outlive an emulator restart: sign out or clear only the 5174 origin's test storage if necessary. Never import production exports into these tests.

Recovery links are recorded in local Auth emulator output / its local oobCodes endpoint; no email is delivered. Test recovery request and error handling here. Real inbox delivery, Google provider configuration, deployed permissions and production behavior require separate approval and verification.

Manual acceptance: create a fictional student, finish onboarding, open Profile & Settings, reload, request recovery, sign out, sign in as another fictional student and confirm no previous name/profile appears. Check invalid password, profile-loading error/retry, Escape and keyboard focus in the dialog, and a narrow phone layout. Do not begin academic profile editing (Stage 1B).

Verified results are recorded in ROADMAP.md after each test run.

For a profile-access failure test, run node scripts/emulator-profile-failure.mjs deny, reload the signed-in app and confirm the Retry screen. Then ALWAYS run node scripts/emulator-profile-failure.mjs restore and Retry. These commands alter only emulator memory, never the on-disk or deployed rules.

This Windows environment needed OpenJDK's TCP-loopback fallback: the launcher selects a missing Unix-socket directory while keeping the normal temp directory valid. Startup initially failed before that workaround. All listener ports (including 9150) were verified bound to 127.0.0.1.

For appearance-save failure testing, `node scripts/emulator-profile-failure.mjs deny-writes` retains owner-only profile reads but denies all writes in emulator memory. Verify the unsaved draft/error message, then immediately run `node scripts/emulator-profile-failure.mjs restore` and retry Save. This is only the fixed loopback demo-dominance emulator; production rules/configuration remain unchanged. Never leave an override active or run the integration suite during the override.

## Community local-only foundation (2026-10-18)

The dedicated emulator config now loads firestore.community.emulator.rules. This preserves the private account baseline while allowing only the bounded HB1 opt-in Community schema and atomic level-change withdrawal locally. Production firestore.rules is unchanged. npm run test:emulators runs Auth, account isolation, Community and administrator permission integration tests sequentially; the Community test loads this candidate only at the fixed 127.0.0.1:8080 demo-dominance endpoint. Fictional Community records may remain for local review; they are labelled Fictional and disappear with an unexported emulator restart. Production Community is disabled in the application. See docs/COMMUNITY_FOUNDATION.md before any release proposal.


The unified My Profile follow-up uses a version-2 public projection of the same saved name, bio and preset/initials. Account edits and published projection updates are one emulator transaction; temporary personal-photo previews remain private. The integration suite covers direct identity mismatch rejection, hide without deleting private records, reload, legacy-card review/private backup and account isolation. A fixed loopback emulator-only admin fixture seeds a fictional legacy card; it uses no real credentials or production endpoint. See docs/COMMUNITY_FOUNDATION.md for manual steps. The local candidate remains the intended emulator ruleset after testing, with no temporary permissive override left active.


Privacy review for the pre-migration checkpoint replaced the copied owner contact in the emulator-only candidate with `emulator-superadmin@example.invalid`. This is a fictional local administrative fixture, not a real account or a production configuration change. Student tests remain fictional and loopback-only. Production owner identities and rules were not edited.

## Cloud Firebase readiness follow-up (2026-10-19)

`npm run test:auth:emulator` runs a standalone real local Auth check without requiring the Firestore JAR. It verifies fictional registration, incorrect-password rejection, sign-out and restoring the correct account. The full `npm run test:emulators` command now includes this check plus private persistence, Community and administrator permission scenarios in sequence.

The local candidate requires `email_verified == true` for the fictional super-administrator identity. The new permission suite uses emulator-only mock claims to verify unverified-email denial, student isolation/no self-promotion, administrator course writes without student-profile access, and verified-super-administrator fixture promotion. It performs no production requests or privileged live grants. At that readiness checkpoint the deployable source file was unchanged; the final administrator correction below supersedes this limitation.

After environment republication on 2026-10-19, the official Firestore v1.22.0 JAR downloaded and matched the CLI checksums. Full Auth/Firestore/Community/administrator integration passed: 17 tests, zero failures/skips, using fictional records and fixed demo-dominance loopback endpoints. The earlier HTTP 403 / stale_base download blocker is resolved. All six Web variables are present and pass value-free validation. The optional live smoke test was not run. The later administrator-security correction is recorded below. See [Firebase development setup](docs/FIREBASE_DEVELOPMENT.md) for configuration, recovery and guarded development-project verification. Do not describe prepared tests as passed or infer that deployed rules match the local candidate.


## Final administrator security correction (2026-10-19)

The permission suite now loads both exact checked-in files, firestore.rules and firestore.community.emulator.rules, into the fixed local demo-dominance emulator. It checks the configured owner email only in unsigned mock claims, never a real registered owner account. Both files require signed boolean email_verified for owner and delegated-administrator privileges. Missing/malformed claims, profile-field spoofing, direct/overwrite/batch self-promotion, cross-account access and unauthorized writes are denied; verified delegated admins can manage courses and revocation denies subsequent writes. Ordinary student onboarding/private progress remains available without email verification.

This follow-up supersedes the earlier statement that the deployable source file is unchanged. Only the checked-in file changed: live rules, configuration and accounts were not touched. The suite restores the Community candidate in finally, including after failures. See [Administrator authorization](docs/FIREBASE_AUTHORIZATION.md) for the role matrix, future custom claims and administrator provisioning requirements. No student migration is needed; administrators require verified email, fresh tokens and reviewed existing grants before an authorized future live rollout.

Final verification: 35 combined integration tests passed, including 24 security tests against the two exact rules files; 129 offline tests, lint and production build passed with existing warnings.
