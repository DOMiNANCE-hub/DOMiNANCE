/* Same private-review schema, with independent Computer Appreciation identifiers. */
(function(root){
 const model=root.DominanceCellState,learning=root.DominanceComputerLearning;
 root.DominanceComputerState={state:(raw,data)=>model.state(raw,data,learning),merge:(a,b,data)=>model.merge(a,b,data,learning),score:model.score};
})(globalThis);
