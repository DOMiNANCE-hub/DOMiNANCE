export function academicHarness({create,data,model,learning,initial={}}){
 const nodes=new Map(),cache=new Map(Object.entries(initial));let focused=false,course=data?.course||'Cell Structure';
 class Node {
  constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.dataset={};this.className='';this.classList={contains:()=>false,toggle(){}}}
  set id(value){this.identifier=value;nodes.set(value,this)}get id(){return this.identifier}
  set innerHTML(value){this.html=value;this.children=[]}get innerHTML(){return this.html||''}
  append(...children){this.children.push(...children)}before(node){nodes.set(node.id,node)}
  setAttribute(key,value){this.attributes[key]=value}getAttribute(key){return this.attributes[key]??null}
  querySelector(selector){return selector==='h2'?{setAttribute(){},focus(){}}:null}
  querySelectorAll(){return this.children.filter(n=>n.className?.includes('answer'))}
 }
 const document={createElement:tag=>new Node(tag),getElementById:id=>{if(!nodes.has(id)){const node=new Node('div');node.id=id}return nodes.get(id)}};
 const storage={getItem:key=>cache.get(key)??null,getConfirmedItem:key=>cache.get(key)??null,setItem:(key,value)=>{cache.set(key,value);return true}};
 const ctx={owner:'fictional-alice',data,model,learning,stateKey:'computerAppreciation',progressId:'computerProgress',document,storage,context:()=>({scopes:['HB1:First'],scope:'HB1:First',course}),toast(){},newId:()=>crypto.randomUUID(),openTopic:id=>pilot.lesson(id),openCellCourse(){},openAcademicCourse:name=>{course=name},showPractice(){},focus:value=>{focused=value},recorded(){},confirm:value=>value.onConfirm()};
 const pilot=create(ctx),walk=node=>[node,...(node.children||[]).flatMap(walk)],node=id=>document.getElementById(id);
 return {ctx,pilot,cache,node,walk,buttons:id=>walk(node(id)).filter(n=>n.tag==='button'),select:(id,label)=>walk(node(id)).find(n=>n.getAttribute?.('aria-label')===label),text:id=>walk(node(id)).map(n=>n.textContent||n.innerHTML||'').join(' '),setCourse:name=>{course=name},get focused(){return focused}};
}
