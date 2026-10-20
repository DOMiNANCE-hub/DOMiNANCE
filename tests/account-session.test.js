import test from 'node:test';
import assert from 'node:assert/strict';
import {observeAccount,accountError,studentAccountProfile} from '../src/account-session.js';
test('new profiles are students and ignore supplied privilege, identity and sharing fields',()=>{
 const profile={name:'Fictional Student',year:'HB 1',semester:'First',courses:['Cell Structure'],role:'superAdmin',email:'forged@example.invalid',communityVisible:true,claims:{admin:true}};
 const result=studentAccountProfile({uid:'fictional-owner',email:'admin@example.invalid'},profile,'2026-10-19T00:00:00Z');
 assert.deepEqual(result,{name:'Fictional Student',username:'Fictional Student',year:'HB 1',semester:'First',courses:['Cell Structure'],email:'admin@example.invalid',role:'student',createdAt:'2026-10-19T00:00:00Z'});
 result.courses.push('Other');assert.deepEqual(profile.courses,['Cell Structure']);assert.equal(profile.role,'superAdmin');
});
test('profile creation needs an authenticated identity and sign-in email',()=>{
 for(const user of [null,{uid:'fictional'},{email:'fixture@example.invalid'}])assert.throws(()=>studentAccountProfile(user,{}),/Sign in/);
});
function setup(){const states=[],profiles=new Map(),timers=new Map();let authNext,authFail,authStops=0,profileStops=0,id=0;
 const stop=observeAccount({publish:s=>states.push(s),subscribeAuth:(next,fail)=>{authNext=next;authFail=fail;return()=>authStops++},subscribeProfile:(uid,next,fail)=>{profiles.set(uid,{next,fail});return()=>profileStops++},setTimer:cb=>{timers.set(++id,cb);return id},clearTimer:key=>timers.delete(key)});
 return{states,profiles,timers,stop,login:u=>authNext(u),fail:()=>authFail(),last:()=>states.at(-1),counts:()=>({authStops,profileStops})};}
test('signed out state clears loading and has no profile',()=>{const s=setup();assert.equal(s.last().loading,true);s.login(null);assert.deepEqual(s.last(),{user:null,profile:null,loading:false,error:''});assert.equal(s.timers.size,0);s.stop()});
test('switching accounts clears previous profile before the next fetch',()=>{const s=setup();s.login({uid:'a'});s.profiles.get('a').next({name:'Alice'});s.login({uid:'b'});assert.equal(s.last().profile,null);assert.equal(s.last().loading,true);assert.equal(s.last().user.uid,'b');s.profiles.get('a').next({name:'Stale Alice'});assert.equal(s.last().profile,null);s.profiles.get('b').next({id:'forged',name:'Bob'});assert.equal(s.last().profile.id,'b');s.stop()});
test('old failures cannot replace a new account',()=>{const s=setup();s.login({uid:'a'});s.login({uid:'b'});s.profiles.get('a').fail();assert.equal(s.last().error,'');assert.equal(s.last().user.uid,'b');s.stop()});
test('profile failure presents retry error without triggering onboarding',()=>{const s=setup();s.login({uid:'a'});s.profiles.get('a').fail();assert.equal(s.last().loading,false);assert.ok(s.last().error);assert.equal(s.last().profile,null);s.stop()});
test('missing profile is a valid onboarding state, not an error',()=>{const s=setup();s.login({uid:'a'});s.profiles.get('a').next(null);assert.equal(s.last().profile,null);assert.equal(s.last().error,'');assert.equal(s.last().loading,false);s.stop()});
test('timeouts are recoverable and a late valid profile clears them',()=>{const s=setup();s.login({uid:'a'});[...s.timers.values()][0]();assert.ok(s.last().error);assert.equal(s.last().profile,null);s.profiles.get('a').next({name:'Alice'});assert.equal(s.last().error,'');assert.equal(s.last().profile.name,'Alice');s.stop()});
test('sign out invalidates stale callbacks and unsubscribes',()=>{const s=setup();s.login({uid:'a'});s.login(null);s.profiles.get('a').next({name:'Alice'});assert.equal(s.last().user,null);assert.equal(s.counts().profileStops,1);s.stop();assert.equal(s.counts().authStops,1)});
test('cleanup prevents later events and clears pending timers',()=>{const s=setup();s.login({uid:'a'});s.stop();const n=s.states.length;s.profiles.get('a').next({name:'Alice'});s.login({uid:'b'});assert.equal(s.states.length,n);assert.equal(s.timers.size,0)});
test('auth failures clear identity; raw service messages are not exposed',()=>{const s=setup();s.login({uid:'a'});s.profiles.get('a').next({name:'Alice'});s.fail();assert.equal(s.last().user,null);assert.equal(s.last().profile,null);assert.ok(s.last().error);assert.equal(accountError({code:'auth/network-request-failed'}),'Connection failed. Check your internet and try again.');assert.doesNotMatch(accountError({message:'secret internal details'}),/secret/);s.stop()});
