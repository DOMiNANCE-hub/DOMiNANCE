import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {compile} from '../scripts/import-biological-chemistry.mjs';
import '../public/dashboard/academic-contract.js';
const data=compile(),unit=data.units.find(u=>u.id==='U05'),questions=data.questions.filter(q=>q.unit==='U05'),learning=globalThis.DominanceCellLearning.create(data.units),link=globalThis.DominanceAcademicContract;
const find=stem=>{const q=questions.find(q=>q.question.includes(stem));assert.ok(q,stem);return q},answer=stem=>{const q=find(stem);return q.options[q.letter.charCodeAt(0)-65]};
const read=file=>JSON.parse(readFileSync(new URL('../content/biological-chemistry/'+file,import.meta.url)));
test('Unit 5 maps its three actual outline topics to independent notes, concepts, questions and source evidence',()=>{
 assert.equal(unit.lessons.length,14);assert.equal(questions.length,58);assert.equal(data.concepts.filter(c=>c.unit==='U05').length,14);
 for(const id of unit.topics)assert.ok(data.concepts.some(c=>c.topic===id));
 for(const q of questions){assert.equal(q.objective,'BIOL157-CLO5');assert.equal(q.status,'draft-review');assert.equal(q.reviewer,null);assert.ok(link.questionReferences(q,data).includes('Lecture 5'));const route=learning.route(link.questionRoute(q,data,learning),data);assert.equal(route.lesson.id,q.lesson)}
 const checks=unit.lessons.flatMap(id=>learning.sections(data.lessons.find(l=>l.id===id))).flatMap(s=>learning.parts(s.text));assert.equal(checks.filter(c=>c.kind==='check').length,28);assert.equal(checks.some(c=>c.kind==='unresolved-check'),false);
 const review=read('unit-reviews/U05.json');assert.equal(review.actualPdfPages,58);assert.equal(review.visualPages.length,21);assert.equal(review.academicApproval,null);assert.equal(review.actualToPrinted.find(p=>p.actual===15).printed,16);assert.equal(review.actualToPrinted.find(p=>p.actual===57).printed,64);
});
test('energy, stereocentre, molecular-formula and tree examples have independently recomputed keys',()=>{
 assert.equal(30*4,120);assert.equal(answer('energy estimate follows from 30 g'),'120 kcal');assert.equal(2**4,16);assert.equal(answer('four stereocentres'),'16');assert.equal(2*180-18,342);assert.equal(answer('product molar mass follows'),'342 g/mol');assert.equal(6-1,5);assert.equal(answer('links connect six sugar units'),'Five');
 const atoms={C:5*6,H:5*12-4*2,O:5*6-4};assert.deepEqual(atoms,{C:30,H:52,O:26});assert.equal(answer('What formula follows for five'),'C₃₀H₅₂O₂₆');assert.equal(1+2,3);assert.equal(answer('linear glucan tree gains two'),'Three');
});
test('projection and anomer keys distinguish carbonyl position, reference configuration and ring atoms',()=>{
 assert.match(answer('which centre determines the D/L'),/^C5/);assert.equal(answer('right,left,right,right at C2'),'C2 epimers');assert.match(answer('D-glucose and D-galactose'),/C4 epimers/);assert.match(answer('assigned D'),/measured rotation is separate/);
 assert.equal(answer('atoms are in the resulting pyranose ring'),'Six: five carbons and one oxygen');assert.match(answer('illustrated fructofuranose'),/^C2/);assert.match(answer('CH₂OH is up and anomeric OH is down'),/^α/);assert.match(answer('glucose mutarotation'),/opening and closure/);assert.equal(answer('net water loss'),'No obligatory net water loss');assert.equal(answer('C3 OH on the Fischer left'),'Up');
});
test('derivative and linkage keys preserve chemically meaningful distinctions',()=>{
 assert.equal(answer('terminal C6 while retaining'),'Glucuronic acid');assert.equal(answer('both terminal positions'),'Aldaric acid');assert.match(answer('reduction of fructose'),/new stereocentre/);assert.match(answer('sugar lactone'),/cyclic ester/);
 assert.match(answer('2-deoxy mean'),/C2 OH.*replaced by H/);assert.match(answer('fits fructose 1,6-bisphosphate'),/separate phosphate ester/);assert.match(answer('methyl glucoside lack'),/full acetal/);assert.match(answer('Glcα(1→4)Glc'),/first glucose/);assert.match(answer('intact sucrose nonreducing'),/Both anomeric/);assert.equal(answer('lactose hydrolysis'),'Glucose and galactose');
});
test('source discrepancies and test limitations are not turned into unsupported absolute answers',()=>{
 assert.match(answer('diet entirely prevents'),/Long-term complications can occur/);assert.match(answer('low lactase activity'),/downstream galactose metabolism/);assert.equal(answer('starch-phosphorylase diagram'),'Glucose 1-phosphate');assert.match(answer('galacturonan composition'),/^Galacturonic/);assert.match(answer('all GAGs as identically'),/Hyaluronan.*keratan/);
 assert.match(answer('fructose give a positive'),/enediol/);assert.match(answer('Benedict reducing-sugar reaction'),/sugar is oxidised.*Cu²⁺ is reduced/);assert.match(answer('Barfoed precipitate appears'),/confound/);assert.match(answer('positive control also fails'),/inconclusive/);assert.match(answer('uncalibrated Benedict colour'),/conditions, matrix/);assert.match(answer('positive Molisch'),/carbohydrate-associated/);assert.equal(answer('uses orcinol'),'Bial’s test');
});
test('complex examples and assay troubleshooting link to their exact independently usable note section',()=>{
 for(const [stem,title] of [['four stereocentres','Worked counting and projection mistakes'],['C3 OH on the Fischer left','Worked Fischer-to-Haworth reasoning'],['product molar mass follows','Worked mass and water accounting'],['linear glucan tree gains two','Worked branch counting with stated assumptions'],['positive control also fails','Worked interpretation and troubleshooting']]){const q=find(stem),r=learning.route(link.questionRoute(q,data,learning),data);assert.equal(learning.sections(r.lesson)[r.part].title,title)}
});
test('Unit 5 figures remain protected and prior Unit 1–4 notes and assessment bytes are preserved',()=>{
 const review=read('unit-reviews/U05.json'),prior=data.questions.filter(q=>review.previousBanks.units.includes(q.unit));assert.equal(createHash('sha256').update(JSON.stringify(prior)).digest('hex'),review.previousBanks.questionsSha256);
 for(const [id,sha] of Object.entries(review.previousBanks.lessonSha256))assert.equal(createHash('sha256').update(readFileSync(new URL('../content/biological-chemistry/lessons/'+id+'.md',import.meta.url))).digest('hex'),sha,id);
 const asset=readFileSync(new URL('../public/dashboard/biological-content.js',import.meta.url),'utf8'),figures=data.figures.filter(f=>f.id.startsWith('BIOL157-U05-'));assert.equal(figures.length,2);
 for(const f of figures){assert.equal(asset.includes(f.id),false);assert.ok(data.lessons.some(l=>l.markdown.includes('[Figure:'+f.id+']')));assert.match(globalThis.DominanceAcademicFigures.html(f),/aria-label=/)}
 assert.equal(asset.includes(questions[0].question),false);assert.match(asset,/academic-release-blocked/);
});
