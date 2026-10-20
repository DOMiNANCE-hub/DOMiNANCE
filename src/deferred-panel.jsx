import {useEffect,useState} from 'react'
export function DeferredPanel({load,label,componentProps}){
 const [result,setResult]=useState({}),[retry,setRetry]=useState(0);
 useEffect(()=>{let current=true;load().then(Component=>{if(current)setResult({load,Component})},()=>{if(current)setResult({load,error:true})});return()=>{current=false}},[load,retry]);
 const {Component,error}=result.load===load?result:{};
 if(Component)return <Component {...componentProps}/>;
 return <div className="deferred-panel" aria-busy={!error}>{error?<><p role="alert">Could not load {label}. Check your connection and try again.</p><button className="account-secondary" onClick={()=>{setResult({});setRetry(value=>value+1)}}>Retry loading</button></>:<p role="status">Loading {label}…</p>}</div>;
}
