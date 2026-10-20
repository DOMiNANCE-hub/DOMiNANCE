import assert from 'node:assert/strict';
import {randomUUID, randomBytes} from 'node:crypto';
import {loadEnv} from 'vite';
import {initializeApp, deleteApp} from 'firebase/app';
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {getFirestore, doc, setDoc, updateDoc, getDocFromServer, terminate, setLogLevel} from 'firebase/firestore';
import {studentAccountProfile} from '../src/account-session.js';
import {createDashboardStorage} from '../src/dashboard-session.js';
import {developmentTestConfiguration} from './firebase-development-config.mjs';

// No Admin SDK, listing, existing-user reads, deletions or privileged role changes.
const clients = [];
let timer;
setLogLevel('silent');
try {
  const env = {...loadEnv('development', process.cwd(), 'VITE_'), ...process.env};
  const config = developmentTestConfiguration(env, process.argv.slice(2));
  timer = setTimeout(() => {
    console.error('Development verification timed out; check network access. New fictional records, if created, are retained.');
    process.exit(1);
  }, 120000);
  const suffix = randomUUID(), password = randomBytes(24).toString('base64url') + 'Aa1!';
  async function register(label) {
    const app = initializeApp(config, `cloud-check-${label}-${suffix}`);
    const auth = getAuth(app), db = getFirestore(app);
    clients.push({app, db});
    const email = `cloud-check-${label}-${suffix}@example.invalid`;
    const {user} = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', user.uid), studentAccountProfile(user, {
      name:`Fictional Cloud ${label}`, year:'HB 1', semester:'First', courses:[],
    }));
    return {auth, db, user, email};
  }
  const alice = await register('Alice');
  const storage = createDashboardStorage({auth:alice.auth, uid:alice.user.uid,
    write:(uid, key, value) => updateDoc(doc(alice.db, 'users', uid), {['dashboardState.' + key]:value}),
  });
  try {
    const progress = JSON.stringify({version:1, lessons:{}, attempts:[{
      id:'cloud-check-' + suffix, completedAt:new Date().toISOString(),
      answers:[{question:'CO-Q001', option:3}],
    }]});
    assert.equal(storage.setItem('cellStructure', progress), true);
    await storage.retry();
    assert.equal(storage.pending, 0);
    await signOut(alice.auth);
    assert.equal(storage.getItem('cellStructure'), null);
    await assert.rejects(signInWithEmailAndPassword(alice.auth, alice.email, 'incorrect-fictional-password'),
      error => ['auth/invalid-credential', 'auth/wrong-password'].includes(error.code));
    await signInWithEmailAndPassword(alice.auth, alice.email, password);
    const saved = (await getDocFromServer(doc(alice.db, 'users', alice.user.uid))).data();
    assert.equal(saved.role, 'student');
    assert.equal(saved.dashboardState.cellStructure, progress);
    const bob = await register('Bob'), denied = error => error.code === 'permission-denied';
    await assert.rejects(getDocFromServer(doc(bob.db, 'users', alice.user.uid)), denied);
    await assert.rejects(updateDoc(doc(bob.db, 'users', alice.user.uid), {name:'Forbidden'}), denied);
    await assert.rejects(updateDoc(doc(bob.db, 'users', bob.user.uid), {role:'admin'}), denied);
    await signOut(bob.auth);
    await assert.rejects(getDocFromServer(doc(bob.db, 'users', bob.user.uid)), denied);
    console.log('PASS: fictional registration, login, profile, quiz persistence, isolation and role-escalation denial.');
    console.log('Only new cloud-check fixtures were used. They are retained; no data was deleted. Administrator grants are tested only in emulators.');
  } finally { storage.dispose(); }
} catch (error) {
  // Never echo Firebase error messages, which can embed request/configuration details.
  const code = typeof error?.code === 'string' && /^(auth\/)?[a-z-]+$/.test(error.code) ? error.code : null;
  const local = clients.length === 0 && error?.name !== 'FirebaseError';
  console.error(local ? error.message : 'Development verification failed' + (code ? ` (${code})` : '') + '.');
  process.exitCode = 1;
} finally {
  for (const {app, db} of clients) { await terminate(db); await deleteApp(app); }
  clearTimeout(timer);
}
