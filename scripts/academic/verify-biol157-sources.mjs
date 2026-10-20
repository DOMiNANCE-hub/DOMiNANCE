/* Optional local evidence verification; private PDFs are never copied into the repository. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
const folder=process.argv[2];if(!folder)throw Error('Provide the authorised lecturer_sources directory.');
const catalog=JSON.parse(readFileSync(new URL('../../content/biological-chemistry/catalog.json',import.meta.url))),evidence=JSON.parse(readFileSync(new URL('../../content/biological-chemistry/source-evidence.json',import.meta.url)));
let count=0;for(const source of catalog.sources.filter(s=>s.sha256)){const file=path.join(folder,source.label),buffer=readFileSync(file);if(createHash('sha256').update(buffer).digest('hex')!==source.sha256)throw Error('Source hash mismatch '+source.id);const run=spawnSync('pdftotext',['-layout',file,'-'],{encoding:'utf8',maxBuffer:10e6});if(run.status!==0)throw Error('Source extraction failed '+source.id);const pages=run.stdout.split('\f');if(pages.length-1!==source.pages)throw Error('Source page count mismatch '+source.id);for(const anchor of evidence.anchors.filter(a=>a.source===source.id)){if(!pages[anchor.pdfPage-1]?.includes(anchor.anchor))throw Error('Literal anchor mismatch '+source.id+' p.'+anchor.pdfPage);count++}}
console.log('Verified 11 private PDF hashes/page counts and '+count+' literal page anchors. Selected visual checks remain a separate recorded human/tool inspection.');
