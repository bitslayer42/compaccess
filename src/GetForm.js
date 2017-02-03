import React from 'react';
import axios from 'axios'; //ajax library
import LibPath from './LibPath';
import Element from './Element';

class GetForm extends React.Component {
  constructor(props) { 
    super(props);
                                                        
    this.state = {
      nodes: [],
      header: {},
      loading: true,
      error: null,
      view: props.formtype //Can be "SUPV", "IS", or "EDIT"
    };
  }

  componentDidMount() { 
    axios.get(LibPath + 'FormJSON.cfm', {
      params: {
        FormID: 4,
        ReqID: 5
      }
    })
    .then(res => {
      const nodes = res.data.body; 
      const header = {};
      header.RequestID = res.data.RequestID;
      header.FormID = res.data.FormID;
      header.SupvID = res.data.SupvID;
      header.SupvName = res.data.SupvName;
      header.EnteredDate = res.data.EnteredDate;
      
      // Update state to trigger a re-render.
      this.setState({
        nodes,
        header,
        loading: false,
        error: null
      });
    })
    .catch(err => {
      this.setState({
        loading: false,
        error: err
      });
    }); 
  }

  handleClick(i) {
    i?console.log(i):console.log("clique");
  } 
  
  renderLoading() {
    return <div>Loading...</div>;
  }

  renderError() { 
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }
  
  makeTree() { 
    let nodes = this.state.nodes;
    let rootID = nodes[0].ID;
    var map = {}, node, atree = [];
    for (var i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        node.children = [];
        map[node.ID] = i; // use map to look-up the parents:stackoverflow.com/questions/18017869/
        if (node.ID !== rootID) {
            nodes[map[node.ParentID]].children.push(node);
        } else {
            atree.push(node);
        }
    }
                                                                          console.log(atree);
    return (
      <Element tree={atree} view={this.state.view} header={this.state.header} submitForm={(i) => this.handleClick(i)}/>
    )
    
  }
  
  render()  {
    return (
      <div className="outerdiv">
          {this.state.loading ?
          this.renderLoading()
          : this.makeTree()}
      </div>
    );
  }
}


export default GetForm;