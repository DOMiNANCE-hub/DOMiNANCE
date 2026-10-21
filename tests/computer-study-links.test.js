import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileComputer,studentComputerContent} from '../scripts/import-computer-appreciation.mjs';
import {attachStudyTargets} from '../scripts/academic/question-study-targets.mjs';
import '../public/dashboard/academic-contract.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/computer-state.js';
import {academicHarness} from './support/academic-harness.js';
const data=compileComputer({includeReview:true}),learning=globalThis.DominanceComputerLearning,links=globalThis.DominanceAcademicContract;
const map=JSON.parse(readFileSync(new URL('../content/computer-appreciation/review/study-targets.json',import.meta.url)));
test('every Computer question has one reviewed matching teaching section',()=>{
 assert.equal(map.reviewer,null);assert.equal(map.targets.length,114);
 for(const q of data.questions){
  const route=links.questionRoute(q,data,learning);
  const resolved=learning.route(route,data);assert.equal(resolved.lesson.id,q.lesson);
  const section=learning.sections(resolved.lesson)[resolved.part];assert.equal(section.title,q.studyTarget.sectionTitle);assert.notEqual(resolved.part,0);assert.ok(section.text.trim().length>100);
 }
 assert.equal(links.questionRoute(data.questions.find(q=>q.id==='CA-Q055'),data,learning),'lesson:CA10:1');
 assert.equal(links.questionRoute(data.questions.find(q=>q.id==='CA-Q098'),data,learning),'lesson:CA10:7');
 assert.equal(links.questionRoute(data.questions.find(q=>q.id==='CA-Q111'),data,learning),'lesson:CA12:8');
});
test('stale, duplicate, ambiguous and cross-lesson targets fail compilation; runtime never guesses',()=>{
 const target=map.targets[0];
 for(const targets of [[{...target,sectionTitle:'Missing'}],[{...target,lesson:'CA11'}],[target,target],[{...target,id:'missing'}],[{...target,reason:''}]])assert.throws(()=>attachStudyTargets(structuredClone(data),learning,targets),/Invalid reviewed study target/);
 assert.equal(links.questionRoute({lesson:'missing',studyTarget:{}},data,learning),null);
 const q=data.questions.find(q=>q.id===target.id),bad={...q,studyTarget:{...q.studyTarget,lesson:'CA11'}};assert.equal(links.questionRoute(bad,data,learning),null);
 const ambiguous=structuredClone(data);ambiguous.lessons.find(l=>l.id===q.lesson).markdown+='\n\n## '+q.studyTarget.sectionTitle+'\nDuplicate';assert.equal(links.questionRoute(q,ambiguous,learning),null);
 assert.deepEqual(studentComputerContent().questions,[]);
});
test('lazy result feedback opens every Computer target and preserves completed practice',()=>{
 for(const {id} of data.lessons){
  const h=academicHarness({create:globalThis.DominanceCellStructure.create,data,learning,model:globalThis.DominanceComputerState});
  h.pilot.lesson('lesson:'+id+':0');h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();
  h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
  const details=h.walk(h.node('quizArea')).filter(n=>n.tag==='details');assert.equal(details.length,data.questions.filter(q=>q.lesson===id).length);
  for(const row of details){row.open=true;row.ontoggle();const button=h.walk(row).find(n=>n.textContent==='Study this concept');assert.ok(button);button.onclick();assert.equal(h.focused,false);const stem=h.walk(row).find(n=>n.tag==='h3').textContent,q=data.questions.find(q=>q.question===stem);assert.ok(h.walk(h.node('cellSection')).some(n=>n.tag==='h2'&&n.textContent===q.studyTarget.sectionTitle));assert.equal(globalThis.DominanceComputerState.state(h.cache.get('computerAppreciation'),data).attempts.length,1)}
 }
});
