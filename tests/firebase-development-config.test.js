import test from 'node:test';
import assert from 'node:assert/strict';
import {developmentTestConfiguration} from '../scripts/firebase-development-config.mjs';
const args = ['--execute', '--project', 'dominance-d310e'];
const env = {DOMINANCE_ALLOW_FIREBASE_DEV_TESTS:'true',
  VITE_FIREBASE_PROJECT_ID:'dominance-d310e', VITE_FIREBASE_API_KEY:'fictional-key',
  VITE_FIREBASE_AUTH_DOMAIN:'dominance-d310e.firebaseapp.com',
  VITE_FIREBASE_STORAGE_BUCKET:'fictional-bucket', VITE_FIREBASE_MESSAGING_SENDER_ID:'fictional-sender',
  VITE_FIREBASE_APP_ID:'fictional-app'};
test('live development tests require both explicit project flags and an opt-in environment variable', () => {
  assert.equal(developmentTestConfiguration(env, args).projectId, 'dominance-d310e');
  for (const invalid of [[], ['--execute'], ['--execute','--project','another-project'], [...args,'--force']]) {
    assert.throws(() => developmentTestConfiguration(env, invalid), /requires/);
  }
  assert.throws(() => developmentTestConfiguration({...env, DOMINANCE_ALLOW_FIREBASE_DEV_TESTS:undefined}, args), /requires/);
});
test('live tests reject other projects, placeholder configuration and emulator redirects before SDK initialization', () => {
  for (const overrides of [
    {VITE_FIREBASE_PROJECT_ID:'other-project'}, {VITE_FIREBASE_AUTH_DOMAIN:'other.invalid'},
    {VITE_FIREBASE_API_KEY:undefined}, {VITE_FIREBASE_APP_ID:'your_app_id'},
    {FIRESTORE_EMULATOR_HOST:'127.0.0.1:8080'}, {FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9099'},
    {VITE_USE_FIREBASE_EMULATORS:'true'}, {MODE:'emulator'},
  ]) assert.throws(() => developmentTestConfiguration({...env, ...overrides}, args));
});
