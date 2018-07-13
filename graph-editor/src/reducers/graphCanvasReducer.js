const graphSetting = {
  graphCanvas: {
    nodes: [
      
    ],
    edges: [
      
    ]
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
  ID:[],
  name:[]
    

};

const graphCanvasReducer = (state = graphSetting, action) => {
  let nodeGroup;
  let externalOption = state.options.groups;
  let nodeForSizeAndColor = state.graphCanvas.nodes.slice();
  let updateColor, updateGroup, updateSize;
  switch (action.type) {
    case "ADD_NODE_ACTION": 
      const newGraphNodeCanvas = state.graphCanvas.nodes.slice();
      const newGraphEdgeCanvas = state.graphCanvas.edges.slice();
      console.log(action);
      for (let ele in action.payload) {
        if (
          JSON.stringify(newGraphNodeCanvas).includes(
            JSON.stringify(action.payload[ele])
          ) === false
        ) {
          newGraphNodeCanvas.push(action.payload[ele]);
        }
      }
      console.log(newGraphNodeCanvas);
      return {
        ...state,
        graphCanvas: {
          nodes: newGraphNodeCanvas,
          edges: newGraphEdgeCanvas
        }
      }
    case "CLEAR_CANVAS":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payload.nodes,
          edges: action.payload.edges
        }
      };
    case "REMOVE_NODE": {
      let backupNode = state.graphCanvas.nodes.slice();
      let backupEdge = state.graphCanvas.edges.slice();
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
      }
    }
    case "EDIT_SIZE":
      for (let ele in nodeForSizeAndColor) {
        if (nodeForSizeAndColor[ele].id === action.nodeID) {
          nodeGroup = nodeForSizeAndColor[ele].group;
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
      for (let ele in nodeForSizeAndColor) {
        if (nodeForSizeAndColor[ele].id === action.nodeID) {
          nodeGroup = nodeForSizeAndColor[ele].group;
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
        updateColor = { ...externalOption.B, color: { background: action.color, border: action.color } };
          updateGroup = { ...externalOption, B: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "C":
        updateColor = { ...externalOption.C, color: { background: action.color, border: action.color }  };
          updateGroup = { ...externalOption, C: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          }; 
        case "D":
        updateColor = { ...externalOption.D, color: { background: action.color, border: action.color }  };
          updateGroup = { ...externalOption, D: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
      }
    case "UPDATE_GRAPH":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payload1,
          edges: action.payload2
        }
      };break;

    case  'CONSOLE_RESPOND':
    let id = []
    let name = []
    let node = []
      for(let i = 0; i < action.payload.length;i++){
        id.push(action.payload[i].descriptor.rid)
        name.push(action.payload[i].record.name)
        node[i] = {id:JSON.stringify(id[i]),label :name[i]}
      }
      console.log(node)
      return {
        ...state,
        graphCanvas:{
          edges: [],
          nodes:node,
          
        
        }
      }
      break;

    default:
      state = {
        ...state
      };
      return state;
      
  }
};

export default graphCanvasReducer;
