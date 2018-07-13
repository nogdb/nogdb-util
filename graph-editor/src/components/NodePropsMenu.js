import React, { Component } from 'react';
import {TabContent,TabPane,Nav,NavItem,NavLink,Card,Button,CardTitle,CardText,Row,Col} from "reactstrap";
import classnames from "classnames";
import { connect} from 'react-redux';
import {getNodeID,updateGraph} from '../actions/dataAction.js';
import {showNodeMenu,hideNodeMenu,showEdgeMenu,hideEdgeMenu,changeSizes,changeColorNode} from '../actions/nodeEdgesMenu';

const mapStateToProps = state => {
  return {
    graph:state.graph,
    scale:state.scale,
    data:state.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getNodeIDActionCreator: nodeID => {
      dispatch (getNodeID(nodeID))
    },
    showNodeMenuActionCreator : () => {
        dispatch(showNodeMenu())
    },
    hideNodeMenuActionCreator : () => {
        dispatch(hideNodeMenu())
    },
    showEdgeMenuActionCreator : () => {
      dispatch(showEdgeMenu())
    },
    hideEdgeMenuActionCreator : () => {
      dispatch(hideEdgeMenu())
    },
    updateGraphActionCreator : (newNode,newEdge) => {
      dispatch(updateGraph(newNode,newEdge))
    },
    changeSizesActionCreator : (ID,size) =>{
      dispatch(changeSizes(ID,size))
    },
    changeColorNodeActionCreator:(ID,colors)=>{
      dispatch(changeColorNode(ID,colors))
    }
  }
}

class NodePropertyMenu extends Component {
  constructor(props){
    super(props);
    this.state= {
     
    };
    this.toggle = this.toggle.bind(this);
    this.setDisplayFormat = this.setDisplayFormat.bind(this);
  }
  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };
   handleSize25 = () => {
    
    this.handleChangeSize(25);
   };
   handleSize50 = () => {
 
    this.handleChangeSize(50);
   };
   handleSize75 = () => {

    this.handleChangeSize(75);
   };
   handleSize100 = () => {

     this.handleChangeSize(100);
   };
   handleChangeSize = (size) =>{
     
     this.props.changeSizesActionCreator(this.props.data.nodeID,size)
   }
   selectedColor = () => {
    let colors = document.getElementById("select-nodecolor").value;
    this.props.changeColorNodeActionCreator(this.props.data.nodeID,colors)
       
      };
      setDisplayFormat = (dumb) => {
          let canvasNode = this.props.graph.graphCanvas.nodes.slice();
          // let canvasEdge = this.props.graph.grapCanvas.edges.slice();
          // let BackupGraph = this.props.graph.graphCanvas.nodes.slice();
          // let backUp;
          // for (let ele in BackupGraph.nodes) {
          //   if ( BackupGraph.nodes[ele].id === this.props.data.nodeID) {      
          //     backUp = BackupGraph.nodes[ele];
          //     break;
          //   }
          // }
          // let chosen;
          // for (let ele in canvasNode) {
          //   if (this.state.nodeID === canvasNode[ele].id) {
          //     chosen = canvasNode[ele];
    
          //     const update = { ...chosen, label: backUp.id };
          //     canvasNode[ele] = update;
          //   }
          // }
         
          // this.props.UpdateGraphActionCreator(canvasNode,canvasEdge)
            
           
          
       
      }
    render () {
      const {graph,scale,data} = this.props;
        return (
            <div className="Left-tab">
          <div id="topbar-prop">
           Node <button onClick={this.props.hideNodeMenuActionCreator}>Hide </button>
         </div>

         <Nav tabs>
            <NavItem>
              <NavLink
               className={classnames({ active: this.state.activeTab === "1" })}
                 onClick={() => {
                  this.toggle("1");
                }}
              >
               Properties
               </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                 className={classnames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                 this.toggle("2");
                }}
               >
                Settings
               </NavLink>
           </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="1">
              <Row>
                <Col sm="12">
                 <h4>Tab 1 Contents</h4>
                  @rid : {data.nodeID} <br />
                  @class : {data.nodeClass} <br />
                  CreatedDate : {this.state.createDate} <br />
                 name : {data.nodeName} <br />
               </Col>
               </Row>
           </TabPane>
             <TabPane tabId="2">
             <Row>
                <Col sm="12">
                  <h4>Tab 2 Contents </h4>
                  <p> Display Format </p>
                 <input
                    type="text"
                   placeholder="display format..."
                     className="Displayformat-text"
                  />
                  <button onClick={this.setDisplayFormat}> @rid</button>
                  <button onClick={this.setClassDisplayFormat}>@class</button>
                 <button> createdate </button>
                 <button onClick={this.setNameDisplayFormat}> name </button>

                   <br />
                   <p> Node Size </p>
                 <button onClick={this.handleSize25}>25</button>
                   <button onClick={this.handleSize50}>50</button>
                  <button onClick={this.handleSize75}>75</button>
                 <button onClick={this.handleSize100}>100</button>
                  <p> display node size </p>
                  <p> Node Color </p>
                  <select id="select-nodecolor" onChange={this.selectedColor}>
                   <option value="red">Red</option>
                  <option value="orange">Orange</option>
                   <option value="green">Green</option>
                   <option value="blue">Blue</option>
                    <option value="yellow">Yellow</option>
                    <option value="aqua">Aqua</option>
                  <option value="purple">Purple</option>
                  </select>
              </Col>
               </Row>
            </TabPane>
           </TabContent>
         </div> 
        )
    }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NodePropertyMenu);