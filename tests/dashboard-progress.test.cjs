const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../public/dashboard/index.html'), 'utf8');
const source = html.split('const academicPolicy=DominanceCurriculum;')[1].split('/* dashboard setup */')[0];
function setup(account='alice',year='HB1',semester='First',courses=[]) {
 const data=new Map(),nodes=new Map();let blocked=false;
 const node=id=>{if(!nodes.has(id))nodes.set(id,{textContent:'',innerHTML:'',value:'',classList:{contains:()=>false,add(){},remove(){},toggle(){}},querySelectorAll:()=>[]});return nodes.get(id)};
 const context=vm.createContext({URLSearchParams,Date,Math,JSON,Number,Infinity,location:{search:'?'+new URLSearchParams({account,year,semester,courses:JSON.stringify(courses)})},localStorage:{getItem:key=>{if(blocked)throw Error('blocked');return data.get(key)??null},setItem:(key,value)=>{if(blocked)throw Error('blocked');data.set(key,value)}},document:{getElementById:node,querySelectorAll:()=>[],querySelector:()=>({disabled:false,setAttribute(){},focus(){}}),createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}})},setTimeout(){},window:{scrollTo(){}}});
 vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../public/dashboard/curriculum.js'),'utf8'),context);context.session={profile:{id:account,year,semester,courses},storage:{getItem:key=>context.localStorage.getItem('dominance:'+account+':'+key),setItem:(key,value)=>{try{context.localStorage.setItem('dominance:'+account+':'+key,value);return true}catch{return false}}}};vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../public/dashboard/cell-content.js'),'utf8'),context);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../public/dashboard/cell-learning.js'),'utf8'),context);vm.runInContext('let cellPilot=null;let homeUI;const academicPolicy=DominanceCurriculum;'+source,context);
 return {context,data,node,run:code=>vm.runInContext(code,context),block:()=>{blocked=true}};
}
test('empty and invalid histories do not invent progress',()=>{
 const s=setup();assert.equal(s.run('progressTotals().accuracy'),null);
 s.data.set('dominance:alice:scores','broken');s.data.set('dominance:alice:lamlaScores','{}');
 assert.equal(s.run('progressTotals().total'),0);
 s.data.set('dominance:alice:scores',JSON.stringify([{course:'A',correct:7,total:3}]));assert.equal(s.run('progressTotals().attempts.length'),0);
});
test('weighted totals and timestamps combine both histories; legacy is preserved',()=>{
 const s=setup();s.data.set('dominance:alice:scores',JSON.stringify([{course:'A',correct:4,total:5,completedAt:'2026-10-12T10:00:00Z'},{course:'Old',correct:1,total:2,date:'10/9/2026'}]));
 s.data.set('dominance:alice:lamlaScores',JSON.stringify([{course:'B',score:1,total:3,completedAt:'2026-10-12T11:00:00Z'}]));
 assert.equal(s.run('progressTotals().accuracy'),60);assert.equal(s.run('readProgressAttempts()[0].course'),'B');assert.equal(s.run('readProgressAttempts()[2].course'),'Old');
});
test('saving is account scoped and duplicate IDs record once',()=>{
 const s=setup();s.data.set('dominance:bob:scores','[]');
 assert.equal(s.run("saveAttempt('scores',{id:'one',course:'A',correct:1,total:3,demo:true})"),true);
 s.run("saveAttempt('scores',{id:'one',course:'A',correct:1,total:3,demo:true})");
 assert.equal(s.run('progressTotals().attempts.length'),1);assert.equal(s.data.get('dominance:bob:scores'),'[]');
});
test('damaged history and blocked storage fail safely without overwriting',()=>{
 const s=setup();s.data.set('dominance:alice:scores','broken');
 assert.equal(s.run("saveAttempt('scores',{id:'x',course:'A',correct:1,total:3})"),false);assert.equal(s.data.get('dominance:alice:scores'),'broken');
 s.block();assert.equal(s.run("saveAttempt('scores',{id:'x',course:'A',correct:1,total:3})"),false);assert.equal(s.run('progressTotals().total'),0);
});
test('history escapes saved text and updates immediately',()=>{
 const s=setup();s.data.set('dominance:alice:scores',JSON.stringify([{course:'<img src=x>',correct:1,total:3,date:'<script>'}]));s.run('updateProgress()');
 assert.equal(s.node('homeQuestions').textContent,3);assert.match(s.node('homeActivity').innerHTML,/&lt;img/);assert.doesNotMatch(s.node('homeActivity').innerHTML,/<script>/);
});
test('LAMLA uses the built sheet context, locks answers, and saves once',()=>{
 const s=setup();s.run("window.lamlaTest=[{a:0},{a:1},{a:0}];window.lamlaPicked={0:0,1:1,2:0};window.lamlaContext={course:'Cell Structure',topic:'Transport'};window.lamlaAttemptId='lamla-one';refreshProgress=()=>updateProgress()");
 s.node('lamlaCourse').value='Changed after build';s.run('finishLamla();finishLamla();pickLamla(0,1,null)');
 assert.equal(s.run('progressTotals().attempts.length'),1);assert.equal(s.run('readProgressAttempts()[0].course'),'Cell Structure');assert.equal(s.run('window.lamlaPicked[0]'),0);assert.equal(s.node('homeQuestions').textContent,3);
});
test('quiz retry after failed saving does not count its final answer twice',()=>{
 const s=setup();s.run("window.quizRecorded=false;window.quizAttemptId='quiz-one';window.quizCourse='Demo';questionIndex=2;correct=2;answered=2;selectedAnswer=0;refreshProgress=()=>updateProgress()");
 s.data.set('dominance:alice:scores','broken');s.run('nextQuestion()');assert.equal(s.run('answered'),2);
 s.data.set('dominance:alice:scores','[]');s.run('nextQuestion();nextQuestion()');assert.equal(s.run('progressTotals().total'),3);assert.equal(s.run('progressTotals().correct'),3);
});
test('corrupt resume is ignored and HB3 practice renders an empty state',()=>{
 const s=setup('alice','HB3');s.data.set('dominance:alice:lastPlace','broken');assert.equal(s.run('readResume()'),null);s.run('renderPracticeGrid()');assert.match(s.node('practiceGrid').innerHTML,/No practice library/);
});

test('complete dashboard script parses and navigation has five primary tabs',()=>{new vm.Script(html.split('<script>')[1].split('</script>')[0]);const nav=html.match(/<nav class="nav">([\s\S]*?)<\/nav>/)[1];assert.equal((nav.match(/data-view=/g)||[]).length,5);for(const view of ['home','courses','practice','community','progress'])assert.ok(nav.includes('data-view="'+view+'"'));assert.ok(fs.readFileSync(require('node:path').join(__dirname,'../public/dashboard/polish.css'),'utf8').includes('width:20%'));});

test('HB1 sees only its current and completed semester',()=>{const first=setup();assert.equal(first.run('allowedScopes.join()'),'HB1:First');const second=setup('alice','HB1','Second');assert.equal(second.run('defaultScope'),'HB1:Second');assert.equal(second.run('allowedScopes.join()'),'HB1:First,HB1:Second');first.run("selectAcademicScope('HB2:Annual')");assert.equal(first.run('selectedScope'),'HB1:First');});
test('HB2 and HB3 have annual current years and earlier curriculum',()=>{const second=setup('alice','HB2','Second');assert.equal(second.run('defaultScope'),'HB2:Annual');assert.equal(second.run('allowedScopes.join()'),'HB2:Annual,HB1:First,HB1:Second');const third=setup('alice','HB3');assert.equal(third.run('allowedScopes.join()'),'HB3:Annual,HB2:Annual,HB1:First,HB1:Second');});
test('Home uses selected current courses without changing revision context',()=>{const s=setup('alice','HB1','Second',['Physiology I','Cell Structure']);s.run("selectedScope='HB1:First';renderHome()");assert.match(s.node('homeCourseGrid').innerHTML,/Physiology I/);assert.doesNotMatch(s.node('homeCourseGrid').innerHTML,/Cell Structure/);assert.equal(s.run('selectedScope'),'HB1:First');});
test('resume preserves earlier-year scope and rejects future-year records',()=>{const s=setup('alice','HB2');s.data.set('dominance:alice:lastPlace',JSON.stringify({level:'HB1',semester:'Semester 2',course:'Physiology I',topic:'Introduction and core concepts'}));assert.equal(s.run('readResume().semester'),'Second');s.data.set('dominance:alice:lastPlace',JSON.stringify({level:'HB3',semester:'Annual',course:'Imagined course'}));assert.equal(s.run('readResume()'),null);});

test('demo exit requires explicit confirmation; completed attempts return directly',()=>{const s=setup();let action;s.context.capture=o=>{action=o};s.run('confirmStudyExit=capture;window.quizRecorded=false');s.node('quizArea').innerHTML='answers';s.run('exitDemoQuiz()');assert.equal(s.node('quizArea').innerHTML,'answers');assert.equal(action.heading,'Leave this practice?');action.onConfirm();assert.equal(s.node('quizArea').innerHTML,'');s.run('window.quizRecorded=true;confirmStudyExit=()=>{throw Error("must not confirm")};exitDemoQuiz()');});
test('confirmation defaults to cancel, restores focus and executes only explicit approval',()=>{const s=setup();let focused=0,confirmed=0;const dialog=s.node('studyExitDialog');dialog.showModal=()=>{dialog.open=true};dialog.close=()=>{dialog.open=false;dialog.onclose()};s.context.document.activeElement={focus:()=>focused++};s.node('studyExitCancel').focus=()=>focused++;s.context.approve=()=>confirmed++;s.run('confirmStudyExit({heading:"Leave?",description:"Discard",onConfirm:approve})');assert.equal(focused,1);s.node('studyExitCancel').onclick();assert.equal(confirmed,0);assert.equal(focused,2);s.run('confirmStudyExit({heading:"Leave?",description:"Discard",onConfirm:approve})');dialog.oncancel();dialog.close();assert.equal(confirmed,0);s.run('confirmStudyExit({heading:"Leave?",description:"Discard",onConfirm:approve})');s.node('studyExitConfirm').onclick();assert.equal(confirmed,1);});

test('answer selection updates one pressed option, can change, and completes exactly once',()=>{const s=setup(),buttons=Array.from({length:4},()=>({selected:false,attributes:{},classList:{toggle(name,active){this.owner.selected=active}},setAttribute(name,value){this.attributes[name]=value}}));buttons.forEach(b=>b.classList.owner=b);s.context.document.querySelectorAll=selector=>selector==='#quizArea .answer'?buttons:[];s.run("window.quizRecorded=false;window.quizAttemptId='selection-demo';window.quizCourse='Demo';questionIndex=0;correct=0;answered=0;selectedAnswer=null;renderQuestion=()=>{};refreshProgress=()=>{}");s.run('selectAnswer(0)');assert.equal(buttons[0].attributes['aria-pressed'],'true');s.run('selectAnswer(1)');assert.equal(buttons[0].attributes['aria-pressed'],'false');assert.equal(buttons[1].selected,true);assert.equal(buttons.filter(b=>b.selected).length,1);s.run('selectAnswer(-1)');assert.equal(s.run('selectedAnswer'),1);s.run('nextQuestion()');assert.equal(s.run('questionIndex'),1);assert.equal(s.run('selectedAnswer'),null);s.run('selectAnswer(2);nextQuestion();selectAnswer(0);nextQuestion();nextQuestion();selectAnswer(1)');assert.equal(s.run('window.quizRecorded'),true);assert.equal(s.run('progressTotals().attempts.length'),1);assert.equal(s.run('progressTotals().correct'),3);assert.equal(s.run('selectedAnswer'),0);});

test('Continue Learning has no fabricated fallback and resumes a real course/topic',()=>{const s=setup();s.run('setResumeCopy()');assert.equal(s.node('resumeAction').textContent,'Explore My Courses →');let calls=[];s.context.record=x=>calls.push(x);s.run('showView=record;resumeLast()');assert.deepEqual(calls,['courses']);s.data.set('dominance:alice:lastPlace',JSON.stringify({level:'HB1',semester:'First',course:'Cell Structure',topic:'Functions and mechanisms',stage:'study'}));s.context.course=c=>calls.push(c);s.context.topic=t=>calls.push(t);s.run('openCourse=course;openTopic=topic;setResumeCopy();resumeLast()');assert.equal(s.node('resumeAction').textContent,'Continue Learning →');assert.deepEqual(calls,['courses','Cell Structure','Functions and mechanisms']);});
test('Home empty courses do not substitute compulsory selections and previews remain honest',()=>{const s=setup();s.run('renderHome()');assert.match(s.node('homeCourseGrid').innerHTML,/No featured courses selected/);assert.match(s.node('homeCourseGrid').innerHTML,/openCourses/);assert.match(html,/homeRace/);assert.match(html,/Classmates, challenges and sharing are not connected/);assert.ok(html.includes(`onclick="showView('practice')">Open Practice`));});
test('Weekly Revision window uses Ghana dates and explicitly remains unavailable',()=>{const s=setup();assert.match(s.run("weeklyRevisionCopy(new Date('2026-10-16T12:00:00Z'))"),/It is the Friday–Sunday/);assert.match(s.run("weeklyRevisionCopy(new Date('2026-10-14T12:00:00Z'))"),/Plan a Friday–Sunday/);});

test('eligible courses without content still open exactly three honest destinations',()=>{const s=setup();s.run("openCourse('Basic Medical Chemistry','HB1 · Semester 1')");const html=s.node('topicList').innerHTML;assert.equal((html.match(/class="panel destination-card"/g)||[]).length,3);assert.match(html,/Study Blocks/);assert.match(html,/Summaries/);assert.match(html,/LAMLA/);assert.match(html,/Awaiting approved course content/);assert.doesNotMatch(html,/Course outline|Introduction and core concepts/)});
