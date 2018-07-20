const data = {
  nodeID: null,
  nodeID2:null,
  nodeClass: null,
  nodeName: null,
  edgeID: null,
  edgeClass: null,
  edgeIn: null,
  edgeOut: null,
  selectId: null
};
const dataReducer = (state = data, action) => {
  switch (action.type) {
    case "GET_NODE_ID":
      state = {
        ...state,
        nodeID: action.payload
      };

      console.log(state.nodeID)
      console.log(state.nodeID2)
      return state;
    case "GET_NODE_ID_2":

      state={
        ...state,
        nodeID2: action.payload,
      }
      console.log(state.nodeID)
      console.log(state.nodeID2)
    case "GET_EDGE_ID":
    //console.log(action.payload)
      state = {
        ...state,
        edgeID: action.payload
      };
      return state;

    case "GET_NODE_CLASS":
      state = {
        ...state,
        nodeClass: action.payload
      };
      return state;

    case "GET_NODE_NAME":
      state = {
        ...state,
        nodeName: action.payload
      };
      return state;

    case "GET_EDGE_CLASS":
      state = {
        ...state,
        edgeClass: action.payload
      };
      return state;

    case "GET_IN_RELATION":
      state = {
        ...state,
        edgeIn: action.payload
      };
      return state;

    case "SEND_SELECT_ID":
      state = {
        ...state,
        selectId: action.payload
      };
      break;
    case "GET_OUT_RELATION":
      state = {
        ...state,
        edgeOut: action.payload
      };
      return state;

    default:
      state = {
        ...state
      };
      return state;
  }
};
export default dataReducer;
