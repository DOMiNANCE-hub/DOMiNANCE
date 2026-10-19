import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {initializeApp, deleteApp} from 'firebase/app';
import {getFirestore, connectFirestoreEmulator, doc, setDoc, updateDoc, getDocFromServer, terminate} from 'firebase/firestore';
import {studentAccountProfile} from '../src/account-session.js';

test('emulator rules enforce student, administrator and verified super-administrator permissions', async t => {
  const rules = readFileSync('firestore.community.emulator.rules', 'utf8');
  const response = await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-dominance:securityRules', {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({rules:{files:[{name:'firestore.rules', content:rules}]}}),
  });
  assert.equal(response.ok, true, await response.text());
  const clients = [], suffix = randomUUID(), denied = error => error.code === 'permission-denied';
  function client(label, {email=`${label}-${suffix}@example.invalid`, verified=false, anonymous=false} = {}) {
    const uid = `${label}-${suffix}`;
    const app = initializeApp({apiKey:'demo-only-key', projectId:'demo-dominance', appId:'demo-only-app'}, uid);
    const db = getFirestore(app);
    // Only the emulator accepts these unsigned claims. No real Auth token or Admin SDK is used.
    connectFirestoreEmulator(db, '127.0.0.1', 8080, anonymous ? {} : {
      mockUserToken:{sub:uid, user_id:uid, email, email_verified:verified},
    });
    clients.push({app, db});
    return {uid, db, email};
  }
  async function profile(student) {
    await setDoc(doc(student.db, 'users', student.uid), studentAccountProfile({uid:student.uid, email:student.email}, {
      name:'Fictional permissions fixture', year:'HB 1', semester:'First', courses:[],
    }));
  }
  try {
    const alice = client('student'), bob = client('other-student'), admin = client('administrator');
    const unverified = client('unverified-owner', {email:'emulator-superadmin@example.invalid'});
    const owner = client('verified-owner', {email:'emulator-superadmin@example.invalid', verified:true});
    const anonymous = client('anonymous', {anonymous:true});
    await profile(alice); await profile(bob); await profile(admin); await profile(unverified);
    const course = 'permissions-course-' + suffix;
    await t.test('an unverified administrative email has no elevated access', async () => {
      await assert.rejects(updateDoc(doc(unverified.db, 'users', unverified.uid), {role:'superAdmin'}), denied);
      await assert.rejects(setDoc(doc(unverified.db, 'courses', course), {title:'Forbidden'}), denied);
      await assert.rejects(getDocFromServer(doc(unverified.db, 'users', alice.uid)), denied);
      const fresh = client('unverified-new-owner', {email:'emulator-superadmin@example.invalid'});
      await assert.rejects(setDoc(doc(fresh.db, 'users', fresh.uid), {
        email:fresh.email, role:'superAdmin', name:'Forbidden',
      }), denied);
    });
    await t.test('students own their profiles but cannot read peers or grant roles', async () => {
      assert.equal((await getDocFromServer(doc(alice.db, 'users', alice.uid))).data().role, 'student');
      await assert.rejects(getDocFromServer(doc(alice.db, 'users', bob.uid)), denied);
      await assert.rejects(updateDoc(doc(alice.db, 'users', bob.uid), {name:'Forbidden'}), denied);
      for (const role of ['admin', 'superAdmin']) {
        await assert.rejects(updateDoc(doc(alice.db, 'users', alice.uid), {role}), denied);
      }
      await assert.rejects(updateDoc(doc(alice.db, 'users', alice.uid), {email:'forged@example.invalid'}), denied);
      await assert.rejects(setDoc(doc(alice.db, 'courses', course), {title:'Forbidden'}), denied);
    });
    await t.test('verified emulator owner can bootstrap a fixture administrator', async () => {
      await setDoc(doc(owner.db, 'users', owner.uid), {email:owner.email, role:'superAdmin', name:'Fictional owner'});
      assert.equal((await getDocFromServer(doc(owner.db, 'users', alice.uid))).data().role, 'student');
      await updateDoc(doc(owner.db, 'users', admin.uid), {role:'admin'});
      assert.equal((await getDocFromServer(doc(admin.db, 'users', admin.uid))).data().role, 'admin');
    });
    await t.test('administrator manages courses but cannot inspect students or grant roles', async () => {
      await setDoc(doc(admin.db, 'courses', course), {title:'Fictional course'});
      await updateDoc(doc(admin.db, 'courses', course), {title:'Fictional updated course'});
      assert.equal((await getDocFromServer(doc(alice.db, 'courses', course))).data().title, 'Fictional updated course');
      await assert.rejects(getDocFromServer(doc(admin.db, 'users', bob.uid)), denied);
      await assert.rejects(updateDoc(doc(admin.db, 'users', bob.uid), {role:'admin'}), denied);
      await assert.rejects(updateDoc(doc(admin.db, 'users', admin.uid), {role:'superAdmin'}), denied);
    });
    await t.test('unauthenticated clients cannot read or write private profiles or courses', async () => {
      await assert.rejects(getDocFromServer(doc(anonymous.db, 'users', alice.uid)), denied);
      await assert.rejects(getDocFromServer(doc(anonymous.db, 'courses', course)), denied);
      await assert.rejects(setDoc(doc(anonymous.db, 'courses', course), {title:'Forbidden'}), denied);
    });
  } finally {
    for (const {app, db} of clients) { await terminate(db); await deleteApp(app); }
  }
});
