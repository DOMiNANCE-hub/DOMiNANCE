/* Compile-time review metadata; targets never alter assessment meanings or saved IDs. */
export function attachStudyTargets(data,learning,targets){
 const seen=new Set();
 for(const target of targets){
  const question=data.questions.find(q=>q.id===target.id),lesson=data.lessons.find(l=>l.id===target.lesson);
  if(!question||!lesson||question.lesson!==lesson.id||seen.has(target.id)||!target.reason?.trim()||learning.sections(lesson).filter(s=>s.title===target.sectionTitle).length!==1)throw Error('Invalid reviewed study target '+target.id);
  question.studyTarget={lesson:lesson.id,sectionTitle:target.sectionTitle};seen.add(target.id);
 }
 return data;
}
