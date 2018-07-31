import React, { Component } from "react";
import Graph from "react-graph-vis";
import { connect } from "react-redux";
import Datetime from "react-datetime";
import {
  getNodeID,
  getNodeID2,
  getNodeClass,
  getNodename,
  getEdgeID,
  deleteEdgeFromDatabase,
  storeEditName,
  storeEditNodeDateTime,
  storeEditInRelation,
  storeEditOutRelation,
  storeEditMessage,
  storeEdgeNewName,
  storeEditRelationName
} from "../actions/dataAction.js";
import {
  getEdgeClass,
  getInRelation,
  getOutRelation
} from "../actions/dataAction.js";
import {
  showNodeMenu,
  hideNodeMenu,
  showEdgeMenu,
  hideEdgeMenu,
  setEditNodeAlertTrue,
  setEditNodeAlertFalse
} from "../actions/nodeEdgesMenu";
import {
  deleteNodeFromDB,
  getNodeInEdge,
  getNodeOutEdge,
  addUpdateNodeToDatabase,
  getAllNodeProperties,
  getAllEdgeProperties,
  addUpdateEdgeToDatabase,
  getAllEdgeClassForAddNodeButton,
  createNewEdgeToDatabase
} from "../actions/databaseAction";
import { removeNode, removeEdgeCanvas } from "../actions/menuAction";
import { Modal, Button } from "reactstrap";

const mapStateToProps = state => {
  return {
    graph: state.graph,
    scale: state.scale,
    data: state.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getNodeIDActionCreator: nodeID => {
      dispatch(getNodeID(nodeID));
    },
    getNodeID2ActionCreator: nodeID => {
      dispatch(getNodeID2(nodeID));
    },
    getEdgeIDActionCreator: edgeID => {
      dispatch(getEdgeID(edgeID));
    },
    getNodeClassActionCreator: nodeClass => {
      dispatch(getNodeClass(nodeClass));
    },
    getEdgeClassActionCreator: edgeClass => {
      dispatch(getEdgeClass(edgeClass));
    },
    getInRelationActionCreator: number => {
      dispatch(getInRelation(number));
    },
    getOutRelationActionCreator: number => {
      dispatch(getOutRelation(number));
    },
    getNodeNameActionCreator: nodeName => {
      dispatch(getNodename(nodeName));
    },
    showNodeMenuActionCreator: () => {
      dispatch(showNodeMenu());
    },
    hideNodeMenuActionCreator: () => {
      dispatch(hideNodeMenu());
    },
    showEdgeMenuActionCreator: () => {
      dispatch(showEdgeMenu());
    },
    hideEdgeMenuActionCreator: () => {
      dispatch(hideEdgeMenu());
    },
    removeNodeActionCreator: nodeID => {
      dispatch(removeNode(nodeID));
    },
    deleteEdgeFromDatabaseActionCreator: edgeID => {
      dispatch(deleteEdgeFromDatabase(edgeID));
    },
    removeEdgeCanvasActionCreator: edgeID => {
      dispatch(removeEdgeCanvas(edgeID));
    },
    deleteNodeFromDB: nodeID => {
      dispatch(deleteNodeFromDB(nodeID));
    },
    getNodeInEdgeActionCreator: nodeID => {
      dispatch(getNodeInEdge(nodeID));
    },
    getNodeOutEdgeActionCreator: nodeID => {
      dispatch(getNodeOutEdge(nodeID));
    },
    addUpdateNodeToDatabaseActionCreator: updateNodeDB => {
      dispatch(addUpdateNodeToDatabase(updateNodeDB));
    },
    getAllNodePropertiesActionCreator: nodeID => {
      dispatch(getAllNodeProperties(nodeID));
    },
    storeEditNameActionCreator: name => {
      dispatch(storeEditName(name));
    },
    storeEditNodeDateTimeActionCreator: dateTime => {
      dispatch(storeEditNodeDateTime(dateTime));
    },
    setEditNodeAlertTrueActionCreator: () => {
      dispatch(setEditNodeAlertTrue());
    },
    setEditNodeAlertFalseActionCreator: () => {
      dispatch(setEditNodeAlertFalse());
    },
    getAllEdgePropertiesActionCreator: edgeID => {
      dispatch(getAllEdgeProperties(edgeID));
    },
    addUpdateEdgeToDatabaseActionCreator: updateEdgeID => {
      dispatch(addUpdateEdgeToDatabase(updateEdgeID));
    },
    storeEditInRelationActionCreator: inRelation => {
      dispatch(storeEditInRelation(inRelation));
    },
    storeEditOutRelationActionCreator: outRelation => {
      dispatch(storeEditOutRelation(outRelation));
    },
    storeEditMessageActionCreator: Message => {
      dispatch(storeEditMessage(Message));
    },
    storeEditRelationNameActionCreator: editEdgeName => {
      dispatch(storeEditRelationName(editEdgeName));
    },
    getAllEdgeClassForAddNodeButtonActionCreator: () => {
      dispatch(getAllEdgeClassForAddNodeButton());
    },
    createNewEdgeToDatabaseActionCreator: newEdge => {
      dispatch(createNewEdgeToDatabase(newEdge));
    },
    storeEdgeNewNameActionCreator: edgeName => {
      dispatch(storeEdgeNewName(edgeName));
    }
  };
};
const customStyle = {
  content: {
    posittion: "absolute",
    top: "20px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    marginRight: "15%",
    marginLeft: "15%",
    marginTop: "15%",
    marginBottom: "15%"
  }
};
const customEditRelationStyle = {
  content: {
    posittion: "absolute",
    top: "20px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    marginRight: "10%",
    marginLeft: "10%",
    marginTop: "10%",
    marginBottom: "10%"
  }
};
const customCreateEdgeModal = {
  content: {
    position: "absolute",
    top: "20px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    marginRight: "10%",
    marginLeft: "10%",
    marginTop: "30%",
    marginBottom: "15%"
  }
};

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editNodeText: "",
      isDeleteNodeActivate: false,
      isDeleteRelationActivate: false,
      isEditNodeActive: false,
      createEdgeMode: false,
      isCreateRelationActive: false,
      isEditRelationActive: false,
      page: 1,
      group: null
    };
    this.handleGetNodeName = this.handleGetNodeName.bind(this);
    this.getInRelationNode = this.getInRelationNode.bind(this);
    this.getOutRelationNode = this.getOutRelationNode.bind(this);
    this.setDisplayFormat = this.setDisplayFormat.bind(this);
    this.handleDeleteRelation = this.handleDeleteRelation.bind(this);
    this.handleIncomingButton = this.handleIncomingButton.bind(this);
    this.handleOutgoingButton = this.handleOutgoingButton.bind(this);
    this.onChangeNodeName = this.onChangeNodeName.bind(this);
    this.onChangeNodeDateTime = this.onChangeNodeDateTime.bind(this);
    this.handleEditNodeButton = this.handleEditNodeButton.bind(this);
    this.handleNodeID2 = this.handleNodeID2.bind(this);
    this.handleInRelationChange = this.handleInRelationChange.bind(this);
    this.handleEdgeNewName = this.handleEdgeNewName.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleOutRelationChange = this.handleOutRelationChange.bind(this);
    this.handleRelationNameChange = this.handleRelationNameChange.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.initializePage = this.initializePage.bind(this);
  }
  initializePage = () => {
    this.setState({
      page: 1
    });
  };

  handleNodeID2 = () => {
    this.setCreateEdgeModalTrue();
  };
  handleCreateRelation = () => {
    this.props.getAllEdgeClassForAddNodeButtonActionCreator();
    this.setState({
      createEdgeMode: true
    });
  };

  setCreateEdgeModalTrue = () => {
    this.setState({
      isCreateRelationActive: true
    });
  };

  setCreateEdgeModalFalse = () => {
    this.setState({
      isCreateRelationActive: false,
      page: 1
    });
  };

  handleGetNodeName = () => {
    for (let ele in this.props.graph.graphCanvas.nodes) {
      if (
        this.props.graph.graphCanvas.nodes[ele].id === this.props.data.nodeID
      ) {
        this.props.getNodeNameActionCreator(
          this.props.graph.graphCanvas.nodes[ele].label
        );
      }
    }
  };
  handleNodeClass = () => {
    for (let ele in this.props.graph.graphCanvas.nodes) {
      if (
        this.props.graph.graphCanvas.nodes[ele].id === this.props.data.nodeID
      ) {
        this.props.getNodeClassActionCreator(
          this.props.graph.graphCanvas.nodes[ele].group
        );
      }
    }
  };
  handleRelationID = relaID => {
    this.props.getEdgeIDActionCreator(relaID[0]);
  };
  getInRelationNode = () => {
    for (let ele in this.props.graph.graphCanvas.edges) {
      if (
        this.props.graph.graphCanvas.edges[ele].id === this.props.data.edgeID
      ) {
        this.props.getInRelationActionCreator(
          this.props.graph.graphCanvas.edges[ele].to
        );
      }
    }
  };
  getOutRelationNode = () => {
    for (let ele in this.props.graph.graphCanvas.edges) {
      if (
        this.props.graph.graphCanvas.edges[ele].id === this.props.data.edgeID
      ) {
        this.props.getOutRelationActionCreator(
          this.props.graph.graphCanvas.edges[ele].from
        );
      }
    }
  };
  setDisplayFormat = () => {
    let canvasNode = this.props.graph.graphCanvas.nodes.slice();
    let canvasEdge = this.props.graph.grapCanvas.edges.slice();
    let backupGraph = this.props.graph.graphCanvas.nodes.slice();
    let backupNode;
    for (let ele in backupGraph.nodes) {
      if (backupGraph.nodes[ele].id === this.props.data.nodeID) {
        backupNode = backupGraph.nodes[ele];
        break;
      }
    }
    let chooseNode;
    for (let ele in canvasNode) {
      if (this.state.nodeID === canvasNode[ele].id) {
        chooseNode = canvasNode[ele];

        const update = { ...chooseNode, label: backupNode.id };
        canvasNode[ele] = update;
      }
    }
    this.setState({
      graph: {
        nodes: canvasNode,
        edges: canvasEdge
      }
    });
  };

  handleRemoveNode = () => {
    this.props.removeNodeActionCreator(this.props.data.nodeID);
  };

  toggleDeletenodeModal = () => {
    this.setState({
      isDeleteNodeActivate: !this.state.isDeleteNodeActivate
    });
  };

  setEditNodeModalTrue = () => {
    this.props.getAllNodePropertiesActionCreator(this.props.data.nodeID);
    this.setState({
      isEditNodeActive: true
    });
  };
  setEditNodeModalFalse = () => {
    this.setState({
      isEditNodeActive: false
    });
  };

  toggleEditRelationModal = () => {
    this.setState({
      isEditRelationActive: !this.state.isEditRelationActive
    });
  };
  toggleDeleteRelationModal = () => {
    this.setState({
      isDeleteRelationActivate: !this.state.isDeleteRelationActivate
    });
  };

  handleDeleteNode = () => {
    this.props.deleteNodeFromDB(this.props.data.nodeID);
    this.props.removeNodeActionCreator(this.props.data.nodeID);
    this.toggleDeletenodeModal();
  };

  handleDeleteRelation = () => {
    this.props.deleteEdgeFromDatabaseActionCreator(this.props.data.edgeID);
    this.props.removeEdgeCanvasActionCreator(this.props.data.edgeID);
    this.toggleDeleteRelationModal();
  };

  handleIncomingButton = () => {
    this.props.getNodeInEdgeActionCreator(this.props.data.nodeID);
  };
  handleOutgoingButton = () => {
    this.props.getNodeOutEdgeActionCreator(this.props.data.nodeID);
  };

  onChangeNodeName(e) {
    this.props.storeEditNameActionCreator(e.target.value);
  }
  onChangeNodeDateTime = e => {
    this.props.storeEditNodeDateTimeActionCreator(e._d);
  };
  onChangeNodeDateTime = e => {
    this.props.storeEditNodeDateTimeActionCreator(e._d);
  };

  handleInRelationChange = e => {
    this.props.storeEditInRelationActionCreator(e.target.value);
  };

  handleMessageChange = e => {
    this.props.storeEditMessageActionCreator(e.target.value);
  };
  handleOutRelationChange = e => {
    this.props.storeEditOutRelationActionCreator(e.target.value);
  };
  handleRelationNameChange = e => {
    this.props.storeEditRelationNameActionCreator(e.target.value);
  };

  handleEdgeNewName = e => {
    this.props.storeEdgeNewNameActionCreator(e.target.value);
  };

  handleEditNodeButton() {
    let updateNodeDB = [
      {
        id: this.props.data.nodeID,
        group: this.props.data.nodeProperty["@className"],
        label: this.props.data.editNodeName,
        date: this.props.data.nodeDateTime
      }
    ];
    this.props.setEditNodeAlertTrueActionCreator();
    this.props.addUpdateNodeToDatabaseActionCreator(updateNodeDB);
    this.setEditNodeModalFalse();
  }

  handleEditRelationbutton = () => {
    let updateEdgeDB = [
      {
        id: this.props.data.edgeID,
        label: this.props.data.edgeName,
        group: this.props.data.edgeProperty["@className"],
        inRelation: this.props.data.inRelation,
        outRelation: this.props.data.outRelation,
        message: this.props.data.message
      }
    ];
    this.props.addUpdateEdgeToDatabaseActionCreator(updateEdgeDB);
    this.toggleEditRelationModal();
  };

  selectEdgeClassList = graph => {
    let arr = [];
    const list = graph.edgeClass;
    for (let ele in list) {
      arr.push(
        <option key={ele} value={list[ele]}>
          {list[ele]}
        </option>
      );
    }
    return arr;
  };

  handleNextPage = () => {
    let g = document.getElementById("selectEdge-id");
    let selectGroup;

    for (let i = 0; i < g.options.length; i++) {
      if (g.options[i].selected === true) {
        selectGroup = g.options[i].value;
        break;
      }
    }
    this.setState({
      page: 2,
      group: selectGroup
    });
  };

  handleCreateRelationbutton = () => {
    let newEdge = [
      {
        className: this.state.group,
        srcVertex: this.props.data.nodeID,
        dstVertex: this.props.data.nodeID2,
        name: this.props.data.edgeName
      }
    ];

    this.props.createNewEdgeToDatabaseActionCreator(newEdge);

    this.setCreateEdgeModalFalse();
  };

  render() {
    const { state, scale, data } = this.props;
    const graphOptions = Object.assign(
      { width: "100%", height: "100%", autoResize: true },
      state.options
    );
    let commandBox;
    //Show node menu when click node
    if (scale.nodeMenu === true) {
      commandBox = (
        <div id="command-div">
          <div id="history-div">
            <button
              id="Incoming-button"
              title="Incoming Relationship"
              onClick={this.handleIncomingButton}
            >
              Incoming
            </button>
            <button
              id="Outcoming-button"
              title="Outcoming Relationship"
              onClick={this.handleOutgoingButton}
            >
              Outgoing
            </button>
            <button id="Edit-button" onClick={this.setEditNodeModalTrue}>
              Edit node
            </button>
            <Modal
              isOpen={this.state.isEditNodeActive}
              contentlabel="Node Editor"
              onRequestClose={this.setEditNodeModalFalse}
              style={customCreateEdgeModal}
            >
              <div id="edit-top-div"> Edit Node : {data.nodeID}</div>
              <div id="edit-middle-div">
                {" "}
                Classname : {data.nodeClass} <br />
                <div id="inside-editmid-div">
                  <br />
                  <h5 id="Editnode-classname">name </h5>
                  <input
                    type="text"
                    placeholder="Edit...."
                    className="Node-editor"
                    value={this.props.data.editNodeName}
                    onChange={this.onChangeNodeName}
                  />
                  <select id="select-nodetype">
                    <option value="String">String </option>
                  </select>
                  <br />

                  <form action="/action_page.php">
                    CreateDate :{" "}
                    <Datetime
                      value={this.props.data.nodeDateTime}
                      onChange={this.onChangeNodeDateTime}
                      viewMode={"days"}
                    />
                    {/* CreateDate: <input type="date" name="day" id="myEditNodeDate" /> */}
                    {/* <input type="time" id="myEditNodeTime" /> */}
                    <select id="select-nodetype">
                      <option value="String">String </option>
                    </select>
                  </form>
                </div>
              </div>
              <div id="edge-bottom-div">
                <br />
                <button id="cancel-edge" onClick={this.setEditNodeModalFalse}>
                  Cancel
                </button>
                <button id="Edge-button" onClick={this.handleEditNodeButton}>
                  Save Change
                </button>
              </div>
            </Modal>
            <button
              id="createRelation-button"
              title="create relationship"
              onClick={this.handleCreateRelation}
            >
              CreateRelation
            </button>
            {
              <Modal
                isOpen={this.state.isCreateRelationActive}
                contentLabel="CreateRelation Modal"
                onRequestClose={this.state.setCreateEdgeModalFalse}
                style={customStyle}
              >
                <div id="Modal-header">
                  Create Relationship from #{this.props.data.nodeID} to #{
                    this.props.data.nodeID2
                  }
                  <button
                    id="hidemodal-button"
                    onClick={this.setCreateEdgeModalFalse}
                  >
                    Hide Modal
                  </button>
                </div>
                {this.state.page === 1 ? (
                  <div id="modal-middle-div">
                    Class :
                    <select id="selectEdge-id">
                      {" "}
                      {this.selectEdgeClassList(state)}{" "}
                    </select>
                  </div>
                ) : (
                  <div id="modal-middle-div">
                    Relation Classname : {this.state.group} <hr />
                    <div id="inside-box">
                      {" "}
                      Name :{" "}
                      <input
                        type="text"
                        placeholder="input new nodename...."
                        className="Nodetext"
                        onChange={this.handleEdgeNewName}
                      />
                    </div>
                  </div>
                )}
                {this.state.page === 1 ? (
                  <div id="modal-bottom-div">
                    <button
                      id="modal-cancel-button"
                      onClick={this.setCreateEdgeModalFalse}
                    >
                      Cancel
                    </button>
                    <button
                      id="modal-next-button"
                      onClick={this.handleNextPage}
                    >
                      Next
                    </button>
                  </div>
                ) : (
                  <div id="modal-bottom-div">
                    <button onClick={this.initializePage}> Back </button>
                    <button
                      id="modal-cancel-button"
                      onClick={this.setCreateEdgeModalFalse}
                    >
                      Cancel
                    </button>
                    <button
                      id="Addedge-button"
                      onClick={this.handleCreateRelationbutton}
                    >
                      Create Relation
                    </button>
                  </div>
                )}
              </Modal>
            }
            <button
              id="removeNode-button"
              title="remove node from canvas"
              onClick={this.handleRemoveNode}
            >
              Delete node from canvas
            </button>
            <button
              id="deleteNode-button"
              title="delete node from Database"
              onClick={this.toggleDeletenodeModal}
            >
              Delete node from database
            </button>
            <Modal
              isOpen={this.state.isDeleteNodeActivate}
              contentlabel="DeleteNodeModal"
              onRequestClose={this.toggleDeletenodeModal}
              style={customCreateEdgeModal}
            >
              <div id="top-deletenode-div"> DeleteNode </div>
              <div id="middle-deletenode-div">
                Deleting node {this.state.nodeID} will permanantly be removed
                from your Database
              </div>
              <div id="bottom-deletenode-div">
                <button onClick={this.toggleDeletenodeModal}>
                  No,keep Node
                </button>
                <Button color="danger" onClick={this.handleDeleteNode}>
                  Yes,Delete Node!
                </Button>
              </div>
            </Modal>
          </div>
        </div>
      );
    } else if (scale.nodeMenu === false) {
      commandBox = null;
    }
    let relationBox;
    if (scale.edgeMenu === true) {
      relationBox = (
        <div id="relationMenu-div">
          <button id="editRelationship" onClick={this.toggleEditRelationModal}>
            Edit Relationship
          </button>
          <Modal
            isOpen={this.state.isEditRelationActive}
            contentLabel="EditRelationship Modal"
            onRequestClose={this.toggleEditRelationModal}
            style={customEditRelationStyle}
          >
            {" "}
            <div id="editRModal-header">
              {" "}
              Edit Relationship
              <button
                id="hidemodal-button"
                onClick={this.toggleEditRelationModal}
              >
                Hide Modal
              </button>
              <hr />
            </div>
            <div id="editRmodal-middle-div">
              {" "}
              relation <hr />
              <div id="ineditRmodal-middle-div">
                inRelation{" "}
                <input
                  type="text"
                  value={this.props.data.inRelation}
                  placeholder="input inrelation...."
                  className="Nodetext"
                  onChange={this.handleInRelationChange}
                />
                {/* <select id="select-inrelation">
                  <option value="String">INTEGER </option>
                </select>{" "} */}
                <br />
                <br />
                message{" "}
                <input
                  type="text"
                  value={this.props.data.message}
                  placeholder="Type message here...."
                  className="msgTxt"
                  onChange={this.handleMessageChange}
                />
                {/* <select id="select-message">
                  <option value="String">STRING </option>
                </select>{" "} */}
                <br />
                <br />
                outRelation{" "}
                <input
                  type="text"
                  value={this.props.data.outRelation}
                  placeholder="input outrelation...."
                  className="Nodetext"
                  onChange={this.handleOutRelationChange}
                />
                {/* <select id="select-outRelation">
                  <option value="String">INTEGER </option>
                </select>{" "}  */}
                <br />
                Name :
                <input
                  type="text"
                  value={this.props.data.edgeName}
                  placeholder="input namerelation...."
                  className="Nodetext"
                  onChange={this.handleRelationNameChange}
                />
                <select id="select-outRelation">
                  <option value="String">STRING </option>
                </select>
                <br />
                <br />
              </div>
            </div>
            <br />
            <div id="editRmodal-bottom-div">
              <button
                id="modal-cancel-button"
                onClick={this.toggleEditRelationModal}
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                id="editRelation-button"
                onClick={this.handleEditRelationbutton}
              >
                Save Change
              </button>
            </div>
          </Modal>
          <button
            id="deleteRelationship"
            onClick={this.toggleDeleteRelationModal}
          >
            Delete Relationship
          </button>
          <Modal
            isOpen={this.state.isDeleteRelationActivate}
            contentlabel="DeleteRelationModal"
            onRequestClose={this.toggleDeleteRelationModal}
            style={customCreateEdgeModal}
          >
            <div id="top-deletenode-div"> Delete Relation </div>
            <div id="middle-deletenode-div">
              Deleting Relation {this.state.relationID} will permanantly be
              removed from your Database
            </div>
            <div id="bottom-deletenode-div">
              <button onClick={this.toggleDeleteRelationModal}>
                No,keep Relationship
              </button>
              <Button color="danger" onClick={this.handleDeleteRelation}>
                Yes,Delete Relationship!
              </Button>
            </div>
          </Modal>
        </div>
      );
    } else if (scale.edgeMenu === false) {
      relationBox = null;
    }

    return (
      <div className="Canvas" align="center">
        {commandBox}
        {relationBox}
        <Graph
          graph={state.graphCanvas}
          options={graphOptions}
          events={{
            selectNode: function(event) {
              if (this.state.createEdgeMode === false) {
                this.props.getNodeIDActionCreator(event.nodes[0]);
              } else {
                this.handleNodeID2(event.nodes);
                this.props.getNodeID2ActionCreator(event.nodes[0]);
              }

              if (this.state.createEdgeMode === true) {
                this.setState({
                  createEdgeMode: false
                });
              }

              this.props.showNodeMenuActionCreator();
              this.props.hideEdgeMenuActionCreator();
              this.props.getAllNodePropertiesActionCreator(
                this.props.data.nodeID
              );
              this.handleGetNodeName();
              this.handleNodeClass();
            }.bind(this),
            deselectNode: function(/*event*/) {
              this.props.hideNodeMenuActionCreator();
            }.bind(this),

            selectEdge: function(event) {
              this.handleRelationID(event.edges);
              this.getInRelationNode();
              this.getOutRelationNode();
              this.props.showEdgeMenuActionCreator();
              this.props.hideNodeMenuActionCreator();
              this.props.getAllEdgePropertiesActionCreator(
                this.props.data.edgeID
              );
            }.bind(this),
            deselectEdge: function() {
              this.props.hideEdgeMenuActionCreator();
            }.bind(this)
          }}
        />
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Canvas);
