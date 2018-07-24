import { all, takeEvery, call, put } from "redux-saga/effects";
import { post } from "../services/webService";
import {
  sendAllClassFromDatabaseToState,
  addVertexConsole,
  addEdgeConsole,
  sendAllNodeClassToGraphCanvasReducer,
  sendNodeIDToCanvas
} from "../actions/databaseAction";

// const SQL_RESULT_TYPE = {
//     RESULT_SET: 's',

// }

function* rootSaga() {
  yield all([
    takeEvery("EXECUTE", addConsoletoDB),
    //takeEvery("DELETE_NODE_FROM_DATABASE", deleteNodeFromDB),
    takeEvery("DELETE_EDGE_FROM_DATABASE", deleteEdgeFromDB),
    takeEvery("GET_ALL_CLASS_FROM_DATABASE", checkClassEdgeNode),
    takeEvery("GET_EDGE_SRC_DST", getSrcDst),
    takeEvery("GET_ALL_CLASS_FOR_ADDNODE_BUTTON", getAllClassForAddNodeButton),
    takeEvery("ADD_NODE_TO_DB", addNodeToDB),
    // takeEvery('ADD_EDGE_TO_DB', addEdgeToDB),
    // takeEvery('GET_NODES_FROM_DB', getNodesFromDB),
    // takeEvery('GET_EDGES_FROM_DB', getEdgesFromDB),
    // takeEvery('UPDATE_NODE_TO_DB', updateNodeToDB),
    // takeEvery('UPDATE_EDGE_TO_DB', updateEdgeToDB),
    takeEvery("DELETE_NODE_TO_DB", deleteNodeFromDB)
    //  takeEvery('DELETE_EDGE_TO_DB', deleteEdgeFromDB)
  ]);
}
//add node button
function* addNodeToDB(newNode) {
  console.log(">addNodetoDB");
  /// console.log(newNode.payload);
  try {
    const response = yield call(post, "http://localhost:3000/Vertex/create", {
      className: newNode.payload[0].group,
      record: {
        name: newNode.payload[0].label,
        date: newNode.payload[0].date,
        time: newNode.payload[0].time
      }
    });
    yield put(sendNodeIDToCanvas(response.data.rid));
  } catch (error) {
    //    yield put(addNodeToDBError(error));
    console.log(error);
  }
}
//sql command in console
function* addConsoletoDB(sqlStr) {
  console.log(">>>ConsoleToDB");

  try {
    const resp = yield call(post, "http://localhost:3000/SQL/execute", {
      sql: sqlStr.payload
    });
    console.log(resp);

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

      //let classNameData = [];
      //console.log(classdescriptor.data);
      // for (let ele in classdescriptor.data) {
      //   if (classdescriptor.data[ele].type === "v") {
      //     classNameData.push(classdescriptor.data[ele]);
      //   }
      // }
      // console.log(classNameData)
      //yield put(sendAllNodeClassToGraphCanvasReducer(classNameData));
      let Nodes = [];
      let Edges = [];
      for (let ele in resp.data.data) {
        if (hashIDToType[resp.data.data[ele].descriptor.rid[0]] === "v") {
          Nodes.push(resp.data.data[ele]);
          // USE
          // Nodes.push({
          //   data: resp.data.data[ele],
          //   group: hash2[resp.data.data[ele].descriptor.rid[0]]
          // })

          // )
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
          //console.log(recordDescriptor);
          // Edges.push(resp.data.data[ele])
          Edges.push({
            data: resp.data.data[ele],
            from: recordDescriptor.data[0].descriptor.rid,
            to: recordDescriptor.data[1].descriptor.rid
            //group: hash2[resp.data.data[ele].descriptor.rid[0]]
          });
          // console.log(Edges)
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
  const vertexID = JSON.parse(nodeID.payload);
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

  console.log(JSON.parse(edgeID.payload));
  try {
    yield call(post, "http://localhost:3000/Edge/destroy", {
      recordDescriptor: {
        rid: JSON.parse(edgeID.payload)
      }
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

// function* addEdgeToDB(newEdge) {

// }

// function* getNodesFromDB() {
//     try{
//     // const response = yield call (get,'http://google/co.th'/nodes)
//     } catch(error) {

//     }
//     yield
// }

// function* getEdgesFromDB() {

// }

// function* updateNodeToDB() {

// }

// function* updateEdgeToDB() {

// }

// function* deleteNodeFromDB() {
//     try {
//           yield call(post, 'http://google.co.th/Vertex/destroy',
//            {
//                "recordDescriptor": nodeid,
//                }
//            );
//            yield put(addNode(newNode));
//        } catch(error) {
//             yield put(addNodeToDBError(error));
//        }

// }

// function* deleteEdgeFromDB() {

// }

export { rootSaga };
