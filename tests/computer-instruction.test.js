import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compileComputer,studentComputerContent} from '../scripts/import-computer-appreciation.mjs';
import {computerQuality} from '../scripts/report-computer-quality.mjs';
const read=name=>JSON.parse(readFileSync(new URL('../'+name,import.meta.url),'utf8'));
const data=compileComputer({includeReview:true});
test('all 18 instructional additions retain original section prefixes and sourced review holds',()=>{
 const audit=read('content/computer-appreciation/instructional/lesson-audit.json');assert.equal(audit.length,18);
 for(const lesson of data.lessons){
  const original=readFileSync(new URL('../content/computer-appreciation/'+(lesson.id>='CA13'?'review/':'')+'lessons/'+lesson.id+'.md',import.meta.url),'utf8').trim();
  assert.ok(lesson.markdown.startsWith(original),lesson.id);
  const row=audit.find(a=>a.lesson===lesson.id);assert.equal(row.studentPublication,false);assert.ok(row.remainingReview);assert.ok(row.actualPdfPages.length);
 }
 assert.deepEqual(studentComputerContent().questions,[]);
});
test('teaching rationales retain all 114 question IDs and answer mappings including adapted candidates',()=>{
 const original=[...read('content/computer-appreciation/questions.json'),...read('content/computer-appreciation/review/questions.json')];
 const withoutRationale=({explanation,studyTarget:_studyTarget,...q})=>q;assert.deepEqual(data.questions.map(withoutRationale),original.map(withoutRationale));
 assert.ok(data.questions.every(q=>q.explanation!==original.find(item=>item.id===q.id).explanation));
 assert.match(data.questions.find(q=>q.id==='CA-Q009').explanation,/Ctrl\+V pastes/);
 assert.match(data.questions.find(q=>q.id==='CA-Q104').explanation,/p\.460/);
 assert.doesNotMatch(data.questions.find(q=>q.id==='CA-Q072').explanation,/creation date/);
});
test('worked demonstrations preserve the intended predictions and unresolved policy distinctions',()=>{
 const lesson=id=>data.lessons.find(l=>l.id===id).markdown;
 assert.match(lesson('CA03'),/D3 \| =B3\*\$F\$1/);assert.match(lesson('CA03'),/16 and 24/);assert.match(lesson('CA03'),/=\(6\+10\)\/2=8/);
 assert.match(lesson('CA09'),/0021, 0030 and 0044/);assert.match(lesson('CA15'),/4\*55=220/);
 assert.match(lesson('CA16'),/neither the matched value 6 nor the worksheet row number 3/);assert.match(lesson('CA17'),/snapshot does not thereby become 58/);
});
test('quality report is reproducible and selectively inspected candidates remain unimported',()=>{
 assert.deepEqual(computerQuality(),read('docs/csm177/INSTRUCTIONAL_QUALITY.json'));
 const candidates=read('content/computer-appreciation/instructional/candidate-review.json');assert.equal(candidates.length,12);
 for(const candidate of candidates){assert.equal(candidate.imported,false);assert.equal(data.questions.some(q=>q.adaptedFrom===candidate.candidate),false);assert.ok(candidate.reason)}
});
