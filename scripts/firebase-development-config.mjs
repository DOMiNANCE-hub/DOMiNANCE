import {firebaseConfiguration, firebaseConfigurationStatus} from '../src/firebase-mode.js';

export const DEVELOPMENT_PROJECT = 'dominance-d310e';

// An explicit gate for the opt-in smoke test, never for general application startup.
export function developmentTestConfiguration(env, args) {
  if (args.length !== 3 || args[0] !== '--execute' || args[1] !== '--project'
      || args[2] !== DEVELOPMENT_PROJECT || env.DOMINANCE_ALLOW_FIREBASE_DEV_TESTS !== 'true') {
    throw new Error('Live testing requires --execute --project dominance-d310e and DOMINANCE_ALLOW_FIREBASE_DEV_TESTS=true.');
  }
  if (env.VITE_USE_FIREBASE_EMULATORS === 'true' || env.FIRESTORE_EMULATOR_HOST
      || env.FIREBASE_AUTH_EMULATOR_HOST || env.MODE === 'emulator') {
    throw new Error('Use npm run test:emulators for emulator testing.');
  }
  const {config} = firebaseConfiguration({...env, MODE:'development', DEV:true});
  if (!firebaseConfigurationStatus(config).ready) {
    throw new Error('Firebase Web configuration is incomplete. Run npm run firebase:check.');
  }
  if (config.projectId !== DEVELOPMENT_PROJECT) {
    throw new Error('Refusing a project other than the approved development project.');
  }
  if (config.authDomain !== `${DEVELOPMENT_PROJECT}.firebaseapp.com`) {
    throw new Error('Review the development Auth domain before running live tests.');
  }
  return config;
}
