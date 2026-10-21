import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {compile} from '../scripts/import-biological-chemistry.mjs';
import '../public/dashboard/academic-contract.js';
const data=compile(),unit=data.units.find(u=>u.id==='U06'),questions=data.questions.filter(q=>q.unit==='U06'),learning=globalThis.DominanceCellLearning.create(data.units),links=globalThis.DominanceAcademicContract;
const find=stem=>{const matches=questions.filter(q=>q.question.includes(stem));assert.equal(matches.length,1,stem);return matches[0]},answer=stem=>{const q=find(stem);return q.options[q.letter.charCodeAt(0)-65]};
const read=name=>JSON.parse(readFileSync(new URL('../content/biological-chemistry/'+name,import.meta.url)));
test('Unit 6 teaches four outline topics with ten usable lessons, 45 questions and twenty answered checks',()=>{
 assert.equal(unit.lessons.length,10);assert.equal(questions.length,45);for(const topic of unit.topics)assert.ok(data.concepts.some(c=>c.topic===topic));
 const parts=unit.lessons.flatMap(id=>learning.sections(data.lessons.find(l=>l.id===id))).flatMap(s=>learning.parts(s.text));assert.equal(parts.filter(p=>p.kind==='check').length,20);assert.equal(parts.some(p=>p.kind==='unresolved-check'),false);
 for(const q of questions){assert.equal(q.status,'draft-review');assert.equal(q.reviewer,null);assert.equal(q.objective,'BIOL157-CLO5');assert.ok(links.questionReferences(q,data).includes('Lecture 6'));assert.equal(learning.route(links.questionRoute(q,data,learning),data).lesson.id,q.lesson)}
 assert.ok(questions.some(q=>q.cognitiveLevel==='understand'));assert.ok(questions.some(q=>q.cognitiveLevel==='apply'));assert.ok(questions.some(q=>q.cognitiveLevel==='analyse'));
 const review=read('unit-reviews/U06.json');assert.equal(review.academicApproval,null);assert.equal(review.actualPdfPages,52);assert.equal(review.visualPages.length,16);assert.equal(review.actualToPrinted.find(p=>p.actual===7).printed,8);
});
test('composition, backbone, sequence-space and UV keys agree with independent arithmetic',()=>{
 assert.equal(2*(5-1),8);assert.equal(answer('two separate linear five'),'Eight');assert.equal(4**4,256);assert.equal(answer('four independently chosen oriented'),'256');
 assert.equal((100-2*30)/2,20);assert.equal(answer('adenine is 30%'),'20%');assert.equal(1000*2,2000);assert.equal(answer('total nucleotide residues'),'2,000');assert.equal(400*3+600*2,2400);assert.equal(answer('400 GC and 600 AT'),'2,400');
 assert.equal(.9/.5,1.8);assert.equal(answer('A260=.90 and A280=.50'),'1.8');assert.equal(.2*50*20,200);assert.equal(answer('explicitly supplied factor'),'200 µg/mL');assert.ok(Math.abs((.7-.5)/.5*100-40)<1e-10);assert.equal(answer('relative increase'),'40%');assert.equal((.5+.7)/2,.6);assert.match(answer('operational Tm follows'),/^70°C/);
});
test('complement and anticodon answers preserve antiparallel direction rather than substitution alone',()=>{
 const complement={A:'T',T:'A',G:'C',C:'G'},reverse=[...'AGTC'].reverse().map(b=>complement[b]).join('');assert.equal(reverse,'GACT');assert.equal(answer('complementary DNA strand'),"5′-GACT-3′");
 const rna={A:'U',U:'A',G:'C',C:'G'};assert.equal([...'AUG'].reverse().map(b=>rna[b]).join(''),'CAU');assert.equal(answer('anticodon is written'),'CAU');
 assert.match(answer('growing nucleic-acid strand'),/3′ OH/);
});
test('base, sugar, phosphate and charge classifications retain source-specific qualifications',()=>{
 assert.equal(answer('canonical purine bases'),'Adenine and guanine');assert.equal(answer('adenine and ribose but no phosphate'),'Adenosine, a nucleoside');assert.equal(answer('joins the sugar to a purine'),'Sugar C1′ to base N9');assert.match(answer('distinguishes thymine'),/5-methyluracil/);assert.match(answer('uses prime numbering'),/C1′ identifies a sugar atom/);
 assert.match(answer('ordinary internal phosphodiester backbone'),/one negative charge/);assert.match(answer('isolated bond breaking'),/whole reaction/);assert.match(answer('free nucleotide automatically'),/^No;/);assert.match(answer('When can the whole-molecule'),/complete ordinary canonically paired/);
});
test('helix, sample-quality and chemical-change keys reject absolute source shortcuts',()=>{
 assert.match(answer('contrasts common DNA helix forms'),/A and B are right-handed; Z is left-handed/);assert.match(answer('supercoiling describe'),/duplex axis/);assert.match(answer('nucleosome core comparison'),/147 wrapped base pairs; H1 is a distinct/);assert.match(answer('same GC percentage'),/not an identical sequence/);
 assert.match(answer('ratio near the DNA reference'),/intact and suitable/);assert.match(answer('RNA group enables'),/2′ OH after deprotonation/);assert.match(answer('intermediate/product pattern'),/cyclic phosphate/);assert.match(answer('depurination'),/abasic site/);assert.match(answer('DNA’s resistance'),/other damage mechanisms/);
});
test('RNA functions and drug examples distinguish active species and mechanisms',()=>{
 assert.match(answer('charging tRNA'),/aminoacyl-tRNA synthetase/);assert.match(answer('ribosomal catalytic'),/RNA-based within a ribonucleoprotein/);assert.match(answer('12-nucleotide segment'),/four complete triplets/);assert.equal(answer('5′-UGG-3′'),'Tryptophan (Trp)');assert.match(answer('UUU and UUC'),/Degeneracy/);assert.equal(4**3-3,61);assert.match(answer('snRNA and tRNA roles'),/processing.*adaptor/);assert.match(answer('noncoding establish'),/role still needs evidence/);
 assert.match(answer('activation step'),/triphosphate/);assert.match(answer('5-fluorouracil'),/FdUMP inhibition of thymidylate synthase/);assert.match(answer('purine product comparison'),/Hypoxanthine.*xanthine.*urate/);assert.match(answer('chemically modified base'),/not automatically a mutation/);
});
test('worked Unit 6 questions return to exact calculation, sequence and mechanism note sections',()=>{
 for(const [stem,title] of [['complementary DNA strand','Worked reverse-complement method'],['400 GC and 600 AT','Worked percentage and count examples'],['operational Tm follows','Worked melting-curve interpretation'],['depurination','Four different meanings of a structural change'],['activation step','Two mechanisms show why analogues differ'],['5′-UGG-3′','Using the standard codon table']]){const q=find(stem),route=learning.route(links.questionRoute(q,data,learning),data);assert.equal(learning.sections(route.lesson)[route.part].title,title)}
});
test('new Unit 6 figures and bank remain protected while all previous notes and question objects retain hashes',()=>{
 const review=read('unit-reviews/U06.json'),prior=data.questions.filter(q=>review.previousBanks.units.includes(q.unit));assert.equal(prior.length,177);assert.equal(createHash('sha256').update(JSON.stringify(prior)).digest('hex'),review.previousBanks.questionsSha256);assert.equal(Object.keys(review.previousBanks.lessonSha256).length,49);
 for(const [id,sha] of Object.entries(review.previousBanks.lessonSha256))assert.equal(createHash('sha256').update(readFileSync(new URL('../content/biological-chemistry/lessons/'+id+'.md',import.meta.url))).digest('hex'),sha,id);
 const oldConcepts=data.concepts.filter(c=>review.previousBanks.units.includes(c.unit)),oldFigures=data.figures.filter(f=>review.previousBanks.figureIds.includes(f.id));assert.equal(createHash('sha256').update(JSON.stringify(oldConcepts)).digest('hex'),review.previousBanks.conceptsSha256);assert.equal(createHash('sha256').update(JSON.stringify(oldFigures)).digest('hex'),review.previousBanks.figuresSha256);
 const figures=data.figures.filter(f=>f.id.startsWith('BIOL157-U06-')),publicAsset=readFileSync(new URL('../public/dashboard/biological-content.js',import.meta.url),'utf8');assert.equal(figures.length,3);for(const f of figures){assert.equal(publicAsset.includes(f.id),false);assert.match(globalThis.DominanceAcademicFigures.html(f),/role="img"/);assert.ok(data.lessons.some(l=>l.markdown.includes('[Figure:'+f.id+']')))}assert.equal(publicAsset.includes(questions[0].question),false);
 assert.match(figures.find(f=>f.id.endsWith('MELTING')).caption,/not measured data/);
});
