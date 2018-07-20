import { all, takeEvery, call, put } from "redux-saga/effects";
import { get, post } from "../services/webService";
import {
  addRespondFromConsole,
  sendAllClassFromDatabaseToState,
  getAllClassFromDatabase,
  addVertexConsole,
  addEdgeConsole,
  sendAllNodeClassToGraphCanvasReducer,
  sendNodeIDToCanvas,
  addIncomingNodeEdge,
  addOutgoingNodeEdge
} from "../actions/databaseAction";
import {addNodeToCanvas} from "../actions/mainButtonAction";

const SQL_RESULT_TYPE = {
  RESULT_SET: "s"
};

// const SQL_RESULT_TYPE = {
//     RESULT_SET: 's',

// }

function* rootSaga() {
  yield all([
    takeEvery("EXECUTE", addConsoletoDB),
    takeEvery("DELETE_NODE_FROM_DATABASE", deleteNodeFromDB),
    takeEvery("DELETE_EDGE_FROM_DATABASE", deleteEdgeFromDB),
    takeEvery("GET_ALL_CLASS_FROM_DATABASE", checkClassEdgeNode),
    takeEvery("GET_EDGE_SRC_DST", getSrcDst),
    takeEvery("GET_ALL_CLASS_FOR_ADDNODE_BUTTON", getAllClassForAddNodeButton),
    takeEvery("ADD_NODE_TO_DB", addNodeToDB),
    takeEvery('GET_IN_EDGE_FOR_NODE',getInEdgeForNode),
    takeEvery('GET_OUT_EDGE_FOR_NODE',getOutEdgeForNode),
    takeEvery('ADD_UPDATE_NODE_TO_DB', updateNodeToDB),
    // takeEvery('ADD_EDGE_TO_DB', addEdgeToDB),
    // takeEvery('GET_NODES_FROM_DB', getNodesFromDB),
    // takeEvery('GET_EDGES_FROM_DB', getEdgesFromDB),
    // takeEvery('UPDATE_EDGE_TO_DB', updateEdgeToDB),
    takeEvery("DELETE_NODE_TO_DB", deleteNodeFromDB)
    //  takeEvery('DELETE_EDGE_TO_DB', deleteEdgeFromDB)
  ]);
}

function* addNodeToDB(newNode) {
  console.log(">addNodetoDB");
  try {
    const response = yield call(post, "http://localhost:3000/Vertex/create", {
      "className": newNode.payload[0].group,
      "record": {
        "name": newNode.payload[0].label,
        "date" : newNode.payload[0].date,
        "time": newNode.payload[0].time,
        
      }
    });
    let newNodeCanvas = [
      {
        id: JSON.stringify(response.data.rid),
        label: newNode.payload[0].label,
        group: newNode.payload[0].group,
        date:  newNode.payload[0].date,
        time: newNode.payload[0].time,
      }
    ];
     yield put(addNodeToCanvas(newNodeCanvas));
    console.log(response.data.rid);
   
  } catch (error) {
    //    yield put(addNodeToDBError(error));
    console.log(error);
  }
}

function* addConsoletoDB(sqlStr) {
  console.log(">>>ConsoleToDB");

  try {
    const resp = yield call(post, "http://localhost:3000/SQL/execute", {
      sql: sqlStr.payload
    });

    if (resp.data.type === "n") {
      console.log("There is no result");
    } else if (resp.data.type === "s") {
      const classdescriptor = yield call(
        post,
        "http://localhost:3000/Db/getSchema",
        {}
      );
     
      let hash = {};
      for (let ele in classdescriptor.data) {
        hash[classdescriptor.data[ele].id] = classdescriptor.data[ele].type;
      }
      let classNameData = [];
      for (let ele in classdescriptor.data) {
        if (classdescriptor.data[ele].type === "v") {
          classNameData.push(classdescriptor.data[ele]);
        }
      }
      yield put(sendAllNodeClassToGraphCanvasReducer(classNameData));

      let Nodes = [];
      let Edges = [];
      for (let ele in resp.data.data) {
        if (hash[resp.data.data[ele].descriptor.rid[0]] === "v") {
          Nodes.push(resp.data.data[ele]);
        } else if (hash[resp.data.data[ele].descriptor.rid[0]] === "e") {
          const recordDescriptor = yield call(
            post,
            "http://localhost:3000/Edge/getSrcDst",
            {
              recordDescriptor: { rid: resp.data.data[ele].descriptor.rid }
            }
          );
          // console.log(recordDescriptor);
          // Edges.push(resp.data.data[ele])
          Edges.push({
            data: resp.data.data[ele],
            from: recordDescriptor.data[0].descriptor.rid,
            to: recordDescriptor.data[1].descriptor.rid
          });
          // console.log(Edges)
        }
      }

      yield put(addVertexConsole(Nodes));
      yield put(addEdgeConsole(Edges));

      //   yield put(getAllClassFromDatabase(resp.data.data[ele].descriptor.rid[0]))
      console.log("RESULT_SET");
    } else if (resp.data.type === "c") {
      console.log("CLASS_DESCRIPTOR");
    } else if (resp.data.type === "p") {
      console.log("PROPERTY_DESCRIPTOR");
    } else if (resp.data.type === "r") {
      console.log("RECORD_DESCRIPTORS");
      console.log(resp);
    }
  } catch (error) {
    console.log(error);
  }
}

function* getSrcDst() {
  console.log(">getsrcdstEdge");

  try {
    const recordDescriptor = yield call(
      post,
      "http://localhost:3000/Edge/getSrcDst",
      {
        recordDescriptor: { rid: [11, 1] }
      }
    );

    console.log(recordDescriptor);
    // yield put(addNode(newNode));
  } catch (error) {
    console.log(error);
    //  yield put(addNodeToDBError(error));
  }
}

function* deleteNodeFromDB(nodeID) {
  console.log(">deleteNodefromDB");
  const vertexID = JSON.parse(nodeID.payload);
  console.log(typeof vertexID);
  console.log(vertexID);
  try {
    yield call(post, "http://localhost:3000/Vertex/destroy", {
      recordDescriptor: {
        rid: vertexID
      }
    });

    // yield put(addNode(newNode));
  } catch (error) {
    //  yield put(addNodeToDBError(error));
  }
}

function* deleteEdgeFromDB(edgeID) {
  console.log(">deleteEdgefromDB");
  try {
    yield call(post, "http://localhost:3000/Edge/destroy", {
      recordDescriptor: edgeID
    });

    // yield put(addNode(newNode));
  } catch (error) {
    //  yield put(addNodeToDBError(error));
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

    // console.log(classdescriptor.data.type)
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
      if (classdescriptor.data[ele].type === "v") {
        classNameData.push(classdescriptor.data[ele]);
      }
    }
    yield put(sendAllNodeClassToGraphCanvasReducer(classNameData));
  } catch (error) {
    console.log(error);
  }
}

function* getInEdgeForNode (selectNode) {
  console.log(">get InEdge for Node");
  let nodes = [];
  let edges = [];
  let nodeID = JSON.parse(selectNode.payload)
  try {

    //// Input NodeID To get incomming Edge(ID)
    const incommingEdge = yield call(
      post,
      "http://localhost:3000/Vertex/getInEdge",
      {
        "recordDescriptor" : {
          "rid": nodeID
        }
      }
    );
  
      for(let ele in incommingEdge.data){
        // console.log(incommingEdge.data[ele].descriptor.rid)
      

        //// Input EdgeID to get Src Node
      const nodeSrcResult = yield call(
        post,
        "http://localhost:3000/Edge/getSrc",
        {
          "recordDescriptor" : {
            "rid": incommingEdge.data[ele].descriptor.rid
          }
        }
      );
      nodes.push({
        id : JSON.stringify(nodeSrcResult.data.descriptor.rid),
        label : JSON.stringify(nodeSrcResult.data.record.name)
      })
      
      edges.push({
        id: JSON.stringify(incommingEdge.data[ele].descriptor.rid),
        from:JSON.stringify(nodeSrcResult.data.descriptor.rid),
        to:JSON.stringify(nodeID) ,
        label:JSON.stringify(incommingEdge.data[ele].record.name)
      })
    } 
    yield put(addIncomingNodeEdge(nodes,edges));
  } catch (error) {
    console.log(error);
  }
}


function* getOutEdgeForNode (selectNode) {
  console.log(">get OutEdge for Node");
  let nodes = [];
  let edges = [];
  let nodeID = JSON.parse(selectNode.payload)
  // let nodeID = selectNode.payload
  console.log(nodeID)
  try {

    //// Input NodeID To get outgoing Edge(ID)
    const outgoingEdge = yield call(
      post,
      "http://localhost:3000/Vertex/getOutEdge",
      {
        "recordDescriptor" : {
          "rid": nodeID
        }
      }
    );
  
      for(let ele in outgoingEdge.data){
        //// Input EdgeID to get Dst Node
      const nodeDstResult = yield call(
        post,
        "http://localhost:3000/Edge/getDst",
        {
          "recordDescriptor" : {
            "rid": outgoingEdge.data[ele].descriptor.rid
          }
        }
      );
      nodes.push({
        id : JSON.stringify(nodeDstResult.data.descriptor.rid),
        label : JSON.stringify(nodeDstResult.data.record.name)
      })
      JSON.stringify(nodeID) ,
      edges.push({
        id: JSON.stringify(outgoingEdge.data[ele].descriptor.rid),
        from:JSON.stringify(nodeID),
        to:JSON.stringify(nodeDstResult.data.descriptor.rid),
        label:JSON.stringify(outgoingEdge.data[ele].record.name)
      })
    } 
    yield put(addOutgoingNodeEdge(nodes,edges));
  } catch (error) {
    console.log(error);
  }
}

function* updateNodeToDB(updateNode) {
   console.log(">>editNodetoDB")
   console.log(updateNode.payload[0].id)
   console.log(updateNode)
    let updateNodeID = JSON.parse(updateNode.payload[0].id)
  //  let updateNodeObj = JSON.parse(updateNode.payload[0])
  
 
  try{
       yield call(post, "http://localhost:3000/Vertex/update", {
      "recordDescriptor": {
        "rid": updateNodeID,
      },
      "record": {
        "name": updateNode.payload[0].label,
         "date" : updateNode.payload[0].date,
         "time": updateNode.payload[0].time,
      }
      
    });
  
    let newNodeCanvas = [
      {
          id: JSON.stringify(updateNodeID),
          label: updateNode.payload[0].label,
          group: updateNode.payload[0].group,
          date: updateNode.payload[0].date,
          time: updateNode.payload[0].time,
      }
    ];
    // console.log(newNodeCanvas.time)
       yield put(addNodeToCanvas(newNodeCanvas));

  }catch(error){
    console.log(error)
  }

}

// function* updateEdgeToDB() {

// }


export { rootSaga };
