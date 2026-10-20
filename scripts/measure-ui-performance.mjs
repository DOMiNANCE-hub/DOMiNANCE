import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
import {performance} from 'node:perf_hooks';
import '../public/dashboard/cell-content.js';
import '../public/dashboard/cell-learning.js';
const manifestPath='dist/.vite/manifest.json';
const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):null;
const initial=new Set();
function include(key){const chunk=manifest[key];if(!chunk||initial.has(chunk.file))return;initial.add(chunk.file);for(const dependency of chunk.imports||[])include(dependency)}
if(manifest){for(const [key,chunk]of Object.entries(manifest))if(chunk.isEntry)include(key)}else{const html=fs.readFileSync('dist/index.html','utf8');for(const match of html.matchAll(/src="\/(assets\/[^"]+\.js)"/g))initial.add(match[1])}
const files=fs.readdirSync('dist/assets').filter(name=>name.endsWith('.js')).map(name=>'assets/'+name);
const sizes=list=>list.reduce((total,file)=>{const bytes=fs.readFileSync(path.join('dist',file));return{bytes:total.bytes+bytes.length,gzipBytes:total.gzipBytes+gzipSync(bytes).length}},{bytes:0,gzipBytes:0});
const samples=[];let sections=0;
for(let run=0;run<5;run++){const start=performance.now();for(let repeat=0;repeat<300;repeat++)for(const lesson of globalThis.DominanceCellContent.lessons)sections+=globalThis.DominanceCellLearning.sections(lesson).length;samples.push(performance.now()-start)}
samples.sort((a,b)=>a-b);
console.log(JSON.stringify({initialJavaScript:sizes([...initial]),deferredJavaScript:sizes(files.filter(file=>!initial.has(file))),initialFiles:[...initial],lessonParsing:{callsPerRun:300*46,medianMs:Number(samples[2].toFixed(2)),samplesMs:samples.map(n=>Number(n.toFixed(2))),sections}},null,2));
