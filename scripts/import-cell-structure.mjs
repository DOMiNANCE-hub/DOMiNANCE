import '../public/dashboard/cell-learning.js';
import {readFileSync,readdirSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'content/cell-structure');
export function studentMarkdown(text){
 const lines=text.replace(/\r\n/g,'\n').split('\n');let skipping=false,depth=0;
 return lines.filter(line=>{const heading=line.match(/^(#{1,6})\s+(.+)/);if(heading){if(/internal|source and review note/i.test(heading[2])){skipping=true;depth=heading[1].length;return false}if(skipping&&heading[1].length<=depth)skipping=false}return !skipping&&!/^\*\*(Source|Status|Figure placements|Student-facing lessons):?\*\*/i.test(line)&&!/^#{1,6}\s+(?:DOMiNANCE.*Cell Structure|Milestone \d+.*Student-facing editorial draft)/.test(line)&&!/^\*\*Student-facing lessons/.test(line)}).join('\n').trim();
}
export function validateContent(data,{review=false}={}){
 if(data.lessons.length!==46||data.questions.length!==(review?178:170))throw Error('Unexpected Cell lesson/question inventory');
 const ids=new Set();for(const l of data.lessons){if(!l.id||ids.has(l.id)||!l.title||!l.markdown)throw Error('Invalid lesson');ids.add(l.id)}
 const questions=new Set();for(const q of data.questions){if(!q.id||questions.has(q.id)||!ids.has(q.lesson)||!q.question?.trim()||!q.explanation?.trim()||!Array.isArray(q.options)||q.options.length!==4||q.options.some(o=>typeof o!=='string'||!o.trim())||new Set(q.options).size!==4||!/^[A-D]$/.test(q.letter))throw Error('Invalid question '+q.id);questions.add(q.id)}return data;
}
export function compile({includeReview=false}={}){
 const rank=id=>id.startsWith('lesson_')?0:({CO:1,OR:2,CM:3,CY:4,CE:5,BI:6}[id.slice(0,2)]??9);
 const lessons=readdirSync(path.join(source,'lessons')).filter(f=>/^[\w]+\.md$/.test(f)).map(file=>{const raw=readFileSync(path.join(source,'lessons',file),'utf8');return{id:file.slice(0,-3),title:raw.match(/^#\s+(.+)/m)?.[1],markdown:studentMarkdown(raw).replace(/\((?:PDF\s+)?pp?\.\s*\d+(?:[–-]\d+)?(?:,\s*\d+(?:[–-]\d+)?)?\)/g,'').replace(/the clarification above/g,'the clarification in this lesson').replace(/specific sequence and times above/g,'specific sequence and times in this lesson').replace('### Understanding Note — Urate oxidase and human peroxisomes\n',''),references:[...new Set(raw.match(/\((?:PDF\s+)?pp?\.\s*\d+(?:[–-]\d+)?(?:,\s*\d+(?:[–-]\d+)?)?\)/g)||[])],attribution:raw.match(/^\*\*Source:\*\*\s*(.*?)(?:\*\*Status:|$)/m)?.[1]?.trim()||'Supplied Cell Structure teaching material'}}).sort((a,b)=>rank(a.id)-rank(b.id)||a.id.localeCompare(b.id));
 let questions=JSON.parse(readFileSync(path.join(source,'MCQ_170_REVIEW_READY.json'),'utf8')).map(({id,lesson,question,options,letter,explanation})=>({id,lesson,question,options,letter,explanation}));
 const peroxisome=lessons.find(l=>l.id==='OR01');
 // Consolidate repeated existing caveats without changing original source files.
 peroxisome.markdown=peroxisome.markdown.replace(/ \*\*Human nuance:\*\* humans do not have a functional urate oxidase enzyme; the slide describes peroxisomal biochemistry across organisms, not an enzyme active in human liver\./,'').replace(/### Understanding Note — uricase in humans\n[\s\S]*$/,'### Understanding Note — uricase in humans\nThe lecturer lists urate oxidase among peroxisomal enzymes across organisms. **Humans lack functional urate oxidase (uricase)**, so human purine catabolism generally ends with uric acid rather than conversion to allantoin through this enzyme. Preserve the lecture’s organism-wide list without inferring that human peroxisomes perform this reaction.');
 if(includeReview){
  const audit=JSON.parse(readFileSync(path.join(source,'review/lesson-audit.json'),'utf8'));
  const rationales=JSON.parse(readFileSync(path.join(source,'review/rationales.json'),'utf8'));
  for(const item of audit){const lesson=lessons.find(l=>l.id===item.lesson);if(!lesson)throw Error('Unknown reviewed lesson');if(item.expansion)lesson.markdown+='\n\n'+readFileSync(path.join(source,'review/lessons',item.lesson+'.md'),'utf8').trim()}
  const resolution=lessons.find(l=>l.id==='lesson_06');resolution.markdown=resolution.markdown.replace('The full slide table includes further objective magnifications and NA values; it should be provided as a verified reference figure rather than silently omitted.','The complete source table is included in the appended internal reference section after visual checking of actual PDF p.89.');
  questions=questions.map(q=>({...q,explanation:rationales[q.id]||q.explanation}));
  for(const id of Object.keys(rationales))if(!questions.some(q=>q.id===id))throw Error('Unknown rationale '+id);
  questions.push(...JSON.parse(readFileSync(path.join(source,'review/questions.json'),'utf8')));
 }
 const data=validateContent({version:1,status:'academic-review-pending',course:'Cell Structure',scope:'HB1:First',...(includeReview?{reviewOnly:true}:{}),lessons,questions},{review:includeReview});
 if(includeReview){const stems=data.questions.map(q=>q.question.toLowerCase().replace(/\s+/g,' ').trim());if(new Set(stems).size!==stems.length)throw Error('Duplicate Cell question stem')}
 return data;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const data=compile(),review=compile({includeReview:true});mkdirSync(path.join(root,'public/dashboard'),{recursive:true});writeFileSync(path.join(root,'public/dashboard/cell-content.js'),'/* Generated by npm run content:cell; do not edit. */\nglobalThis.DominanceCellContent='+JSON.stringify(data).replaceAll('<','\\u003c')+';\n');writeFileSync(path.join(root,'public/dashboard/cell-index.js'),'/* Generated validation index: no lesson or question text. */\nglobalThis.DominanceCellIndex='+JSON.stringify({lessons:data.lessons.map(({id})=>({id})),questions:review.questions.map(({id,letter})=>({id,letter}))})+';\n');console.log('Compiled unchanged 46/170 student bank; 46/178 instructional review is local-emulator-only.');}
