const removeNode = (nodeID)=>({
    type: 'REMOVE_NODE',
    payload: nodeID
})

const removeEdgeCanvas = (edgeID) => ({
    type: 'REMOVE_EDGE',
    payload: edgeID
})

export {removeNode,removeEdgeCanvas}