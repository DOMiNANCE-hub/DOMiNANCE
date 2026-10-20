const {chromium}=await import(process.argv[2]||'playwright');
import assert from 'node:assert/strict';
// Optional Playwright check against the local built preview; never load a live Firebase root.
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(10000);page.on('pageerror',error=>{errors.push(error.message);console.log('PAGE_ERROR',error.message)});
 await page.route('**/*',async route=>{
  const url=new URL(route.request().url());
  if(url.origin!=='http://127.0.0.1:4173')return route.abort();
  if(url.pathname==='/fixture')return route.fulfill({contentType:'text/html',body:'<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><iframe src="/dashboard/index.html" style="width:100%;height:1200px;border:0"></iframe></body></html>'});
  return route.continue();
 });
 await page.goto('http://127.0.0.1:4173/fixture');
 const frame=page.frames().find(f=>f.url().includes('/dashboard/index.html'));
 await frame.waitForFunction(()=>typeof initializeDashboard==='function',null,{timeout:10000});
 const original=JSON.stringify({version:1,lessons:{CA01:'2026-10-19T12:00:00Z'},attempts:[{id:'owned-history',completedAt:new Date().toISOString(),answers:[{question:'CA-Q001',option:0}]}],draft:{format:2,id:'saved-draft',questions:['CA-Q001'],index:0,responses:{'CA-Q001':0},phase:'answer'}});
 await frame.evaluate(raw=>{
  const records=new Map([['computerAppreciation',raw]]);window.__savedComputer=raw;
  window.__testStorage={getItem:key=>records.get(key)??null,getConfirmedItem:key=>records.get(key)??null,setItem:(key,value)=>{records.set(key,value);return true},pendingKeys:()=>[]};
  initializeDashboard({profile:{id:'fictional-local-fixture',name:'Fictional Gate Review',year:'HB1',semester:'First',role:'student',courses:[]},storage:window.__testStorage});
 },original);
 assert.equal(await frame.evaluate(()=>DominanceComputerContent.status),'academic-release-blocked');
 await frame.evaluate(()=>openCourse('Computer Appreciation','HB1 · Semester 1'));
 await frame.getByRole('button',{name:'Open Study Blocks',exact:true}).click();
 await frame.getByText(/Coming Soon — reviewed content is not available/).waitFor();
 assert.equal(await frame.locator('#cellSection').count(),0);
 await frame.evaluate(()=>showView('practice'));
 await frame.getByRole('button',{name:'Open Topic Questions',exact:true}).click();
 assert.deepEqual(await frame.locator('select[aria-label="Practice course"] option').evaluateAll(nodes=>nodes.map(n=>n.value)),['Cell Structure']);
 await frame.evaluate(()=>showView('progress'));
 await frame.locator('#computerProgress').getByText(/Content is held for academic review/).waitFor();
 assert.equal(await frame.evaluate(()=>__testStorage.getItem('computerAppreciation')),original);
 await frame.evaluate(()=>showView('home'));
 assert.equal(await frame.locator('#homeQuestions').innerText(),'1');
 await page.screenshot({path:'/tmp/csm177-student-gate.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS: built student asset blocks Computer reader/practice, preserves old draft/history, and counts confirmed past activity; no Firebase client loaded or production requests.');
}finally{await browser.close()}
