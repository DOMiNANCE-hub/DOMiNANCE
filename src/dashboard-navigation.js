const primary=new Set(['home','courses','practice','community','progress']);
const supported=new Set([...primary,'topic','study','lamla','cards']);
const tab=route=>['topic','study'].includes(route.view)?'courses':['lamla','cards'].includes(route.view)?'practice':route.view;
const valid=route=>route&&supported.has(route.view)?{view:route.view,scope:String(route.scope||''),course:String(route.course||''),topic:String(route.topic||'')}:{view:'home'};
// History is a presentation hint only. The iframe revalidates curriculum on restore.
export function createDashboardNavigation({host,uid,onRoute}){
 const previous=host.history.state;
 let current=previous?.dominanceOwner===uid?valid(previous.dominanceRoute):previous?.dominanceOwner?{view:'home'}:{view:primary.has(host.location.hash.slice(1))?host.location.hash.slice(1):'home'};
 const store=replace=>host.history[replace?'replaceState':'pushState']({dominanceOwner:uid,dominanceRoute:current},'','#'+tab(current));
 store(true);
 const pop=()=>{const state=host.history.state;const target=state?.dominanceOwner===uid?valid(state.dominanceRoute):{view:'home'};onRoute(target,accepted=>{if(accepted)current=target;else store(true)})};
 host.addEventListener('popstate',pop);
 return {initial:current,commit(route){const next=valid(route);if(JSON.stringify(next)===JSON.stringify(current))return;current=next;store(false)},dispose(){host.removeEventListener('popstate',pop)}};
}
