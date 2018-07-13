import React, { Component } from 'react';
import {TabContent,TabPane,Nav,NavItem,NavLink,Card,Button,CardTitle,CardText,Row,Col} from "reactstrap";
import classnames from "classnames";
import { connect} from 'react-redux';
import {getNodeID} from '../actions/dataAction.js';
import {showNodeMenu,hideNodeMenu,showEdgeMenu,hideEdgeMenu} from '../actions/nodeEdgesMenu';


const mapStateToProps = state => {
    return {
      graph:state.graph,
      scale:state.scale,
      data:state.data
    }
  }

  const mapDispatchToProps = dispatch => {
    return {
      getNodeIDActionCreator: NodeID => {
        dispatch (getNodeID(NodeID))
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
      }
     
      
    }
  }

class EdgePropertyMenu extends Component {
    constructor(props){
      super(props);
      this.state= {
        
      };
      this.toggle = this.toggle.bind(this);
    }
    toggle = tab => {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    };
      render () {
        const {graph,scale,data} = this.props;
  
          return (
            <div className="Left-tab">
            <div id="topbar-prop">
              Relationship <button onClick={this.props.hideEdgeMenuActionCreator}>Hide </button>
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
                    <h4>Tab 1 Edge</h4>
                    @rid : {data.edgeID} <br />
                    @class : relationship <br />
                    in : {data.edgeIn} <br />
                    inRelation : <br />
                    message : <br />
                    out : {data.edgeOut} <br />
                    outRelation : <br />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <h4>Tab 2 Edge </h4>
                    <p> Display Format </p>
                    <input
                      type="text"
                      placeholder="display format..."
                      className="Displayformat-text"
                    />
                    <button onClick={this.setRIDRelationDisplayFormat}> @rid</button>
                    <button onClick={this.setClassRelationDisplayFormat}>@class</button>
                    <button onClick={this.setInRelationDisplayFormat}> in </button>
                    <button onClick={this.setOutRelationDisplayFormat}> out </button>
                    {/* <button onClick={this.setInRelationDisplayFormat}> inRelation </button> */}
                    {/* <button onClick={this.setOutRelationDisplayFormat}> outRelation </button> */}
                    <button onClick={this.setMessageDisplayFormat}> message </button>
  
                    <br />
  
                    <p> Relationship Color </p>
                    <select id="select-relationcolor">  
                      <option value="String">Red </option>
                      <option value="Integer">Blue </option>
                      <option value="etc">Yellow </option>
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
  )(EdgePropertyMenu);