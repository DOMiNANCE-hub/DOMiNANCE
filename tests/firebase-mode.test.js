import test from 'node:test';import assert from 'node:assert/strict';import {firebaseConfiguration,firebaseConfigurationStatus,assertFirebaseAppConfiguration,FIREBASE_WEB_FIELDS} from '../src/firebase-mode.js';
test('emulator mode ignores real environment values',()=>{const {emulator,config}=firebaseConfiguration({DEV:true,MODE:'emulator',VITE_FIREBASE_PROJECT_ID:'dominance-d310e',VITE_FIREBASE_API_KEY:'must-not-use',VITE_FIREBASE_DATABASE_URL:'https://must-not-use.invalid'});assert.equal(emulator,true);assert.equal(config.projectId,'demo-dominance');assert.equal(config.apiKey,'demo-only-key');assert.equal(config.databaseURL,undefined)});
test('emulator flag cannot enable emulators outside dedicated development mode',()=>{assert.throws(()=>firebaseConfiguration({DEV:false,MODE:'emulator'}));assert.throws(()=>firebaseConfiguration({DEV:true,MODE:'development',VITE_USE_FIREBASE_EMULATORS:'true'}));assert.throws(()=>firebaseConfiguration({DEV:false,MODE:'production',VITE_USE_FIREBASE_EMULATORS:'true'}))});
test('ordinary configuration remains unchanged',()=>{const result=firebaseConfiguration({MODE:'production',DEV:false,VITE_FIREBASE_PROJECT_ID:'ordinary-value'});assert.equal(result.emulator,false);assert.equal(result.config.projectId,'ordinary-value')});
test('configuration diagnostics identify missing fields without disclosing values',()=>{
 const result=firebaseConfigurationStatus({apiKey:'fictional-private-value',projectId:'fictional-project'});
 assert.equal(result.ready,false);assert.ok(result.missing.includes('VITE_FIREBASE_APP_ID'));
 assert.ok(!result.missing.includes('VITE_FIREBASE_API_KEY'));assert.doesNotMatch(JSON.stringify(result),/fictional-private-value|fictional-project/);
});
test('copied example placeholders cannot initialize live Firebase',()=>{
 const config=Object.fromEntries(Object.values(FIREBASE_WEB_FIELDS).map(field=>[field,'your_value']));
 const result=firebaseConfigurationStatus(config);assert.equal(result.ready,false);assert.equal(result.placeholders.length,6);
 assert.equal(firebaseConfigurationStatus(firebaseConfiguration({DEV:true,MODE:'emulator'}).config).ready,true);
});
test('Firebase reuse refuses a different project or Web app rather than retaining stale credentials',()=>{
 const config=Object.fromEntries(Object.values(FIREBASE_WEB_FIELDS).map(field=>[field,'fictional-'+field]));
 assert.doesNotThrow(()=>assertFirebaseAppConfiguration(undefined,config));assert.doesNotThrow(()=>assertFirebaseAppConfiguration({options:{...config}},config));
 for(const field of Object.values(FIREBASE_WEB_FIELDS))assert.throws(()=>assertFirebaseAppConfiguration({options:{...config,[field]:'different'}},config),/Reload/);
});

import {accountError} from '../src/account-session.js';
test('older and newer credential errors share helpful non-identifying feedback',()=>{for(const code of ['auth/wrong-password','auth/user-not-found','auth/invalid-credential'])assert.equal(accountError({code}),'The email or password is incorrect.')});
