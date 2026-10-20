// Cache code, never student data. Failed requests can be retried without reloading an account.
export function createModuleLoader(importModule,exportName){
 let pending;
 return()=>pending??=(Promise.resolve().then(importModule).then(module=>{if(typeof module[exportName]!=='function')throw Error('Unavailable component');return module[exportName]}).catch(error=>{pending=undefined;throw error}));
}
