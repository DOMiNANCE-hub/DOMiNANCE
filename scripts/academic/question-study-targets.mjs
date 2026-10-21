/* Reviewed teaching targets do not alter assessment meanings or saved IDs. */
import {createHash} from 'node:crypto';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function attachStudyTargets(data,learning,targets,{corrections=[]}={}){
 const seen=new Set(),ledger=new Map(),used=new Set(),pending=[];
 for(const row of corrections){
  const q=data.questions.find(q=>q.id===row.id),target=targets.find(t=>t.id===row.id),from=learning.resolveBlock(row.fromLesson),to=learning.resolveBlock(row.toLesson);
  if(!q||!target||ledger.has(row.id)||q.lesson!==row.fromLesson||target.lesson!==row.toLesson||row.fromLesson===row.toLesson||!from||from.id!==to?.id||!row.reason?.trim()||row.questionSha256!==hash({question:q.question,options:q.options,letter:q.letter}))throw Error('Invalid reviewed teaching correction '+row.id);
  ledger.set(row.id,row);
 }
 for(const target of targets){
  const q=data.questions.find(q=>q.id===target.id),lesson=data.lessons.find(l=>l.id===target.lesson),cross=q&&q.lesson!==lesson?.id;
  if(!q||!lesson||(cross&&!ledger.has(q.id))||seen.has(target.id)||!target.reason?.trim()||learning.sections(lesson).filter(s=>s.title===target.sectionTitle).length!==1)throw Error('Invalid reviewed study target '+target.id);
  pending.push([q,{lesson:lesson.id,sectionTitle:target.sectionTitle,...(cross?{fromLesson:q.lesson}:{})}]);seen.add(target.id);if(cross)used.add(q.id);
 }
 if(used.size!==ledger.size)throw Error('Unused reviewed teaching correction');
 for(const [question,target]of pending)question.studyTarget=target;
 return data;
}
