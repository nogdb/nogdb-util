const graphSetting = {
  graphCanvas: {
    nodes: [],
    edges: []
  },
  options: {
    groups: {
      Person: { color: { background: "red", border: "red" }, size: 25 },
      School: { color: { background: "orange", border: "orange" }, size: 25 },
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
  edgeClass: [],
  nodeID_DB: "ccccc",
  nodeIDDB: "",
  selectClass: " ",
  label: {
    id: [],
    label: []
  } //use to show label on graph
};

const graphCanvasReducer = (state = graphSetting, action) => {
  let nodeGroup = null;
  let externalOption = state.options.groups;
  let backupNode = state.graphCanvas.nodes.slice();
  let backupEdge = state.graphCanvas.edges.slice();
  let updateColor, updateGroup, updateSize;
  let hashIDToClass = {};
  for (let i in backupNode) {
    hashIDToClass[JSON.parse(backupNode[i].id)[0]] = backupNode[i].group;
  }
  switch (action.type) {
    //edit node button render
    case "ADD_NODE_ACTION":
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

    case "ADD_EDGE_CANVAS": {
      let copyEdge = state.graphCanvas.edges.slice();
      for (let ele in action.payload) {
        if (
          JSON.stringify(copyEdge).includes(
            JSON.stringify(action.payload[ele])
          ) === false
        ) {
          copyEdge.push(action.payload[ele]);
          copyEdge.shift();
        }
      }
      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: copyEdge
        }
      };
    }
    case "CLEAR_CANVAS":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payload.nodes,
          edges: action.payload.edges
        }
      };
    case "REMOVE_NODE":
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
      nodeGroup = hashIDToClass[JSON.parse(action.nodeID)[0]];

      //Hard Code node class name

      switch (nodeGroup) {
        case "Person":
          updateSize = { ...externalOption.Person, size: action.size };
          updateGroup = { ...externalOption, Person: updateSize };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "School":
          updateSize = { ...externalOption.School, size: action.size };
          updateGroup = { ...externalOption, School: updateSize };
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
        default:
      }
      break;
    case "CHANGE_COLOR_NODE":
      nodeGroup = hashIDToClass[JSON.parse(action.nodeID)[0]];
      //Hard Code node class name

      switch (nodeGroup) {
        case "Person":
          updateColor = {
            ...externalOption.Person,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, Person: updateColor };
          return {
            ...state,
            options: { ...state.options, groups: updateGroup }
          };
        case "School":
          updateColor = {
            ...externalOption.School,
            color: { background: action.color, border: action.color }
          };
          updateGroup = { ...externalOption, School: updateColor };
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
        default:
      }
      break;
    case "UPDATE_GRAPH":
      return {
        ...state,
        graphCanvas: {
          nodes: action.payloadNode,
          edges: action.payloadEdge
        }
      };
    //add node via console

    case "ADD_VERTEX_CONSOLE": {
      //ADDNODE
      let nodeID = [];
      let nodeName = [];
      let nodeGroup = [];
      /// convert nodeID type is string---"[10,2]"
      let tempID = [];
      let hashIDToLabel = {};
      let hashLabelToID = {};

      for (let i = 0; i < action.payload.length; i++) {
        nodeID.push(action.payload[i].descriptor.rid);
        tempID.push(nodeID[i].join(","));
        nodeName.push(action.payload[i].record.name);
        nodeGroup.push(action.payload[i].record["@className"]);
        //default
        //use label to store what node or edge name render
      }
      let a = [];
      for (let i in graphSetting.label.id) {
        a.push(graphSetting.label.id[i].join(","));
      }
      for (let ele in tempID) {
        if (a.includes(tempID[ele]) === true) {
          if (graphSetting.label.label.includes(nodeName[ele]) === false) {
            for (let ele2 in graphSetting.label.id) {
              if (a[ele2] === tempID[ele]) {
                graphSetting.label.label[ele2] = nodeName[ele];
              }
            }
          }
        } else if (a.includes(tempID[ele]) === false) {
          graphSetting.label.id.push(nodeID[ele]);
          graphSetting.label.label.push(nodeName[ele]);
        }
      }

      // hash node id to label of node
      for (let ele in graphSetting.label.id) {
        hashIDToLabel[JSON.stringify(graphSetting.label.id[ele])] =
          graphSetting.label.label[ele];
        hashLabelToID[graphSetting.label.label[ele]] = JSON.stringify(
          graphSetting.label.id[ele]
        );
      }
      let hashIDBackupNode = {};
      for (let ele in backupNode) {
        hashIDBackupNode[backupNode[ele].id] = backupNode[ele].label;
      }
      const backupID = nodeID.map(item => JSON.stringify(item));
      for (let i in backupID) {
        if (backupNode.map(item => item.id).includes(backupID[i]) === false) {
          backupNode.push({
            id: JSON.stringify(nodeID[i]),
            label: hashIDToLabel[JSON.stringify(nodeID[i])],
            group: nodeGroup[i]
          });
        } else if (
          backupNode.map(item => item.id).includes(backupID[i]) === true &&
          hashIDToLabel[backupID[i]] !== hashIDBackupNode[backupID[i]]
        ) {
          const index = backupNode
            .map(item => item.label)
            .indexOf(hashIDBackupNode[backupID[i]]);
          a = backupNode[index];
          const update = {
            ...backupNode[index],
            label: hashIDToLabel[backupID[i]]
          };
          backupNode[index] = update;
        }
      }

      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          nodes: backupNode
        }
      };
    }
    case "SEND_EDGE_CLASS": {
      //get all edgeclass from getschema index.js
      let edgeClassName = [];
      for (let i = 0; i < action.payload.length; i++) {
        edgeClassName.push(action.payload[i].name);
      }
      return {
        ...state,
        edgeClass: edgeClassName
      };
    }
    case "GET_ALL_CLASS": {
      //get all class from getschema index.js
      let className = [];
      for (let i = 0; i < action.payload.length; i++) {
        className.push(action.payload[i].name);
      }
      return {
        ...state,
        classes: className
      };
    }
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

        backupEdge.push({
          id: JSON.stringify(edgeID[i]),
          from: JSON.stringify(src[i]),
          to: JSON.stringify(dst[i]),
          label: JSON.stringify(edgeName[i])
        });
      }

      const backupID = edgeID.map(item => JSON.stringify(item));
      for (let i in backupID) {
        if (backupEdge.map(item => item.id).includes(backupID[i]) === false) {
          backupEdge.push({
            id: JSON.stringify(edgeID[i]),
            from: JSON.stringify(src[i]),
            to: JSON.stringify(dst[i]),
            label: edgeName[i]
          });
        }
      }
      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          nodes: backupNode
        }
      };
    }

    case "SEND_NODE_ID_TO_CANVAS": {
      return {
        ...state,
        nodeID_DB: action.payload
      };
    }
    case "ADD_INCOMING_NODE_EDGE": {
      for (let ele in action.payloadNode) {
        backupNode.push(action.payloadNode[ele]);
      }
      for (let ele in action.payloadEdge) {
        backupEdge.push(action.payloadEdge[ele]);
      }

      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: backupEdge
        }
      };
    }

    case "ADD_OUTGOING_NODE_EDGE": {
      for (let ele in action.payloadNode) {
        backupNode.push(action.payloadNode[ele]);
      }
      for (let ele in action.payloadEdge) {
        backupEdge.push(action.payloadEdge[ele]);
      }
      return {
        ...state,
        graphCanvas: {
          nodes: backupNode,
          edges: backupEdge
        }
      };
    }
    case "ADD_NODE_RENDER": {
      backupNode.push(action.payload);
      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          nodes: backupNode
        }
      };
    }
    case "ADD_EDGE_RENDER": {
      console.log(">>addedgeTorender");
      backupEdge.push(action.payload[0]);
      return {
        ...state,
        graphCanvas: {
          edges: backupEdge,
          nodes: backupNode
        }
      };
    }

    default:
      state = {
        ...state
      };
      return state;
  }
};

export default graphCanvasReducer;
