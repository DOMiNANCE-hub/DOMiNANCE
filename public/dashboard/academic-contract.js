/* Stable concept/section links. Academic text and private account state stay separate. */
(function(root){
 function sectionRoute(concept,data,learning,sectionId=concept?.sectionId){
  if(!concept)return null;const lesson=data.lessons.find(l=>l.id===concept.lesson),section=lesson?.sections?.find(s=>s.id===sectionId);
  if(!lesson||!section)return null;const part=learning.sections(lesson).findIndex(s=>s.title===section.title);
  return part<0?null:'lesson:'+lesson.id+':'+part;
 }
 function questionRoute(question,data,learning){const concept=data.concepts?.find(c=>c.id===question.conceptId);return sectionRoute(concept,data,learning,question.sectionId||concept?.sectionId)}
 function relatedQuestions(conceptId,data){return data.questions.filter(q=>q.conceptId===conceptId)}
 function sectionConcept(lesson,section,data){return data.concepts?.find(c=>c.lesson===lesson.id&&lesson.sections?.some(s=>s.id===c.sectionId&&s.title===section.title))||null}
 function questionReferences(question,data){
  if(question.sourceRefs)return question.sourceRefs.map(ref=>{const source=data.sources?.find(s=>s.id===ref.source);return (source?.label||ref.source)+(ref.pages?.length?' · PDF '+ref.pages.map(([a,b])=>'p. '+a+(a===b?'':'–'+b)).join(', '):'')}).join(' · ');
  return question.pages?'CSM 177 lecturer PDF '+question.pages.map(([a,b])=>'p. '+a+(a===b?'':'–'+b)).join(', '):'';
 }
 root.DominanceAcademicContract={sectionRoute,questionRoute,relatedQuestions,sectionConcept,questionReferences};
})(globalThis);
