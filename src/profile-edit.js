export function profileChanges(draft,profile,policy){
 const name=String(draft.name||'').trim();
 if(!name||name.length>60||[...name].some(character=>character.charCodeAt(0)<32||character.charCodeAt(0)===127))throw Error('Enter a display name between 1 and 60 characters.');
 if(!Object.hasOwn(policy.curriculum,draft.year))throw Error('Choose a valid academic level.');
 if(draft.year==='HB1'&&!['First','Second'].includes(draft.semester))throw Error('Choose your current semester.');
 const semester=draft.year==='HB1'?draft.semester:'Annual';
 const available=policy.courses(draft.year+':'+semester);
 return {name,username:name,year:draft.year.replace('HB','HB '),semester,courses:policy.normalizeProfile(profile).courses.filter(c=>available.includes(c))};
}
export async function saveAcademicProfile({auth,uid,changes,write}){
 if(!auth.currentUser||auth.currentUser.uid!==uid)throw Error('Your account changed. Sign in again before saving.');
 await write(uid,changes);
}
