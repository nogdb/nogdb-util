const addNodeToCanvas = newNode => ({
  type: "ADD_NODE_ACTION",
  payload: newNode
});
const addEdgeToCanvas = newEdge => ({
  type: "ADD_EDGE_CANVAS",
  payload: newEdge
});
const addNodeToDatabase = newNode => ({
  type: "ADD_NODE_TO_DB",
  payload: newNode
});
const clearCanvas = nullCanvas => ({
  type: "CLEAR_CANVAS",
  payload: nullCanvas
});
const fullscreen = () => ({
  type: "SET_FULLSCREEN"
});
const exitFullscreen = () => ({
  type: "EXIT_FULLSCREEN"
});
const addNodeToDBError = () => ({
  type: "ADD_NODE_DB_ERROR"
});

export {
  addNodeToCanvas,
  addNodeToDatabase,
  clearCanvas,
  fullscreen,
  exitFullscreen,
  addNodeToDBError,
  addEdgeToCanvas
};
