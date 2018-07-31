import { all, takeEvery, call, put } from "redux-saga/effects";
import { post } from "../services/webService";
import {
  sendAllClassFromDatabaseToState,
  addVertexConsole,
  addEdgeConsole,
  sendAllNodeClassToGraphCanvasReducer,
  sendAllEdgeClassToGraphCanvasReducer,
  addIncomingNodeEdge,
  addOutgoingNodeEdge,
  addNodeRender,
  sendAllNodePropertyToDataReducer,
  sendAllEdgePropertyToDataReducer,
  addEdgeRender
} from "../actions/databaseAction";
import { removeNode } from "../actions/menuAction";
import { addNodeToCanvas, addEdgeToCanvas } from "../actions/mainButtonAction";

function* rootSaga() {
  yield all([
    takeEvery("EXECUTE", addConsoletoDB),
    takeEvery("DELETE_EDGE_FROM_DATABASE", deleteEdgeFromDB),
    takeEvery("GET_ALL_CLASS_FROM_DATABASE", checkClassEdgeNode),
    takeEvery("GET_ALL_CLASS_FOR_ADDNODE_BUTTON", getAllClassForAddNodeButton),
    takeEvery(
      "GET_ALL_EDGE_CLASS_FOR_CREATE_RELATION_BUTTON",
      getAllClassForCreateRelationButton
    ),
    takeEvery("ADD_NODE_TO_DB", addNodeToDB),
    takeEvery("GET_IN_EDGE_FOR_NODE", getInEdgeForNode),
    takeEvery("GET_OUT_EDGE_FOR_NODE", getOutEdgeForNode),
    takeEvery("ADD_UPDATE_NODE_TO_DB", updateNodeToDB),
    takeEvery("ADD_UPDATE_EDGE_TO_DB", updateEdgeToDB),
    takeEvery("GET_NODE_PROPERTY", getallnodePropertyDB),
    takeEvery("GET_EDGE_PROPERTY", getAllEdgePropertyDB),
    takeEvery("ADD_EDGE_TO_DB", addEdgeToDB),
    takeEvery("GET_EDGE_SRC_DST", getSrcDst),
    takeEvery("DELETE_NODE_TO_DB", deleteNodeFromDB)
  ]);
}
//add node button
function* addNodeToDB(newNode) {
  console.log(">addNodetoDB");
  try {
    const response = yield call(post, "http://localhost:3000/Vertex/create", {
      className: newNode.payload[0].group,
      record: {
        name: newNode.payload[0].label,
        date: newNode.payload[0].date,
        time: newNode.payload[0].time
      }
    });
    //send to render graph canvas
    const nodeData = {
      id: JSON.stringify(response.data.rid),
      label: newNode.payload[0].label,
      group: newNode.payload[0].group,
      date: newNode.payload[0].date,
      time: newNode.payload[0].time
    };
    yield put(addNodeRender(nodeData));
  } catch (error) {
    console.log(error);
  }
}
//sql command in console
function* addConsoletoDB(sqlStr) {
  console.log(">>>ConsoleToDB");
  let stash = [];
  try {
    const resp = yield call(post, "http://localhost:3000/SQL/execute", {
      sql: sqlStr.payload
    });

    if (resp.data.type === "n") {
      //No result
      console.log("There is no result");
    } else if (resp.data.type === "s") {
      //Result set
      //select command
      const classdescriptor = yield call(
        post,
        "http://localhost:3000/Db/getSchema",
        {}
      );
      let hashIDToType = {};
      let hashIDToName = {};
      for (let ele in classdescriptor.data) {
        hashIDToType[classdescriptor.data[ele].id] =
          classdescriptor.data[ele].type;
        hashIDToName[classdescriptor.data[ele].id] =
          classdescriptor.data[ele].name;
      }
      //[id,type], [id,name]

      let Nodes = [];
      let Edges = [];
      for (let ele in resp.data.data) {
        if (hashIDToType[resp.data.data[ele].descriptor.rid[0]] === "v") {
          Nodes.push(resp.data.data[ele]);
        } else if (
          hashIDToType[resp.data.data[ele].descriptor.rid[0]] === "e"
        ) {
          const recordDescriptor = yield call(
            post,
            "http://localhost:3000/Edge/getSrcDst",
            {
              recordDescriptor: { rid: resp.data.data[ele].descriptor.rid }
            }
          );
          Edges.push({
            data: resp.data.data[ele],
            from: recordDescriptor.data[0].descriptor.rid,
            to: recordDescriptor.data[1].descriptor.rid
          });
        }
      }
      yield put(addVertexConsole(Nodes));
      yield put(addEdgeConsole(Edges));
    } else if (resp.data.type === "c") {
      //Class descriptor
      console.log("CLASS_DESCRIPTOR");
    } else if (resp.data.type === "p") {
      //Property descriptor
      console.log("PROPERTY_DESCRIPTOR");
    } else if (resp.data.type === "r") {
      //Record descriptor
      console.log("RECORD_DESCRIPTORS");
      stash.push(resp);
      const property = yield call(post, "http://localhost:3000/Db/getRecord", {
        recordDescriptor: resp.data.data[0]
      });
      stash.push(property);
    }
  } catch (error) {
    console.log(error);
  }
  if (stash.length == 1) {
    yield put(removeNode(JSON.stringify(stash[0].data.data[0].rid)));
  } else if (stash.length == 2) {
    let newNode = [];
    newNode.push({
      descriptor: stash[0].data.data[0],
      record: stash[1].data
    });
    yield put(addVertexConsole(newNode));
  }
}

function* addEdgeToDB(newEdge) {
  console.log(">addEdgeToDatabase");
  let srcID = JSON.parse(newEdge.payload[0].srcVertex);
  let dstID = JSON.parse(newEdge.payload[0].dstVertex);
  try {
    const recordDescriptor = yield call(
      post,
      "http://localhost:3000/Edge/create",
      {
        className: newEdge.payload[0].className,
        srcVertexRecordDescriptor: {
          rid: srcID
        },
        dstVertexRecordDescriptor: {
          rid: dstID
        },
        record: {}
      }
    );
    let newEdgeCanvas = [
      {
        id: JSON.stringify(recordDescriptor.data.rid),
        from: newEdge.payload[0].srcVertex,
        to: newEdge.payload[0].dstVertex,
        label: newEdge.payload[0].name
      }
    ];
    yield put(addEdgeRender(newEdgeCanvas));
  } catch (error) {
    console.log(error);
  }
}

function* deleteNodeFromDB(nodeID) {
  const vertexID = JSON.parse(nodeID.payload);
  try {
    yield call(post, "http://localhost:3000/Vertex/destroy", {
      recordDescriptor: {
        rid: vertexID
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function* deleteEdgeFromDB(edgeID) {
  console.log(">deleteEdgefromDB");
  try {
    yield call(post, "http://localhost:3000/Edge/destroy", {
      recordDescriptor: {
        rid: JSON.parse(edgeID.payload)
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function* checkClassEdgeNode(selectID) {
  console.log(">check Vertex or Edge");

  try {
    const classdescriptor = yield call(
      post,
      "http://localhost:3000/Db/getSchema",
      {
        classId: selectID.payload
      }
    );
    yield put(sendAllClassFromDatabaseToState(classdescriptor));
  } catch (error) {
    console.log(error);
  }
}
function* getAllClassForAddNodeButton() {
  console.log(">>> getallclassfor-addnodebutton");
  try {
    const classdescriptor = yield call(
      post,
      "http://localhost:3000/Db/getSchema",
      {}
    );
    let classNameData = [];
    for (let ele in classdescriptor.data) {
      // if it is vertex class
      if (classdescriptor.data[ele].type === "v") {
        classNameData.push(classdescriptor.data[ele]);
      }
    }
    yield put(sendAllNodeClassToGraphCanvasReducer(classNameData));
  } catch (error) {
    console.log(error);
  }
}

// get adll class for CreateRelation button selector
function* getAllClassForCreateRelationButton() {
  console.log(">>> getallclassfor-addnodebutton");
  try {
    const classdescriptor = yield call(
      post,
      "http://localhost:3000/Db/getSchema",
      {}
    );
    let classNameData = [];
    for (let ele in classdescriptor.data) {
      // if it is Edge class?
      if (classdescriptor.data[ele].type === "e") {
        classNameData.push(classdescriptor.data[ele]);
      }
    }
    yield put(sendAllEdgeClassToGraphCanvasReducer(classNameData));
  } catch (error) {
    console.log(error);
  }
}

function* getInEdgeForNode(selectNode) {
  console.log(">get InEdge for Node");
  let nodes = [];
  let edges = [];
  let nodeID = JSON.parse(selectNode.payload);
  try {
    //// Input NodeID To get incomming Edge(ID)
    const incommingEdge = yield call(
      post,
      "http://localhost:3000/Vertex/getInEdge",
      {
        recordDescriptor: {
          rid: nodeID
        }
      }
    );

    for (let ele in incommingEdge.data) {
      //// Input EdgeID to get Src Node
      const nodeSrcResult = yield call(
        post,
        "http://localhost:3000/Edge/getSrc",
        {
          recordDescriptor: {
            rid: incommingEdge.data[ele].descriptor.rid
          }
        }
      );
      nodes.push({
        id: JSON.stringify(nodeSrcResult.data.descriptor.rid),
        label: nodeSrcResult.data.record.name,
        group: nodeSrcResult.data.record["@className"]
      });

      edges.push({
        id: JSON.stringify(incommingEdge.data[ele].descriptor.rid),
        from: JSON.stringify(nodeSrcResult.data.descriptor.rid),
        to: JSON.stringify(nodeID),
        label: incommingEdge.data[ele].record.name
      });
    }
    yield put(addIncomingNodeEdge(nodes, edges));
  } catch (error) {
    console.log(error);
  }
}

function* getOutEdgeForNode(selectNode) {
  console.log(">get OutEdge for Node");
  let nodes = [];
  let edges = [];
  let nodeID = JSON.parse(selectNode.payload);
  try {
    //// Input NodeID To get outgoing Edge(ID)
    const outgoingEdge = yield call(
      post,
      "http://localhost:3000/Vertex/getOutEdge",
      {
        recordDescriptor: {
          rid: nodeID
        }
      }
    );

    for (let ele in outgoingEdge.data) {
      //// Input EdgeID to get Dst Node
      const nodeDstResult = yield call(
        post,
        "http://localhost:3000/Edge/getDst",
        {
          recordDescriptor: {
            rid: outgoingEdge.data[ele].descriptor.rid
          }
        }
      );
      nodes.push({
        id: JSON.stringify(nodeDstResult.data.descriptor.rid),
        label: nodeDstResult.data.record.name,
        group: nodeDstResult.data.record["@className"]
      });
      edges.push({
        id: JSON.stringify(outgoingEdge.data[ele].descriptor.rid),
        from: JSON.stringify(nodeID),
        to: JSON.stringify(nodeDstResult.data.descriptor.rid),
        label: outgoingEdge.data[ele].record.name
      });
    }
    yield put(addOutgoingNodeEdge(nodes, edges));
  } catch (error) {
    console.log(error);
  }
}

function* updateNodeToDB(updateNode) {
  console.log(">>editNodetoDB");
  try {
    let updateNodeID = JSON.parse(updateNode.payload[0].id);
    yield call(post, "http://localhost:3000/Vertex/update", {
      recordDescriptor: {
        rid: updateNodeID
      },
      record: {
        name: updateNode.payload[0].label,
        date: updateNode.payload[0].date,
        time: updateNode.payload[0].time
      }
    });
    const newNodeCanvas = {
      id: updateNode.payload[0].id,
      label: updateNode.payload[0].label,
      group: updateNode.payload[0].group,
      date: updateNode.payload[0].date,
      time: updateNode.payload[0].time
    };
    const arr = [];
    arr.push(newNodeCanvas);
    yield put(addNodeToCanvas(arr));
  } catch (error) {
    console.log(error);
  }
}

function* updateEdgeToDB(updateEdge) {
  console.log(">>editEdgetoDB");
  try {
    // Parse EdgeID payload to object > database
    let updateEdgeID = JSON.parse(updateEdge.payload[0].id);
    let edgeSrcDst = yield call(post, "http://localhost:3000//Edge/getSrcDst", {
      recordDescriptor: {
        rid: updateEdgeID
      }
    });
    yield call(post, "http://localhost:3000/Edge/update", {
      recordDescriptor: {
        rid: updateEdgeID
      },
      record: {
        name: updateEdge.payload[0].label,
        inRelation: updateEdge.payload[0].inRelation,
        message: updateEdge.payload[0].message,
        outRelation: updateEdge.payload[0].outRelation
      }
    });
    const newEdgeCanvas = {
      id: updateEdge.payload[0].id,
      from: JSON.stringify(edgeSrcDst.data[0].descriptor.rid),
      to: JSON.stringify(edgeSrcDst.data[1].descriptor.rid),
      label: updateEdge.payload[0].label,
      group: updateEdge.payload[0].group,
      inRelation: updateEdge.payload[0].inRelation,
      message: updateEdge.payload[0].message,
      outRelation: updateEdge.payload[0].outRelation
    };

    const arrayEdge = [];
    arrayEdge.push(newEdgeCanvas);
    yield put(addEdgeToCanvas(arrayEdge));
  } catch (error) {
    console.log(error);
  }
}

function* getallnodePropertyDB(nodeID) {
  console.log(">>> getallNodeProperties");
  let objNodeID = JSON.parse(nodeID.payload);
  try {
    const nodeProperty = yield call(
      post,
      "http://localhost:3000/Db/getRecord",
      {
        recordDescriptor: {
          rid: objNodeID
        }
      }
    );
    yield put(sendAllNodePropertyToDataReducer(nodeProperty));
  } catch (error) {
    console.log(error);
  }
}

function* getAllEdgePropertyDB(edgeID) {
  console.log(">>> getallEdgeProperties");
  let objEdgeID = JSON.parse(edgeID.payload);
  try {
    const edgeProperty = yield call(
      post,
      "http://localhost:3000/Db/getRecord",
      {
        recordDescriptor: {
          rid: objEdgeID
        }
      }
    );
    yield put(sendAllEdgePropertyToDataReducer(edgeProperty));
  } catch (error) {
    console.log(error);
  }
}

function* getSrcDst() {
  console.log(">getsrcdstEdge");

  try {
    yield call(post, "http://localhost:3000/Edge/getSrcDst", {
      recordDescriptor: { rid: [11, 1] }
    });
  } catch (error) {
    console.log(error);
  }
}

export { rootSaga };
