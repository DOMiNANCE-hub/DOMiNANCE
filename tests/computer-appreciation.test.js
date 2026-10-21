import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileComputer,validateComputerContent} from '../scripts/import-computer-appreciation.mjs';
import '../public/dashboard/cell-content.js';
import '../public/dashboard/cell-learning.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/computer-content.js';
import '../public/dashboard/computer-learning.js';
import '../public/dashboard/computer-state.js';
import '../public/dashboard/academic-courses.js';
import '../public/dashboard/home-model.js';
import {createDashboardStorage,mergeComputerHistory} from '../src/dashboard-session.js';
import {academicHarness} from './support/academic-harness.js';
import {hb1Coverage,coverageTable} from '../scripts/report-hb1-coverage.mjs';
const data=compileComputer({includeReview:true}),learning=globalThis.DominanceComputerLearning,model=globalThis.DominanceComputerState;
globalThis.DominanceComputerContent={...data,reviewOnly:true};
const harness=()=>academicHarness({create:globalThis.DominanceCellStructure.create,data,learning,model});
const answer=q=>q.options[q.letter.charCodeAt(0)-65];

test('Computer preserves the 12/72 baseline and compiles the incremental 18/114 review bank',()=>{
 const legacy=compileComputer();assert.equal(legacy.lessons.length,12);assert.equal(legacy.questions.length,72);
 assert.deepEqual(compileComputer({includeReview:true}),data);assert.equal(data.lessons.length,18);assert.equal(data.questions.length,114);
 const assessment=({explanation,studyTarget:_studyTarget,...question})=>question;
 assert.deepEqual(data.questions.slice(0,72).map(assessment),legacy.questions.map(assessment),'existing IDs, stems, options, keys and citations remain unchanged');
 assert.equal(data.status,'academic-review-pending');assert.equal(data.scope,'HB1:First');
 const all=learning.blocks.flatMap(b=>b.lessons);assert.deepEqual([...all].sort(),data.lessons.map(l=>l.id).sort());
 for(const l of legacy.lessons){
  assert.equal(l.markdown,readFileSync(new URL('../content/computer-appreciation/lessons/'+l.id+'.md',import.meta.url),'utf8').trim());
  const questions=legacy.questions.filter(q=>q.lesson===l.id);assert.equal(questions.length,6);
  assert.equal(questions.filter(q=>q.kind==='foundation').length,3);assert.equal(questions.filter(q=>q.kind==='application').length,3);
  assert.ok(l.references.length);assert.ok(learning.sections(l).length>=3);
 }
 assert.equal(new Set(data.questions.map(q=>q.question)).size,114);
});
test('Computer validation rejects broken citations, mapping, ambiguous options and answer keys',()=>{
 for(const mutate of [d=>{d.questions[0].pages=[[0,1]]},d=>{d.lessons[0].pages=[[1,543]]},d=>{d.blocks[0].lessons.push('CA01')},d=>{d.questions[0].options[1]=d.questions[0].options[0].toUpperCase()},d=>{d.questions[0].letter='E'},d=>{d.questions[0].explanation=''},d=>{d.questions[0].lesson='CO01'}]){
  const invalid=structuredClone(data);mutate(invalid);assert.throws(()=>validateComputerContent(invalid));
 }
});
test('worked numeric examples and copied references retain independently checked answer keys',()=>{
 const expected={'CA-Q016':'15','CA-Q017':'=B3*$F$1','CA-Q018':'$B3','CA-Q022':'2','CA-Q023':'9','CA-Q028':'5','CA-Q029':'2 and 3','CA-Q030':'3','CA-Q034':'Review complete','CA-Q035':'TRUE','CA-Q036':'Rate 12%/12; nper 60','CA-Q040':'25%','CA-Q053':'3'};
 for(const [id,result]of Object.entries(expected))assert.equal(answer(data.questions.find(q=>q.id===id)),result,id);
 assert.equal(6+27/3,15);assert.equal(17%5,2);assert.equal(Math.sqrt(81),9);assert.equal([2,4,9].reduce((a,b)=>a+b)/3,5);
 for(const q of data.questions)assert.ok(q.explanation.length>65,q.id);
});
test('reader navigation and practice retain Computer course context and separate records',()=>{
 const h=harness();assert.equal(h.pilot.course(),true);h.pilot.lesson('lesson:CA03:0');
 assert.match(h.node('studyMeta').textContent,/Computer Appreciation/);
 h.buttons('studyOutput').find(b=>b.textContent==='Next Section').onclick();
 assert.equal(model.state(h.cache.get('computerAppreciation'),data).reading['spreadsheet-foundations'].part,1);
 h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();assert.equal(h.focused,true);
 h.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();
 h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
 const saved=model.state(h.cache.get('computerAppreciation'),data);assert.equal(saved.attempts.length,1);assert.equal(saved.draft,null);assert.equal(saved.attempts[0].answers.length,6);
 assert.equal(saved.attempts[0].answers.filter(a=>a.option===null).length,5);assert.equal(h.cache.has('cellStructure'),false);
 const details=h.node('quizArea').children.find(n=>n.tag==='details');details.open=true;details.ontoggle();assert.match(h.text('quizArea'),/Source: CSM 177 lecturer PDF/);
});
test('Practice switches between real course pools and keeps independent unfinished drafts',()=>{
 assert.equal(globalThis.DominanceAcademicCourses.create({owner:null}),null);
 const h=academicHarness({create:globalThis.DominanceAcademicCourses.create,data});
 h.pilot.openTopics();assert.equal(h.select('cellPractice','Practice course').children.length,2);
 const course=h.select('cellPractice','Practice course');course.value='Computer Appreciation';course.onchange();
 assert.match(h.text('cellPractice'),/114 available questions/);h.select('cellPractice','Question count').value='5';h.buttons('cellPractice').find(b=>b.textContent==='Start practice').onclick();
 const saved=model.state(h.cache.get('computerAppreciation'),data);assert.equal(saved.draft.questions.length,5);assert.ok(saved.draft.questions.every(id=>id.startsWith('CA-Q')));
 h.pilot.exit();h.pilot.openTopics();const switcher=h.select('cellPractice','Practice course');switcher.value='Cell Structure';switcher.onchange();
 assert.match(h.text('cellPractice'),/170 available questions/);assert.equal(h.cache.get('computerAppreciation'),JSON.stringify(saved));
 assert.equal(h.pilot.validTopic('lesson:CA01:0','Cell Structure'),false);assert.equal(h.pilot.validTopic('lesson:CA01:0','Computer Appreciation'),true);
 assert.match(h.pilot.resumeInfo('Computer Appreciation','lesson:CA01:1').note,/Section 2/);
});
test('Computer state rejects Cell IDs and merges completions without resurrecting stale drafts',()=>{
 const empty=model.state(null,data),draft={format:2,id:'owned',questions:['CA-Q001'],index:0,responses:{},phase:'answer'},attempt={id:'owned',completedAt:'2026-10-19T12:00:00Z',answers:[{question:'CA-Q001',option:0}]};
 assert.throws(()=>model.state({...empty,lessons:{CO01:'2026-10-19T12:00:00Z'}},data));
 assert.throws(()=>model.state({...empty,draft:{...draft,questions:['CO-Q001']}},data));
 const result=JSON.parse(mergeComputerHistory(JSON.stringify({...empty,attempts:[attempt]}),JSON.stringify({...empty,draft})));
 assert.equal(result.draft,null);assert.equal(result.attempts.length,1);assert.equal(model.score(attempt,data),1);
});
test('Computer persistence waits for acknowledgement and denies account switching',async()=>{
 let failed=true;const auth={currentUser:{uid:'alice'}},storage=createDashboardStorage({auth,uid:'alice',write:async()=>{if(failed)throw Error('offline')}});
 const value=JSON.stringify(model.state(null,data));assert.equal(storage.setItem('computerAppreciation',value),true);await storage.retry();
 assert.equal(storage.getConfirmedItem('computerAppreciation'),null);failed=false;await storage.retry();assert.equal(storage.getConfirmedItem('computerAppreciation'),value);
 auth.currentUser={uid:'bob'};assert.equal(storage.getItem('computerAppreciation'),null);assert.equal(storage.setItem('computerAppreciation',value),false);storage.dispose();
});
test('Home counts confirmed Computer completions with skipped answers excluded',()=>{
 const now=new Date('2026-10-19T12:00:00Z'),raw=JSON.stringify({...model.state(null,data),attempts:[{id:'home',completedAt:now.toISOString(),answers:[{question:'CA-Q001',option:0},{question:'CA-Q002',option:null}]}]});
 const records=globalThis.DominanceHome.records(null,null,now,null,null,raw,data),summary=globalThis.DominanceHome.summary(records,now);
 assert.equal(records[0].type,'Computer Appreciation');assert.equal(summary.sessions,1);assert.equal(summary.questions,1);assert.equal(summary.accuracy,100);
});
test('HB1 coverage report matches real modules and keeps empty courses explicit',()=>{
 const report=hb1Coverage();assert.equal(report.courses.length,9);
 assert.equal(report.courses.filter(c=>c.lessons===0&&c.questions===0).length,7);
 assert.equal(report.courses.reduce((n,c)=>n+c.lessons,0),64);assert.equal(report.courses.reduce((n,c)=>n+c.questions,0),284);
 assert.deepEqual(report,JSON.parse(readFileSync(new URL('../docs/HB1_CONTENT_COVERAGE.json',import.meta.url),'utf8')));
 assert.equal(coverageTable(report),readFileSync(new URL('../docs/HB1_CONTENT_COVERAGE_TABLE.md',import.meta.url),'utf8'));
 for(const course of report.courses)assert.equal(course.lessonCoverage.reduce((n,l)=>n+l.questions,0),course.questions);
});
