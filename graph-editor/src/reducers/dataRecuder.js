const data = {
  nodeID: null,
  nodeID2: null,
  nodeClass: null,
  nodeName: null,
  edgeID: null,
  edgeName: null,
  edgeClass: null,
  edgeIn: null,
  edgeOut: null,
  selectId: null,
  edgeProperty: null,
  editNodeName: null,
  nodeDateTime: null,
  nodeProperty: null,

  inRelation: null,
  outRelation: null,
  message: null
};
const dataReducer = (state = data, action) => {
  switch (action.type) {
    case "GET_NODE_ID":
      state = {
        ...state,
        nodeID: action.payload
      };
      return state;
    case "GET_NODE_ID_2":
      state = {
        ...state,
        nodeID2: action.payload
      };
      console.log("from ", state.nodeID);
      console.log("to ", state.nodeID2);
      return state;
    case "GET_EDGE_ID":
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

    case "STORE_EDIT_NODENAME_VALUE":
      return {
        ...state,
        editNodeName: action.name
      };
    case "STORE_NODE_DATE_VALUE":
      return {
        ...state,
        nodeDateTime: action.dateTime
      };

    case "STORE_EDGE_INRELATION":
      return {
        ...state,
        inRelation: action.payload
      };

    case "STORE_EDGE_OUTRELATION":
      return {
        ...state,
        outRelation: action.payload
      };

    case "STORE_EDGE_MESSAGE":
      return {
        ...state,
        message: action.payload
      };

    case "STORE_EDGE_NAME":
      return {
        ...state,
        edgeName: action.payload
      };

    case "STORE_EDIT_EDGE_NAME":
      return {
        ...state,
        edgeName: action.payload
      };

    case "SEND_NODE_PERPERTY_TO_DATA_REDUCER":
      return {
        ...state,
        nodeProperty: action.payload.data,
        editNodeName: action.payload.data.name,
        nodeDateTime: action.payload.data.date,
        nodeClass: action.payload.data["@className"]
      };

    case "SEND_EDGE_PROPERTY_TO_DATA_REDUCER":
      return {
        ...state,
        edgeName: action.payload.data.name,
        edgeProperty: action.payload.data,
        inRelation: action.payload.data.inRelation,
        message: action.payload.data.message,
        outRelation: action.payload.data.outRelation,
        edgeClass: action.payload.data["@className"]
      };
    default:
      state = {
        ...state
      };
      return state;
  }
};
export default dataReducer;
