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
  sendNodeIDToCanvas
};
