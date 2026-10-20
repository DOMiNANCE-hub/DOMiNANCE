/* Text-and-geometry academic figures only: no embedded HTML, URLs, scripts or source images. */
(function(root){
 const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
 function validate(f){
  if(!/^[\w-]+$/.test(f?.id)||!f.title?.trim()||!f.description?.trim()||!f.caption?.trim()||!Number.isFinite(f.width)||!Number.isFinite(f.height)||f.width<1||f.height<1||f.width>1200||f.height>1200||!Array.isArray(f.elements))throw Error('Invalid academic figure');
  const point=(x,y)=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=f.width&&y>=0&&y<=f.height;
  for(const e of f.elements){if(e.kind==='line'){if(!point(e.x1,e.y1)||!point(e.x2,e.y2)||(e.dashed!==undefined&&typeof e.dashed!=='boolean'))throw Error('Invalid figure line')}else if(e.kind==='text'){if(!point(e.x,e.y)||typeof e.text!=='string'||!['start','middle','end'].includes(e.anchor||'middle'))throw Error('Invalid figure text')}else if(e.kind==='wedge'){if(!Array.isArray(e.points)||e.points.length!==3||!e.points.every(p=>Array.isArray(p)&&p.length===2&&point(...p)))throw Error('Invalid figure wedge')}else throw Error('Unsupported academic figure primitive')}
  return f;
 }
 function html(f){validate(f);const body=f.elements.map(e=>e.kind==='line'?'<line x1="'+e.x1+'" y1="'+e.y1+'" x2="'+e.x2+'" y2="'+e.y2+'" stroke="currentColor" stroke-width="2"'+(e.dashed?' stroke-dasharray="5 4"':'')+'/>':e.kind==='wedge'?'<polygon points="'+e.points.map(p=>p.join(',')).join(' ')+'" fill="currentColor"/>':'<text x="'+e.x+'" y="'+e.y+'" text-anchor="'+(e.anchor||'middle')+'" fill="currentColor" font-size="18">'+escape(e.text)+'</text>').join('');return '<figure class="academic-figure" data-figure-id="'+escape(f.id)+'"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+f.width+' '+f.height+'" role="img" aria-label="'+escape(f.description)+'" focusable="false"><title>'+escape(f.title)+'</title>'+body+'</svg><figcaption>'+escape(f.caption)+'</figcaption></figure>'}
 root.DominanceAcademicFigures={validate,html};
})(globalThis);
