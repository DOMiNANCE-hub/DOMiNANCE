// Injectable account lifecycle; tests never contact Firebase.
export function studentAccountProfile(user,profile,createdAt=new Date().toISOString()) {
 if(!user?.uid||typeof user.email!=='string'||!user.email)throw Error('Sign in before creating a profile.');
 return {name:profile.name,username:profile.username||profile.name,year:profile.year,semester:profile.semester,courses:Array.isArray(profile.courses)?[...profile.courses]:[],email:user.email,role:'student',createdAt};
}
export function observeAccount({subscribeAuth,subscribeProfile,publish,timeoutMs=15000,setTimer=setTimeout,clearTimer=clearTimeout}) {
 let active=true,generation=0,stopProfile=()=>{},stopAuth=()=>{},timer;
 const emit=state=>{if(active)publish(state)},clear=()=>{clearTimer(timer);timer=undefined};
 const wait=(user,token)=>{clear();timer=setTimer(()=>{if(active&&token===generation)emit({user,profile:null,loading:false,error:'Loading your account is taking longer than expected. Please retry.'})},timeoutMs)};
 emit({user:null,profile:null,loading:true,error:''});wait(null,generation);
 try{stopAuth=subscribeAuth(user=>{
 if(!active)return;const token=++generation;clear();stopProfile();stopProfile=()=>{};
 emit({user,profile:null,loading:!!user,error:''});if(!user)return;wait(user,token);
 try{stopProfile=subscribeProfile(user.uid,profile=>{if(!active||token!==generation)return;clear();emit({user,profile:profile?{...profile,id:user.uid}:null,loading:false,error:''})},()=>{if(!active||token!==generation)return;clear();emit({user,profile:null,loading:false,error:'We could not load your student profile. Please retry.'})})||(()=>{})}
 catch{clear();emit({user,profile:null,loading:false,error:'We could not load your student profile. Please retry.'})}
 },()=>{if(!active)return;++generation;clear();stopProfile();emit({user:null,profile:null,loading:false,error:'We could not check your sign-in status. Please retry.'})})||(()=>{})}
 catch{clear();emit({user:null,profile:null,loading:false,error:'We could not check your sign-in status. Please retry.'})}
 return()=>{active=false;++generation;clear();stopProfile();stopAuth()};
}
export function accountError(error){
 const messages={'auth/wrong-password':'The email or password is incorrect.','auth/user-not-found':'The email or password is incorrect.','auth/invalid-credential':'The email or password is incorrect.','auth/invalid-email':'Enter a valid email address.','auth/email-already-in-use':'This email already has an account. Try signing in.','auth/weak-password':'Choose a password with at least six characters.','auth/network-request-failed':'Connection failed. Check your internet and try again.','auth/too-many-requests':'Too many attempts. Please wait before trying again.','auth/popup-closed-by-user':'Google sign-in was closed. You can try again.','auth/popup-blocked':'Your browser blocked Google sign-in. Allow the popup or use email sign-in.','auth/user-disabled':'This account is disabled. Please contact the app team.'};
 return messages[error?.code]||'We could not complete that action. Please try again.';
}
