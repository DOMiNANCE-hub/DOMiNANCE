import {compile} from '../import-cell-structure.mjs';
export function cellReviewPlugin(mode,command){
 if(mode!=='emulator'||command!=='serve')return null;
 return {name:'local-cell-instructional-review',configureServer(server){server.middlewares.use('/dashboard/cell-content.js',(request,response,next)=>{
  if(!['GET','HEAD'].includes(request.method))return next();
  response.setHeader('Content-Type','application/javascript; charset=utf-8');response.setHeader('Cache-Control','no-store');
  response.end(request.method==='HEAD'?'':'globalThis.DominanceCellContent='+JSON.stringify(compile({includeReview:true})).replaceAll('<','\\u003c')+';');
 })}};
}
