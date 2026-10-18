/* Presentation mappings and optional check parsing; no generated academic content. */
(function(root){
 const sequence=(prefix,count)=>Array.from({length:count},(_,i)=>prefix+String(i+1).padStart(2,'0'));
 const blocks=[
  {id:'microscopy',title:'Microscopy',lessons:sequence('lesson_',18),chapters:[{title:'Optical foundations',lessons:sequence('lesson_',6)},{title:'Imaging methods',lessons:sequence('lesson_',12).slice(6)},{title:'Specimen preparation',lessons:sequence('lesson_',18).slice(12)}]},
  {id:'organization',title:'Cellular Organization',lessons:sequence('CO',4)},
  {id:'organelles',title:'Cell Organelles',lessons:sequence('OR',7)},
  {id:'cytoskeleton',title:'Cytoskeleton',lessons:sequence('CY',4)},
  {id:'membranes',title:'Cell Membranes',lessons:sequence('CM',4)},
  {id:'fractionation',title:'Cell Disruption & Fractionation',lessons:sequence('CE',4)},
  {id:'analysis',title:'Biochemical Analysis',lessons:sequence('BI',5)}
 ];
 function splitCheck(text,line){
  const cleaned=text.replace(/^\s*(?:\d+\.|[-*])\s+/,'').replace(/^\*\*Optional checks?:\*\*\s*/i,'');
  const explicit=cleaned.match(/^(.*?)\s*\*\*Answer:\*\*\s*(.+)$/i);
  const emphasized=cleaned.match(/^(.*?)\s+(\*\*|\*)(.+)\2\s*$/);
  if(explicit)return{kind:'check',question:explicit[1],answer:explicit[2],line};
  if(emphasized)return{kind:'check',question:emphasized[1],answer:emphasized[3],line};
  return{kind:'unresolved-check',question:cleaned,line,reason:'No unambiguous supplied answer delimiter'};
 }
 function parts(markdown){const lines=markdown.split('\n'),result=[];let buffer=[],inChecks=false;const flush=()=>{if(buffer.length){result.push({kind:'markdown',text:buffer.join('\n')});buffer=[]}};
  lines.forEach((line,index)=>{if(/^(?:#{1,6}\s+(?:Quick checks|Short concept checks)|\*\*Optional checks:\*\*)\s*$/i.test(line)){flush();inChecks=true;return}if(/^\*\*Optional check:\*\*/i.test(line)){flush();result.push(splitCheck(line,index+1));inChecks=false;return}if(inChecks&&/^\s*(?:\d+\.|[-*])\s+/.test(line)){flush();result.push(splitCheck(line,index+1));return}if(inChecks&&line.trim()&&!/^\s*$/.test(line))inChecks=false;buffer.push(line)});flush();return result;
 }
 function resolveBlock(id){return blocks.find(b=>id==='block:'+b.id||b.lessons.includes(id))}
 function questionsFor(data,selector){const block=blocks.find(b=>selector==='block:'+b.id);return data.questions.filter(q=>!selector||(block?block.lessons.includes(q.lesson):q.lesson===selector))}
 function practiceLabel(ids,data){const groups=new Set(ids.map(id=>resolveBlock(data.questions.find(q=>q.id===id)?.lesson)?.title).filter(Boolean));return groups.size===1?[...groups][0]:'Full course'}

 function lessonTitle(lesson){return lesson.title.replace(/^(?:Lesson\s+\d+|[A-Z]{2}\d{2})\s*[—:–-]\s*/i,'')}
 function lessonLabel(lesson){const block=resolveBlock(lesson.id);return 'Lesson '+(block.lessons.indexOf(lesson.id)+1)+' — '+lessonTitle(lesson)}
 function sections(lesson){const text=lesson.markdown.replace(/^# .*(?:\n|$)/,'').replace(/^\*\*(Slide Essentials|Concept Connections):\*\*\s*/gm,'## $1\n');const headings=[...text.matchAll(/^(#{2,6})\s+/gm)],depth=headings.length?Math.min(...headings.map(m=>m[1].length)):2;const lines=text.split('\n'),result=[];let title='Introduction',buffer=[];const flush=()=>{if(buffer.some(l=>l.trim()&&!/^---+$/.test(l))){const body=buffer.join('\n').trim();result.push({title,text:body,kind:/Understanding [Nn]ote|clarification/i.test(title)?'clarification':/Concept Connections/i.test(title)?'connections':/Slide Essentials/i.test(title)?'essentials':'explanation'})}buffer=[]};for(const line of lines){const heading=line.match(/^(#{2,6})\s+(.+)/);if(heading&&(heading[1].length===depth||/^Understanding [Nn]ote/.test(heading[2]))){flush();title=heading[2];if(/^(?:Quick checks|Short concept checks)$/i.test(title.trim()))buffer.push(line)}else buffer.push(line)}flush();return result.length?result:[{title:'Lesson',text,kind:'explanation'}]}
 function route(id,data){const legacy=resolveBlock(id);if(legacy&&id.startsWith('block:'))return{block:legacy};if(legacy)return{block:legacy,lesson:data.lessons.find(l=>l.id===id),part:null};const match=id.match(/^lesson:([\w]+):(\d+)$/);if(!match)return null;const lesson=data.lessons.find(l=>l.id===match[1]),block=lesson&&resolveBlock(lesson.id),part=Number(match[2]);return block&&part<sections(lesson).length?{block,lesson,part}:null}
 function countOptions(total){return [...new Set([...(total>=5?[5]:[]),...(total>=10?[10]:[]),...(total>0?[total]:[])])]}
 function location(value){if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid reading positions');const result={};for(const [id,p] of Object.entries(value)){const block=blocks.find(b=>b.id===id);if(!block||!block.lessons.includes(p?.section)||(p.part!==undefined&&(!Number.isInteger(p.part)||p.part<0||p.part>100))||typeof p.offset!=='number'||!Number.isFinite(p.offset)||p.offset<0||p.offset>1||typeof p.updatedAt!=='string'||!Number.isFinite(Date.parse(p.updatedAt)))throw Error('Invalid reading position');result[id]={section:p.section,offset:p.offset,updatedAt:p.updatedAt,...(p.part!==undefined?{part:p.part}:{})}}return result}
 root.DominanceCellLearning={blocks,parts,resolveBlock,questionsFor,practiceLabel,lessonTitle,lessonLabel,sections,route,countOptions,location};
})(globalThis);
