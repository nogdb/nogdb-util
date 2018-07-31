import React, { Component } from "react";
import Modal from "react-modal";
import "./App.css";
import { Row, Col, Container } from "reactstrap";
import NogDBTitle from "../components/Title";
import Console from "../components/Console";
import Canvas from "../components/Canvas";
//import History from "../components/History";
import { Alert } from "reactstrap";
import { connect } from "react-redux";
import {
  addNodeToDatabase,
  clearCanvas,
  fullscreen,
  exitFullscreen
} from "../actions/mainButtonAction";
import NodePropertyMenu from "../components/NodePropsMenu";
import EdgePropertyMenu from "../components/EdgePropsMenu";
import {
  getAllClassFromDatabase,
  getAllNodeClassForAddNodeButton
} from "../actions/databaseAction";
import { setEditNodeAlertFalse } from "../actions/nodeEdgesMenu";

const customAddNodeStyle = {
  content: {
    posittion: "absolute",
    top: "20px",
    left: "40px",
    right: "40px",
    bottom: "40px",
    marginRight: "15%",
    marginLeft: "15%",
    marginTop: "10%",
    marginBottom: "10%"
  }
};

const mapStateToProps = state => {
  return {
    graph: state.graph,
    scale: state.scale,
    data: state.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addNodeToDatabaseActionCreator: newNode => {
      dispatch(addNodeToDatabase(newNode));
    },
    clearCanvasActionCreator: nullCanvas => {
      dispatch(clearCanvas(nullCanvas));
    },
    setFullsceenActionCreator: () => {
      dispatch(fullscreen());
    },
    exitFullscreenActionCreator: () => {
      dispatch(exitFullscreen());
    },
    getAllClassFromDatabaseActionCreator: () => {
      dispatch(getAllClassFromDatabase());
    },
    getAllNodeClassForAddNodeButtonActionCreator: () => {
      dispatch(getAllNodeClassForAddNodeButton());
    },
    setEditNodeAlertFalseActionCreator: () => {
      dispatch(setEditNodeAlertFalse());
    }
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: " ",
      srcValue: " ",
      dscValue: " ",
      isAddNodeActive: false,
      isAddEdgeActive: false,
      isEditNodeActive: false,
      isDeleteNodeActivate: false,
      isDeleteRelationActivate: false,
      page: 1,
      prevNodeID: " ",
      flagIsAddToCanvas: true,
      createDate: "",
      isEdgeProperty: false,
      createEdgeMode: false,
      isAlertShow: false,
      nodeLabel: " ",
      isCreateRelationAlertShow: false,
      group: null
    };
    this.handleAddNodeButton = this.handleAddNodeButton.bind(this);
    this.handleNextPage = this.handleNextPage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClearCanvas = this.handleClearCanvas.bind(this);
  }

  handleAddNodeButton() {
    let newNodeDB = [
      {
        label: this.state.textValue,
        group: this.state.group,
        date: document.getElementById("myDate").value,
        time: document.getElementById("myTime").value
      }
    ];
    this.props.addNodeToDatabaseActionCreator(newNodeDB);
    this.setState({
      textValue: ""
    });

    this.setModalAddNodeFalse();
  }
  setModalAddNodeTrue = () => {
    this.props.getAllNodeClassForAddNodeButtonActionCreator();
    this.setState({
      isAddNodeActive: true,
      page: 1
    });
  };
  setModalAddNodeFalse = () => {
    this.setState({
      isAddNodeActive: false,
      page: 1
    });
  };
  handleNextPage = () => {
    let g = document.getElementById("select-id");
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

  selectBoxList = graph => {
    let arr = [];
    const list = graph.classes;
    for (let ele in list) {
      arr.push(
        <option key={ele} value={list[ele]}>
          {list[ele]}
        </option>
      );
    }
    return arr;
  };

  handleChange(e) {
    this.setState({
      textValue: e.target.value
    });
  }

  handleClearCanvas() {
    let nullGraph = {
      nodes: [],
      edges: []
    };
    this.props.clearCanvasActionCreator(nullGraph);
    this.setState({ graph: nullGraph });
  }

  render() {
    const { graph, scale } = this.props;
    let Title;
    let canvas;
    let consoleBox;
    //let historyBox;
    let nodeTabBars;
    let edgeTabBars;
    let editNodeAlert;
    if (scale.editAlert === true) {
      editNodeAlert = (
        <Alert id="alertTest" color="success">
          {" "}
          Edit node successfully.
          <button
            id="close-editnode-alert"
            onClick={this.props.setEditNodeAlertFalseActionCreator}
          >
            X
          </button>
        </Alert>
      );
    } else {
      editNodeAlert = null;
    }

    if (scale.isFullscreen === true) {
      Title = null;
      consoleBox = null;
      //historyBox = null;
      canvas = <Canvas id="fullCanvas" state={graph} />;
    } else {
      Title = <NogDBTitle />;
      consoleBox = <Console />;
      //historyBox = <History />;
      canvas = <Canvas id="normalCanvas" state={graph} />;
    }
    if (scale.nodeMenu === true) {
      nodeTabBars = <NodePropertyMenu />;
    } else if (scale.nodeMenu === false) {
      nodeTabBars = null;
    }
    if (scale.edgeMenu === true) {
      edgeTabBars = <EdgePropertyMenu />;
    } else if (scale.edgeMenu === false) {
      edgeTabBars = null;
    }

    return (
      <Container>
        {Title}
        <Row>
          <Col md={scale.nodeMenu || scale.edgeMenu ? 3 : 0}>
            {nodeTabBars}
            {edgeTabBars}
          </Col>
          <Col md={scale.nodeMenu || scale.edgeMenu ? 9 : 12}>
            {consoleBox}
            <div>
              <button id="Addnode-modal" onClick={this.setModalAddNodeTrue}>
                Add node
              </button>

              {/*  Fullscreen state render setting */}

              {/* {scale.isFullscreen === false ? (
                <button
                  id="FullScreen-button"
                  onClick={this.props.setFullsceenActionCreator}
                >
                  Full screen
                </button>
              ) : (
                <button
                  id="FullScreen-button"
                  onClick={this.props.exitFullscreenActionCreator}
                >
                  Exit Fullscreen
                </button>
              )} */}
              <button id="Clear-Canvas" onClick={this.handleClearCanvas}>
                Clear Canvas
              </button>
            </div>

            {canvas}

            {/* input historyBox here! */}
            {/* {historyBox} */}
          </Col>
        </Row>
        {/* <NodePropertyMenu/> */}

        {/*Modal add node*/}
        <Modal
          isOpen={this.state.isAddNodeActive}
          contentLabel="addnode Modal"
          onRequestClose={this.setModalAddNodeTrue}
          style={customAddNodeStyle}
        >
          <div id="AddnodeModal-header">
            Add new node
            <button id="hidemodal-button" onClick={this.setModalAddNodeFalse}>
              Hide Modal
            </button>
          </div>
          {this.state.page === 1 ? (
            <div id="addnodemodal-middle-div">
              <hr />
              Class : {/*select class node*/}
              <select id="select-id"> {this.selectBoxList(graph)} </select>
            </div>
          ) : (
            <div id="addnodemodal-middle-div">
              <div id="edit-middle-div">
                {" "}
                {/* Group : {this.state.nodeClass} <br /> */}
                <br />
                <div id="inside-editmid-div">
                  <br />
                  {/*Hard Code*/}
                  <h5 id="Editnode-classname">name </h5>
                  {/*fill node name*/}
                  <input
                    type="node-edit"
                    placeholder="Edit...."
                    className="Node-editor"
                    onChange={this.handleChange}
                  />
                  <select id="select-nodetype">
                    <option value="String">String </option>
                  </select>
                  <br />

                  <form action="/action_page.php">
                    CreateDate: <input type="date" name="day" id="myDate" />
                    <input type="time" id="myTime" />
                    <select id="select-nodetype">
                      <option value="String">String </option>
                    </select>
                  </form>
                </div>
              </div>
            </div>
          )}
          {this.state.page === 1 ? (
            <div id="addnodemodal-top-div">
              <br />
              <br />
              <button
                id="modal-cancel-button"
                onClick={this.setModalAddNodeFalse}
              >
                Cancel
              </button>
              <button id="modal-next-button" onClick={this.handleNextPage}>
                Next
              </button>
            </div>
          ) : (
            <div id="addnodemodal-bottom-div">
              <button
                id="modal-cancel-button"
                onClick={this.setModalAddNodeFalse}
              >
                Cancel
              </button>
              <button id="Addnode-button" onClick={this.handleAddNodeButton}>
                Add node
              </button>
            </div>
          )}
        </Modal>
        {editNodeAlert}
      </Container>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
