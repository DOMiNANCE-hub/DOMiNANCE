import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToString} from 'react-dom/server';

test('account interfaces render without Firebase calls',async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{
  const {AuthGate,AccountBar,Onboarding}=await server.ssrLoadModule('/src/DominanceApp.jsx');
  const onboarding=renderToString(React.createElement(Onboarding,{profile:{name:'Fictional Student',year:'HB 1',semester:'First',courses:['Cell Structure']},save:()=>{throw Error('No calls during render')}}));assert.doesNotMatch(onboarding,/Your courses|type="checkbox"/);assert.match(onboarding,/Semester|semester/);
  const signIn=renderToString(React.createElement(AuthGate));
  assert.match(signIn,/Forgot password/);assert.match(signIn,/Continue with Google/);assert.match(signIn,/Sign in/);assert.match(signIn,/DOMiNANCE/);assert.doesNotMatch(signIn,/caduceus|dom-auth-mark/);
  const account=renderToString(React.createElement(AccountBar,{user:{uid:'mock-only',email:'student@example.invalid'},profile:{name:'Test student',year:'HB 2',semester:'Annual',courses:[]},logout:()=>{throw new Error('must not execute during render')}}));
  assert.match(account,/Open account menu for Test student/);assert.match(account,/My Profile/);assert.match(account,/Preferences/);assert.match(account,/Account &amp; Security/);assert.match(account,/Sign out/);assert.doesNotMatch(account,/Reset your password/);assert.match(account,/student@example.invalid/);assert.match(account,/aria-labelledby="account-heading"/);
 }finally{await server.close()}
});
