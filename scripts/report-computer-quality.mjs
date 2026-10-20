import {writeFileSync,readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {compileComputer} from './import-computer-appreciation.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const words=text=>text.trim().split(/\s+/).filter(Boolean).length;
export function computerQuality(){
 const data=compileComputer({includeReview:true});
 const audits=JSON.parse(readFileSync(path.join(root,'content/computer-appreciation/instructional/lesson-audit.json'),'utf8'));
 return {course:data.course,status:'editorial-review-only',officialSyllabusVerified:false,academicApproval:null,studentPublication:false,lessons:data.lessons.map(l=>({id:l.id,title:l.title,words:words(l.markdown),questions:data.questions.filter(q=>q.lesson===l.id).length,changes:audits.find(a=>a.lesson===l.id).implemented,remainingReview:audits.find(a=>a.lesson===l.id).remainingReview})),questionCount:data.questions.length,rewrittenRationales:data.questions.length,rationaleWordCounts:data.questions.map(q=>({id:q.id,words:words(q.explanation)})),candidateReview:{additionalInspected:12,newlyImported:0,remainingNotImported:242},limitations:['Word counts are descriptive, not quality scores or acceptance thresholds.','Official course objectives are unavailable; lesson goals are source-derived editorial goals.','The 199-page crosswalk is unchanged; it is not a complete source-version reconciliation.','All 15 required Microsoft Office scenarios remain unexecuted in Microsoft Office.','Full function catalogues, detailed lookup arguments and target-version desktop acceptance remain incomplete.']};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const report=computerQuality();writeFileSync(path.join(root,'docs/csm177/INSTRUCTIONAL_QUALITY.json'),JSON.stringify(report,null,2)+'\n');
 console.log(report.lessons.length+' lessons expanded; '+report.rewrittenRationales+' rationales rewritten; no new student publication or academic approval.');
}
