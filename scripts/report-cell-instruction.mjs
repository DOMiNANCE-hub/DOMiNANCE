import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {compile} from './import-cell-structure.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>JSON.parse(readFileSync(path.join(root,name),'utf8'));
export function cellInstructionCoverage(){
 const original=compile(),review=compile({includeReview:true}),audit=read('content/cell-structure/review/lesson-audit.json'),sourceQuestions=read('content/cell-structure/MCQ_170_REVIEW_READY.json');
 return {course:review.course,officialSourceYear:2025,currentYearOutlineVerified:false,academicApproval:null,lessons:46,expandedLessons:audit.filter(r=>r.expansion).map(r=>r.lesson),studentQuestions:170,reviewQuestions:178,rationalesExpanded:96,rationalesRemainingUnchanged:74,originalConceptChecks:51,reviewConceptChecks:74,sections:review.lessons.reduce((n,l)=>n+DominanceCellLearning.sections(l).length,0),coverageStatus:'partial source-aligned instructional review; no complete syllabus claim',questionAudit:review.questions.map(q=>({id:q.id,lesson:q.lesson,status:original.questions.some(old=>old.id===q.id)?original.questions.find(old=>old.id===q.id).explanation===q.explanation?'existing-key-retained-not-independently-certified':'rationale-expanded-awaiting-academic-review':q.reviewStatus,source:sourceQuestions.find(old=>old.id===q.id)?.source_pages||q.pages})),remaining:['74 original rationales are retained for further targeted review.','23 lessons have new expansions; the other 23 retain correct existing material and audited gaps.','LO02 historical-development outcome is only partly represented.','Biochemical analysis has lecturer chapter support but no separate official outcome text verified.','Typical-cell labels, optical ray diagrams and remaining source figures need review.','All original source files and IDs remain intact; no final approval.']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))writeFileSync(path.join(root,'docs/cell-instruction/coverage.json'),JSON.stringify(cellInstructionCoverage(),null,2)+'\n');
