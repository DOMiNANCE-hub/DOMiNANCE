import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {compileComputer,studentComputerContent,computerValidationIndex,validateComputerContent} from '../scripts/import-computer-appreciation.mjs';
import {computerReviewPlugin} from '../scripts/academic/computer-review-plugin.mjs';
import '../public/dashboard/cell-content.js';
import '../public/dashboard/cell-learning.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/computer-learning.js';
import '../public/dashboard/computer-index.js';
import '../public/dashboard/computer-state.js';
import '../public/dashboard/academic-courses.js';
import '../public/dashboard/home-model.js';
import {academicHarness} from './support/academic-harness.js';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const directory='content/computer-appreciation/review/';
const data=compileComputer({includeReview:true}),model=globalThis.DominanceComputerState;

test('student asset contains no pending Computer teaching or assessment text',()=>{
 const source=readFileSync(new URL('../public/dashboard/computer-content.js',import.meta.url),'utf8'),context={};runInNewContext(source,context);
 assert.deepEqual(JSON.parse(JSON.stringify(context.DominanceComputerContent)),studentComputerContent());
 assert.equal(context.DominanceComputerContent.status,'academic-release-blocked');
 assert.deepEqual(context.DominanceComputerContent.lessons.length,0);assert.equal(context.DominanceComputerContent.questions.length,0);
 for(const q of data.questions)assert.equal(source.includes(q.question),false,q.id);
});
test('review middleware exists only in explicit local emulator serve mode',()=>{
 for(const [mode,command] of [['production','build'],['production','serve'],['development','serve'],['emulator','build']])assert.equal(computerReviewPlugin(mode,command),null);
 let route,handler;computerReviewPlugin('emulator','serve').configureServer({middlewares:{use:(path,callback)=>{route=path;handler=callback}}});
 assert.equal(route,'/dashboard/computer-content.js');let body;const headers={};
 handler({method:'GET'},{setHeader:(key,value)=>{headers[key]=value},end:value=>{body=value}},()=>assert.fail('review GET must be handled'));
 const context={};runInNewContext(body,context);assert.equal(context.DominanceComputerContent.reviewOnly,true);assert.equal(context.DominanceComputerContent.lessons.length,18);assert.equal(context.DominanceComputerContent.questions.length,114);assert.equal(headers['Cache-Control'],'no-store');
});
test('release hold prevents course entry and practice while preserving confirmed historical activity',()=>{
 const previous=globalThis.DominanceComputerContent;globalThis.DominanceComputerContent=studentComputerContent();
 const saved={version:1,lessons:{CA01:'2026-10-19T12:00:00Z'},draft:{format:2,id:'legacy-private',questions:['CA-Q001'],index:0,responses:{'CA-Q001':0},phase:'answer'},attempts:[{id:'done',completedAt:'2026-10-19T12:00:00Z',answers:[{question:'CA-Q001',option:0}]}]};
 try{
  const raw=JSON.stringify(saved),h=academicHarness({create:globalThis.DominanceAcademicCourses.create,data,initial:{computerAppreciation:raw}});
  assert.equal(h.pilot.supports('Computer Appreciation'),false);assert.equal(h.pilot.lesson('lesson:CA01:0'),false);assert.equal(h.pilot.validTopic('lesson:CA01:0','Computer Appreciation'),false);
  h.pilot.openTopics();assert.equal(h.select('cellPractice','Practice course').children.length,1);
  h.pilot.renderProgress();assert.match(h.text('computerProgress'),/1 lessons previously marked as read/);assert.match(h.text('computerProgress'),/held for academic review/);assert.equal(h.cache.get('computerAppreciation'),raw);
  const records=globalThis.DominanceHome.records(null,null,new Date('2026-10-20'),null,null,raw,computerValidationIndex());assert.equal(records[0].total,1);assert.equal(records[0].correct,1);
 }finally{globalThis.DominanceComputerContent=previous}
});
test('four held items cannot enter review or student content under their original or adapted IDs',()=>{
 const withheld=read(directory+'withheld-questions.json'),ids=new Set(withheld.map(q=>q.id));assert.equal(ids.size,4);
 for(const q of data.questions)assert.equal(ids.has(q.id)||ids.has(q.adaptedFrom),false);
 const index=computerValidationIndex();for(const id of ids)assert.equal(index.questions.some(q=>q.id===id),false);
 const copy=structuredClone(data);copy.questions[0].adaptedFrom=withheld[0].id;assert.throws(()=>validateComputerContent(copy),/Withheld/);
});
test('every staged question has inspected actual-source evidence and preserves candidate answer mapping',()=>{
 const facts=new Map(read(directory+'source-fact-checks.json').map(f=>[f.id,f])),disposition=read(directory+'package-disposition.json');
 const mapping=read('docs/csm177/source-page-reconciliation.json');
 assert.equal(data.questions.slice(72).length,42);assert.equal(data.questions.filter(q=>['CA10','CA11','CA12'].includes(q.lesson)).length,36);
 for(const q of data.questions.slice(72)){
  const fact=facts.get(q.verification);assert.ok(fact,q.id);assert.equal(q.pages[0][0],fact.page);assert.ok(fact.anchor.length>10);assert.match(fact.normalizedPageSha256,/^[a-f0-9]{64}$/);
  if(q.adaptedFrom){const row=disposition.questions.find(row=>row.id===q.adaptedFrom);assert.equal(row.reviewQuestion,q.id);assert.equal(mapping.pages[row.packagePages[0]-1].actualPage,q.pages[0][0],q.id);assert.equal(q.options[q.letter.charCodeAt(0)-65],row.candidateCorrectOption,q.id);assert.ok(Number.isInteger(row.candidateCorrectIndex)&&row.candidateCorrectIndex>=0&&row.candidateCorrectIndex<4)}
 }
 assert.equal(disposition.questions.filter(q=>q.disposition==='adapted-to-local-review').length,24);
 assert.equal(disposition.questions.filter(q=>q.disposition==='excluded-overlapping-objective').length,4);
 assert.equal(disposition.questions.filter(q=>q.disposition==='not-imported-review-pending').length,242);
 const duplicate=structuredClone(data);duplicate.questions[1].question=duplicate.questions[0].question.toUpperCase();assert.throws(()=>validateComputerContent(duplicate),/Duplicate/);
});
test('source crosswalk maps unique anchors only and leaves unverified pages unresolved',()=>{
 const result=read('docs/csm177/source-page-reconciliation.json');assert.equal(result.packagePageCount,541);assert.equal(result.actualPageCount,542);assert.equal(result.pages.length,541);assert.equal(result.packageOriginalPdfAvailable,false);
 assert.equal(result.pages.filter(p=>p.actualPage).length,199);assert.equal(result.pages.filter(p=>!p.actualPage).length,342);
 for(const row of result.pages){if(row.actualPage)assert.ok(row.evidence.some(e=>e.actualPage===row.actualPage&&e.status==='unique-text-anchor'&&e.match>=.85&&e.match-e.runnerUp>=.0999));else assert.equal(row.actualTextSha256,null)}
 assert.equal(result.pages[400].actualPage,402);assert.equal(result.pages[0].actualPage,null,'do not infer a global offset');
});
test('new four-question lessons and stronger PowerPoint pools use the existing review/submission flow',()=>{
 for(const lesson of ['CA13','CA14','CA15','CA16','CA17','CA18','CA10','CA11','CA12']){
  if(lesson>='CA13'){const questions=data.questions.filter(q=>q.lesson===lesson);assert.equal(questions.filter(q=>q.kind==='foundation').length,2);assert.equal(questions.filter(q=>q.kind==='application').length,2)}
  const h=academicHarness({create:globalThis.DominanceCellStructure.create,data,model,learning:globalThis.DominanceComputerLearning});
  h.pilot.lesson('lesson:'+lesson+':0');h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();
  const draft=model.state(h.cache.get('computerAppreciation'),data).draft;assert.equal(draft.questions.length,lesson<='CA12'?12:4);
  h.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
  assert.equal(model.state(h.cache.get('computerAppreciation'),data).attempts.length,1);
 }
});
test('Office register keeps every required Microsoft scenario unexecuted despite alternative engine results',()=>{
 const scenarios=read(directory+'practical-checks.json'),evidence=read('docs/csm177/office-alternative-results.json');
 assert.equal(scenarios.length,15);assert.equal(new Set(scenarios.map(s=>s.test_id)).size,15);assert.ok(scenarios.every(s=>s.status==='NOT_EXECUTED_IN_MICROSOFT_OFFICE'));
 assert.equal(evidence.requiredMicrosoftOfficeGuiChecksExecuted,0);assert.equal(evidence.requiredMicrosoftOfficeGuiChecksPassed,0);assert.ok(evidence.evidence.length>10);assert.ok(evidence.evidence.every(e=>e.status==='PASS'&&e.method.includes('NOT Microsoft Office')));
});
