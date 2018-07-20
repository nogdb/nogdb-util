const graphSetting = {
  graphCanvas: {
    nodes: [],
    edges: []
  },
  options: {
    groups: {
      A: { color: { background: "red", border: "red" }, size: 25 },
      B: { color: { background: "orange", border: "orange" }, size: 25 },
      C: { color: { background: "green", border: "green" }, size: 25 },
      D: { color: { background: "pink", border: "pink" }, size: 25 }
    },
    layout: {
      hierarchical: false
    },
    edges: {
      color: {
        hover: "blue",
        highlight: "yellow"
      },
      width: 3
    },
    nodes: {
      color: {
        hover: {
          border: "blue"
        },
        highlight: {
          border: "yellow"
        }
      },
      shape: "dot",
      size: 25,
      font: {
        size: 22
      }
    },
    interaction: {
      hover: true,
      selectable: true,
      selectConnectedEdges: false
    },
    manipulation: {
      enabled: true
    }
  },
  respondFromConsole: [],
  ID: [],
  name: [],
  classes: [],
  nodeID_DB: "ccccc"
};

const graphCanvasReducer = (state = graphSetting, action) => {
  let nodeGroup;
  let externalOption = state.options.groups;
  let backupNode = state.graphCanvas.nodes.slice();
  let backupEdge = state.graphCanvas.edges.slice();
  let updateColor, updateGroup, updateSize;
  switch (action.type) {
    case "ADD_NODE_ACTION":
      //const newGraphNodeCanvas = state.graphCanvas.nodes.slice();
      //const newGraphEdgeCanvas = state.graphCanvas.edges.slice();

      for (let ele in action.payload) {
        if (
          JSON.stringify(backupNode).includes(
            JSON.stringify(action.payload[ele])
          ) === false
        ) {
          backupNode.push(action.payload[ele]);
        }
      }
      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: backupEdge
        }
      };
    case "CLEAR_CANVAS":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payload.nodes,
          edges: action.payload.edges
        }
      };
    case "REMOVE_NODE":
      //let backupNode = state.graphCanvas.nodes.slice();
      //let backupEdge = state.graphCanvas.edges.slice();
      for (let ele in backupNode) {
        if (backupNode[ele].id === action.payload) {
          backupNode.splice(ele, 1);
        }
      }
      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: backupEdge
        }
      };

    case "REMOVE_EDGE":
      //let backupNode = state.graphCanvas.nodes.slice();
      //let backupEdge = state.graphCanvas.edges.slice();
      for (let ele in backupEdge) {
        if (backupEdge[ele].id === action.payload) {
          backupEdge.splice(ele, 1);
        }
      }
      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: backupEdge
        }
      };

    case "EDIT_SIZE":
      for (let ele in backupNode) {
        if (backupNode[ele].id === action.nodeID) {
          nodeGroup = backupNode[ele].group;
          break;
        }
      }
      switch (nodeGroup) {
        case "A":
          updateSize = { ...externalOption.A, size: action.size };
          updateGroup = { ...externalOption, A: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "B":
          updateSize = { ...externalOption.B, size: action.size };
          updateGroup = { ...externalOption, B: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "C":
          updateSize = { ...externalOption.C, size: action.size };
          updateGroup = { ...externalOption, C: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "D":
          updateSize = { ...externalOption.D, size: action.size };
          updateGroup = { ...externalOption, D: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
      }
      break;
    case "CHANGE_COLOR_NODE":
      for (let ele in backupNode) {
        if (backupNode[ele].id === action.nodeID) {
          nodeGroup = backupNode[ele].group;
          break;
        }
      }
      switch (nodeGroup) {
        case "A":
          updateColor = {
            ...externalOption.A,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, A: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "B":
          updateColor = {
            ...externalOption.B,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, B: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "C":
          updateColor = {
            ...externalOption.C,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, C: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "D":
          updateColor = {
            ...externalOption.D,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, D: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
      }
      break;
    case "UPDATE_GRAPH":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payload1,
          edges: action.payload2
        }
      };

    case "ADD_VERTEX_CONSOLE": {
      //ADDNODE
      let nodeID = [];
      let nodeName = [];
      for (let i = 0; i < action.payload.length; i++) {
        console.log("hello");
        nodeID.push(action.payload[i].descriptor.rid);
        nodeName.push(action.payload[i].record.name);
        backupNode.push({ id: JSON.stringify(nodeID[i]), label: nodeName[i] });
        // node[i] = {id:JSON.stringify(nodeID[i]),label :nodeName[i]}
      }
      console.log(backupNode)
      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          //  nodes:graphSetting.graphCanvas.nodes,
          nodes: backupNode
        }
      };
    
      break;
    }
    case "GET_ALL_CLASS": //get all class from getschema index.js
      let className = [];
      for (let i = 0; i < action.payload.length; i++) {
        className.push(action.payload[i].name);
      }
      return {
        ...state,
        classes: className
      };

    case "ADD_EDGE_CONSOLE": {
      //AddEDGE
      let edgeID = [];
      let src = [];
      let dst = [];
      let edgeName = []; //label
      for (let i = 0; i < action.payload.length; i++) {
        edgeID.push(action.payload[i].data.descriptor.rid);
        src.push(action.payload[i].from);
        dst.push(action.payload[i].to);
        edgeName.push(action.payload[i].data.record.name);
        //////////////////////////////////////////////////////////////
    /// check same Edge before adding to backupEdge (graphcanvas State ) Here
        ///////////////////////////////////////////////////////////////
        backupEdge.push({
          id: JSON.stringify(edgeID[i]),
          from: JSON.stringify(src[i]),
          to: JSON.stringify(dst[i]),
          label: JSON.stringify(edgeName[i])
        });
      
      }
      console.log(backupEdge);
      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          nodes: backupNode
        }
      };
    }

    case "SEND_NODE_ID_TO_CANVAS":{
      return{
        ...state,
        nodeID_DB:action.payload
      }
    }
    case 'ADD_INCOMING_NODE_EDGE':{
      
      for(let ele in action.payloadNode){
        backupNode.push(action.payloadNode[ele])
      }
      for(let ele in action.payloadEdge){
        backupEdge.push(action.payloadEdge[ele])
      }
       console.log(backupNode)
      // console.log(action.payloadNode,action.payloadEdge)
      // backupNode.push(action.payloadnode)
      // backupEdge.push(action.payloadEdge)
      return{
        ...state,
        graphCanvas : {
          nodes:backupNode,
          edges:backupEdge
        }
      }
    }

    case 'Add_OUTGOING_NODE_EDGE':{
      
      for(let ele in action.payloadNode){
        backupNode.push(action.payloadNode[ele])
      }
      for(let ele in action.payloadEdge){
        backupEdge.push(action.payloadEdge[ele])
      }
       
      return{
        ...state,
        graphCanvas : {
          nodes:backupNode,
          edges:backupEdge
        }
      }
    }


    default:
      state = {
        ...state
      };
      return state;
  }
};

export default graphCanvasReducer;
