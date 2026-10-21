/* Optional source-evidence check. Authorised PDF stays outside the repository. */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const file=process.argv[2];if(!file)throw Error('Provide the authorised 410-page BIOL151 lecturer PDF path.');
const evidence=JSON.parse(readFileSync(new URL('../../content/cell-structure/review/source-evidence.json',import.meta.url)));
const hash=value=>createHash('sha256').update(value).digest('hex');
if(hash(readFileSync(file))!==evidence.sha256)throw Error('Cell source PDF hash mismatch');
const result=spawnSync('pdftotext',['-layout',file,'-'],{encoding:'utf8',maxBuffer:10e6});
if(result.status!==0)throw Error('Cell PDF extraction failed');
const pages=result.stdout.split('\f');if(pages.length-1!==evidence.pages)throw Error('Cell PDF page count mismatch');
for(const row of evidence.textPagesInspected){const text=pages[row.page-1];if(hash(text)!==row.textSha256||!text.replace(/\s+/g,' ').trim().includes(row.anchor))throw Error('Cell page evidence mismatch on actual PDF p.'+row.page)}
console.log('Verified private Cell PDF identity, 410 actual pages and '+evidence.textPagesInspected.length+' selected text-page hashes/anchors. This does not certify uninspected figures or academic approval.');
