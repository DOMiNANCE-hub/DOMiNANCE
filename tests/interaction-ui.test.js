import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {runInNewContext} from 'node:vm';
const html=readFileSync('public/dashboard/index.html','utf8');
test('shared dashboard styles load once, in order, before the body is shown',()=>{const sheets=['polish','appearance','refinement','cell-structure','workspace-choice','workspace-ui'];let previous=-1;for(const name of sheets){const token='/dashboard/'+name+'.css';assert.equal(html.split(token).length-1,1,name);const at=html.indexOf(token);assert.ok(at>previous&&at<html.indexOf('</head>'));previous=at}assert.doesNotMatch(html,/workspacePolish|appearanceSheet|refinementSheet/)});
test('save notifications skip hidden Home and Progress DOM but refresh each visible view',()=>{for(const [hook,following,object,method]of [['refreshHomeWidgets','homeUI.refresh','homeUI','refresh'],['refreshCellProgress','renderPracticeGrid','cellPilot','renderProgress']]){const expression=html.match(new RegExp('window\\.'+hook+'=(.*?);'+following.replace('.','\\.')))?.[1];assert.ok(expression,hook);let visible=false,calls=0;const callback=runInNewContext(expression,{document:{getElementById:()=>({classList:{contains:()=>visible}})},[object]:{[method]:()=>calls++}});callback();assert.equal(calls,0);visible=true;callback();assert.equal(calls,1)}});
test('picker observation ignores unrelated text but tracks live option labels',()=>{let onChange,scans=0;const d={body:{},querySelector:()=>({}),querySelectorAll:()=>{scans++;return[]}};runInNewContext(readFileSync('public/dashboard/workspace-choice.js','utf8'),{document:d,MutationObserver:class{constructor(callback){onChange=callback}observe(){}}});assert.equal(scans,1);onChange([{type:'childList',addedNodes:[{tagName:'SPAN',querySelector:()=>null}],removedNodes:[]}]);assert.equal(scans,1);onChange([{type:'childList',addedNodes:[{tagName:'SELECT'}],removedNodes:[]}]);assert.equal(scans,2);onChange([{type:'childList',target:{closest:()=>({tagName:'SELECT'})},addedNodes:[],removedNodes:[]}]);assert.equal(scans,3);onChange([{type:'characterData',target:{parentElement:{closest:()=>({tagName:'SELECT'})}}}]);assert.equal(scans,4)});
test('Sprint 01 keeps single account stylesheet import, delegates active Home metrics to homeUI without transient demo flashes, and enforces responsive/reduced-motion rules',()=>{
 const app=readFileSync('src/DominanceApp.jsx','utf8'),css=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.equal((app.match(/import\s+['"]\.\/account\.css['"]/g)||[]).length,1,'account.css is imported once');
 assert.match(html,/for\(const id of homeUI\?\['sessionCount'\]:\['sessionCount','homeSessions'\]\)/);
 assert.doesNotMatch(html,/renderHome\(\);homeUI\?\.refresh\(\)/,'refreshProgress does not call homeUI.refresh redundantly after renderHome');
 assert.match(css,/\.authenticated-dashboard \.shell \.content \.course\{display:flex;flex-direction:column/);
 assert.match(css,/#home\.home-compact \.home-continue \.eyebrow\{color:#f3cc71!important\}/);
 assert.match(css,/\[data-motion=reduced\] \.loading-mark\{animation:none!important\}/);
 assert.match(css,/@media\(max-width:400px\)/);
 assert.match(css,/@media\(max-width:1080px\)/);
});
test('Sprint 02 standardizes AuthGate, Onboarding modal, Community cards, activity dividers, toasts, and dark-mode surfaces',()=>{
 const authCss=readFileSync('src/auth.css','utf8'),accountCss=readFileSync('src/account.css','utf8'),uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.match(authCss,/\.dom-auth>section\{[^}]*border-radius:22px/);
 assert.match(authCss,/\.dom-auth input\{[^}]*min-height:46px/);
 assert.match(accountCss,/\.account-intro\{display:grid;grid-template-columns:44px 1fr/);
 assert.match(accountCss,/\.dom-modal input,\.dom-modal select,\.dom-modal \.workspace-choice\{[^}]*min-height:46px/);
 assert.match(uiCss,/\.authenticated-dashboard \.activity\{border-bottom:1px solid var\(--app-line\)/);
 assert.match(uiCss,/\.authenticated-dashboard \.toast\{[^}]*background:var\(--app-nav\)/);
 assert.match(uiCss,/html\.authenticated-dashboard\[data-mode=dark\] \.shell \.content \.course/);
});
test('Sprint 03 refines study block cards, lesson topic rows, section navigation, concept checks, quiz question headers, review tiles, and explanation accordions',()=>{
 const uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.match(uiCss,/\.authenticated-dashboard \.cell-block-card\{display:flex;flex-direction:column;min-height:204px/);
 assert.match(uiCss,/\.authenticated-dashboard \.lesson-list \.topicrow::after\{content:'→'/);
 assert.match(uiCss,/\.authenticated-dashboard \.section-navigation\{background:var\(--app-surface\)/);
 assert.match(uiCss,/\.authenticated-dashboard \.cell-concept-check\{[^}]*border-left:4px solid var\(--app-secondary\)!important/);
 assert.match(uiCss,/\.authenticated-dashboard \.question-review button\{border:1px solid var\(--app-line\)/);
 assert.match(uiCss,/\.authenticated-dashboard #quizArea details\[open\] summary\{padding-bottom:10px;border-bottom:1px solid var\(--app-line\)/);
 assert.match(uiCss,/\.authenticated-dashboard \.lamla-options button\{min-height:44px/);
});
test('Sprint 04 deduplicates courseCard progress parsing, guards visibilitychange Home refreshes, and adds layout containment, touch-action, focus-visible, and reduced-motion rules',()=>{
 const uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8'),homeUi=readFileSync('public/dashboard/home-ui.js','utf8');
 assert.match(html,/function courseCard\(name,index,tag,attempts=progressTotals\(\)\.attempts\)/);
 assert.match(html,/courseCard\(n,i,academicPolicy\.label\(selectedScope\),attempts\)/);
 assert.match(homeUi,/addEventListener\('visibilitychange',\(\)=>\{if\(!d\.hidden&&el\('home'\)\.classList\.contains\('active'\)\)refresh\(\)\}\)/);
 assert.match(uiCss,/contain:layout style/);
 assert.match(uiCss,/touch-action:manipulation/);
 assert.match(uiCss,/\.authenticated-dashboard details summary:focus-visible/);
 assert.match(uiCss,/@media\(prefers-reduced-motion:reduce\)/);
});
test('Sprint 05 fixes concept-check answer background, hides orphan reader hr wrappers, refines dark-mode active nav contrast, and polishes Community person cards',()=>{
 const uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.match(uiCss,/\.authenticated-dashboard \.cell-concept-answer\{background:transparent!important\}/);
 assert.match(uiCss,/\.authenticated-dashboard \.cell-reader>div:not\(:has\(p,ul,ol,table,h2,h3,h4\)\)\{display:none\}/);
 assert.match(uiCss,/html\.authenticated-dashboard\[data-mode=dark\] \.shell \.side \.nav button\.active\{background:#1d3557!important/);
 assert.match(uiCss,/\.authenticated-dashboard \.community-person\{min-height:196px/);
});
test('Integrated QA preserves hidden file inputs in account dialogs, suppresses programmatic heading focus outlines, prevents mobile table header word-splitting, and aligns AuthGate focus and action buttons',()=>{
 const authCss=readFileSync('src/auth.css','utf8'),accountCss=readFileSync('src/account.css','utf8'),uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.match(accountCss,/\.account-dialog \[hidden\],\.account-dialog input\[hidden\]\{display:none!important\}/);
 assert.match(uiCss,/\.account-dialog \[hidden\],\.account-dialog input\[hidden\]\{display:none!important\}/);
 assert.match(uiCss,/html h3\[tabindex='-1'\]:focus,html h3\[tabindex='-1'\]:focus-visible\{outline:none!important\}/);
 assert.match(uiCss,/\.authenticated-dashboard \.cell-table th\{white-space:nowrap\}/);
 assert.match(uiCss,/html\.authenticated-dashboard\[data-mode=dark\] \.shell \.side \.nav button\.active\{box-shadow:none!important\}/);
 assert.match(authCss,/\.dom-auth\{--app-focus:#f6c75b;/);
 assert.match(authCss,/\.dom-auth>section>\.account-secondary,\.dom-auth form \.account-secondary\{width:100%;/);
});


test('Final Sprint: reusable Study Area supports inline code and formula multiplication, chapter grouping, read badges, seamless Lesson-Question-Explanation navigation, and multi-course Computer Appreciation content',async()=>{
 await import('../public/dashboard/cell-content.js');
 await import('../public/dashboard/cell-learning.js');
 await import('../public/dashboard/cell-state.js');
 await import('../public/dashboard/cell-structure.js');
 const api=globalThis.DominanceCellStructure,cellData=globalThis.DominanceCellContent,cellLearning=globalThis.DominanceCellLearning;
 const uiCss=readFileSync('public/dashboard/workspace-ui.css','utf8');
 assert.match(uiCss,/\.authenticated-dashboard \.section-navigation\{grid-template-columns:minmax\(0,1fr\)\}/);
 assert.match(uiCss,/\.authenticated-dashboard \.lesson-list \.cell-chapter-heading/);
 assert.match(uiCss,/\.authenticated-dashboard \.lesson-list \.topicrow\[data-read=true\]::after\{content:'Read · →'/);
 assert.match(uiCss,/\.authenticated-dashboard \.cell-reader code\{/);
 assert.match(uiCss,/\.authenticated-dashboard #quizArea \.cell-related-lessons/);

 const formulaMd=api.markdown('Enter `=B2*$F$1` in D2.\nMultiplication uses *, division / and powers ^. =10/5*2 gives 4, whereas =10/(5*2) gives 1.\nThe source contrasts Price * Quantity with A1*B1 and uses *retention factor* as the term.');
 assert.match(formulaMd,/<code>=B2\*\$F\$1<\/code>/);
 assert.match(formulaMd,/=10\/5\*2 gives 4, whereas =10\/\(5\*2\) gives 1\./);
 assert.match(formulaMd,/Price \* Quantity with A1\*B1/);
 assert.match(formulaMd,/<em>retention factor<\/em>/);

 function makeHarness({data=cellData,learning=cellLearning,model=globalThis.DominanceCellState,stateKey='cellStructure',progressId='cellProgress'}={}){
  const nodes=new Map(),cache=new Map();let focused=false,course=data.course||'Cell Structure',lastTopic=null,courseOpened=false;
  class Node{
   constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.dataset={};this.className='';this.classes=new Set();this.classList={contains:n=>this.classes.has(n),toggle:(n,on)=>{if(on)this.classes.add(n);else this.classes.delete(n)}}}
   set id(v){this.identifier=v;nodes.set(v,this)}get id(){return this.identifier}
   set innerHTML(v){this.html=v;this.children=[]}get innerHTML(){return this.html||''}
   append(...c){this.children.push(...c)}before(n){nodes.set(n.id,n)}
   setAttribute(k,v){this.attributes[k]=v}getAttribute(k){return this.attributes[k]??null}
   querySelector(s){return s==='h2'?{setAttribute(){},focus(){}}:null}
   querySelectorAll(){return this.children.filter(n=>n.className?.includes('answer'))}
  }
  const document={createElement:t=>new Node(t),getElementById:id=>{if(!nodes.has(id)){const n=new Node('div');n.id=id}return nodes.get(id)}};
  const storage={getItem:k=>cache.get(k)??null,getConfirmedItem:k=>cache.get(k)??null,setItem:(k,v)=>{cache.set(k,v);return true}};
  const ctx={owner:'student-1',data,learning,model,stateKey,progressId,document,storage,context:()=>({scopes:['HB1:First'],scope:'HB1:First',course}),toast(){},newId:()=>'attempt-'+Math.random().toString(36).slice(2,8),openTopic:id=>{lastTopic=id},openCellCourse:()=>{courseOpened=true},showPractice(){},focus:v=>{focused=v},recorded(){},confirm:v=>v.onConfirm()};
  const pilot=api.create(ctx),walk=n=>[n,...(n.children||[]).flatMap(walk)],node=id=>document.getElementById(id);
  return{ctx,pilot,cache,node,walk,buttons:id=>walk(node(id)).filter(n=>n.tag==='button'),get focused(){return focused},get lastTopic(){return lastTopic},get courseOpened(){return courseOpened}};
 }

 const h=makeHarness();
 h.pilot.lesson('lesson:lesson_01:0');
 const markBtn=h.buttons('studyOutput').find(b=>b.textContent==='Mark lesson as read');
 markBtn.onclick();
 const pracBtn=h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson');
 assert.equal(pracBtn.dataset.questions,String(cellLearning.questionsFor(cellData,'lesson_01').length));
 h.pilot.lesson('block:microscopy');
 const chapters=h.walk(h.node('studyOutput')).filter(n=>n.className==='cell-chapter-heading').map(n=>n.textContent);
 assert.deepEqual(chapters,['Optical foundations','Imaging methods','Specimen preparation']);
 const lesson1Btn=h.buttons('studyOutput').find(b=>b.dataset.lesson==='lesson_01');
 assert.equal(lesson1Btn.dataset.read,'true');
 assert.equal(lesson1Btn.classList.contains('topicrow-read'),true);

 h.pilot.lesson('lesson:lesson_01:0');
 h.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();
 h.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();
 h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();
 h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
 const details=h.node('quizArea').children.find(n=>n.tag==='details');
 assert.match(details.children[0].textContent,/Lesson 1 — Why Microscopy Matters/);
 const returnBtn=h.buttons('quizArea').find(b=>b.textContent==='Return to study');
 assert.equal(returnBtn.dataset.targetTopic,'lesson:lesson_01:0');
 returnBtn.onclick();
 assert.equal(h.focused,false);
 assert.equal(h.courseOpened,true);
 assert.equal(h.lastTopic,'lesson:lesson_01:0');

 h.pilot.openTopics();
 const blockSelect=h.walk(h.node('cellPractice')).find(n=>n.getAttribute?.('aria-label')==='Practice block');
 blockSelect.value='organization';blockSelect.onchange();
 h.buttons('cellPractice').find(b=>b.textContent==='Start practice').onclick();
 h.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();
 h.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();
 h.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
 const blockReturn=h.buttons('quizArea').find(b=>b.textContent==='Return to study');
 assert.equal(blockReturn.dataset.targetTopic,'block:organization');
 const relatedBtns=h.buttons('quizArea').filter(b=>b.textContent.startsWith('Study Lesson '));
 assert.ok(relatedBtns.length>=2);
 relatedBtns[0].onclick();
 assert.equal(h.lastTopic,relatedBtns[0].dataset.targetTopic);

 const computerBlocks=[{id:'spreadsheet-foundations',title:'Spreadsheet Foundations',lessons:['CA01','CA03']}];
 const computerLearning={
  blocks:computerBlocks,
  parts:cellLearning.parts,
  resolveBlock:id=>computerBlocks.find(b=>id==='block:'+b.id||b.lessons.includes(id)),
  questionsFor:(d,sel)=>{const b=computerBlocks.find(x=>sel==='block:'+x.id);return d.questions.filter(q=>!sel||(b?b.lessons.includes(q.lesson):q.lesson===sel))},
  practiceLabel:(ids,d)=>{const g=new Set(ids.map(id=>computerLearning.resolveBlock(d.questions.find(q=>q.id===id)?.lesson)?.title).filter(Boolean));return g.size===1?[...g][0]:'Full course'},
  lessonTitle:cellLearning.lessonTitle,
  lessonLabel:l=>'Lesson '+(computerLearning.resolveBlock(l.id).lessons.indexOf(l.id)+1)+' — '+cellLearning.lessonTitle(l),
  sections:cellLearning.sections,
  route:(id,d)=>{if(typeof id!=='string')return null;const leg=computerLearning.resolveBlock(id);if(leg&&id.startsWith('block:'))return{block:leg};if(leg)return{block:leg,lesson:d.lessons.find(l=>l.id===id),part:null};const m=id.match(/^lesson:([\w]+):(\d+)$/);if(!m)return null;const l=d.lessons.find(x=>x.id===m[1]),b=l&&computerLearning.resolveBlock(l.id),p=Number(m[2]);return b&&p<cellLearning.sections(l).length?{block:b,lesson:l,part:p}:null},
  resumePart:cellLearning.resumePart,
  countOptions:cellLearning.countOptions,
  location:v=>{const res={};for(const [id,p]of Object.entries(v||{})){const b=computerBlocks.find(x=>x.id===id);if(!b||!b.lessons.includes(p?.section))throw Error('Invalid reading');res[id]=p}return res}
 };
 const computerData={
  course:'Computer Appreciation',
  lessons:[
   {id:'CA01',title:'CA01 — Workbook structure and cell addressing',markdown:'# Workbook structure\n## Cells and ranges\nA cell is identified by column and row, such as `B2`.\n**Optional check:** What identifies a cell? **Answer:** Its column letter and row number.',references:['CSM 177 PDF pp. 1–10']},
   {id:'CA03',title:'CA03 — Formulas, references and evaluation order',markdown:'# Formulas\n## Build a calculation\nWith quantity in B2 and unit price in C2, `=B2*C2` calculates the row cost. =10/5*2 gives 4, whereas =10/(5*2) gives 1.\n## Reference table\n| Reference | Fixed part | Copied |\n|---|---|---|\n| B2 | Neither | C3 |\n| $B$2 | Both | $B$2 |',references:['CSM 177 PDF pp. 21–35']}
  ],
  questions:[
   {id:'CA-Q016',lesson:'CA03',question:'What is the value of =6+27/3?',options:['11','15','9','18'],letter:'B',explanation:'Division precedes addition: 27/3=9, then 6+9=15.',pages:[[21,28]]}
  ]
 };
 const ch=makeHarness({data:computerData,learning:computerLearning,stateKey:'computerAppreciation',progressId:'computerProgress'});
 assert.equal(ch.pilot.course(),true);
 assert.equal(ch.pilot.lesson('lesson:CA03:0'),true);
 assert.match(ch.node('studyMeta').textContent,/Computer Appreciation · Spreadsheet Foundations/);
 ch.buttons('studyOutput').find(b=>b.textContent==='Practise this lesson').onclick();
 ch.buttons('quizArea').find(b=>b.className.startsWith('answer')).onclick();
 ch.buttons('quizArea').find(b=>b.textContent==='Review responses').onclick();
 ch.buttons('quizArea').find(b=>b.textContent.startsWith('Submit practice')).onclick();
 assert.equal(ch.cache.has('cellStructure'),false);
 assert.equal(ch.cache.has('computerAppreciation'),true);
 const compDetails=ch.node('quizArea').children.find(n=>n.tag==='details');
 compDetails.open=true;compDetails.ontoggle();
 assert.match(ch.walk(compDetails).map(n=>n.textContent||'').join(' '),/Source: CSM 177 lecturer PDF p\. 21–28/);
 const compReturn=ch.buttons('quizArea').find(b=>b.textContent==='Return to study');
 assert.equal(compReturn.dataset.targetTopic,'lesson:CA03:0');
 compReturn.onclick();
 assert.equal(ch.lastTopic,'lesson:CA03:0');
});
