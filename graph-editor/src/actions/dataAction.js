const getNodeID = eventNodeID => ({
  type: "GET_NODE_ID",
  payload: eventNodeID
});
const getNodeID2 = eventNodeID => ({
  type: "GET_NODE_ID_2",
  payload: eventNodeID
});
const getEdgeID = edgeID => ({
  type: "GET_EDGE_ID",
  payload: edgeID
});
const getNodeClass = nodeClass => ({
  type: "GET_NODE_CLASS",
  payload: nodeClass
});
const getNodename = nodeName => ({
  type: "GET_NODE_NAME",
  payload: nodeName
});

const getEdgeClass = edgeClass => ({
  type: "GET_EDGE_CLASS",
  payload: edgeClass
});
const getInRelation = inRelation => ({
  type: "GET_IN_RELATION",
  payload: inRelation
});
const getOutRelation = outRelation => ({
  type: "GET_OUT_RELATION",
  payload: outRelation
});
const updateGraph = (newNode, newEdge) => ({
  type: "UPDATE_GRAPH",
  payload1: newNode,
  payload2: newEdge
});
const dedeteNodeInDatabase = nodeID => ({
  type: "DELETE_NODE_FROM_DATABASE",
  payload: nodeID
});

const deleteEdgeFromDatabase = edgeID => ({
  type: "DELETE_EDGE_FROM_DATABASE",
  payload: edgeID
});
const storeEditName = name => ({
  type: "STORE_EDIT_NODENAME_VALUE",
  name: name
  // date:date,
  // time:time
});
const storeEditNodeDateTime = dateTime => ({
  type: "STORE_NODE_DATE_VALUE",
  dateTime: dateTime
});

const storeEditInRelation = inRelation => ({
  type: "STORE_EDGE_INRELATION",
  payload: inRelation
});

const storeEditOutRelation = outRelation => ({
  type: "STORE_EDGE_OUTRELATION",
  payload: outRelation
});

const storeEditMessage = Message => ({
  type: "STORE_EDGE_MESSAGE",
  payload: Message
});

const storeEdgeNewName = EdgeName => ({
  type: "STORE_EDGE_NAME",
  payload: EdgeName
});

// const storeEditTime = (time) => ({
//   type:'STORE_TIME_VALUE',
//   time:time
// })

// const storeEditTime = (time) => ({
//   type:'STORE_TIME_VALUE',
//   time:time
// })

export {
  getNodeID,
  getNodeID2,
  getNodeClass,
  getEdgeID,
  getNodename,
  getEdgeClass,
  getInRelation,
  getOutRelation,
  updateGraph,
  dedeteNodeInDatabase,
  deleteEdgeFromDatabase,
  storeEditName,
  storeEditNodeDateTime,
  storeEditInRelation,
  storeEditOutRelation,
  storeEditMessage,
  storeEdgeNewName
};
