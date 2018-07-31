import React, { Component } from "react";
import { connect } from "react-redux";
import {
  executeConsole,
  getAllClassFromDatabase,
  getSrcDstEdge
} from "../actions/databaseAction.js";

const mapStateToProps = state => {
  return {
    graph: state.graph,
    scale: state.scale,
    data: state.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    executeConsoleActionCreater: SQL => {
      const action = executeConsole(SQL);
      dispatch(action);
    },
    getAllClassFromDatabaseActionCreator: () => {
      dispatch(getAllClassFromDatabase());
    },
    getSrcDstEdgeActionCreator: edgeID => {
      dispatch(getSrcDstEdge(edgeID));
    }
  };
};

class Console extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textAreaValue: ""
    };
    this.handleTextArea = this.handleTextArea.bind(this);
  }
  handleTextArea(e) {
    this.setState({
      textAreaValue: e.target.value
    });
  }
  render() {
    return (
      <div className="Top-Box" align="center">
        <textarea row="4" cols="50" onChange={this.handleTextArea}>
          {" "}
        </textarea>

        <button
          id="CompileButton"
          onClick={() =>
            this.props.executeConsoleActionCreater(this.state.textAreaValue)
          }
        >
          Compile
        </button>
        {/* <button onClick={() => this.props.getNodeInEdgeActionCreator()}>GetAllgraph</button> */}
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Console);
