import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,updateDoc,getDocFromServer,runTransaction,terminate} from 'firebase/firestore';
import {studentAccountProfile} from '../src/account-session.js';
import {createDashboardStorage,mergeCellHistory} from '../src/dashboard-session.js';
import {compile} from '../scripts/import-cell-structure.mjs';
test('Cell instructional preview preserves old/new history through authenticated transactions and account switches',async()=>{
 const clients=[],suffix=Date.now(),password='Fictional-cell-review-123!',data=compile({includeReview:true});
 const make=name=>{const app=initializeApp({apiKey:'demo-only-key',projectId:'demo-dominance',appId:'demo-only-app'},name+'-'+suffix),auth=getAuth(app),db=getFirestore(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);clients.push({app,db});return{auth,db}};
 const alice=make('cell-review-alice'),bob=make('cell-review-bob');let storage;
 try{
  const email='cell-review-alice-'+suffix+'@example.invalid',user=(await createUserWithEmailAndPassword(alice.auth,email,password)).user;
  const old={version:1,lessons:{CO01:'2026-10-20T12:00:00Z'},draft:null,attempts:[{id:'original',completedAt:'2026-10-20T12:00:00Z',answers:[{question:'CO-Q001',option:3}]}]};
  await setDoc(doc(alice.db,'users',user.uid),{...studentAccountProfile(user,{name:'Fictional Cell Alice',year:'HB 1',semester:'First',courses:[]}),dashboardState:{cellStructure:JSON.stringify(old)}});
  storage=createDashboardStorage({auth:alice.auth,uid:user.uid,initial:{cellStructure:JSON.stringify(old)},write:(uid,key,value)=>runTransaction(alice.db,async tx=>{const ref=doc(alice.db,'users',uid),snapshot=await tx.get(ref),merged=mergeCellHistory(snapshot.data().dashboardState[key],value);tx.update(ref,{['dashboardState.'+key]:merged});return merged})});
  const next={...old,draft:{format:2,id:'new-cell-review',questions:data.questions.map(q=>q.id),index:1,responses:{'CELL-RQ001':0},phase:'answer'},reading:{microscopy:{section:'lesson_06',part:1,offset:.3,updatedAt:'2026-10-20T12:00:00Z'}}};
  assert.equal(storage.setItem('cellStructure',JSON.stringify(next)),true);await storage.retry();assert.equal(storage.pending,0);
  const other=(await createUserWithEmailAndPassword(bob.auth,'cell-review-bob-'+suffix+'@example.invalid',password)).user;
  await setDoc(doc(bob.db,'users',other.uid),studentAccountProfile(other,{name:'Fictional Cell Bob',year:'HB 1',semester:'First',courses:[]}));
  await assert.rejects(getDocFromServer(doc(bob.db,'users',user.uid)),e=>e.code==='permission-denied');await assert.rejects(updateDoc(doc(bob.db,'users',user.uid),{'dashboardState.cellStructure':JSON.stringify(next)}),e=>e.code==='permission-denied');
  await signOut(alice.auth);assert.equal(storage.getItem('cellStructure'),null);assert.equal(storage.setItem('cellStructure',JSON.stringify(old)),false);await signInWithEmailAndPassword(alice.auth,email,password);
  const restored=globalThis.DominanceCellState.state((await getDocFromServer(doc(alice.db,'users',user.uid))).data().dashboardState.cellStructure,data);assert.equal(restored.draft.responses['CELL-RQ001'],0);assert.equal(restored.attempts[0].id,'original');assert.equal(restored.reading.microscopy.part,1);
  const completed={...restored,draft:null,attempts:[...restored.attempts,{id:'new-cell-review',completedAt:'2026-10-20T12:00:00Z',answers:data.questions.map(q=>({question:q.id,option:q.id==='CELL-RQ001'?0:null}))}]};assert.equal(storage.setItem('cellStructure',JSON.stringify(completed)),true);await storage.retry();assert.equal(JSON.parse(storage.getConfirmedItem('cellStructure')).attempts.length,2);
 }finally{storage?.dispose();for(const {app,db} of clients){await terminate(db);await deleteApp(app)}}
});
