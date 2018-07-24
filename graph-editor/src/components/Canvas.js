import React, { Component } from "react";
import Graph from "react-graph-vis";
import { connect } from "react-redux";
import Datetime from 'react-datetime';
import {
  getNodeID,
  getNodeID2,
  getNodeClass,
  getNodename,
  getEdgeID,
  deleteEdgeFromDatabase,
  storeEditName,
  storeEditNodeDateTime
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
  hideEdgeMenu
} from "../actions/nodeEdgesMenu";
import { deleteNodeFromDB,getNodeInEdge,getNodeOutEdge,addUpdateNodeToDatabase,getAllNodeProperties } from "../actions/databaseAction";
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
    getNodeInEdgeActionCreator: nodeID=>{
      dispatch(getNodeInEdge(nodeID));
    },
    getNodeOutEdgeActionCreator: (nodeID) => {
      dispatch(getNodeOutEdge(nodeID));
    },
    addUpdateNodeToDatabaseActionCreator: (nodeID) => {
      dispatch(addUpdateNodeToDatabase(nodeID));
    },
    getAllNodePropertiesActionCreator: (nodeID) => {
      dispatch(getAllNodeProperties(nodeID));
    },
    storeEditNameActionCreator: (name) => {
      dispatch(storeEditName(name))
    },
    storeEditNodeDateTimeActionCreator: (dateTime) => {
      dispatch(storeEditNodeDateTime(dateTime))
    },
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
      isEditNodeActive:false,
      createEdgeMode: false,
      isCreateRelationActive: false
    };
    this.handleNodeID = this.handleNodeID.bind(this);
    this.handleGetNodeName = this.handleGetNodeName.bind(this);
    this.getInRelationNode = this.getInRelationNode.bind(this);
    this.getOutRelationNode = this.getOutRelationNode.bind(this);
    this.setDisplayFormat = this.setDisplayFormat.bind(this);
    this.handleDeleteRelation = this.handleDeleteRelation.bind(this);
    this.handleIncomingButton = this.handleIncomingButton.bind(this);
    this.handleOutgoingButton = this.handleOutgoingButton.bind(this);
    this.onChangeNodeName = this.onChangeNodeName.bind(this);
    this.onChangeNodeDateTime = this.onChangeNodeDateTime.bind(this);
    // this.onChangeNodeTime = this.onChangeNodeTime.bind(this);
    this.handleEditNodeButton = this.handleEditNodeButton.bind(this);
    this.handleNodeID2 = this.handleNodeID2.bind(this);
  }
  handleNodeID(nodeIDs) {
    this.props.getNodeIDActionCreator(nodeIDs[0]);
  }
  handleNodeID2 = nodeIDs => {
    this.props.getNodeID2ActionCreator(nodeIDs[0]);
    this.setCreateEdgeModalTrue();
  };
  handleCreateRelation = () => {
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
      isCreateRelationActive: false
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
    console.log(this.props.data)
    this.setState({
      isEditNodeActive:true
    });
  };
  setEditNodeModalFalse = () => {
    this.setState({
      isEditNodeActive:false
    })
  }

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
    this.props.getNodeInEdgeActionCreator(this.props.data.nodeID)
  }
  handleOutgoingButton = () => {
    this.props.getNodeOutEdgeActionCreator(this.props.data.nodeID)
  }

  onChangeNodeName(e) {
    this.props.storeEditNameActionCreator(e.target.value)
      //  document.getElementById("myEditNodeDate").value,document.getElementById("myEditNodeTime").value)
    // this.setState({
    //   editNodeText: e.target.value
    // });
  }
  onChangeNodeDateTime = (e) => {
    this.props.storeEditNodeDateTimeActionCreator(e._d)
    // let ArrayTime = JSON.stringify(e._d.split(""))
     console.log(e._d)
  }

  // onChangeNodeTime = () => {
    
  // }

  handleEditNodeButton() {
    
    console.log(this.props.data.nodeProperty)
  
    let updateNodeDB = [
      { 
        id:this.props.data.nodeID,
        group: this.state.group,
        label: this.props.data.editNodeName,
        // date: this.props.data.nodeDateTime
        date: this.props.data.nodeDateTime
        // time: document.getElementById("myEditNodeTime").value
      }
    ];
    this.props.addUpdateNodeToDatabaseActionCreator(updateNodeDB);
    // this.setState({
    //   editNodeText: " "
    // });
    
    this.setEditNodeModalFalse();
  }


    // this.setNewNodeName(this.state.nodeID, this.state.editNodeName);
    // console.log(this.state.graph.nodes);
    // this.toggleEditnodeModal();
    // this.handleAlertTrue();
  
  
  // handleRemoveRelation = () => {
  //   let BackupNode = this.state.graph.edges.slice();
  //   let BackupEdges = this.state.graph.edges.slice();

  //   for (let ele1 in BackupEdges) {
  //     if (BackupEdges[ele1].id === this.state.relationID) {
  //       BackupEdges.splice(ele1, 1);
  //     }
  //   }

  //   this.setState({ graph: { nodes: BackupNode, edges: BackupEdges } });
  //   this.toggleRelationMenu();
  // };

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
            Command Menu : {data.nodeID}
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
            <button
              id="Edit-button"
              onClick={this.setEditNodeModalTrue}
            >
              Edit node {data.nodeID}
            </button>
            <Modal
                       isOpen={this.state.isEditNodeActive}
                       contentlabel="Node Editor"
                       onRequestClose={this.setEditNodeModalFalse}
                       style={customCreateEdgeModal}
                     >
                       <div id="edit-top-div"> Edit Node : {data.nodeID}</div>
                       <div id="edit-middle-div"> Classname : {data.nodeClass} <br />
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
                          
                             CreateDate : <Datetime value={this.props.data.nodeDateTime} onChange={this.onChangeNodeDateTime} viewMode={'days'}/>
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
                onRequestClose={this.state.toggleCreateRelationModalFalse}
                style={customStyle}
              >
                <div id="Modal-header">
                  Create Relationship from #inNodeID to #outNodeID
                  <button
                    id="hidemodal-button"
                    onClick={this.toggleCreateRelationModalFalse}
                  >
                    Hide Modal
                  </button>
                </div>
                {this.state.page === 1 ? (
                  <div id="modal-middle-div">
                    Class :{" "}
                    <select id="select-id"> {this.selectBoxList()} </select>
                  </div>
                ) : (
                  <div id="modal-middle-div">
                    Relation Classname : <hr />
                    <div id="inside-box">
                      {" "}
                      This relationship require no attribute
                    </div>
                  </div>
                )}
                {this.state.page === 1 ? (
                  <div id="modal-bottom-div">
                    Bottom modal 1 <hr />
                    <button
                      id="modal-cancel-button"
                      onClick={this.toggleCreateRelationModalFalse}
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
                    Bottom modal 2 <hr />
                    <button onClick={this.InitializePage}> Back </button>
                    <button
                      id="modal-cancel-button"
                      onClick={this.toggleCreateRelationModalFalse}
                    >
                      {" "}
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
              Remove
            </button>
            <button
              id="deleteNode-button"
              title="delete node from Database"
              onClick={this.toggleDeletenodeModal}
            >
              Delete
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
          Relationship Menu :
          {/* {this.state.relationID} */}
          <button
            id="editRelationship"
            // onClick={this.toggleEditRelationModal}
          >
            Edit Relationship
          </button>
          {/* <Modal isOpen={this.state.isEditRelationActive} contentLabel = "EditRelationship Modal" 
                            onRequestClose={this.toggleEditRelationModal}
                            style = {customEditRStyle} > <div id="editRModal-header">  Edit Relationship 
                     <button id="hidemodal-button" onClick={this.toggleEditRelationModal}>Hide Modal</button>
                     <hr></hr>
                     </div>
                    
                        <div id="editRmodal-middle-div"> relation <hr></hr>
                        <div id="ineditRmodal-middle-div">
                           inRelation <input type="text" placeholder="Node name...." className="Nodetext" onChange={this.handleChange} />
                               <select id="select-id"  > {this.selectBoxList()} </select> <br></br><br></br>
                             message   <input type="text" placeholder="Type message here...." className="msgTxt"  /> 
                               <select id="select-id"  > {this.selectBoxList()} </select>        <br></br><br></br>
                           outRelation  <input type="text" placeholder="Node name...." className="Nodetext" onChange={this.handleChange} />
                               <select id="select-id"  > {this.selectBoxList()} </select>
                           </div>
                        </div>
                        <br></br>
                        <div id="editRmodal-bottom-div">  
                        <button id="modal-cancel-button" onClick={this.toggleEditRelationModal}> Cancel </button>
                        <button id="Addnode-button" onClick={this.handleAddNodebutton} >Save Change</button>
                        </div>
        
                       
                     </Modal> */}
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
        {/*console.log("NodeID :"+data.nodeID)*/}
        <Graph
          graph={state.graphCanvas}
          options={graphOptions}
          events={{
            selectNode: function(event) {
              if (this.state.createEdgeMode === false) {
                this.handleNodeID(event.nodes);
              } else {
                this.handleNodeID2(event.nodes);
              }

              if (this.state.createEdgeMode === true) {
                const src = this.props.data.nodeID;
                const dest = this.props.data.nodeID2;
                //console.log(src,dest)
                //this.setSrcEdge(src);
                //this.setDecEdge(dest);
                //this.toggleCreateRelationModalTrue();
                this.setState({
                  createEdgeMode: false
                });
              }

              this.handleNodeID(event.nodes);
              this.props.showNodeMenuActionCreator();
              this.props.hideEdgeMenuActionCreator();
              this.props.getAllNodePropertiesActionCreator(this.props.data.nodeID);
              this.handleGetNodeName();
              this.handleNodeClass();
              //  this.getCreateDate();
            }.bind(this),
            deselectNode: function(/*event*/) {
              this.props.hideNodeMenuActionCreator();
              // this.handleAlertFalse();
              // this.toggleCreateRAlertmsgFalse();
            }.bind(this),

            selectEdge: function(event) {
              this.handleRelationID(event.edges);
              this.getInRelationNode();
              this.getOutRelationNode();
              this.props.showEdgeMenuActionCreator();
              this.props.hideNodeMenuActionCreator();
              // this.setDisplayEdge();
            }.bind(this),
            deselectEdge: function(/*event*/) {
              // this.toggleRelationMenu();
              this.props.hideEdgeMenuActionCreator();

              // this.setHideEdge();
              // this.setHideprop();
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
