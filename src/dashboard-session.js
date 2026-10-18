import '../public/dashboard/cell-learning.js'
import '../public/dashboard/cell-index.js'
import '../public/dashboard/cell-state.js'
import {validAvatar} from './avatars.js'
const keys=new Set(['scores','lamlaScores','lastPlace','theme','mode','intensity','motion','dailyGoal','avatar','cellStructure']);
// UI/demo state only. Never a source of permissions, official scores or mastery.
export function createDashboardStorage({auth,uid,initial={},initialConfirmed=true,write,onStatus}){
 const cache={};for(const key of keys)if(typeof initial[key]==='string'&&initial[key].length<=100000)cache[key]=initial[key];
 const confirmed=initialConfirmed?{...cache}:{};let active=true,queue=Promise.resolve();const pending=new Map();
 const owns=()=>active&&auth.currentUser?.uid===uid;
 const status=message=>{if(owns())onStatus?.(message)};
 const flush=()=>{queue=queue.then(async()=>{if(!owns())return;for(const [key,value] of [...pending]){if(!owns())return;try{const stored=await write(uid,key,value);confirmed[key]=typeof stored==='string'?stored:value;if(pending.get(key)===value){pending.delete(key);if(typeof stored==='string')cache[key]=stored}}catch{status('Changes are not synced. Keep this page open and retry.');return}}status(pending.size?'Saving changes…':'')});return queue};
 return {reconcile(values={},isConfirmed=true){if(!owns())return;for(const key of keys)if(!pending.has(key)&&typeof values[key]==='string'&&values[key].length<=100000)cache[key]=values[key];if(isConfirmed)for(const key of keys)if(typeof values[key]==='string'&&values[key].length<=100000)confirmed[key]=values[key]},getConfirmedItem(key){return owns()&&keys.has(key)?confirmed[key]??null:null},pendingKeys(){return owns()?[...pending.keys()]:[]},getItem(key){return owns()&&keys.has(key)?cache[key]??null:null},setItem(key,value){if(!owns()||!keys.has(key)||(key==='avatar'&&!validAvatar(value))||typeof value!=='string'||value.length>100000)return false;if(cache[key]===value)return true;cache[key]=value;pending.set(key,value);status('Saving changes…');void flush();return true},retry:flush,dispose(){active=false;pending.clear()},get pending(){return pending.size}};
}

export function mergeDemoHistory(existing,incoming){
 const previous=JSON.parse(existing||'[]'),next=JSON.parse(incoming);
 if(!Array.isArray(previous)||!Array.isArray(next))throw Error('Invalid demo history');
 const merged=new Map();for(const attempt of [...next,...previous]){if(!attempt||typeof attempt.id!=='string'||!attempt.id)throw Error('Missing demo attempt ID');if(!merged.has(attempt.id))merged.set(attempt.id,attempt)}
 const value=JSON.stringify([...merged.values()]);if(value.length>100000)throw Error('Demo history capacity reached');return value;
}

export function mergeCellHistory(existing,incoming){return globalThis.DominanceCellState.merge(existing,incoming,globalThis.DominanceCellIndex)}
