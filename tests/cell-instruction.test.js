import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {compile,applyQuestionRevisions} from '../scripts/import-cell-structure.mjs';
import '../public/dashboard/academic-contract.js';
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
 const raw=readFileSync(new URL('../content/cell-structure/MCQ_170_REVIEW_READY.json',import.meta.url));assert.equal(createHash('sha256').update(raw).digest('hex'),read('content/cell-structure/review/source-evidence.json').sourceQuestionsSha256);
 const revisions=read('content/cell-structure/review/question-revisions.json');
 for(const [i,q] of review.questions.slice(0,170).entries()){const before=original.questions[i],revision=revisions.find(r=>r.id===q.id);for(const field of ['id','lesson','question','options','letter'])assert.deepEqual(q[field],revision?.changes[field]??before[field],q.id+':'+field);assert.equal(q.options[q.letter.charCodeAt(0)-65],before.options[before.letter.charCodeAt(0)-65])}
 assert.equal(audit.filter(row=>row.expansion).length,34);assert.equal(review.questions.length,178);
 assert.equal(review.questions.slice(0,170).filter((q,i)=>q.explanation!==original.questions[i].explanation).length,170);
});
test('one human uricase clarification retains the unique endpoint and organism qualifications',()=>{
 for(const data of [original,review]){const text=data.lessons.find(l=>l.id==='OR01').markdown;assert.equal((text.match(/Humans lack functional urate oxidase/gi)||[]).length,1);assert.match(text,/human purine catabolism generally ends with uric acid/);assert.match(text,/in organisms possessing the enzyme/)}
});
test('new study sections preserve earlier partitions and all 88 concept checks have explicit answers',()=>{
 const learning=globalThis.DominanceCellLearning;let checks=0;
 for(const lesson of review.lessons){
  const before=learning.sections(original.lessons.find(l=>l.id===lesson.id)),after=learning.sections(lesson);
  assert.deepEqual(after.slice(0,before.length).map(s=>s.title),before.map(s=>s.title),lesson.id);
  const parts=after.flatMap(s=>learning.parts(s.text));assert.equal(parts.some(p=>p.kind==='unresolved-check'),false,lesson.id);checks+=parts.filter(p=>p.kind==='check').length;
 }
 assert.equal(checks,88);
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
 const objectives=read('content/cell-structure/review/objectives.json'),evidence=read('content/cell-structure/review/source-evidence.json');assert.equal(objectives.official.length,31);assert.equal(objectives.editorial.length,1);assert.equal(evidence.pages,410);assert.equal(evidence.visualChecks.length,6);assert.ok(evidence.visualChecks.some(row=>row.page===358&&row.status==='flagged-not-adopted'));
 const ids=new Set([...objectives.official,...objectives.editorial].map(o=>o.id));for(const row of audit)for(const id of row.objectives)assert.ok(ids.has(id));for(const q of review.questions.slice(170))assert.ok(ids.has(q.objective));
});
test('ambiguous and repeated prompts are corrected only in the protected review bank without changing historical answer positions',()=>{
 const by=(data,id)=>data.questions.find(q=>q.id===id),answer=q=>q.options[q.letter.charCodeAt(0)-65];
 assert.match(by(original,'CYQ19').question,/used in cancer chemotherapy/);assert.doesNotMatch(by(original,'CYQ19').question,/inhibiting/);
 const drug=by(review,'CYQ19');assert.match(drug.question,/inhibiting microtubule assembly/);assert.equal(answer(drug),'Vincristine');assert.match(drug.explanation,/Paclitaxel is also an anticancer drug/);
 assert.match(by(original,'CO-Q003').options[2],/structure and organisation/);assert.match(by(review,'CO-Q003').options[2],/composition alone/);
 assert.match(by(review,'CO-Q012').question,/compressed by adjacent cells/);assert.match(by(review,'CO-Q005').question,/framework/);
 const revisions=read('content/cell-structure/review/question-revisions.json'),clone=()=>structuredClone(original.questions);
 assert.throws(()=>applyQuestionRevisions(clone(),[...revisions,revisions[0]]),/Invalid question revision/);
 const stale=structuredClone(revisions);stale[0].original.options[0]='stale';assert.throws(()=>applyQuestionRevisions(clone(),stale),/Stale/);
 const changedKey=structuredClone(revisions);changedKey[0].changes.options[1]='different keyed answer';assert.throws(()=>applyQuestionRevisions(clone(),changedKey),/keyed answer/);
});
test('Cell review citations handle all eight new questions and flat legacy pages without borrowing a Computer source label',()=>{
 const contract=globalThis.DominanceAcademicContract;
 for(const q of review.questions.slice(170)){const citation=contract.questionReferences(q,review);assert.match(citation,/BIOL 151 Cell Structure/);assert.doesNotMatch(citation,/CSM/)}
 assert.equal(contract.questionReferences({pages:[81,91]},{course:'Cell Structure'}),'BIOL 151 lecturer PDF p. 81, p. 91');
 assert.equal(contract.questionReferences({pages:[[523,524]]},{course:'Computer Appreciation'}),'CSM 177 lecturer PDF p. 523–524');
 const pages=read('content/cell-structure/review/rationale-evidence.json');assert.equal(pages.rationales.length,74);assert.deepEqual(pages.rationales.find(r=>r.id==='OR02-Q05').pages,[206]);assert.deepEqual(pages.rationales.find(r=>r.id==='CYQ09').pages,[274]);
});
test('Cell geometric examples and original figures are source-qualified and remain out of normal assets',()=>{
 assert.equal(6*2**2,24);assert.equal(8*6*1**2,48);assert.equal(2**3,8*1**3);assert.equal((6*2**2)/(2**3),3);
 assert.equal(review.figures.length,2);const publicAsset=readFileSync(new URL('../public/dashboard/cell-content.js',import.meta.url),'utf8');
 for(const figure of review.figures){assert.ok(review.lessons.some(l=>l.markdown.includes('[Figure:'+figure.id+']')));assert.equal(publicAsset.includes(figure.id),false);assert.match(globalThis.DominanceAcademicFigures.html(figure),/role="img"/)}
 const actin=review.lessons.find(l=>l.id==='CY01').markdown;assert.match(actin,/Calcium binds troponin/);assert.match(actin,/ATP binding allows myosin to detach/);assert.match(actin,/individual actin and myosin filaments do not have to become shorter/);
 assert.match(review.lessons.find(l=>l.id==='OR07').markdown,/two central singlet microtubules/);
});
