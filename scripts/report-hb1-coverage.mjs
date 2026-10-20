import '../public/dashboard/curriculum.js';
import {compile} from './import-cell-structure.mjs';
import {compileComputer} from './import-computer-appreciation.mjs';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export function hb1Coverage(){
 const datasets=[compile(),compileComputer({includeReview:true})];
 return {scope:'HB1:First',basis:'Repository curriculum and supplied material; current official syllabus not verified',courses:globalThis.DominanceCurriculum.courses('HB1:First').map(course=>{
  const data=datasets.find(d=>d.course===course);
  return {course,lessons:data?.lessons.length||0,questions:data?.questions.length||0,status:data?(course==='Computer Appreciation'?'local-review-only':'academic-review-pending'):'no-implemented-content',studentLessons:course==='Computer Appreciation'?0:data?.lessons.length||0,studentQuestions:course==='Computer Appreciation'?0:data?.questions.length||0,lessonCoverage:data?.lessons.map(l=>({id:l.id,title:l.title,questions:data.questions.filter(q=>q.lesson===l.id).length}))||[]};
 })};
}
export function coverageTable(report){return '| Course | Lessons | MCQs | Implementation status |\n|---|---:|---:|---|\n'+report.courses.map(c=>'| '+c.course+' | '+c.lessons+' | '+c.questions+' | '+(c.status==='local-review-only'?'Emulator review only; student release blocked':c.lessons?'Source-based review candidate':'No implemented lessons or course MCQs')+' |').join('\n')+'\n'}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=hb1Coverage(),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
 writeFileSync(path.join(root,'docs/HB1_CONTENT_COVERAGE.json'),JSON.stringify(report,null,2)+'\n');
 writeFileSync(path.join(root,'docs/HB1_CONTENT_COVERAGE_TABLE.md'),coverageTable(report));
 console.log('Reported '+report.courses.length+' configured HB1 first-semester courses; no syllabus percentage inferred.');
}
