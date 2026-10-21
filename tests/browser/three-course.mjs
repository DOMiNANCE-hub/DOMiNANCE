const {chromium}=await import(process.argv[2]||'playwright');
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5179/');
 await page.getByRole('button',{name:'Create an account',exact:true}).click();
 await page.getByLabel('Full name').fill('Fictional Biological Reader');
 await page.getByLabel('Email',{exact:true}).fill('biol-browser-'+Date.now()+'@example.invalid');
 await page.getByLabel('Password',{exact:true}).fill('Fictional-test-123!');
 await page.getByRole('button',{name:'Create free account'}).click();
 await page.getByLabel('Display name',{exact:true}).fill('Fictional Biological Reader');
 await page.getByRole('button',{name:'Enter DOMiNANCE →'}).click();
 const frame=page.frameLocator('iframe');
 await frame.getByRole('button',{name:'My Courses',exact:true}).first().click();
 await frame.locator('.course').filter({hasText:'Biological Chemistry'}).click();
 await frame.getByRole('button',{name:'Open Study Blocks',exact:true}).click();
 assert.equal(await frame.locator('.cell-block-card').count(),10);
 await frame.getByRole('button',{name:'Open Lipids',exact:true}).click();
 assert.equal(await frame.getByText(/Teaching for this unit has not yet been authored/).count(),0);
 let dashboard=page.frames().find(f=>f.url().includes('/dashboard/index.html'));
 const availableUnits=await dashboard.evaluate(()=>DominanceBiologicalContent.units.map(u=>({id:u.id,status:u.status,count:u.lessons.length})));assert.equal(availableUnits.length,10);assert.ok(availableUnits.every(u=>u.status==='draft-review'&&u.count>0));
 for(const u of availableUnits){await dashboard.evaluate(id=>openTopic('block:'+id),u.id);assert.equal(await frame.getByText(/Teaching for this unit has not yet been authored/).count(),0);assert.equal(await frame.locator('#studyOutput .lesson-list .topicrow').count(),u.count,u.id);}

 const bioCount=await dashboard.evaluate(()=>DominanceBiologicalContent.questions.length);
 await dashboard.evaluate(()=>openTopic('lesson:BC0104:1'));
 await frame.getByRole('heading',{name:'Bonding capacity and molecular diversity',exact:true}).waitFor();
 await frame.getByRole('button',{name:'Mark lesson as read',exact:true}).click();
 await frame.getByRole('button',{name:'Practise this concept',exact:true}).click();
 await frame.locator('.answer').first().click();
 await frame.getByRole('button',{name:'← Exit practice',exact:true}).click();
 await frame.locator('#studyExitConfirm').click();
 await frame.getByRole('button',{name:'Open Topic Questions',exact:true}).click();
 await frame.getByRole('button',{name:'Resume unfinished practice',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:/^Submit practice/}).click();
 await frame.getByText('Practice results',{exact:true}).waitFor();
 await frame.locator('#quizArea summary').first().click();
 await frame.getByRole('button',{name:'Study this concept',exact:true}).click();
 await frame.getByRole('heading',{name:'Bonding capacity and molecular diversity',exact:true}).waitFor();
 await frame.getByRole('button',{name:'Practise this concept',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:/^Submit practice/}).click();
 await frame.getByRole('button',{name:'Return to Topic Questions',exact:true}).click();
 await frame.locator('select[aria-label="Practice block"]').selectOption('',{force:true});
 await frame.locator('select[aria-label="Question count"]').selectOption(String(bioCount),{force:true});
 await frame.getByRole('button',{name:'Start practice',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:'Submit practice ('+bioCount+' unanswered)',exact:true}).click();
 await frame.getByText('Practice results',{exact:true}).waitFor();
 await frame.getByRole('button',{name:'Retry this selection',exact:true}).click();
 await frame.getByText('Question 1 of '+bioCount+' · Untimed',{exact:true}).waitFor();
 await frame.getByRole('button',{name:'← Exit practice',exact:true}).click();
 await frame.locator('#studyExitConfirm').click();
 await page.reload();
 await frame.getByRole('button',{name:'Practice',exact:true}).first().click();
 await frame.getByRole('button',{name:'Open Topic Questions',exact:true}).click();
 // The registry starts in Cell Structure after reload; select the course explicitly.
 await frame.locator('select[aria-label="Practice course"]').selectOption('Biological Chemistry',{force:true});
 await frame.getByRole('button',{name:'Resume unfinished practice',exact:true}).click();
 await frame.getByText('Question 1 of '+bioCount+' · Untimed',{exact:true}).waitFor();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:'Submit practice ('+bioCount+' unanswered)',exact:true}).click();
 await frame.getByRole('button',{name:'Return to study',exact:true}).click();
 console.log('PASS: ten-unit catalogue, all ten authored draft units, independent study, concept practice, exit/resume, exact feedback link, all available Bio questions/retry/reload.');
 dashboard=page.frames().find(f=>f.url().includes('/dashboard/index.html'));
 const routes=await dashboard.evaluate(()=>DominanceBiologicalContent.lessons.map(l=>({id:l.id,parts:DominanceBiologicalLearning.sections(l).length})));
 const seenFigures=new Set();
 await page.setViewportSize({width:390,height:844});
 for(const route of routes)for(let part=0;part<route.parts;part++){
  await dashboard.evaluate(({id,part})=>openTopic('lesson:'+id+':'+part),{id:route.id,part});
  await dashboard.locator('#cellSection').waitFor({state:'visible',timeout:5000});
  for(const figure of await dashboard.locator('#cellSection .academic-figure').all()){const id=await figure.getAttribute('data-figure-id');seenFigures.add(id);const clipped=await figure.locator('svg').evaluate(svg=>{const v=svg.viewBox.baseVal;return [...svg.querySelectorAll('text')].filter(t=>{const b=t.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height}).map(t=>t.textContent)});assert.deepEqual(clipped,[],id);await figure.screenshot({path:'/tmp/'+id+'.png'})}
  assert.equal(await dashboard.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,route.id+':'+part);
 }
 assert.equal(seenFigures.size,await dashboard.evaluate(()=>DominanceBiologicalContent.figures?.length||0));
 console.log('PASS:',seenFigures.size,'academic figures render without clipped labels.');
 await page.screenshot({path:'/tmp/biol157-mobile.png'});
 console.log('PASS:',routes.length,'lessons /',routes.reduce((n,l)=>n+l.parts,0),'sections at390px.');
 // New content uses native concept practice and precise feedback routes.
 for(const [route,lecture,label] of [['lesson:BC0503:1',5,'Unit 5'],['lesson:BC0606:1',6,'Unit 6'],['lesson:BC0703:1',7,'Unit 7'],['lesson:BC0806:1',8,'Unit 8'],['lesson:BC0902:1',9,'Unit 9'],['lesson:BC1015:1',10,'Unit 10']]){
  await dashboard.evaluate(route=>openTopic(route),route);
  await frame.getByRole('button',{name:'Practise this concept',exact:true}).click();
  await frame.locator('.answer').first().click();
  await frame.getByRole('button',{name:'Review responses',exact:true}).click();
  await frame.getByRole('button',{name:/^Submit practice/}).click();
  const details=frame.locator('#quizArea details').first();await details.locator('summary').click();
  await details.getByText(new RegExp('^Source: BIOL 157_Lecture '+lecture)).waitFor();
  const stem=await details.locator('h3').textContent();
  const expectedTitle=await dashboard.evaluate(stem=>{const q=DominanceBiologicalContent.questions.find(q=>q.question===stem),l=DominanceBiologicalContent.lessons.find(l=>l.id===q.lesson);return l.sections.find(s=>s.id===q.sectionId).title},stem);
  await frame.getByRole('button',{name:'Study this concept',exact:true}).click();
  await frame.getByRole('heading',{name:expectedTitle,exact:true}).waitFor();
  console.log('PASS:',label,'concept practice, source feedback and exact note-section return.');
 }
 // Combined app regression against the existing Cell bank.
 await dashboard.evaluate(()=>openCourse('Cell Structure','HB1 · Semester 1'));
 await dashboard.evaluate(()=>openTopic('lesson:CO01:0'));
 await frame.getByRole('button',{name:'Practise this lesson',exact:true}).click();
 await frame.locator('.answer').first().click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:/^Submit practice/}).click();
 await frame.getByText('Practice results',{exact:true}).waitFor();

 await frame.getByRole('button',{name:'Return to Topic Questions',exact:true}).click();
 await frame.locator('select[aria-label="Practice block"]').selectOption('',{force:true});
 await frame.locator('select[aria-label="Question count"]').selectOption('178',{force:true});
 await frame.getByRole('button',{name:'Start practice',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:'Submit practice (178 unanswered)',exact:true}).click();
 for(let index=170;index<178;index++){
  const details=frame.locator('#quizArea details').nth(index);await details.locator('summary').click();await details.getByText(/^Source: BIOL 151 Cell Structure/).waitFor();
 }
 await frame.getByRole('button',{name:'Return to study',exact:true}).click();
 const cellRoutes=await dashboard.evaluate(()=>DominanceCellContent.lessons.map(l=>({id:l.id,parts:DominanceCellLearning.sections(l).length}))),cellFigures=new Set();
 for(const route of cellRoutes)for(let part=0;part<route.parts;part++){
  await dashboard.evaluate(({id,part})=>openTopic('lesson:'+id+':'+part),{id:route.id,part});
  await dashboard.locator('#cellSection').waitFor({state:'visible',timeout:5000});
  for(const figure of await dashboard.locator('#cellSection .academic-figure').all()){
   const id=await figure.getAttribute('data-figure-id');cellFigures.add(id);
   const clipped=await figure.locator('svg').evaluate(svg=>{const v=svg.viewBox.baseVal;return [...svg.querySelectorAll('text')].filter(t=>{const b=t.getBBox();return b.x<0||b.y<0||b.x+b.width>v.width||b.y+b.height>v.height}).map(t=>t.textContent)});assert.deepEqual(clipped,[],id);await figure.screenshot({path:'/tmp/'+id+'.png'});
  }
  assert.equal(await dashboard.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth),true,route.id+':'+part);
 }
 assert.equal(cellFigures.size,await dashboard.evaluate(()=>DominanceCellContent.figures.length));
 console.log('PASS:',cellRoutes.length,'Cell lessons /',cellRoutes.reduce((n,l)=>n+l.parts,0),'sections /',cellFigures.size,'figures at390px, plus all eight new-question citations.');
 await dashboard.evaluate(()=>openCourse('Computer Appreciation','HB1 · Semester 1'));
 await dashboard.evaluate(()=>openTopic('lesson:CA10:0'));
 await frame.getByRole('button',{name:'Practise this lesson',exact:true}).click();
 await frame.locator('.answer').first().click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:/^Submit practice/}).click();
 await frame.locator('#quizArea summary').first().click();
 await frame.getByText(/^Source: CSM 177 lecturer PDF/).waitFor();
 const powerpointStem=await frame.locator('#quizArea h3').first().textContent(),powerpointTarget=await dashboard.evaluate(stem=>DominanceComputerContent.questions.find(q=>q.question===stem).studyTarget.sectionTitle,powerpointStem);
 await frame.getByRole('button',{name:'Study this concept',exact:true}).click();
 await frame.getByRole('heading',{name:powerpointTarget,exact:true}).waitFor();
 console.log('PASS: PowerPoint result opens its reviewed exact teaching section.');
 await frame.getByRole('button',{name:'← Computer Appreciation',exact:true}).click();
 await frame.getByRole('button',{name:'Practice',exact:true}).first().click();
 await frame.getByRole('button',{name:'Open Topic Questions',exact:true}).click();
 await frame.locator('select[aria-label="Practice block"]').selectOption('',{force:true});
 await frame.locator('select[aria-label="Question count"]').selectOption('114',{force:true});
 await frame.getByRole('button',{name:'Start practice',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:'Submit practice (114 unanswered)',exact:true}).click();
 await frame.getByRole('button',{name:'Return to study',exact:true}).click();
 await dashboard.evaluate(()=>openTopic('lesson:CA03:0'));
 await frame.getByRole('button',{name:'Practise this lesson',exact:true}).click();
 await frame.getByRole('button',{name:'Review responses',exact:true}).click();
 await frame.getByRole('button',{name:/^Submit practice/}).click();
 await frame.locator('#quizArea summary').first().click();
 const excelStem=await frame.locator('#quizArea h3').first().textContent(),excelTarget=await dashboard.evaluate(stem=>DominanceComputerContent.questions.find(q=>q.question===stem).studyTarget.sectionTitle,excelStem);
 await frame.getByRole('button',{name:'Study this concept',exact:true}).click();
 await frame.getByRole('heading',{name:excelTarget,exact:true}).waitFor();
 await frame.getByRole('button',{name:'← Computer Appreciation',exact:true}).click();
 console.log('PASS: Excel formula feedback opens its reviewed exact teaching section.');
 await dashboard.evaluate(()=>showView('progress'));
 await frame.locator('#biologicalProgress').waitFor({state:'visible'});
 await frame.locator('#computerProgress').waitFor({state:'visible'});
 await frame.locator('#cellProgress').waitFor({state:'visible'});
 const counts=await dashboard.evaluate(()=>[DominanceCellContent.questions.length,DominanceComputerContent.questions.length,DominanceBiologicalContent.questions.length]);assert.deepEqual(counts,[178,114,bioCount]);
 assert.deepEqual(errors,[]);console.log('PASS: all three courses in one app; full available course pools submissions, source feedback and all three progress panels. No page errors.');

}finally{await browser.close()}
