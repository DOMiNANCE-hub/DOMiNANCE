/* Shared curriculum and student-facing navigation policy. Not an authorization boundary. */
(function(root){
 const curriculum={HB1:{First:['Basic Medical Chemistry','Biological Chemistry','Medical Genetics','Cell Structure','Ghanaian Sign Language','Communication Skills','Computer Appreciation','Algebra','Statistical Methods'],Second:['Ghanaian Sign Language','Medical Entomology','Behavioural Science','Human Anatomy I','Biochemistry I','Physiology I']},HB2:{Annual:['Human Anatomy II','Biochemistry II','Physiology II']},HB3:{Annual:[]}};
 function normalizeProfile(profile={}){const level=String(profile.year||'HB1').replace(/\s/g,'');const year=Object.hasOwn(curriculum,level)?level:'HB1';return{year,semester:year==='HB1'&&['Second','Semester 2'].includes(profile.semester)?'Second':year==='HB1'?'First':'Annual',courses:Array.isArray(profile.courses)?profile.courses.filter(c=>typeof c==='string'):[]}}
 function scopes(profile){const p=normalizeProfile(profile),result=[];if(p.year==='HB1'){result.push('HB1:First');if(p.semester==='Second')result.push('HB1:Second')}else{result.push(p.year+':Annual');if(p.year==='HB3')result.push('HB2:Annual');result.push('HB1:First','HB1:Second')}return result}
 function currentScope(profile){const p=normalizeProfile(profile);return p.year+':'+p.semester}
 function courses(scope){const [year,period]=scope.split(':');return curriculum[year]?.[period]||[]}
 function label(scope){const [year,period]=scope.split(':');return year+(period==='Annual'?'':' · '+(period==='Second'?'Semester 2':'Semester 1'))}
 root.DominanceCurriculum={curriculum,normalizeProfile,scopes,currentScope,courses,label};
})(globalThis);
