const data = {
  nodeID: null,
  nodeClass: null,
  nodeName: null,
  edgeID: null,
  edgeClass: null,
  edgeIn: null,
  edgeOut: null
};
const dataReducer = (state = data, action) => {
  switch (action.type) {
    case "GET_NODE_ID":
      state = {
        ...state,
        nodeID: action.payload
      };
      return state;
      break;

    case "GET_EDGE_ID":
      state = {
        ...state,
        edgeID: action.payload
      };
      return state;
      break;

    case "GET_NODE_CLASS":
      state = {
        ...state,
        nodeClass: action.payload
      };
      return state;
      break;

    case "GET_NODE_NAME":
      state = {
        ...state,
        nodeName: action.payload
      };
      return state;
      break;

    case "GET_EDGE_CLASS":
      state = {
        ...state,
        edgeClass: action.payload
      };
      return state;
      break;

    case "GET_IN_RELATION":
      state = {
        ...state,
        edgeIn: action.payload
      };
      return state;
      break;

    case "GET_OUT_RELATION":
      state = {
        ...state,
        edgeOut: action.payload
      };
      return state;
      break;

    default:
      state = {
        ...state
      };
      return state;
      break;
  }
};
export default dataReducer;
