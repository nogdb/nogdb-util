const removeNode = (nodeID)=>({
    type: 'REMOVE_NODE',
    payload: nodeID
})

export {removeNode}