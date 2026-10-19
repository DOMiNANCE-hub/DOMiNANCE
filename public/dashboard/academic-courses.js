/* Course selection around the existing reader/quiz engine; no account data in globals. */
(function(root){
 function create(ctx){
  if(!ctx.owner||!ctx.storage)return null;
  const definitions=[
   {name:'Cell Structure',data:root.DominanceCellContent,learning:root.DominanceCellLearning,model:root.DominanceCellState,key:'cellStructure',progressId:'cellProgress'},
   {name:'Computer Appreciation',data:root.DominanceComputerContent,learning:root.DominanceComputerLearning,model:root.DominanceComputerState,key:'computerAppreciation',progressId:'computerProgress'}
  ].filter(c=>c.data&&c.learning&&c.model);
  const engines=new Map();let selected=definitions[0]?.name;
  const definition=name=>definitions.find(c=>c.name===name);
  const study=()=>engines.get(ctx.context().course);
  const practice=()=>[...engines.values()].find(e=>e.active)||engines.get(selected);
  for(const c of definitions)engines.set(c.name,root.DominanceCellStructure.create({...ctx,data:c.data,learning:c.learning,model:c.model,stateKey:c.key,progressId:c.progressId,courses:definitions.map(d=>d.name),selectCourse:name=>{
   if(!engines.has(name)||practice()?.active)return;
   selected=name;engines.get(name).openTopics();
  },openCellCourse:()=>ctx.openAcademicCourse(c.name)}));
  return {
   supports:name=>engines.has(name),
   info:name=>{const c=definition(name);return c?{blocks:c.learning.blocks.length,questions:c.data.questions.length}:null},
   course(){if(study())selected=ctx.context().course;return study()?.course()||false},
   lesson(id){if(study())selected=ctx.context().course;return study()?.lesson(id)||false},
   validTopic(id,name=ctx.context().course){return engines.get(name)?.validTopic(id)||false},
   canonicalTopic:id=>id,
   resumeInfo(name,id){const c=definition(name);if(!c)return null;const route=c.learning.route(id||'',c.data),label={'@blocks':'Study Blocks','@summaries':'Summaries','@lamla':'LAMLA'}[id];return {title:route?.lesson?c.learning.lessonLabel(route.lesson):route?.block?.title||label||name,block:route?.block?.title||label||'Study location',note:route?.lesson&&route.part!==null?'Section '+(route.part+1)+' of '+c.learning.sections(route.lesson).length+' · Saved study location':'Returns to your saved study location.'}},
   practice:force=>practice()?.practice(force),openTopics:()=>practice()?.openTopics(),landing:()=>practice()?.landing(),
   renderProgress:()=>engines.forEach(e=>e.renderProgress()),restoreReading:()=>study()?.restoreReading(),
   beforeNavigate:id=>engines.forEach(e=>e.beforeNavigate(id)),get active(){return [...engines.values()].some(e=>e.active)},
   exit:next=>practice()?.exit(next)
  };
 }
 root.DominanceAcademicCourses={create};
})(globalThis);
