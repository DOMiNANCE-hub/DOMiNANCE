import test from 'node:test';
import assert from 'node:assert/strict';
import {createModuleLoader} from '../src/deferred-module.js';
test('deferred code shares one import and returns only the requested component',async()=>{let imports=0;const Panel=()=>null,load=createModuleLoader(async()=>{imports++;return{Panel}},'Panel');const first=load(),second=load();assert.equal(first,second);assert.equal(await first,Panel);assert.equal(await load(),Panel);assert.equal(imports,1)});
test('failed deferred requests can retry without caching errors',async()=>{let imports=0;const Panel=()=>null,load=createModuleLoader(async()=>{if(++imports===1)throw Error('offline');return{Panel}},'Panel');await assert.rejects(load(),/offline/);assert.equal(await load(),Panel);assert.equal(imports,2)});
test('invalid deferred exports fail clearly and allow a corrected retry',async()=>{let imports=0;const load=createModuleLoader(async()=>++imports===1?{}:{Panel:()=>null},'Panel');await assert.rejects(load(),/Unavailable component/);assert.equal(typeof await load(),'function')});
