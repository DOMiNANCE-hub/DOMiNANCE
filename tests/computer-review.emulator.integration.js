import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,updateDoc,getDocFromServer,runTransaction,terminate} from 'firebase/firestore';
import {studentAccountProfile} from '../src/account-session.js';
import {createDashboardStorage,mergeComputerHistory} from '../src/dashboard-session.js';
import {compileComputer} from '../scripts/import-computer-appreciation.mjs';

test('local review preserves old/new Computer activity and Cell state across real account switches',async()=>{
 const clients=[],suffix=Date.now(),password='Fictional-review-123!',data=compileComputer({includeReview:true});
 const make=name=>{const app=initializeApp({apiKey:'demo-only-key',projectId:'demo-dominance',appId:'demo-only-app'},name+'-'+suffix),auth=getAuth(app),db=getFirestore(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);clients.push({app,db});return {auth,db}};
 const alice=make('review-alice'),bob=make('review-bob');let storage;
 try{
  const email='review-alice-'+suffix+'@example.invalid',user=(await createUserWithEmailAndPassword(alice.auth,email,password)).user;
  const cell=JSON.stringify({version:1,lessons:{CO01:'2026-10-19T12:00:00Z'},attempts:[],draft:null});
  const old={version:1,lessons:{CA01:'2026-10-19T12:00:00Z'},attempts:[{id:'old-confirmed',completedAt:'2026-10-19T12:00:00Z',answers:[{question:'CA-Q001',option:0}]}],draft:null};
  await setDoc(doc(alice.db,'users',user.uid),{...studentAccountProfile(user,{name:'Fictional Review Alice',year:'HB 1',semester:'First',courses:[]}),dashboardState:{computerAppreciation:JSON.stringify(old),cellStructure:cell}});
  storage=createDashboardStorage({auth:alice.auth,uid:user.uid,initial:{computerAppreciation:JSON.stringify(old),cellStructure:cell},write:(uid,key,value)=>runTransaction(alice.db,async tx=>{const ref=doc(alice.db,'users',uid),snapshot=await tx.get(ref),merged=mergeComputerHistory(snapshot.data().dashboardState[key],value);tx.update(ref,{['dashboardState.'+key]:merged});return merged})});
  const next={...old,lessons:{...old.lessons,CA13:'2026-10-20T12:00:00Z'},reading:{'spreadsheet-foundations':{section:'CA13',part:1,offset:.2,updatedAt:'2026-10-20T12:00:00Z'}},draft:{format:2,id:'review-draft',questions:['CA-Q073','CA-Q097'],index:1,responses:{'CA-Q073':0},phase:'answer'}};
  assert.equal(storage.setItem('computerAppreciation',JSON.stringify(next)),true);await storage.retry();assert.equal(storage.pending,0);
  const saved=(await getDocFromServer(doc(alice.db,'users',user.uid))).data().dashboardState;
  assert.equal(saved.cellStructure,cell);assert.equal(globalThis.DominanceComputerState.state(saved.computerAppreciation,data).reading['spreadsheet-foundations'].section,'CA13');
  const other=(await createUserWithEmailAndPassword(bob.auth,'review-bob-'+suffix+'@example.invalid',password)).user;
  await setDoc(doc(bob.db,'users',other.uid),studentAccountProfile(other,{name:'Fictional Review Bob',year:'HB 1',semester:'First',courses:[]}));
  await assert.rejects(getDocFromServer(doc(bob.db,'users',user.uid)),e=>e.code==='permission-denied');
  await assert.rejects(updateDoc(doc(bob.db,'users',user.uid),{'dashboardState.computerAppreciation':JSON.stringify(next)}),e=>e.code==='permission-denied');
  assert.equal((await getDocFromServer(doc(bob.db,'users',other.uid))).data().dashboardState?.computerAppreciation,undefined);
  await signOut(alice.auth);assert.equal(storage.getItem('computerAppreciation'),null);assert.equal(storage.setItem('computerAppreciation',JSON.stringify(old)),false);
  await signInWithEmailAndPassword(alice.auth,email,password);
  const restored=(await getDocFromServer(doc(alice.db,'users',user.uid))).data().dashboardState;
  const review=globalThis.DominanceComputerState.state(restored.computerAppreciation,data);
  assert.equal(review.attempts[0].id,'old-confirmed');assert.equal(review.draft.responses['CA-Q073'],0);assert.equal(review.reading['spreadsheet-foundations'].part,1);assert.equal(restored.cellStructure,cell);
  const completed={...review,draft:null,attempts:[...review.attempts,{id:'review-draft',completedAt:'2026-10-20T12:00:00Z',answers:[{question:'CA-Q073',option:0},{question:'CA-Q097',option:null}]}]};
  assert.equal(storage.setItem('computerAppreciation',JSON.stringify(completed)),true);await storage.retry();
  assert.equal(globalThis.DominanceComputerState.state(storage.getConfirmedItem('computerAppreciation'),data).attempts.length,2);
 }finally{storage?.dispose();for(const {app,db} of clients){await terminate(db);await deleteApp(app)}}
});
