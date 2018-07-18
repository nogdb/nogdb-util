const executeConsole = SQL => ({
    type: 'EXECUTE',
    payload: SQL
  });

const addVertexConsole = (Nodes) => ({
    type: 'ADD_VERTEX_CONSOLE',
    payload: Nodes
})
const addEdgeConsole = (Edges,srcdst) => ({
    type: 'ADD_EDGE_CONSOLE',
    payloadEdge:Edges,
    payloadSrcDst:srcdst
})
const getAllClassFromDatabase =(selectID) => ({
    type: 'GET_ALL_CLASS_FROM_DATABASE',
    payload:selectID
  
})

const sendAllClassFromDatabaseToState=(allClass) => ({
    type: 'SEND_ALL_CLASS_FROM_DATABASE_TO_STATE',
    payload : allClass
})
const getSrcDstEdge = (edgeID) => ({
    type: 'GET_EDGE_SRC_DST',
    payload: edgeID
})




  export {
      executeConsole,
      addVertexConsole,
      getAllClassFromDatabase,
      sendAllClassFromDatabaseToState,
      addEdgeConsole,
      getSrcDstEdge
     
  }