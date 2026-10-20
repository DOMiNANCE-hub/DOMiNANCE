import '../public/dashboard/appearance.js'
// Drafts never write storage. Only the explicit caller-controlled Apply does.
export function createAppearanceDraft(initial){const A=globalThis.DominanceAppearance;let saved=A.normalize(initial),draft={...saved};return{value:()=>({...draft}),preview:next=>(draft=A.normalize({...draft,...next}),{...draft}),apply:()=>(saved={...draft},{...saved}),cancel:()=>(draft={...saved},{...draft})}}
