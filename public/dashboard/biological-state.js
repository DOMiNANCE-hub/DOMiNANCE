/* Independent account-owned course state, reusing the validated academic state model. */
(function(root){const model=root.DominanceCellState,learning=root.DominanceBiologicalLearning;root.DominanceBiologicalState={state:(raw,data)=>model.state(raw,data,learning),merge:(a,b,data)=>model.merge(a,b,data,learning),score:model.score}})(globalThis);
