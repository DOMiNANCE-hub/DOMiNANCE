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
