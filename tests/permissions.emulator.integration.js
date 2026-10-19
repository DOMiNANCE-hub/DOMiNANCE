import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {initializeApp, deleteApp} from 'firebase/app';
import {
  getFirestore, connectFirestoreEmulator, doc, collection, setDoc, updateDoc,
  deleteDoc, deleteField, getDocFromServer, getDocsFromServer, writeBatch, terminate,
} from 'firebase/firestore';
import {studentAccountProfile} from '../src/account-session.js';

const candidateFile = 'firestore.community.emulator.rules';
async function loadRules(content) {
  // Fixed emulator endpoint/project: never uses .firebaserc or live Firebase configuration.
  const response = await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-dominance:securityRules', {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({rules:{files:[{name:'firestore.rules', content}]}}),
  });
  const body = await response.json();
  assert.equal(response.ok, true, JSON.stringify(body));
  assert.equal(body.issues?.some(issue => issue.severity === 'ERROR') ?? false, false, 'emulator must compile the exact rules');
}

for (const file of ['firestore.rules', candidateFile]) {
  test(`${file}: verified administrative ownership and least-privilege permissions`, async t => {
    const candidate = readFileSync(candidateFile, 'utf8');
    const rules = readFileSync(file, 'utf8');
    // Test the exact checked-in rules, including their configured email, without rewriting them.
    // This address appears only in unsigned local mock claims, never in a real Auth account.
    const ownerEmail = rules.match(/request\.auth\.token\.email == '([^']+)'/)?.[1];
    assert.ok(ownerEmail, 'the email-based bootstrap identity must be covered');
    const clients = [], suffix = randomUUID(), denied = error => error.code === 'permission-denied';
    function client(label, options = {}) {
      const {email=`${label}-${suffix}@example.invalid`, anonymous=false} = options;
      const verified = Object.hasOwn(options, 'verified') ? options.verified : false;
      const uid = `${label}-${suffix}`;
      const app = initializeApp({apiKey:'demo-only-key', projectId:'demo-dominance', appId:'demo-only-app'}, uid);
      const db = getFirestore(app);
      // Only the emulator accepts these unsigned claims; no real token or Admin SDK is used.
      connectFirestoreEmulator(db, '127.0.0.1', 8080, anonymous ? {} : {
        mockUserToken:{sub:uid, user_id:uid, email, ...(verified === undefined ? {} : {email_verified:verified})},
      });
      clients.push({app, db});
      return {uid, db, email};
    }
    const userRef = (student, uid=student.uid) => doc(student.db, 'users', uid);
    const courseRef = student => doc(student.db, 'courses', 'permissions-course-' + suffix);
    async function profile(student) {
      await setDoc(userRef(student), studentAccountProfile({uid:student.uid, email:student.email}, {
        name:'Fictional permissions fixture', year:'HB 1', semester:'First', courses:[],
      }));
    }
    try {
      await loadRules(rules);
      const alice = client('student'), bob = client('other-student');
      const verifiedStudent = client('verified-student', {verified:true});
      const owner = client('verified-owner', {email:ownerEmail, verified:true});
      const unverifiedOwner = client('unverified-owner', {email:ownerEmail});
      const admin = client('verified-administrator', {verified:true});
      const unverifiedAdmin = client('unverified-administrator');
      const anonymous = client('anonymous', {anonymous:true});
      for (const student of [alice, bob, verifiedStudent, owner, unverifiedOwner, admin, unverifiedAdmin]) await profile(student);
      // Trusted local owner grants simulate legacy records without altering any live accounts.
      await updateDoc(userRef(owner, admin.uid), {role:'admin'});
      await updateDoc(userRef(owner, unverifiedAdmin.uid), {role:'admin'});
      await updateDoc(userRef(owner, unverifiedOwner.uid), {role:'superAdmin'});
      await setDoc(courseRef(owner), {title:'Fictional course'});

      await t.test('ordinary unverified students retain their own profile and private progress access', async () => {
        await updateDoc(userRef(alice), {name:'Fictional edited student', 'dashboardState.scores':'fictional-private-result'});
        const saved = (await getDocFromServer(userRef(alice))).data();
        assert.equal(saved.name, 'Fictional edited student');
        assert.equal(saved.dashboardState.scores, 'fictional-private-result');
        assert.equal(saved.role, 'student');
        assert.equal((await getDocFromServer(courseRef(alice))).exists(), true);
      });
      await t.test('an unverified configured owner cannot bootstrap, use legacy roles or touch peers', async () => {
        assert.equal((await getDocFromServer(userRef(unverifiedOwner))).data().role, 'superAdmin');
        await assert.rejects(updateDoc(userRef(unverifiedOwner), {role:'admin'}), denied);
        await assert.rejects(setDoc(courseRef(unverifiedOwner), {title:'Forbidden'}), denied);
        await assert.rejects(deleteDoc(courseRef(unverifiedOwner)), denied);
        await assert.rejects(getDocFromServer(userRef(unverifiedOwner, alice.uid)), denied);
        await assert.rejects(getDocsFromServer(collection(unverifiedOwner.db, 'users')), denied);
        await assert.rejects(updateDoc(userRef(unverifiedOwner, alice.uid), {role:'admin'}), denied);
        await assert.rejects(deleteDoc(userRef(unverifiedOwner, alice.uid)), denied);
        const fresh = client('unverified-new-owner', {email:ownerEmail});
        await assert.rejects(setDoc(userRef(fresh), {email:fresh.email, role:'superAdmin', name:'Forbidden'}), denied);
      });
      await t.test('missing or malformed email verification claims never authorize an owner', async () => {
        for (const [label, verified] of [['missing', undefined], ['string', 'true'], ['number', 1]]) {
          const invalid = client('invalid-owner-' + label, {email:ownerEmail, verified});
          await profile(invalid);
          await assert.rejects(updateDoc(userRef(invalid), {role:'superAdmin'}), denied);
          await assert.rejects(updateDoc(courseRef(invalid), {title:'Forbidden'}), denied);
          await assert.rejects(getDocFromServer(userRef(invalid, alice.uid)), denied);
        }
      });
      await t.test('verified email alone gives an ordinary student no administrative authority', async () => {
        await assert.rejects(setDoc(courseRef(verifiedStudent), {title:'Forbidden'}), denied);
        await assert.rejects(updateDoc(userRef(verifiedStudent), {role:'superAdmin'}), denied);
        await assert.rejects(getDocFromServer(userRef(verifiedStudent, bob.uid)), denied);
      });
      await t.test('students cannot create, overwrite, remove or atomically promote their roles', async () => {
        for (const role of ['admin', 'superAdmin']) {
          const fresh = client('forged-new-' + role, {verified:true});
          await assert.rejects(setDoc(userRef(fresh), {email:fresh.email, role, name:'Forbidden'}), denied);
          await assert.rejects(updateDoc(userRef(alice), {role}), denied);
          await assert.rejects(setDoc(userRef(alice), {email:alice.email, role, name:'Forbidden'}), denied);
        }
        await assert.rejects(updateDoc(userRef(alice), {role:deleteField()}), denied);
        await assert.rejects(updateDoc(userRef(alice), {email:ownerEmail, email_verified:true}), denied);
        // Profile fields that look like token claims must not become authorization sources.
        await updateDoc(userRef(alice), {email_verified:true, admin:true, claims:{role:'superAdmin'}});
        await assert.rejects(updateDoc(courseRef(alice), {title:'Forbidden'}), denied);
        const batch = writeBatch(verifiedStudent.db);
        batch.update(userRef(verifiedStudent), {role:'admin'});
        batch.update(courseRef(verifiedStudent), {title:'Forbidden'});
        await assert.rejects(batch.commit(), denied);
        assert.equal((await getDocFromServer(userRef(verifiedStudent))).data().role, 'student');
      });
      await t.test('students cannot read, change, delete or impersonate another account', async () => {
        await assert.rejects(getDocFromServer(userRef(alice, bob.uid)), denied);
        await assert.rejects(getDocsFromServer(collection(alice.db, 'users')), denied);
        await assert.rejects(updateDoc(userRef(alice, bob.uid), {'dashboardState.scores':'Forbidden'}), denied);
        await assert.rejects(deleteDoc(userRef(alice, bob.uid)), denied);
        const absent = client('not-created');
        await assert.rejects(setDoc(userRef(alice, absent.uid), {email:alice.email, role:'student'}), denied);
      });
      await t.test('verified owner can bootstrap and grant or remove administrator roles', async () => {
        await updateDoc(userRef(owner), {role:'superAdmin'});
        assert.equal((await getDocFromServer(userRef(owner, alice.uid))).data().role, 'student');
        const fresh = client('verified-new-owner', {email:ownerEmail, verified:true});
        await setDoc(userRef(fresh), {email:fresh.email, role:'superAdmin', name:'Fictional owner'});
        await updateDoc(userRef(owner, bob.uid), {role:'admin'});
        await updateDoc(userRef(owner, bob.uid), {role:'student'});
        await updateDoc(courseRef(owner), {title:'Fictional owner course'});
      });
      await t.test('an unverified delegated administrator cannot write courses or grant access', async () => {
        assert.equal((await getDocFromServer(userRef(unverifiedAdmin))).data().role, 'admin');
        await assert.rejects(setDoc(courseRef(unverifiedAdmin), {title:'Forbidden'}), denied);
        await assert.rejects(updateDoc(courseRef(unverifiedAdmin), {title:'Forbidden'}), denied);
        await assert.rejects(deleteDoc(courseRef(unverifiedAdmin)), denied);
        await assert.rejects(getDocFromServer(userRef(unverifiedAdmin, alice.uid)), denied);
        await assert.rejects(updateDoc(userRef(unverifiedAdmin, alice.uid), {role:'admin'}), denied);
        await updateDoc(userRef(unverifiedAdmin), {name:'Fictional personal edit'});
      });
      await t.test('verified administrator manages courses without private student access or role grants', async () => {
        await deleteDoc(courseRef(admin));
        await setDoc(courseRef(admin), {title:'Fictional administrator course'});
        await updateDoc(courseRef(admin), {title:'Fictional updated course'});
        assert.equal((await getDocFromServer(courseRef(alice))).data().title, 'Fictional updated course');
        await assert.rejects(getDocFromServer(userRef(admin, bob.uid)), denied);
        await assert.rejects(getDocsFromServer(collection(admin.db, 'users')), denied);
        await assert.rejects(updateDoc(userRef(admin, bob.uid), {role:'admin'}), denied);
        await assert.rejects(deleteDoc(userRef(admin, bob.uid)), denied);
        await assert.rejects(updateDoc(userRef(admin), {role:'superAdmin'}), denied);
      });
      await t.test('revoking a stored administrator role immediately denies later course writes', async () => {
        await updateDoc(userRef(owner, admin.uid), {role:'student'});
        await assert.rejects(updateDoc(courseRef(admin), {title:'Forbidden after revocation'}), denied);
        assert.equal((await getDocFromServer(userRef(admin))).data().role, 'student');
      });
      await t.test('unauthenticated clients cannot read or write profiles or courses', async () => {
        await assert.rejects(getDocFromServer(userRef(anonymous, alice.uid)), denied);
        await assert.rejects(getDocFromServer(courseRef(anonymous)), denied);
        await assert.rejects(setDoc(userRef(anonymous), {email:anonymous.email, role:'student'}), denied);
        await assert.rejects(setDoc(courseRef(anonymous), {title:'Forbidden'}), denied);
      });
    } finally {
      try {
        for (const {app, db} of clients) { await terminate(db); await deleteApp(app); }
      } finally {
        // Restore the intended local Community candidate even if the deployable-rules tests fail.
        await loadRules(candidate);
      }
    }
  });
}
