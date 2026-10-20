import {compileComputer} from '../import-computer-appreciation.mjs';

// Vite development middleware only. No review asset is copied to public/ or dist/.
export function computerReviewPlugin(mode,command){
 if(mode!=='emulator'||command!=='serve')return null;
 return {name:'local-computer-academic-review',configureServer(server){
  server.middlewares.use('/dashboard/computer-content.js',(request,response,next)=>{
   if(!['GET','HEAD'].includes(request.method))return next();
   const content=JSON.stringify({...compileComputer({includeReview:true}),reviewOnly:true}).replaceAll('<','\\u003c');
   response.setHeader('Content-Type','application/javascript; charset=utf-8');
   response.setHeader('Cache-Control','no-store');
   response.end(request.method==='HEAD'?'':'globalThis.DominanceComputerContent='+content+';');
  });
 }};
}
