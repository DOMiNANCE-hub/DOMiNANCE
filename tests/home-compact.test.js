import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import '../public/dashboard/cell-content.js';
import '../public/dashboard/cell-learning.js';
import '../public/dashboard/cell-state.js';
import '../public/dashboard/home-model.js';
import '../public/dashboard/home-ui.js';
const data=globalThis.DominanceCellContent,model=globalThis.DominanceHome,now=new Date('2026-10-18T12:00:00Z');
function pilot(){const value=globalThis.DominanceCellState.state(null,data);value.attempts=[{id:'real',completedAt:now.toISOString(),answers:data.questions.slice(0,2).map((q,i)=>({question:q.id,option:i?null:q.letter.charCodeAt(0)-65}))}];value.draft={format:2,id:'unfinished',questions:[data.questions[2].id],index:0,responses:{},phase:'answer'};return value}
test('Home counts valid completed pilot practice, excludes skipped answers and unfinished drafts',()=>{const items=model.records(null,null,now,JSON.stringify(pilot()),data),summary=model.summary(items,now);assert.equal(items.length,1);assert.equal(items[0].type,'Cell Structure');assert.equal(items[0].demo,false);assert.equal(summary.sessions,1);assert.equal(summary.questions,1);assert.equal(summary.accuracy,100);assert.equal(summary.dailyQuestions,1)});
test('Home excludes corrupt/foreign and future pilot attempts without altering source records',()=>{const value=pilot();value.attempts[0].answers[0].question='foreign';const raw=JSON.stringify(value);assert.equal(model.records(null,null,now,raw,data).length,0);assert.equal(JSON.stringify(value),raw);const future=pilot();future.attempts[0].completedAt='2027-01-01T00:00:00Z';assert.equal(model.records(null,null,now,JSON.stringify(future),data).length,0);assert.equal(model.records(null,null,now,'broken',data).length,0)});
test('Home combines demo and pilot sources without ID collisions or invented mastery',()=>{const demo=[{id:'cell:real',completedAt:now.toISOString(),total:3,correct:1,demo:true}],summary=model.summary(model.records(JSON.stringify(demo),null,now,JSON.stringify(pilot()),data),now);assert.equal(summary.sessions,2);assert.equal(summary.questions,4);assert.equal(summary.accuracy,50);assert.equal(summary.hasDemo,true);const skipped=pilot();skipped.attempts[0].answers.forEach(a=>a.option=null);const empty=model.summary(model.records(null,null,now,JSON.stringify(skipped),data),now);assert.equal(empty.sessions,1);assert.equal(empty.questions,0);assert.equal(empty.accuracy,null)});
function harness(){const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',children:[],dataset:{},parentElement:{},isConnected:true,open:false,contains:()=>false,classList:{contains:()=>true,toggle(){},remove(){},add(){}},querySelectorAll:()=>[],addEventListener(){},insertAdjacentHTML(where,text){this.innerHTML+=text},setAttribute(){},showModal(){this.open=true},close(){this.open=false;this.onclose?.()},focus(){document.activeElement=this}});return nodes.get(id)};const document={getElementById:node,activeElement:null,documentElement:{dataset:{motion:'reduced'}},addEventListener(){}};let launches=0;const ui=globalThis.DominanceHomeUI.create({document,window:{setInterval(){},requestAnimationFrame:fn=>fn()},profile:()=>({}),read:()=>null,confirmedRead:()=>null,cellData:data,pending:()=>[],resume:()=>null,scope:()=>'',policy:{courses:()=>[]},quickPractice:()=>launches++,navigate(){}});return{node,ui,document,get launches(){return launches}}}
test('planned tool entries explain their real status, Escape/native close can restore focus and Quick Practice uses its real destination',()=>{const h=harness(),origin=h.node('origin');h.document.activeElement=origin;for(const id of Object.keys(model.tools)){h.ui.openTool(id);assert.equal(h.node('homeToolDialog').open,true);assert.equal(h.node('homeToolTitle').textContent,model.tools[id].title);assert.match(h.node('homeToolDescription').textContent,/planned|prepared|not connected/);h.node('homeToolClose').onclick();assert.equal(h.document.activeElement,origin)}h.ui.openTool('constructor');assert.equal(h.node('homeToolDialog').open,false);h.ui.openPractice();assert.equal(h.launches,1)});
test('Home Practise now button invokes the guarded practice callback without a global controller',()=>{
 const html=readFileSync('public/dashboard/index.html','utf8');
 const button=html.match(/<button\b([^>]*)>Practise now →<\/button>/);
 assert.ok(button,'Home has a Practise now button');
 const id=button[1].match(/\bid="([^"]+)"/);
 assert.ok(id,'the Home controller can address the actual button');
 assert.doesNotMatch(button[1],/\bonclick=/,'the button must not resolve a private controller through a global inline handler');
 const h=harness();
 assert.equal(typeof h.node(id[1]).onclick,'function','initialization binds the actual Home button');
 assert.equal(globalThis.homeUI,undefined);
 h.node(id[1]).onclick();
 assert.equal(h.launches,1,'click dispatches the existing curriculum-aware practice callback exactly once');
});
test('compact Home puts real study before tools and spotlight and retains every primary entry',()=>{const html=readFileSync('public/dashboard/index.html','utf8'),home=html.slice(html.indexOf('<section class="view active home-compact"'),html.indexOf('<section class="view" id="courses"'));assert.ok(home.indexOf('home-actions')<home.indexOf('home-momentum'));assert.ok(home.indexOf('home-momentum')<home.indexOf('id="homeTools"'));assert.ok(home.indexOf('id="homeTools"')<home.indexOf('id="homeSpotlight"'));for(const title of ['Speed Race','LAMLA','My Weak Spots','The Arena'])assert.ok((home+readFileSync('public/dashboard/home-ui.js','utf8')).includes(title));assert.match(home,/Coming soon/);assert.match(home,/homeToolDescription/);assert.doesNotMatch(home,/mastery journey|Example: 68%/)});
