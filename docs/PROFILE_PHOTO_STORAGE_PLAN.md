# Profile photo storage — integration pending approval

Current Phase 1 supports device image selection, validated JPEG/PNG/WebP up to 5 MB, decoding/pixel limits, a keyboard-operable square crop with zoom/reposition, a resized 320px JPEG and session-only Blob URL avatars. No upload occurs; sign-out/reload discards the preview. Replacement/removal affect only that memory preview, never an existing cloud object. No base64 is stored in Firestore. Firebase Storage is initialized only outside emulator mode in existing code; no Storage emulator or project rules are currently wired. We chose the explicitly approved local-processing fallback rather than assuming the live bucket permits safe uploads.

Before persistent uploads: approve a dedicated Storage emulator and local-only SDK connection/CSP, preserve fixed demo-dominance selection, and test owner upload/read/replace/delete denials between fictional users. Test interrupted/retried upload, late callbacks after account switching, malformed image bytes and decoded content validation. Do not ship public download-token URLs for private photos. Retrieve authenticated Blob data at users/{auth.uid}/avatar.jpg and create a short-lived object URL. If public Community avatars are later wanted, define opt-in public copies separately. Never infer ownership from a URL or photo path from another profile.

Proposed Storage rules below are reference only; not loaded, deployed or verified. Client compression is not a server content-validation boundary. A future server validation pipeline is needed for public image sharing. Per-object MIME/size checks limit damage but do not prove image bytes match their MIME declaration.

```text
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/avatar.jpg {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow create, update: if request.auth != null && request.auth.uid == uid
        && request.resource.size <= 300 * 1024
        && request.resource.contentType == 'image/jpeg';
      allow delete: if request.auth != null && request.auth.uid == uid;
    }
    match /{allPaths=**} { allow read, write: if false; }
  }
}
```

Persistent uploads and cross-device loading remain unavailable. No production configuration, rules, billing or data was changed. An emulator-only implementation can be a separately scoped follow-up; production integration requires authorization and a reviewed rollout.
