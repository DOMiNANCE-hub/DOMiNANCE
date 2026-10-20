import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,createUserWithEmailAndPassword,signOut,signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,getDocFromServer,deleteDoc,updateDoc,getDocsFromServer,collection,query,where,limit,serverTimestamp,terminate,writeBatch} from 'firebase/firestore';
import {createCommunityService,updateProfileWithCommunity,updateAvatarWithCommunity} from '../src/community-service.js';

test('isolated unified identity, opt-in, migration and classmates security',async t=>{
 const rules=readFileSync('firestore.community.emulator.rules','utf8');
 const response=await fetch('http://127.0.0.1:8080/emulator/v1/projects/demo-dominance:securityRules',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({rules:{files:[{name:'firestore.rules',content:rules}]}})});
 assert.equal(response.ok,true,await response.text());
 const clients=[],services=[];let serial=0;
 const password='Fictional-community-123!';
 async function student(name,year='HB 1'){
  const app=initializeApp({apiKey:'demo-only-key',projectId:'demo-dominance',appId:'demo-only-app'},'community-'+Date.now()+'-'+serial++),auth=getAuth(app),db=getFirestore(app);
  connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});connectFirestoreEmulator(db,'127.0.0.1',8080);clients.push({app,db});
  const user=(await createUserWithEmailAndPassword(auth,'community-'+Date.now()+'-'+serial+'@example.invalid',password)).user;
  await setDoc(doc(db,'users',user.uid),{name,email:user.email,role:'student',year,semester:'First',courses:[],dashboardState:{avatar:'coils',scores:'private-learning-record'}});
  const service=createCommunityService({auth,db,uid:user.uid,enabled:true});services.push(service);return{auth,db,user,service};
 }
 const save=(student,changes={},community)=>updateProfileWithCommunity({...student,uid:student.user.uid,changes,community});
 const readPrivate=async student=>(await getDocFromServer(doc(student.db,'users',student.user.uid))).data();
 const readShared=async student=>getDocFromServer(doc(student.db,'communityProfiles',student.user.uid));
 const denied=error=>error.code==='permission-denied';
 async function allClassmates(service){
  const people=[];let cursor=null;
  for(let pageNumber=0;pageNumber<100;pageNumber++){
   const page=await service.classmates('KNUST-SMS-HB1',cursor);people.push(...page.people);
   if(!page.more)return people;cursor=page.cursor;
  }
  throw Error('Local fictional directory exceeded the test pagination bound');
 }
 try{
  const alice=await student('Fictional Alice'),bob=await student('Fictional Bob');let joined;
  await t.test('one Save stores a private bio and requires explicit sharing consent',async()=>{
   assert.equal((await alice.service.own()).mine,null);
   await save(alice,{}, {bio:'Microscopy',visible:false});
   assert.equal((await readPrivate(alice)).profileBio,'Microscopy');assert.equal((await readShared(alice)).exists(),false);
   await assert.rejects(alice.service.setVisibility(true,false),/visible/);
   await alice.service.setVisibility(true,true);
   const shared=await readShared(alice);joined=shared.data().joinedAt.toMillis();
   assert.deepEqual(Object.keys(shared.data()).sort(),['avatar','bio','cohort','identityVersion','joinedAt','name','updatedAt']);
   assert.equal(shared.data().name,'Fictional Alice');assert.equal(shared.data().avatar,'coils');assert.equal(shared.data().bio,'Microscopy');
  });
  await t.test('saved name, bio and avatar update one public identity atomically',async()=>{
   await save(alice,{name:'Fictional Alice Updated',username:'Fictional Alice Updated'},{bio:'Cell biology',visible:true,consent:true});
   await updateAvatarWithCommunity({...alice,uid:alice.user.uid,avatar:'glasses'});
   const shared=(await readShared(alice)).data(),privateProfile=await readPrivate(alice);
   assert.equal(shared.name,privateProfile.username);assert.equal(shared.bio,privateProfile.profileBio);assert.equal(shared.avatar,privateProfile.dashboardState.avatar);assert.equal(shared.joinedAt.toMillis(),joined);
   assert.equal(privateProfile.dashboardState.scores,'private-learning-record');
   // Even a bypassed UI cannot poison the directory with mismatched or invalid plain text.
   for(const patch of [{profileBio:'bad\nbio'},{profileBio:'x'.repeat(161)},{name:'bad\nname',username:'bad\nname'}]){
    const batch=writeBatch(alice.db);batch.update(doc(alice.db,'users',alice.user.uid),patch);
    batch.update(doc(alice.db,'communityProfiles',alice.user.uid),{...(patch.profileBio?{bio:patch.profileBio}:{name:patch.name}),updatedAt:serverTimestamp()});
    await assert.rejects(batch.commit(),denied);
   }
   // Ordinary learning/preferences writes remain independent of the identity transaction.
   await updateDoc(doc(alice.db,'users',alice.user.uid),{'dashboardState.theme':'aurora'});
   await assert.rejects(updateAvatarWithCommunity({...alice,uid:alice.user.uid,avatar:'blob:temporary'}),/saved avatar/);
   for(const patch of [{username:'Independent name'},{profileBio:'Independent bio'},{communityVisible:false},{'dashboardState.avatar':'waves'}])await assert.rejects(updateDoc(doc(alice.db,'users',alice.user.uid),patch),denied);
   for(const patch of [{name:'Independent public name'},{bio:'Independent public bio'},{avatar:'waves'},{avatar:'https://example.invalid/private.jpg'},{email:'private@example.invalid'},{dashboardState:{scores:'private'}},{cohort:'HB2'}])await assert.rejects(updateDoc(doc(alice.db,'communityProfiles',alice.user.uid),{...patch,updatedAt:serverTimestamp()}),denied);
  });
  await t.test('classmates, pagination and cross-account reads/writes remain constrained',async()=>{
   await bob.service.setVisibility(true,true);
   const peers=await allClassmates(bob.service);
   assert.ok(peers.some(p=>p.id===alice.user.uid&&p.name==='Fictional Alice Updated'&&p.avatar==='glasses'));
   assert.ok(peers.every(p=>!('email'in p)&&!('dashboardState'in p)));
   await assert.rejects(getDocFromServer(doc(bob.db,'users',alice.user.uid)),denied);
   await assert.rejects(setDoc(doc(bob.db,'communityProfiles',alice.user.uid),{name:'Forged'}),denied);
   await assert.rejects(deleteDoc(doc(bob.db,'communityProfiles',alice.user.uid)),denied);
   await assert.rejects(getDocsFromServer(query(collection(bob.db,'communityProfiles'),limit(8))),denied);
   await assert.rejects(getDocsFromServer(query(collection(bob.db,'communityProfiles'),where('cohort','==','KNUST-SMS-HB1'),limit(50))),denied);
   for(let i=0;i<8;i++){const peer=await student('Fictional Classmate '+i);await peer.service.setVisibility(true,true)}
   const page=await alice.service.classmates('KNUST-SMS-HB1'),next=await alice.service.classmates('KNUST-SMS-HB1',page.cursor);
   assert.equal(page.more,true);assert.equal(next.people.some(p=>page.people.some(old=>old.id===p.id)),false);assert.ok(page.people.length+next.people.length>=9);
  });
  await t.test('withdrawing retains the private profile and later edits do not republish it',async()=>{
   await alice.service.withdraw();assert.equal((await readShared(alice)).exists(),false);
   const profile=await readPrivate(alice);assert.equal(profile.profileBio,'Cell biology');assert.equal(profile.dashboardState.scores,'private-learning-record');
   await save(alice,{name:'Fictional Hidden Alice',username:'Fictional Hidden Alice'});
   await updateAvatarWithCommunity({...alice,uid:alice.user.uid,avatar:'waves'});
   assert.equal((await readShared(alice)).exists(),false);
   assert.equal((await allClassmates(bob.service)).some(p=>p.id===alice.user.uid),false);
  });
  await t.test('level changes withdraw the card and higher-year discovery stays unavailable',async()=>{
   await alice.service.setVisibility(true,true);
   // Normalizing the legacy spelling of HB1 must not hide an unchanged cohort.
   await save(alice,{year:'HB1'});assert.equal((await readShared(alice)).exists(),true);
   await save(alice,{year:'HB 1'});assert.equal((await readShared(alice)).exists(),true);
   await assert.rejects(updateDoc(doc(alice.db,'users',alice.user.uid),{year:'HB 2'}),denied);
   await save(alice,{year:'HB 2',semester:'Annual'});
   assert.equal((await readShared(alice)).exists(),false);assert.equal((await readPrivate(alice)).communityVisible,false);
   await assert.rejects(getDocFromServer(doc(alice.db,'communityProfiles',bob.user.uid)),denied);
   await assert.rejects(alice.service.classmates('KNUST-SMS-HB1'),denied);
   await assert.rejects(alice.service.setVisibility(true,true),/HB1/);
  });
  await t.test('earlier independent directory identities require review and retain a private backup',async()=>{
   const legacy=await student('Fictional Canonical Name');
   // Admin bypass is only an emulator fixture at this fixed loopback demo endpoint.
   const fixture=await fetch('http://127.0.0.1:8080/v1/projects/demo-dominance/databases/(default)/documents/communityProfiles/'+legacy.user.uid,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:'Bearer owner'},body:JSON.stringify({fields:{name:{stringValue:'Fictional Earlier Alias'},bio:{stringValue:'Earlier bio'},cohort:{stringValue:'KNUST-SMS-HB1'},joinedAt:{timestampValue:'2026-10-18T10:00:00Z'},updatedAt:{timestampValue:'2026-10-18T10:00:00Z'}}})});
   assert.equal(fixture.ok,true,await fixture.text());
   const earlier=await legacy.service.own();assert.equal(earlier.needsReview,true);assert.equal(earlier.visible,false);assert.equal(earlier.bio,'Earlier bio');
   await updateAvatarWithCommunity({...legacy,uid:legacy.user.uid,avatar:'crop'});
   assert.equal((await readShared(legacy)).exists(),false);
   const privateProfile=await readPrivate(legacy);assert.deepEqual(privateProfile.legacyCommunityProfile,{name:'Fictional Earlier Alias',bio:'Earlier bio'});
   assert.equal((await legacy.service.own()).needsReview,true);
   await save(legacy,{}, {bio:'Earlier bio',visible:false});assert.equal((await legacy.service.own()).needsReview,false);
   await legacy.service.setVisibility(true,true);
   const shared=(await readShared(legacy)).data();assert.equal(shared.name,'Fictional Canonical Name');assert.equal(shared.bio,'Earlier bio');assert.equal(shared.avatar,'crop');assert.equal(shared.identityVersion,2);
   assert.deepEqual((await readPrivate(legacy)).legacyCommunityProfile,privateProfile.legacyCommunityProfile);
  });
  await t.test('sign-out/sign-in reloads the same identity and stale clients cannot affect another account',async()=>{
   const email=bob.user.email;await signOut(bob.auth);
   await assert.rejects(bob.service.own(),/account changed/);await assert.rejects(bob.service.withdraw(),/account changed/);
   await assert.rejects(getDocFromServer(doc(bob.db,'communityProfiles',bob.user.uid)),denied);
   await signInWithEmailAndPassword(bob.auth,email,password);
   const reloaded=await bob.service.own();assert.equal(reloaded.visible,true);assert.equal(reloaded.mine.name,'Fictional Bob');assert.equal(reloaded.mine.avatar,'coils');
   const before=(await readShared(bob)).data();
   await assert.rejects(updateProfileWithCommunity({auth:bob.auth,db:bob.db,uid:alice.user.uid,changes:{name:'Forged'}}),/account changed/);
   assert.equal((await readShared(bob)).data().name,before.name);
  });
 }finally{services.forEach(s=>s.dispose());for(const {app,db}of clients){await terminate(db);await deleteApp(app)}}
});
