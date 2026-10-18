import test from 'node:test';
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail,signOut,onAuthStateChanged} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,setDoc,updateDoc,getDoc,doc,onSnapshot,terminate,runTransaction} from 'firebase/firestore';
import '../public/dashboard/curriculum.js';
import {profileChanges,saveAcademicProfile} from '../src/profile-edit.js';
import {createDashboardStorage,mergeDemoHistory,mergeCellHistory} from '../src/dashboard-session.js';
import {observeAccount} from '../src/account-session.js';
const project='demo-dominance';
const config={apiKey:'demo-only-key',projectId:project,appId:'demo-only-app'};
const clients=[];
function client(name){const app=initializeApp(config,name),auth=getAuth(app),db=getFirestore(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);clients.push({app,db});return{auth,db}}
const waitFor=async(check)=>{const until=Date.now()+10000;while(Date.now()<until){if(check())return;await new Promise(resolve=>setTimeout(resolve,25))}throw new Error('Expected emulator account state was not reached')};
test('real local Auth/Firestore integration and profile isolation',async()=>{
 const {auth,db}=client('isolated-account-test');const suffix=Date.now();const password='Fictional-test-123!';let state;
 const stop=observeAccount({subscribeAuth:(next,fail)=>onAuthStateChanged(auth,next,fail),subscribeProfile:(uid,next,fail)=>onSnapshot(doc(db,'users',uid),snapshot=>next(snapshot.exists()?snapshot.data():null),fail),publish:next=>{state=next}});
 try{
  const aliceEmail='alice-'+suffix+'@example.invalid',bobEmail='bob-'+suffix+'@example.invalid';
  const alice=(await createUserWithEmailAndPassword(auth,aliceEmail,password)).user;
  await waitFor(()=>state?.user?.uid===alice.uid&&!state.loading);assert.equal(state.profile,null);
  await setDoc(doc(db,'users',alice.uid),{name:'Fictional Alice',email:aliceEmail,role:'student',year:'HB 1',semester:'First',courses:['Cell Structure']});
  await waitFor(()=>state?.profile?.name==='Fictional Alice');assert.equal(state.profile.id,alice.uid);
  await saveAcademicProfile({auth,uid:alice.uid,changes:profileChanges({name:'Fictional Alice Edited',year:'HB1',semester:'Second'},state.profile,globalThis.DominanceCurriculum),write:(uid,data)=>updateDoc(doc(db,'users',uid),data)});
  await waitFor(()=>state?.profile?.name==='Fictional Alice Edited');assert.equal(state.profile.semester,'Second');assert.deepEqual(state.profile.courses,[]);assert.equal(state.profile.role,'student');
  const storage=createDashboardStorage({auth,uid:alice.uid,initial:state.profile.dashboardState,write:(uid,key,value)=>updateDoc(doc(db,'users',uid),{['dashboardState.'+key]:value})});
  storage.setItem('scores',JSON.stringify([{id:'owned-demo',course:'Demo',correct:1,total:3,demo:true}]));await storage.retry();assert.equal(storage.pending,0);
  assert.ok((await getDoc(doc(db,'users',alice.uid))).data().dashboardState.scores.includes('owned-demo'));
  await Promise.all(['concurrent-one','concurrent-two'].map(id=>runTransaction(db,async transaction=>{const ref=doc(db,'users',alice.uid),snapshot=await transaction.get(ref);transaction.update(ref,{'dashboardState.scores':mergeDemoHistory(snapshot.data().dashboardState.scores,JSON.stringify([{id,course:'Demo',correct:1,total:3,demo:true}]))})})));
  const merged=JSON.parse((await getDoc(doc(db,'users',alice.uid))).data().dashboardState.scores);assert.equal(merged.length,3);
  storage.setItem('cellStructure',JSON.stringify({version:1,lessons:{CO01:'2026-10-14T12:00:00Z'},reading:{microscopy:{section:'lesson_08',offset:0.35,updatedAt:'2026-10-14T12:00:00Z'}},draft:{id:'emulator-draft',questions:['CO-Q001'],index:0,answers:[],selected:3,checked:false},attempts:[{id:'cell-completed',completedAt:'2026-10-14T12:00:00Z',answers:[{question:'CO-Q001',option:3}]}]}));await storage.retry();const cellSaved=(await getDoc(doc(db,'users',alice.uid))).data().dashboardState.cellStructure;assert.equal(JSON.parse(cellSaved).draft.selected,3);assert.equal(JSON.parse(cellSaved).reading.microscopy.section,'lesson_08');assert.equal(JSON.parse(mergeCellHistory(cellSaved,cellSaved)).attempts.length,1);
  const modern=JSON.parse(cellSaved);modern.reading.microscopy.part=1;modern.draft={format:2,id:'emulator-draft',questions:['CO-Q001','CO-Q002'],index:1,responses:{'CO-Q001':3},phase:'review'};modern.attempts.push({id:'skipped-completed',completedAt:'2026-10-15T12:00:00Z',answers:[{question:'CO-Q002',option:null}]});storage.setItem('cellStructure',JSON.stringify(modern));await storage.retry();assert.equal(storage.pending,0);const modernSaved=JSON.parse((await getDoc(doc(db,'users',alice.uid))).data().dashboardState.cellStructure);assert.equal(modernSaved.draft.phase,'review');assert.equal(modernSaved.draft.responses['CO-Q001'],3);assert.equal(modernSaved.attempts.at(-1).answers[0].option,null);
  storage.setItem('avatar','glasses');storage.setItem('theme','aurora');storage.setItem('mode','system');storage.setItem('intensity','vibrant');storage.setItem('motion','reduced');storage.setItem('dailyGoal',JSON.stringify({enabled:true,paused:false,type:'questions',target:10,timeZone:'Africa/Accra'}));await storage.retry();assert.equal(storage.pending,0);
  await sendPasswordResetEmail(auth,aliceEmail);
  const recovery=await fetch('http://127.0.0.1:9099/emulator/v1/projects/'+project+'/oobCodes').then(response=>response.json());assert.ok(recovery.oobCodes.some(code=>code.email===aliceEmail&&code.requestType==='PASSWORD_RESET'));
  await signOut(auth);await waitFor(()=>!state.user&&!state.profile&&!state.loading);
  await assert.rejects(signInWithEmailAndPassword(auth,aliceEmail,'wrong-fictional-password'));
  const bob=(await createUserWithEmailAndPassword(auth,bobEmail,password)).user;
  await waitFor(()=>state?.user?.uid===bob.uid&&!state.loading);assert.equal(state.profile,null);
  await setDoc(doc(db,'users',bob.uid),{name:'Fictional Bob',email:bobEmail,role:'student',year:'HB 2',semester:'Annual',courses:['Human Anatomy II']});
  await waitFor(()=>state?.profile?.name==='Fictional Bob');assert.equal(state.profile.id,bob.uid);
  // Separate client avoids confusing cached own documents with a server-authorized read.
  const other=client('isolation-reader');await signInWithEmailAndPassword(other.auth,bobEmail,password);
  await assert.rejects(getDoc(doc(other.db,'users',alice.uid)),error=>error.code==='permission-denied');
  await assert.rejects(setDoc(doc(other.db,'users',alice.uid),{name:'Forged'}),error=>error.code==='permission-denied');
  await assert.rejects(updateDoc(doc(other.db,'users',alice.uid),{'dashboardState.scores':'forged'}),error=>error.code==='permission-denied');
  assert.equal(storage.getItem('scores'),null);assert.equal(storage.setItem('scores','forged'),false);
  await assert.rejects(updateDoc(doc(other.db,'users',alice.uid),{'dashboardState.dailyGoal':'forged'}),error=>error.code==='permission-denied');
  await assert.rejects(updateDoc(doc(other.db,'users',alice.uid),{'dashboardState.avatar':'waves'}),error=>error.code==='permission-denied');
  await assert.rejects(getDoc(doc(other.db,'users',alice.uid)),error=>error.code==='permission-denied');await assert.rejects(updateDoc(doc(other.db,'users',alice.uid),{'dashboardState.cellStructure':'forged'}),error=>error.code==='permission-denied');assert.equal(storage.getItem('cellStructure'),null);
  const own=await getDoc(doc(other.db,'users',bob.uid));assert.equal(own.data().name,'Fictional Bob');
  const failure=await new Promise(resolve=>{const unsubscribe=onSnapshot(doc(other.db,'users',alice.uid),()=>resolve('unexpected success'),error=>{unsubscribe();resolve(error.code)})});assert.equal(failure,'permission-denied');
  await signOut(auth);await signInWithEmailAndPassword(auth,aliceEmail,password);await waitFor(()=>state?.profile?.name==='Fictional Alice Edited');assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).attempts[0].id,'cell-completed');assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).draft.id,'emulator-draft');assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).draft.index,1);assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).draft.responses['CO-Q001'],3);assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).reading.microscopy.part,1);assert.equal(JSON.parse(state.profile.dashboardState.cellStructure).reading.microscopy.offset,.35);assert.equal(state.profile.id,alice.uid);assert.equal(state.profile.semester,'Second');assert.ok(state.profile.dashboardState.scores.includes('owned-demo'));assert.equal(state.profile.dashboardState.avatar,'glasses');assert.equal(state.profile.dashboardState.theme,'aurora');assert.equal(state.profile.dashboardState.mode,'system');assert.equal(JSON.parse(state.profile.dashboardState.dailyGoal).target,10);storage.dispose();
 }finally{stop();for(const item of clients){await terminate(item.db);await deleteApp(item.app)}}
});
