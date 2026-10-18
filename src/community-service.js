import {collection,doc,getDocFromServer,getDocsFromServer,query,where,limit,startAfter,serverTimestamp,runTransaction} from 'firebase/firestore'
import {communityCohort,communityView,profileBio,publicIdentity} from './community-model.js'
import {validAvatar} from './avatars.js'
function guardLocal({auth,db,uid,enabled=true}){if(!uid||auth?.currentUser?.uid!==uid)throw Error('Your account changed. Reopen My Profile.');if(!enabled||db?.app?.options?.projectId!=='demo-dominance'||auth?.app?.options?.projectId!=='demo-dominance')throw Error('Community is available in the isolated local preview only.')}
// One atomic source of profile identity; no independently editable public name/avatar.
async function commitIdentity({auth,db,uid,changes={},community,avatar}){
 guardLocal({auth,db,uid});if(community&&typeof community.visible!=='boolean')throw Error('Choose a visibility setting.');if(community?.visible===true&&community.consent!==true)throw Error('Choose to make your profile visible before saving.');if(avatar!==undefined&&!validAvatar(avatar))throw Error('Choose a saved avatar or initials.');
 await runTransaction(db,async transaction=>{
  guardLocal({auth,db,uid});const userRef=doc(db,'users',uid),sharedRef=doc(db,'communityProfiles',uid),[snapshot,shared]=await Promise.all([transaction.get(userRef),transaction.get(sharedRef)]);guardLocal({auth,db,uid});if(!snapshot.exists())throw Error('Profile missing');
  const previous=snapshot.data(),old=shared.exists()?shared.data():null,legacy=old&&old.identityVersion!==2,patch={...changes},next={...previous,...changes,dashboardState:{...(previous.dashboardState||{}),...(avatar!==undefined?{avatar}:{})}};
  if(avatar!==undefined)patch['dashboardState.avatar']=avatar;
  const bio=profileBio(community?.bio??previous.profileBio??old?.bio??''),levelChanged=changes.year!==undefined&&String(changes.year).replace(/\s/g,'')!==String(previous.year).replace(/\s/g,'');
  const visible=!levelChanged&&!!communityCohort(next)&&(community?community.visible===true:previous.communityVisible===true&&old?.identityVersion===2);
  if(community?.visible===true&&!communityCohort(next))throw Error('Community is currently available for HB1.');
  if(community)patch.communityIdentityVersion=2;
  patch.profileBio=bio;patch.communityVisible=visible;next.profileBio=bio;next.communityVisible=visible;
  if(legacy&&!previous.legacyCommunityProfile)patch.legacyCommunityProfile={name:old.name,bio:old.bio};
  transaction.update(userRef,patch);
  if(visible)transaction.set(sharedRef,{...publicIdentity(next),joinedAt:old?.joinedAt||serverTimestamp(),updatedAt:serverTimestamp()});else if(old)transaction.delete(sharedRef);
 });guardLocal({auth,db,uid});
}
export function createCommunityService({auth,db,uid,enabled}){
 let active=true;const guard=()=>{if(!active)throw Error('Your account changed. Reopen Community.');guardLocal({auth,db,uid,enabled})};
 async function own(){guard();const [account,shared]=await Promise.all([getDocFromServer(doc(db,'users',uid)),getDocFromServer(doc(db,'communityProfiles',uid))]);guard();if(!account.exists())throw Error('Your account profile could not be loaded.');const profile=account.data(),mine=shared.exists()?communityView(uid,shared.data()):null;return{cohort:communityCohort(profile),mine,bio:profileBio(profile.profileBio??mine?.bio??''),visible:profile.communityVisible===true&&mine?.identityVersion===2,needsReview:!!mine&&mine.identityVersion!==2||!!profile.legacyCommunityProfile&&profile.communityIdentityVersion!==2&&!mine}}
 async function classmates(cohort,cursor=null){guard();if(cohort!=='KNUST-SMS-HB1')return{people:[],cursor:null,more:false};const clauses=[where('cohort','==',cohort),limit(8)];if(cursor)clauses.push(startAfter(cursor));const result=await getDocsFromServer(query(collection(db,'communityProfiles'),...clauses));guard();return{people:result.docs.filter(item=>item.id!==uid).map(item=>communityView(item.id,item.data())),cursor:result.docs.at(-1)||null,more:result.size===8}}
 async function setVisibility(visible,consent=false){guard();if(typeof visible!=='boolean')throw Error('Choose a visibility setting.');await commitIdentity({auth,db,uid,community:{visible,consent}});guard();return own()}
 return{own,classmates,setVisibility,withdraw:()=>setVisibility(false),dispose(){active=false}};
}
export async function updateProfileWithCommunity(options){await commitIdentity(options)}
export async function updateAvatarWithCommunity(options){await commitIdentity(options);return options.avatar}
