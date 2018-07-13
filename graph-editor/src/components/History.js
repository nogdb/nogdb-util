import React, { Component } from 'react';
import { connect } from 'react-redux';
import {displayHistory,undisplayHistory} from '../actions/historyAction.js';

const mapStateToProps = state => {
    return {
      graph:state.graph,
      scale:state.scale,
      data:state.datas
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        setHistoryDisplayActionCreator: () => {
            dispatch (displayHistory())
          },
        setHistoryUndisplayActionCreator: () => {
            dispatch (undisplayHistory())
        }
     
      
    }
  }


class History extends Component {
    constructor(props){
        super(props);
        this.state= {
          isHistoryDispaly:false
        };
        // this.handle
    }
    render () {
        const {graph,scale,data} = this.props;
        let displaybutton;
        let historyBody;
        if (scale.historyBar === true){
            displaybutton = <button onClick={this.props.setHistoryUndisplayActionCreator}> hide </button>
            historyBody = <div className ='History-body'> HelloWorld </div>
        } else if (scale.historyBar === false ) {
            displaybutton = <button onClick={this.props.setHistoryDisplayActionCreator}>show</button>
            historyBody = null;
        }

        
      

        return (
            <div>
            
            <div className='History-box'> History Area  {displaybutton} </div>
            
            {historyBody}
           
            
           
            </div>
           

      

        )
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(History);