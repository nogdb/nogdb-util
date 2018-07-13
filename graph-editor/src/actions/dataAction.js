const getNodeID = eventNodeID => ({
  type: 'GET_NODE_ID',
  payload: eventNodeID
});
const getEdgeID = edgeID => ({
  type: 'GET_EDGE_ID',
  payload: edgeID
});
const getNodeClass = nodeClass => ({
  type: 'GET_NODE_CLASS',
  payload: nodeClass
});
const getNodename = nodeName => ({
  type: 'GET_NODE_NAME',
  payload: nodeName
});

const getEdgeClass = edgeClass => ({
  type: 'GET_EDGE_CLASS',
  payload: edgeClass
});
const getInRelation = inRelation => ({
  type: 'GET_IN_RELATION',
  payload: inRelation
});
const getOutRelation = outRelation => ({
  type: 'GET_OUT_RELATION',
  payload: outRelation
});
const updateGraph = (newNode, newEdge) => ({
  type: 'UPDATE_GRAPH',
  payload1: newNode,
  payload2: newEdge
});
const dedeteNodeInDatabase = (nodeID) => ({
  type: 'DELETE_NODE_FROM_DATABASE',
  payload:nodeID
})

const deleteEdgeFromDatabase =(edgeID) => ({
  type: 'DELETE_EDGE_FROM_DATABASE',
  payload:edgeID
})

export {
  getNodeID,
  getNodeClass,
  getEdgeID,
  getNodename,
  getEdgeClass,
  getInRelation,
  getOutRelation,
  updateGraph,
  dedeteNodeInDatabase,
  deleteEdgeFromDatabase
};
