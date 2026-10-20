export const EMULATOR_PROJECT = 'demo-dominance';
export const FIREBASE_WEB_FIELDS = Object.freeze({
  VITE_FIREBASE_API_KEY:'apiKey',
  VITE_FIREBASE_AUTH_DOMAIN:'authDomain',
  VITE_FIREBASE_PROJECT_ID:'projectId',
  VITE_FIREBASE_STORAGE_BUCKET:'storageBucket',
  VITE_FIREBASE_MESSAGING_SENDER_ID:'messagingSenderId',
  VITE_FIREBASE_APP_ID:'appId',
});
export function firebaseConfigurationStatus(config) {
  const missing=[],placeholders=[];
  for(const [name,field] of Object.entries(FIREBASE_WEB_FIELDS)) {
    const value=config?.[field];
    if(typeof value!=='string'||!value.trim())missing.push(name);
    else if(/^your_/i.test(value.trim()))placeholders.push(name);
  }
  return {ready:!missing.length&&!placeholders.length,missing,placeholders};
}
export function assertFirebaseAppConfiguration(app,config) {
  if(app&&Object.values(FIREBASE_WEB_FIELDS).some(field=>app.options[field]!==config[field])) {
    throw new Error('Firebase configuration changed. Reload before continuing.');
  }
}
export function firebaseConfiguration(env) {
  const emulator = env.MODE === 'emulator' || env.VITE_USE_FIREBASE_EMULATORS === 'true';
  if (emulator && (!env.DEV || env.MODE !== 'emulator')) {
    throw new Error('Firebase emulator testing requires the dedicated development emulator mode.');
  }
  if (emulator) return {emulator:true, config:{apiKey:'demo-only-key',authDomain:'demo-dominance.invalid',projectId:EMULATOR_PROJECT,storageBucket:'demo-dominance.invalid',messagingSenderId:'000000000000',appId:'demo-only-app'}};
  return {emulator:false,config:{apiKey:env.VITE_FIREBASE_API_KEY,authDomain:env.VITE_FIREBASE_AUTH_DOMAIN,databaseURL:env.VITE_FIREBASE_DATABASE_URL,projectId:env.VITE_FIREBASE_PROJECT_ID,storageBucket:env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:env.VITE_FIREBASE_APP_ID,measurementId:env.VITE_FIREBASE_MEASUREMENT_ID}};
}
