import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {compile} from '../scripts/import-cell-structure.mjs';
import {cellReviewPlugin} from '../scripts/academic/cell-review-plugin.mjs';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import {mergeCellHistory} from '../src/dashboard-session.js';
import {academicHarness} from './support/cell-review-harness.js';
import {cellInstructionCoverage} from '../scripts/report-cell-instruction.mjs';
const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const original=compile(),review=compile({includeReview:true}),audit=read('content/cell-structure/review/lesson-audit.json');
test('instructional coverage separates delivered, retained and still-unverified work reproducibly',()=>{
 assert.deepEqual(cellInstructionCoverage(),read('docs/cell-instruction/coverage.json'));
});
test('all 46 original lessons and 170 source questions retain original bytes and stable assessment fields',()=>{
 assert.equal(audit.length,46);assert.equal(new Set(audit.map(row=>row.lesson)).size,46);
 for(const row of audit){const bytes=readFileSync(new URL('../content/cell-structure/lessons/'+row.lesson+'.md',import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),row.originalSha256)}
 const strip=({explanation,...q})=>q;assert.deepEqual(review.questions.slice(0,170).map(strip),original.questions.map(strip));
 assert.equal(audit.filter(row=>row.expansion).length,23);assert.equal(review.questions.length,178);
 assert.equal(review.questions.slice(0,170).filter((q,i)=>q.explanation!==original.questions[i].explanation).length,96);
});
test('one human uricase clarification retains the unique endpoint and organism qualifications',()=>{
 for(const data of [original,review]){const text=data.lessons.find(l=>l.id==='OR01').markdown;assert.equal((text.match(/Humans lack functional urate oxidase/gi)||[]).length,1);assert.match(text,/human purine catabolism generally ends with uric acid/);assert.match(text,/in organisms possessing the enzyme/)}
});
test('new study sections preserve earlier partitions and all 74 concept checks have explicit answers',()=>{
 const learning=globalThis.DominanceCellLearning;let checks=0;
 for(const lesson of review.lessons){
  const before=learning.sections(original.lessons.find(l=>l.id===lesson.id)),after=learning.sections(lesson);
  assert.deepEqual(after.slice(0,before.length).map(s=>s.title),before.map(s=>s.title),lesson.id);
  const parts=after.flatMap(s=>learning.parts(s.text));assert.equal(parts.some(p=>p.kind==='unresolved-check'),false,lesson.id);checks+=parts.filter(p=>p.kind==='check').length;
 }
 assert.equal(checks,74);
});
test('normal student bank excludes instructional additions and every new assessment stem',()=>{
 const source=readFileSync(new URL('../public/dashboard/cell-content.js',import.meta.url),'utf8'),context={};runInNewContext(source,context);
 assert.equal(context.DominanceCellContent.questions.length,170);assert.equal(context.DominanceCellContent.reviewOnly,undefined);
 for(const q of review.questions.slice(170))assert.equal(source.includes(q.question),false,q.id);
 assert.equal(source.includes('baseline is 1 cm above the ruler'),false);
});
test('local review middleware cannot be enabled in normal serve or build modes',()=>{
 for(const [mode,command] of [['production','build'],['development','serve'],['emulator','build']])assert.equal(cellReviewPlugin(mode,command),null);
 let handle;cellReviewPlugin('emulator','serve').configureServer({middlewares:{use:(path,callback)=>{assert.equal(path,'/dashboard/cell-content.js');handle=callback}}});
 const headers={};let body;handle({method:'GET'},{setHeader:(k,v)=>{headers[k]=v},end:s=>{body=s}},()=>assert.fail());const context={};runInNewContext(body,context);assert.equal(context.DominanceCellContent.reviewOnly,true);assert.equal(context.DominanceCellContent.questions.length,178);assert.equal(headers['Cache-Control'],'no-store');
});
test('new calculation and interpretation keys match independently recomputed examples',()=>{
 const answer=id=>{const q=review.questions.find(q=>q.id===id);return q.options[q.letter.charCodeAt(0)-65]};
 assert.equal(0.61*560/1.4,244);assert.equal(answer('CELL-RQ001'),'244 nm');assert.equal(Math.log10(100/10),1);assert.equal(answer('CELL-RQ007'),'1');assert.equal((3-1)/(6-1),.4);assert.equal(answer('CELL-RQ008'),'0.40');
 for(const q of review.questions.slice(170)){assert.ok(q.conceptId);assert.ok(q.objective);assert.ok(q.pages.every(p=>p>=1&&p<=410));assert.equal(q.reviewer,null);assert.match(q.reviewStatus,/awaiting-academic-review/)}
});
test('new review questions run through the existing submit flow and retain legacy history',()=>{
 const full={version:1,lessons:{},attempts:[],draft:{format:2,id:'full-review-pool',questions:review.questions.map(q=>q.id),index:0,responses:{},phase:'answer'}};
 assert.equal(globalThis.DominanceCellState.state(full,review).draft.questions.length,178);
 const fullResult={...full,draft:null,attempts:[{id:'full-review-pool',completedAt:'2026-10-20T12:00:00Z',answers:review.questions.map(q=>({question:q.id,option:null}))}]};
 assert.equal(globalThis.DominanceCellState.state(fullResult,review).attempts[0].answers.length,178);
 const h=academicHarness({create:globalThis.DominanceCellStructure.create,data:review});
 h.pilot.lesson('lesson:lesson_06:0');h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();
 h.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
 const saved=JSON.parse(h.cache.get('cellStructure'));assert.equal(saved.attempts.length,1);
 const legacy=JSON.stringify({version:1,lessons:{CO01:'2026-10-20T12:00:00Z'},attempts:[{id:'old',completedAt:'2026-10-20T12:00:00Z',answers:[{question:'CO-Q001',option:3}]}],draft:null});
 const merged=JSON.parse(mergeCellHistory(legacy,JSON.stringify({...saved,attempts:[...saved.attempts,{id:'new',completedAt:'2026-10-20T12:00:00Z',answers:[{question:'CELL-RQ001',option:0}]}]})));assert.equal(merged.attempts.length,3);assert.equal(merged.lessons.CO01,'2026-10-20T12:00:00Z');
});
test('official-source objectives, editorial extensions and remaining figure concerns are distinct',()=>{
 const objectives=read('content/cell-structure/review/objectives.json'),evidence=read('content/cell-structure/review/source-evidence.json');assert.equal(objectives.official.length,21);assert.equal(objectives.editorial.length,1);assert.equal(evidence.pages,410);assert.equal(evidence.visualChecks.length,6);assert.ok(evidence.visualChecks.some(row=>row.page===358&&row.status==='flagged-not-adopted'));
 const ids=new Set([...objectives.official,...objectives.editorial].map(o=>o.id));for(const row of audit)for(const id of row.objectives)assert.ok(ids.has(id));for(const q of review.questions.slice(170))assert.ok(ids.has(q.objective));
});
