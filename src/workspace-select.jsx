import {useEffect,useLayoutEffect,useRef} from 'react'
import '../public/dashboard/workspace-choice.js'
import '../public/dashboard/workspace-choice.css'
// React owns the native field; the menu mirrors it and dispatches its normal change event.
const useBeforePaint=typeof document==='undefined'?useEffect:useLayoutEffect
export function WorkspaceSelect(props){
 const ref=useRef(null),picker=useRef(null)
 useBeforePaint(()=>{picker.current=globalThis.DominanceChoices.enhance(ref.current,document);return()=>picker.current?.dispose()},[])
 useBeforePaint(()=>{picker.current?.refresh()},[props.value,props.disabled,props.children])
 return <span className="workspace-select-host"><select {...props} ref={ref}/></span>
}
