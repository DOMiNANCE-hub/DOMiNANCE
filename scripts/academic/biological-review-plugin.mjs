import {reviewData} from '../import-biological-chemistry.mjs';
export function biologicalReviewPlugin(mode,command){
 if(mode!=='emulator'||command!=='serve')return null;
 return {name:'local-biol157-academic-review',configureServer(server){server.middlewares.use('/dashboard/biological-content.js',(request,response,next)=>{
  if(!['GET','HEAD'].includes(request.method))return next();
  response.setHeader('Content-Type','application/javascript; charset=utf-8');response.setHeader('Cache-Control','no-store');response.end(request.method==='HEAD'?'':'globalThis.DominanceBiologicalContent='+JSON.stringify(reviewData()).replaceAll('<','\\u003c')+';');
 })}};
}
