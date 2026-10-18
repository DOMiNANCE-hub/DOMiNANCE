import test from 'node:test';
import assert from 'node:assert/strict';
import {communityCohort,communityDraft,communityView,communityInitials,profileBio,publicIdentity} from '../src/community-model.js';
import {createCommunityService,updateProfileWithCommunity,updateAvatarWithCommunity} from '../src/community-service.js';

test('Community projects the same saved identity without private account fields',()=>{
 const profile={name:'Private fallback',username:'Fictional Ama',profileBio:'Anatomy enthusiast',year:'HB 1',dashboardState:{avatar:'coils',scores:'private'},email:'private@example.invalid',role:'admin'};
 const identity=publicIdentity(profile);
 assert.deepEqual(identity,{name:'Fictional Ama',bio:'Anatomy enthusiast',avatar:'coils',cohort:'KNUST-SMS-HB1',identityVersion:2});
 assert.deepEqual(communityView('alice',{...identity,email:profile.email,dashboardState:profile.dashboardState}),{id:'alice',...identity});
 assert.equal(communityInitials(identity.name),'FA');
 assert.equal(communityCohort({year:'HB1'}),'KNUST-SMS-HB1');
 assert.equal(communityCohort({year:'HB2'}),null);
 assert.equal(communityCohort({}),null);
});
test('legacy cards remain readable while external URLs and temporary photos cannot become shared avatars',()=>{
 assert.deepEqual(communityView('old',{name:'Earlier name',bio:'Earlier bio',cohort:'KNUST-SMS-HB1'}),{id:'old',name:'Earlier name',bio:'Earlier bio',avatar:'initials',cohort:'KNUST-SMS-HB1',identityVersion:1});
 for(const avatar of ['blob:local-only','https://example.invalid/photo.jpg',null,{},'unknown'])assert.equal(publicIdentity({name:'A',year:'HB1',dashboardState:{avatar},photo:'blob:private'}).avatar,'initials');
});
test('profile bio and shared name validation match the private profile limits',()=>{
 for(const value of [{name:''},{name:'x'.repeat(61)},{name:'Valid',bio:'x'.repeat(161)},{name:'Bad\nname'}])assert.throws(()=>communityDraft(value));
 assert.throws(()=>communityView('id',{name:'Valid',cohort:'HB2'}));
 assert.throws(()=>profileBio('bad\ttext'));
 assert.equal(communityDraft({name:'A'}).name,'A');
 assert.equal(profileBio('  <script>plain text</script>  '),'<script>plain text</script>');
});
test('Community refuses production, missing identity, account changes and disposed clients before SDK requests',async()=>{
 const auth={currentUser:{uid:'alice'},app:{options:{projectId:'demo-dominance'}}},db={app:{options:{projectId:'demo-dominance'}}};
 const disabled=createCommunityService({auth,db,uid:'alice',enabled:false});
 await assert.rejects(disabled.own(),/isolated local/);
 await assert.rejects(disabled.setVisibility(true,true),/isolated local/);
 const liveDb={app:{options:{projectId:'dominance-d310e'}}};
 const production=createCommunityService({auth,db:liveDb,uid:'alice',enabled:true});
 await assert.rejects(production.classmates('KNUST-SMS-HB1'),/isolated local/);
 await assert.rejects(updateProfileWithCommunity({auth,db:liveDb,uid:'alice',changes:{name:'A'}}),/isolated local/);
 await assert.rejects(updateAvatarWithCommunity({auth,db:liveDb,uid:'alice',avatar:'coils'}),/isolated local/);
 const client=createCommunityService({auth,db,uid:'alice',enabled:true});
 await assert.rejects(client.setVisibility(true,false),/visible/);
 await assert.rejects(client.setVisibility('true'),/visibility/);
 await assert.rejects(updateAvatarWithCommunity({auth,db,uid:'alice',avatar:'blob:temporary'}),/saved avatar/);
 auth.currentUser={uid:'bob'};
 await assert.rejects(client.own(),/account changed/);
 await assert.rejects(client.withdraw(),/account changed/);
 auth.currentUser={uid:'alice'};client.dispose();
 await assert.rejects(client.own(),/account changed/);
});
