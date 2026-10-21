import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {compile} from '../scripts/import-biological-chemistry.mjs';
import '../public/dashboard/academic-contract.js';
const data=compile(),unit=data.units.find(u=>u.id==='U07'),questions=data.questions.filter(q=>q.unit==='U07'),learning=globalThis.DominanceCellLearning.create(data.units),links=globalThis.DominanceAcademicContract;
const find=stem=>{const qs=questions.filter(q=>q.question.includes(stem));assert.equal(qs.length,1,stem);return qs[0]},answer=stem=>{const q=find(stem);return q.options[q.letter.charCodeAt(0)-65]};
const read=name=>JSON.parse(readFileSync(new URL('../content/biological-chemistry/'+name,import.meta.url))),notes=n=>data.lessons.find(l=>l.id==='BC07'+String(n).padStart(2,'0')).markdown;
test('Unit 7 covers three actual outline topics with independent notes and original linked review questions',()=>{
 assert.equal(unit.lessons.length,12);assert.equal(questions.length,60);for(const topic of unit.topics)assert.ok(data.concepts.some(c=>c.topic===topic));
 const checks=unit.lessons.flatMap(id=>learning.sections(data.lessons.find(l=>l.id===id))).flatMap(s=>learning.parts(s.text));assert.equal(checks.filter(p=>p.kind==='check').length,24);assert.equal(checks.some(p=>p.kind==='unresolved-check'),false);
 for(const q of questions){assert.equal(q.status,'draft-review');assert.equal(q.reviewer,null);assert.equal(q.objective,'BIOL157-CLO5');assert.match(links.questionReferences(q,data),/Lecture 7/);const route=learning.route(links.questionRoute(q,data,learning),data);assert.equal(route.lesson.id,q.lesson);assert.equal(learning.sections(route.lesson)[route.part].title,route.lesson.sections.find(s=>s.id===q.sectionId).title)}
 const review=read('unit-reviews/U07.json');assert.equal(review.academicApproval,null);assert.equal(review.actualPdfPages,71);assert.equal(review.visualPages.length,21);assert.equal(review.actualToPrinted.at(-1).printed,81);
});
test('all twenty residue codes are taught without conflating amides, carboxylates or sulphur groups',()=>{
 const codes={Glycine:['Gly','G'],Alanine:['Ala','A'],Valine:['Val','V'],Leucine:['Leu','L'],Isoleucine:['Ile','I'],Proline:['Pro','P'],Methionine:['Met','M'],Phenylalanine:['Phe','F'],Tryptophan:['Trp','W'],Serine:['Ser','S'],Threonine:['Thr','T'],Cysteine:['Cys','C'],Tyrosine:['Tyr','Y'],Asparagine:['Asn','N'],Glutamine:['Gln','Q'],Aspartate:['Asp','D'],Glutamate:['Glu','E'],Lysine:['Lys','K'],Arginine:['Arg','R'],Histidine:['His','H']};
 for(const [name,[three,one]] of Object.entries(codes))assert.ok(notes(2).includes('| '+name+' | '+three+', '+one+' |'));
 assert.equal(answer('side-chain carboxylates'),'Aspartate and glutamate');assert.equal(answer('supplies a thiol'),'Cysteine');assert.match(answer('surface glutamate'),/loses the usual negative/);assert.match(answer('free proline corrects'),/secondary amino.*carboxyl/);assert.match(answer('glycine achiral'),/two identical hydrogen/);assert.match(answer('assigning L configuration'),/rotation still needs independent/);assert.match(notes(1),/L-cysteine is R/);
});
test('pI and protonation keys independently follow bracketing states and equilibrium arithmetic',()=>{
 assert.equal((2.4+9.6)/2,6);assert.equal(answer('two-group example has pKa'),'6.0');assert.equal((9+10.5)/2,9.75);assert.equal(answer('lysine-like example'),'9.75');assert.ok(Math.abs((2+3.9)/2-2.95)<1e-12);assert.equal(answer('aspartate-like example'),'2.95');
 assert.ok(Math.abs(1/(1+10**(8.6-9.6))*100-90.90909)<.00001);assert.equal(answer('supplied ammonium pKa'),'91%');assert.ok(Math.abs(1/(1+10**(7-6))*100-9.090909)<.000001);assert.equal(answer('supplied histidine side-chain pKa'),'9.1%');assert.match(answer('protein’s pI'),/average net charge/);assert.match(answer('pH equal to its pKa'),/equal concentrations/);
});
test('peptide, assembly, mass and combinatorial keys preserve explicit topology and counting assumptions',()=>{
 assert.equal((21-1)+(30-1),49);assert.equal(answer('Separate unmodified linear chains'),'49');assert.equal(75+89+105-2*18,233);assert.equal(answer('supplied free amino-acid masses'),'233 g/mol');assert.equal(20**4,160000);assert.equal(answer('oriented four-residue peptide'),'160,000');
 const orders=new Set();for(const a of ['G','A'])for(const b of ['G','A'])for(const c of ['G','A'])if([a,b,c].filter(x=>x==='G').length===2)orders.add(a+b+c);assert.equal(orders.size,3);assert.equal(answer('exactly two glycines'),'Three');assert.equal(2*100+2*80-4,356);assert.equal(answer('hypothetical α2β2 protein'),'356');assert.equal(answer('How many backbone peptide bonds are present in ordinary linear'),'Two');
 assert.match(answer('α2β2 assembly'),/Four chains and two types/);assert.match(answer('formal loss of water'),/activated.*tRNA/);
});
test('analytical examples distinguish source corrections, measurement limits and independent arithmetic',()=>{
 assert.equal(.5/10000*1e6*10,500);assert.equal(answer('For a theoretical protein'),'500 µmol/L');assert.equal((100/10)/(200/100),5);assert.equal(100/200*100,50);assert.equal(answer('An extract has 100 mg'),'Fivefold enrichment and 50% recovery');
 assert.match(answer('Strong-acid analysis'),/Asx combines original Asp\/Asn/);assert.match(answer('Complete ideal hydrolysis'),/original N→C order/);assert.match(answer('free proline in the ordinary'),/yellow product/);assert.match(answer('ordinary mid-infrared absorption'),/molecular vibrations/);assert.match(answer('all been normalised'),/absolute molar absorptivities/);assert.match(answer('pI 8 and is placed'),/positive.*cation exchanger/);assert.match(answer('salting out'),/protein, ion identity, pH and temperature/);
 const review=read('unit-reviews/U07.json');assert.ok(review.withheldSourceClaims.some(s=>s.includes('penicillamine')));assert.equal(questions.some(q=>/penicillamine|bacteriorhodopsin|semi-essential because/.test(q.question)),false);
});
test('structure questions teach mechanisms without conflating levels, processes or absolute folding rules',()=>{
 assert.equal(20-4,16);assert.equal(answer('twenty-residue α-helical segment'),'Sixteen');assert.equal(20*.15,3);assert.equal(answer('supplied ideal α-helical rise'),'3.0 nm');assert.equal(answer('neighbouring β strands'),'Antiparallel');
 assert.match(answer('regular α helix'),/i\+4/);assert.match(answer('peptide C–N bond'),/partial double-bond/);assert.match(answer('geometry around proline'),/not automatically cis/);assert.match(answer('collagen triple-helix packing'),/every third/);assert.match(answer('contains two compact domains'),/remain monomeric/);assert.match(answer('loses activity in urea'),/Reversible disruption/);assert.match(answer('membrane channel'),/polar groups lining/);assert.match(answer('smaller polypeptide bands'),/without deliberate peptide-backbone hydrolysis/);assert.match(answer('positive oxygen-binding cooperativity'),/higher affinity/);
});
test('questions route directly to the calculation or interpretation being assessed',()=>{
 for(const [stem,title] of [['lysine-like example','Worked side-chain examples'],['For a theoretical protein','Worked theoretical concentration and interpretation'],['Separate unmodified linear chains','Count connections before choosing a formula'],['Strong-acid analysis','What acid analysis loses'],['twenty-residue α-helical segment','Worked helix geometry and hydrogen-bond counting'],['An extract has 100 mg','Worked recovery and activity example']]){const q=find(stem),route=learning.route(links.questionRoute(q,data,learning),data);assert.equal(learning.sections(route.lesson)[route.part].title,title)}
});
test('all previous notes, questions, concepts and figures retain hashes and new drafts remain out of public assets',()=>{
 const review=read('unit-reviews/U07.json'),prior=data.questions.filter(q=>review.previousBanks.units.includes(q.unit)),hash=obj=>createHash('sha256').update(JSON.stringify(obj)).digest('hex');assert.equal(prior.length,222);assert.equal(hash(prior),review.previousBanks.questionsSha256);assert.equal(Object.keys(review.previousBanks.lessonSha256).length,59);
 for(const [id,sha] of Object.entries(review.previousBanks.lessonSha256))assert.equal(createHash('sha256').update(readFileSync(new URL('../content/biological-chemistry/lessons/'+id+'.md',import.meta.url))).digest('hex'),sha,id);
 assert.equal(hash(data.concepts.filter(c=>review.previousBanks.units.includes(c.unit))),review.previousBanks.conceptsSha256);assert.equal(hash(data.figures.filter(f=>review.previousBanks.figureIds.includes(f.id))),review.previousBanks.figuresSha256);
 const publicAsset=readFileSync(new URL('../public/dashboard/biological-content.js',import.meta.url),'utf8'),figures=data.figures.filter(f=>f.id.startsWith('BIOL157-U07-'));assert.equal(figures.length,4);for(const f of figures){assert.equal(publicAsset.includes(f.id),false);assert.match(globalThis.DominanceAcademicFigures.html(f),/role="img"/);assert.ok(data.lessons.some(l=>l.markdown.includes('[Figure:'+f.id+']')))}assert.equal(publicAsset.includes(questions[0].question),false);assert.equal(data.release.studentEnabled,false);assert.equal(data.release.academicApproval,null);
});
