import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID, randomBytes} from 'node:crypto';
import {initializeApp, deleteApp} from 'firebase/app';
import {getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth';

test('local Auth registers fictional users, rejects wrong passwords and restores the correct account', async () => {
  const app = initializeApp({apiKey:'demo-only-key', projectId:'demo-dominance', appId:'demo-only-app'}, 'auth-check-' + randomUUID());
  const auth = getAuth(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', {disableWarnings:true});
  const suffix = randomUUID(), password = randomBytes(24).toString('base64url') + 'Aa1!';
  const aliceEmail = `auth-check-alice-${suffix}@example.invalid`;
  try {
    const alice = (await createUserWithEmailAndPassword(auth, aliceEmail, password)).user;
    await updateProfile(alice, {displayName:'Fictional Auth Alice'});
    assert.equal(auth.currentUser.uid, alice.uid);
    await signOut(auth);
    assert.equal(auth.currentUser, null);
    await assert.rejects(signInWithEmailAndPassword(auth, aliceEmail, 'incorrect-fictional-password'),
      error => ['auth/invalid-credential', 'auth/wrong-password'].includes(error.code));
    const bob = (await createUserWithEmailAndPassword(auth, `auth-check-bob-${suffix}@example.invalid`, password)).user;
    assert.notEqual(bob.uid, alice.uid);
    assert.equal(bob.displayName, null);
    await signOut(auth);
    const restored = (await signInWithEmailAndPassword(auth, aliceEmail, password)).user;
    assert.equal(restored.uid, alice.uid);
    assert.equal(restored.displayName, 'Fictional Auth Alice');
    await signOut(auth);
    assert.equal(auth.currentUser, null);
  } finally { await deleteApp(app); }
});
