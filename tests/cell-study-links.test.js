import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {compile} from '../scripts/import-cell-structure.mjs';
import {attachStudyTargets} from '../scripts/academic/question-study-targets.mjs';
import '../public/dashboard/academic-contract.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import {academicHarness} from './support/cell-review-harness.js';
const data=compile({includeReview:true}),original=compile(),learning=globalThis.DominanceCellLearning,links=globalThis.DominanceAcademicContract,model=globalThis.DominanceCellState;
const mapping=JSON.parse(readFileSync(new URL('../content/cell-structure/review/study-targets.json',import.meta.url)));
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
test('24 reviewed cytoskeleton targets bind existing prose; all 178 question objects retain historical assessment fields',()=>{
 assert.equal(mapping.reviewer,null);assert.equal(mapping.academicApproval,null);assert.equal(mapping.targets.length,24);assert.equal(mapping.corrections.length,11);
 const preserved=data.questions.map(({studyTarget:_studyTarget,...q})=>q);assert.equal(hash(preserved),mapping.preservedQuestionsSha256);
 for(const target of mapping.targets){const q=data.questions.find(q=>q.id===target.id),route=learning.route(links.questionRoute(q,data,learning),data);assert.equal(route.lesson.id,target.lesson);assert.equal(learning.sections(route.lesson)[route.part].title,target.sectionTitle)}
 const cases=[['CYQ01','CY02',/25 nm/],['CYQ07','CY01',/spectrin/],['CYQ16','CY02',/epidermolysis/i],['CYQ17','CY04',/align chromosomes/],['CYQ18','CY04',/paclitaxel/],['CYQ23','CY01',/dynamic network/]];
 for(const [id,lesson,phrase]of cases){const q=data.questions.find(q=>q.id===id),route=learning.route(links.questionRoute(q,data,learning),data);assert.equal(route.lesson.id,lesson);assert.match(learning.sections(route.lesson)[route.part].text,phrase)}
 assert.equal(data.questions.filter(q=>!q.studyTarget).length,154);assert.equal(original.questions.some(q=>q.studyTarget),false);
});
test('cross-lesson teaching requires a matching fingerprinted same-block ledger and is applied atomically',()=>{
 const clear=()=>{const d=structuredClone(data);for(const q of d.questions)delete q.studyTarget;return d},row=mapping.corrections[0];
 assert.throws(()=>attachStudyTargets(clear(),learning,mapping.targets),/Invalid reviewed study target/);
 for(const mutate of [r=>r.questionSha256='0'.repeat(64),r=>r.fromLesson='CY04',r=>r.toLesson='CM01',r=>r.reason='']){const rows=structuredClone(mapping.corrections);mutate(rows[0]);const d=clear();assert.throws(()=>attachStudyTargets(d,learning,mapping.targets,{corrections:rows}),/Invalid reviewed teaching correction/);assert.equal(d.questions.some(q=>q.studyTarget),false)}
 assert.throws(()=>attachStudyTargets(clear(),learning,mapping.targets,{corrections:[...mapping.corrections,row]}),/Invalid reviewed teaching correction/);
 const q=data.questions.find(q=>q.id===row.id);assert.equal(links.questionRoute({...q,studyTarget:{...q.studyTarget,fromLesson:'wrong'}},data,learning),null);
});
test('review practice follows taught concepts while legacy assignments, drafts and scores remain valid',()=>{
 const expected=[4,12,3,5],ids=[];
 for(const [i,id]of ['CY01','CY02','CY03','CY04'].entries()){const pool=learning.questionsFor(data,id);assert.equal(pool.length,expected[i]);ids.push(...pool.map(q=>q.id));assert.equal(learning.questionsFor(original,id).length,6)}
 assert.equal(ids.length,24);assert.equal(new Set(ids).size,24);assert.equal(learning.questionsFor(data,'block:cytoskeleton').length,24);assert.equal(learning.questionsFor(data,'').length,178);
 for(const row of mapping.corrections){const q=data.questions.find(q=>q.id===row.id);assert.equal(q.lesson,row.fromLesson);assert.ok(!learning.questionsFor(data,row.fromLesson).includes(q));assert.ok(learning.questionsFor(data,row.toLesson).includes(q))}
 const oldQuestions=data.questions.filter(q=>q.lesson==='CY01'),draft={format:2,id:'historical-six',questions:oldQuestions.map(q=>q.id),index:0,responses:{CYQ01:0},phase:'answer'},saved={version:1,lessons:{},attempts:[],draft};assert.equal(draft.questions.length,6);assert.deepEqual(model.state(saved,data),saved);
 const attempt={id:'old-completion',completedAt:'2026-10-20T12:00:00Z',answers:oldQuestions.map(q=>({question:q.id,option:q.letter.charCodeAt(0)-65}))};assert.equal(model.score(attempt,data),6);assert.deepEqual(model.state({...saved,draft:null,attempts:[attempt]},data).attempts,[attempt]);
});
test('all 24 actual cytoskeleton feedback panels open their reviewed section and keep completed attempts',()=>{
 for(const id of ['CY01','CY02','CY03','CY04']){
  const h=academicHarness({create:globalThis.DominanceCellStructure.create,data,learning,model});h.pilot.lesson('lesson:'+id+':1');h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
  const rows=h.walk(h.node('quizArea')).filter(n=>n.tag==='details');assert.equal(rows.length,learning.questionsFor(data,id).length);
  for(const row of rows){row.open=true;row.ontoggle();const q=data.questions.find(q=>q.question===h.walk(row).find(n=>n.tag==='h3').textContent);h.walk(row).find(n=>n.textContent==='Study this concept').onclick();assert.ok(h.walk(h.node('cellSection')).some(n=>n.tag==='h2'&&n.textContent===q.studyTarget.sectionTitle));assert.equal(h.focused,false);assert.equal(model.state(h.cache.get('cellStructure'),data).attempts.length,1)}
 }
});
