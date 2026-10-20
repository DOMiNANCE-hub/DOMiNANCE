import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from '../scripts/import-biological-chemistry.mjs';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/biological-catalog.js';
import '../public/dashboard/biological-learning.js';
import '../public/dashboard/biological-state.js';
import {academicHarness} from './support/biological-harness.js';
test('Antigravity compatibility adapter preserves strict per-course reading validation with native course models',()=>{
 const location=globalThis.DominanceCellLearning.location,data=compile();
 academicHarness({create:globalThis.DominanceCellStructure.create,data,model:globalThis.DominanceBiologicalState,learning:globalThis.DominanceBiologicalLearning});
 assert.equal(globalThis.DominanceCellLearning.location,location);
 const foreign={version:1,lessons:{},attempts:[],draft:null,reading:{U01:{section:'BC0101',part:0,offset:0,updatedAt:'2026-10-20T01:00:00Z'}}};
 assert.doesNotThrow(()=>globalThis.DominanceBiologicalState.state(foreign,data));
 assert.throws(()=>globalThis.DominanceCellState.state(foreign,{lessons:[],questions:[]}));
});
