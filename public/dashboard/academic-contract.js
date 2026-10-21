/* Stable concept/section links. Academic text and private account state stay separate. */
(function(root){
 function sectionRoute(concept,data,learning,sectionId=concept?.sectionId){
  if(!concept)return null;const lesson=data.lessons.find(l=>l.id===concept.lesson),section=lesson?.sections?.find(s=>s.id===sectionId);
  if(!lesson||!section)return null;const part=learning.sections(lesson).findIndex(s=>s.title===section.title);
  return part<0?null:'lesson:'+lesson.id+':'+part;
 }
 function questionRoute(question,data,learning){
  const concept=data.concepts?.find(c=>c.id===question.conceptId);
  if(concept)return sectionRoute(concept,data,learning,question.sectionId||concept.sectionId);
  const target=question.studyTarget,lesson=data.lessons.find(l=>l.id===question.lesson);
  if(!target||!lesson||target.lesson!==lesson.id)return null;
  const sections=learning.sections(lesson),matches=sections.map((s,i)=>s.title===target.sectionTitle?i:-1).filter(i=>i>=0);
  return matches.length===1?'lesson:'+lesson.id+':'+matches[0]:null;
 }
 function relatedQuestions(conceptId,data){return data.questions.filter(q=>q.conceptId===conceptId)}
 function sectionConcept(lesson,section,data){return data.concepts?.find(c=>c.lesson===lesson.id&&lesson.sections?.some(s=>s.id===c.sectionId&&s.title===section.title))||null}
 function questionReferences(question,data){
  if(question.sourceRefs)return question.sourceRefs.map(ref=>{const source=data.sources?.find(s=>s.id===ref.source);return (source?.label||ref.source)+(ref.pages?.length?' · PDF '+ref.pages.map(([a,b])=>'p. '+a+(a===b?'':'–'+b)).join(', '):'')}).join(' · ');
  return question.pages?(data.course==='Cell Structure'?'BIOL 151 lecturer PDF ':'CSM 177 lecturer PDF ')+question.pages.map(page=>{const [a,b]=Array.isArray(page)?page:[page,page];return 'p. '+a+(a===b?'':'–'+b)}).join(', '):'';
 }
 root.DominanceAcademicContract={sectionRoute,questionRoute,relatedQuestions,sectionConcept,questionReferences};
})(globalThis);
