import { all, takeEvery, call, put } from 'redux-saga/effects'
import { get, post } from '../services/webService'
import { addNode,addNodeToDBError } from '../actions/mainButtonAction';


function* rootSaga() {
    yield all([
        takeEvery('EXECUTE', addConsoletoDB),
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

function* addConsoletoDB(sqlStr) {
    console.log('>>>>>')
    try {
     const resp =  yield call(post, 'http://localhost:3001/SQL/execute', 
        {
            "sql": sqlStr
        });
        // yield put(addNode(newNode));
        console.log(resp);
    } catch(error) {        
       console.log(error)
    }
}

// tmp = {
//     "type": "RECORD_DESCRIPTORS",
//     "data": {
        
//     }
// }

// function* addNodeToDB(newNode) {
//     try {
//         yield call(post, 'http://google.co.th/Vertex/create', 
//         {
//             "className": newNode.group,
//             "record": { 
//                 "xxx": newNode.label,
//                 "createdate":,
//                 "time":,

//             }
//         });
//         yield put(addNode(newNode));
//     } catch(error) {        
//          yield put(addNodeToDBError(error));
//     }
// }

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