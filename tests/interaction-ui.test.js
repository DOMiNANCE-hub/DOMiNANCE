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


