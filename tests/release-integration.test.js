import test from 'node:test';
import assert from 'node:assert/strict';
import {compile} from '../scripts/import-biological-chemistry.mjs';
import {compile as compileCell} from '../scripts/import-cell-structure.mjs';
import {compileComputer} from '../scripts/import-computer-appreciation.mjs';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/cell-learning.js';
import '../public/dashboard/cell-structure.js';
import '../public/dashboard/computer-learning.js';
import '../public/dashboard/computer-state.js';
import '../public/dashboard/biological-catalog.js';
import '../public/dashboard/biological-learning.js';
import '../public/dashboard/biological-state.js';
import '../public/dashboard/academic-contract.js';
import '../public/dashboard/academic-courses.js';
import {academicHarness} from './support/biological-harness.js';
test('Antigravity compatibility adapter preserves strict per-course reading validation with native course models',()=>{
 const location=globalThis.DominanceCellLearning.location,data=compile();
 academicHarness({create:globalThis.DominanceCellStructure.create,data,model:globalThis.DominanceBiologicalState,learning:globalThis.DominanceBiologicalLearning});
 assert.equal(globalThis.DominanceCellLearning.location,location);
 const foreign={version:1,lessons:{},attempts:[],draft:null,reading:{U01:{section:'BC0101',part:0,offset:0,updatedAt:'2026-10-20T01:00:00Z'}}};
 assert.doesNotThrow(()=>globalThis.DominanceBiologicalState.state(foreign,data));
 assert.throws(()=>globalThis.DominanceCellState.state(foreign,{lessons:[],questions:[]}));
});

test('three-course integration supports CELL-RQ integer page citations, per-question Study this concept links, and multi-course Practice switching',()=>{
 const cellReview=compileCell({includeReview:true}),compReview=compileComputer({includeReview:true}),bioReview=compile(),contract=globalThis.DominanceAcademicContract;
 const rq1=cellReview.questions.find(q=>q.id==='CELL-RQ001');
 assert.ok(rq1);
 assert.equal(contract.questionReferences(rq1,cellReview),'BIOL 151 Cell Structure lecturer PDF (2025) · PDF p. 81, p. 91');
 assert.equal(contract.questionReferences({pages:[81,91]},cellReview),'BIOL 151 lecturer PDF p. 81, p. 91');
 assert.equal(contract.questionRoute(rq1,cellReview,globalThis.DominanceCellLearning),'lesson:lesson_06:0');
 const caQ=compReview.questions.find(q=>q.id==='CA-Q016');
 assert.equal(contract.questionReferences(caQ,compReview),'CSM 177 lecturer PDF p. 112');
 assert.equal(contract.questionRoute(caQ,compReview,globalThis.DominanceComputerLearning),'lesson:CA03:0');
 const bioQ=bioReview.questions[0];
 assert.equal(contract.questionRoute(bioQ,bioReview,globalThis.DominanceBiologicalLearning),'lesson:BC0101:1');

 const prevCell=globalThis.DominanceCellContent,prevComp=globalThis.DominanceComputerContent,prevBio=globalThis.DominanceBiologicalContent;
 globalThis.DominanceCellContent=cellReview;
 globalThis.DominanceComputerContent=compReview;
 globalThis.DominanceBiologicalContent=bioReview;
 try{
  const nodes=new Map(),cache=new Map();let course='Cell Structure',lastTopic=null,focused=false;
  class Node{
   constructor(t){this.tag=t;this.children=[];this.attributes={};this.dataset={};this.className='';this.classList={contains:()=>false,toggle(){}}}
   set id(v){this.identifier=v;nodes.set(v,this)}get id(){return this.identifier}
   set innerHTML(v){this.html=v;this.children=[]}get innerHTML(){return this.html||''}
   append(...c){this.children.push(...c)}before(n){nodes.set(n.id,n)}
   setAttribute(k,v){this.attributes[k]=v}getAttribute(k){return this.attributes[k]??null}
   querySelector(s){return s==='h2'?{setAttribute(){},focus(){}}:null}
   querySelectorAll(){return this.children.filter(n=>n.className?.includes('answer'))}
  }
  const document={createElement:t=>new Node(t),getElementById:id=>{if(!nodes.has(id)){const n=new Node('div');n.id=id}return nodes.get(id)}};
  const storage={getItem:k=>cache.get(k)??null,getConfirmedItem:k=>cache.get(k)??null,setItem:(k,v)=>{cache.set(k,v);return true}};
  const walk=n=>[n,...(n.children||[]).flatMap(walk)],node=id=>document.getElementById(id);
  const courses=globalThis.DominanceAcademicCourses.create({owner:'student-rc',document,storage,context:()=>({scopes:['HB1:First'],scope:'HB1:First',course}),toast(){},newId:()=>'id-'+Math.random().toString(36).slice(2,8),openAcademicCourse:name=>{course=name;courses.course()},openTopic:id=>{lastTopic=id;courses.lesson(id)},showPractice(){},focus:v=>{focused=v},recorded(){},confirm:v=>v.onConfirm()});

  courses.openTopics();
  let practiceSelect=walk(node('cellPractice')).find(n=>n.getAttribute?.('aria-label')==='Practice course');
  assert.equal(practiceSelect.value,'Cell Structure');
  practiceSelect.value='Computer Appreciation';practiceSelect.onchange();
  practiceSelect=walk(node('cellPractice')).find(n=>n.getAttribute?.('aria-label')==='Practice course');
  assert.equal(practiceSelect.value,'Computer Appreciation');

  course='Cell Structure';
  courses.course();
  courses.practice(false);
  practiceSelect=walk(node('cellPractice')).find(n=>n.getAttribute?.('aria-label')==='Practice course');
  assert.equal(practiceSelect.value,'Cell Structure');
  assert.equal(node('cellPractice').dataset.course,'Cell Structure');

  courses.lesson('lesson:lesson_06:0');
  walk(node('studyOutput')).find(n=>n.tag==='button'&&n.textContent==='Practise this lesson').onclick();
  walk(node('quizArea')).find(n=>n.tag==='button'&&n.textContent==='Review responses').onclick();
  walk(node('quizArea')).find(n=>n.tag==='button'&&n.textContent.startsWith('Submit practice')).onclick();
  const detailsList=node('quizArea').children.filter(n=>n.tag==='details');
  for(const d of detailsList){d.open=true;d.ontoggle()}
  const allDetailsText=detailsList.flatMap(walk).map(n=>n.textContent||'').join(' ');
  assert.match(allDetailsText,/Source: BIOL 151 (?:Cell Structure lecturer PDF \(2025\) · PDF |lecturer PDF )p\. 81, p\. 91/);
  const conceptBtn=walk(detailsList[0]).find(n=>n.tag==='button'&&n.textContent==='Study this concept');
  assert.ok(conceptBtn);
  conceptBtn.onclick();
  assert.equal(focused,false);
  assert.equal(course,'Cell Structure');
  assert.equal(lastTopic,'lesson:lesson_06:0');
 }finally{
  globalThis.DominanceCellContent=prevCell;
  globalThis.DominanceComputerContent=prevComp;
  globalThis.DominanceBiologicalContent=prevBio;
 }
});
