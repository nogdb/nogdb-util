const executeConsole = SQL => ({
  type: "EXECUTE",
  payload: SQL
});

const addVertexConsole = Nodes => ({
  type: "ADD_VERTEX_CONSOLE",
  payload: Nodes
});
const addEdgeConsole = Edges => ({
  type: "ADD_EDGE_CONSOLE",
  payload: Edges
});
const getAllClassFromDatabase = selectID => ({
  type: "GET_ALL_CLASS_FROM_DATABASE",
  payload: selectID
});
const getAllNodeClassForAddNodeButton = () => ({
  type: "GET_ALL_CLASS_FOR_ADDNODE_BUTTON"
});

const sendAllClassFromDatabaseToState = allClass => ({
  type: "SEND_ALL_CLASS_FROM_DATABASE_TO_STATE",
  payload: allClass
});
const getSrcDstEdge = edgeID => ({
  type: "GET_EDGE_SRC_DST",
  payload: edgeID
});

const sendAllNodeClassToGraphCanvasReducer = allClass => ({
  type: "GET_ALL_CLASS",
  payload: allClass
});

const deleteNodeFromDB = NodeID => ({
  type: "DELETE_NODE_TO_DB",
  payload: NodeID
});
const sendNodeIDToCanvas = nodeID =>({
  type : "SEND_NODE_ID_TO_CANVAS",
  payload: nodeID
})
const getNodeInEdge = (selectNodeID) => ({
  type : "GET_IN_EDGE_FOR_NODE",
  payload : selectNodeID
})
const addIncomingNodeEdge = (nodes,edges) => ({
  type : 'ADD_INCOMING_NODE_EDGE',
  payloadNode:nodes,
  payloadEdge:edges
})
const getNodeOutEdge = (selectNodeID) => ({
  type : 'GET_OUT_EDGE_FOR_NODE',
  payload:selectNodeID
})
const addOutgoingNodeEdge = (nodes,edges) => ({
  type :'ADD_OUTGOING_NODE_EDGE',
  payloadNode:nodes,
  payloadEdge:edges
})
const addUpdateNodeToDatabase = (updateNode) => ({
  type : 'ADD_UPDATE_NODE_TO_DB',
  payload:updateNode
})

export {
  executeConsole,
  addVertexConsole,
  getAllClassFromDatabase,
  sendAllClassFromDatabaseToState,
  addEdgeConsole,
  getSrcDstEdge,
  sendAllNodeClassToGraphCanvasReducer,
  getAllNodeClassForAddNodeButton,
  deleteNodeFromDB,
  sendNodeIDToCanvas,
  getNodeInEdge,
  addIncomingNodeEdge,
  getNodeOutEdge,
  addOutgoingNodeEdge,
  addUpdateNodeToDatabase
};
