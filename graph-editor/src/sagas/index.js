import { all, takeEvery, call, put } from 'redux-saga/effects'
import { get, post } from '../services/webService'
import { addRespondFromConsole,sendAllClassFromDatabaseToState,getAllClassFromDatabase} from '../actions/databaseAction';





function* rootSaga() {
    yield all([
        takeEvery('EXECUTE', addConsoletoDB),
        takeEvery('ADD_NODE_DB',addNodetoDB),
        takeEvery('DELETE_NODE_FROM_DATABASE',deleteNodeFromDB),
        takeEvery('DELETE_EDGE_FROM_DATABASE',deleteEdgeFromDB),
        takeEvery('GET_ALL_CLASS_FROM_DATABASE',getAllClassFromDB)
        //  takeEvery('ADD_NODE_TO_DB', addNodeToDB),
        // takeEvery('ADD_EDGE_TO_DB', addEdgeToDB),
        // takeEvery('GET_NODES_FROM_DB', getNodesFromDB),
        // takeEvery('GET_EDGES_FROM_DB', getEdgesFromDB),
        // takeEvery('UPDATE_NODE_TO_DB', updateNodeToDB),
        // takeEvery('UPDATE_EDGE_TO_DB', updateEdgeToDB),
        // takeEvery('DELETE_NODE_TO_DB', deleteNodeFromDB),
        //  takeEvery('DELETE_EDGE_TO_DB', deleteEdgeFromDB)
      
    ])
}

function* addNodetoDB(newNode) {
    console.log('>addNodetoDB')
    try {
       const response = yield call(post, 'http://localhost:3000/Vertex/create', 
        {
            "className": newNode[0].group,
            "record": { 
                "label": newNode[0].label,
                "createdate":newNode[0].date,
                "time":newNode[0].time

            }
        });
        console.log(response);
        // yield put(addNode(newNode));
    } catch(error) {        
        //  yield put(addNodeToDBError(error));
    }
}

function* addConsoletoDB(sqlStr) {
    console.log('>>>>>')
    console.log(sqlStr.payload)
    //  this.props.getAllClassFromDatabaseActionCreator(className)
    try {
     const resp =  yield call(post, 'http://localhost:3000/SQL/execute', 
        {
            "sql": sqlStr.payload
        });
        if (resp.data.type === "n"){
            console.log("There is no result");
        }else if (resp.data.type === "s"){
        yield put(addRespondFromConsole(resp.data.data));
        // console.log(resp.data.data)
        for(let ele in resp.data.data){
        yield put(getAllClassFromDatabase(resp.data.data[ele].descriptor.rid[0]))
        }
       
            console.log("RESULT_SET")
        }else if (resp.data.type === "c"){
            console.log("CLASS_DESCRIPTOR")
        }else if (resp.data.type === "p"){
            console.log("PROPERTY_DESCRIPTOR")
        }else if (resp.data.type === "r"){
            console.log("RECORD_DESCRIPTORS")
            console.log(resp)
        }
    } catch(error) {        
        console.log(error)
    }
}


function* deleteNodeFromDB(nodeID) {
    console.log('>deleteNodefromDB')
    try {
           yield call(post, 'http://localhost:3000/Vertex/destroy', 
        {
            "RecordDescriptor": nodeID

        });
       

        // yield put(addNode(newNode));
    } catch(error) {        
        //  yield put(addNodeToDBError(error));
    }
}

function* deleteEdgeFromDB(edgeID) {
    console.log('>deleteEdgefromDB')
    try {
           yield call(post, 'http://localhost:3000/Edge/destroy', 
        {
            "RecordDescriptor": edgeID

        });
       

        // yield put(addNode(newNode));
    } catch(error) {        
        //  yield put(addNodeToDBError(error));
    }
}

function* getAllClassFromDB(selectID) {
    console.log('>getallclassfromDB')
  
    try {
          const classdescriptor = yield call(post, 'http://localhost:3000/Db/getSchema', 
        {
            "classId": selectID.payload 
            // "className": selectClassName
            // "className": 'Person'
        });
       
        console.log(classdescriptor.data.type)
          yield put(sendAllClassFromDatabaseToState(classdescriptor));
    } catch(error) {        
         console.log(error)
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

export { rootSaga }