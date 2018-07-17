import React, { Component } from 'react';
import { connect } from 'react-redux';
import {executeConsole,getAllClassFromDatabase} from '../actions/databaseAction.js';

const mapStateToProps = state => {
    return {
      graph:state.graph,
      scale:state.scale,
      data:state.data
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      executeConsoleActionCreater: SQL => {
        const action = executeConsole(SQL)
        console.log('#####', action)
        dispatch (action)
      },
      getAllClassFromDatabaseActionCreator: () => {
        dispatch (getAllClassFromDatabase());
      }
      
    }
  }



class Console extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textAreaValue:""
        };
        this.handleTextArea = this.handleTextArea.bind(this);
    }
    handleTextArea(e){
        this.setState ({
          textAreaValue:e.target.value
        })
       
      }
    render () {
        const {graph,scale,data} = this.props;

        return (
            <div className="Top-Box" align="center">
            <textarea row="4" cols = "50"
            onChange={this.handleTextArea}> </textarea>
            {/* {console.log(this.state.textAreaValue)} */}
            <button onClick={() => this.props.executeConsoleActionCreater(this.state.textAreaValue)}>Compile</button>
            {/* <button onClick={() => this.props.getAllClassFromDatabaseActionCreator()}>Get AllCLASS</button> */}
            </div>
            
        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Console);