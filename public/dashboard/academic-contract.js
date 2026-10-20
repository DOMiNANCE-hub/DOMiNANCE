/* Stable concept/section links. Academic text and private account state stay separate. */
(function(root){
 function sectionRoute(concept,data,learning,sectionId=concept?.sectionId){
  if(!concept)return null;const lesson=data.lessons.find(l=>l.id===concept.lesson),section=lesson?.sections?.find(s=>s.id===sectionId);
  if(!lesson||!section)return null;const part=learning.sections(lesson).findIndex(s=>s.title===section.title);
  return part<0?null:'lesson:'+lesson.id+':'+part;
 }
 function questionRoute(question,data,learning){if(data?.concepts){const concept=data.concepts.find(c=>c.id===question.conceptId);return sectionRoute(concept,data,learning,question.sectionId||concept?.sectionId)}const lesson=question?.lesson&&data?.lessons?.find(l=>l.id===question.lesson);return lesson?'lesson:'+lesson.id+':0':null}
 function relatedQuestions(conceptId,data){return data.questions.filter(q=>q.conceptId===conceptId)}
 function sectionConcept(lesson,section,data){return data.concepts?.find(c=>c.lesson===lesson.id&&lesson.sections?.some(s=>s.id===c.sectionId&&s.title===section.title))||null}
 const formatPages=pages=>pages.map(p=>Array.isArray(p)?'p. '+p[0]+(p[0]===p[1]?'':'–'+p[1]):'p. '+p).join(', ');
 function questionReferences(question,data){
  if(question.sourceRefs)return question.sourceRefs.map(ref=>{const source=data.sources?.find(s=>s.id===ref.source);return (source?.label||ref.source)+(ref.pages?.length?' · PDF '+ref.pages.map(([a,b])=>'p. '+a+(a===b?'':'–'+b)).join(', '):'')}).join(' · ');
  return question.pages?(question.source==='BIOL151-LECTURER'||data?.course==='Cell Structure'?'BIOL 151 lecturer PDF ':'CSM 177 lecturer PDF ')+formatPages(question.pages):'';
 }
 root.DominanceAcademicContract={sectionRoute,questionRoute,relatedQuestions,sectionConcept,questionReferences};
})(globalThis);
