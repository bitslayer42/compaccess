import React from 'react';
import axios from 'axios'; //ajax library
import LibPath from './LibPath';
import AddNew from './AddNew';
import TogglePublish from './TogglePublish';
import DeleteNode from './DeleteNode';
import { Link } from 'react-router';
import { hashHistory } from 'react-router';

export default class Admin extends React.Component {

  constructor(props) { 
    super(props);

    this.state = {
      adminData: null,
      loading: true,
      error: null
    };
    this.handleAddedForm = this.handleAddedForm.bind(this);
    this.handleDeletedForm = this.handleDeletedForm.bind(this);
    this.handleTogglePublish = this.handleTogglePublish.bind(this);
  }

  componentDidMount() { 
    axios.get(LibPath + 'AdminJSON.cfm')
    .then(res => {
      const adminData = res.data; 
      
      this.setState({
        adminData,
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
  
  renderLoading() {
    return <div>Loading...</div>;
  }
  
  unpackXML(xmlStr) { //The request has some of the key detail fields duplicated in the Requests.headerXML field, here we turn xml into a table row.
    let text = "<xml>" + xmlStr + "</xml>";

    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(text,"text/xml");
    let returnArr = [];
    let values = xmlDoc.getElementsByTagName("ItemValue");
    for (let i = 0; i < values.length; i++) {
        values[i].childNodes[0] && returnArr.push(<td key={i}>{values[i].childNodes[0].nodeValue}</td>);
    }
    return returnArr;
  }
  
  handleFormRowClick(ReqID){
    hashHistory.push(`/ADMIN/0/${ReqID}`);
  }

  handleAddedForm(obj){
    let newForm = {
      "Descrip":obj.Descrip,
      "FormID":obj.FormID,
      "Type":"UNPUB"
    }
    let newAdminData = {
      "admins": this.state.adminData.admins,
      "forms": this.state.adminData.forms.concat(newForm),
      "requests": this.state.adminData.requests,
      "root": this.state.adminData.root
    }
    this.setState({
      adminData: newAdminData
    });    
  }
  handleTogglePublish(toggledIndex){
    //console.log("handleTogglePublish");
    let newFormList = this.state.adminData.forms;
    newFormList[toggledIndex].Type=newFormList[toggledIndex].Type==="FORM"?"UNPUB":"FORM";
    let newAdminData = {
      "admins": this.state.adminData.admins,
      "forms": newFormList,
      "requests": this.state.adminData.requests,
      "root": this.state.adminData.root
    }
    this.setState({
      adminData: newAdminData
    });     
  }
    
  handleNewAdminClick(){
    console.log("handleNewAdminClick");
  }

  handleDeletedForm(deletedIndex){
    //console.log("handleDelete",deletedIndex);
    let newFormList = this.state.adminData.forms;
    newFormList.splice(deletedIndex,1);
    let newAdminData = {
      "admins": this.state.adminData.admins,
      "forms": newFormList,
      "requests": this.state.adminData.requests,
      "root": this.state.adminData.root
    }
    this.setState({
      adminData: newAdminData
    }); 
  }
  
  renderNextStep() {      console.log("adminData",this.state.adminData);                                                      
    var self = this; //so nested funcs can see the parent object
    let listRequests = <tr ><td colSpan="4">No unresolved requests.</td></tr>
    if(this.state.adminData.requests[0]) { 
      listRequests = this.state.adminData.requests.map(function(req){
        return (
          <tr key={req.RequestID}  className="reqsrow" onClick={() => self.handleFormRowClick(req.RequestID)}>
            
            {self.unpackXML(req.headerXML)}
          </tr>
        )
      });
    }
    let listFormsEDIT = this.state.adminData.forms.map(function(form,ix){
      return (
        <tr key={form.FormID}>
          <td>
          <TogglePublish FormID={form.FormID} published={form.Type==="FORM" ? true : false} handleTogglePublish={self.handleTogglePublish} index={ix} />
          </td><td>
          <Link to={`/EDIT/${form.FormID}`}>{form.Descrip}</Link>
          </td><td>
          <DeleteNode FormID={form.FormID} handleDelete={self.handleDeletedForm} index={ix}/>
          </td>
        </tr>
      )
    });
    let listFormsSUPV = this.state.adminData.forms.map(function(form){
      return <li key={form.FormID}><Link to={`/SUPV/${form.FormID}`}>{form.Descrip}</Link></li>;
    });
    let listAdmins = this.state.adminData.admins.map(function(adm){
      return <li key={adm.AdminID}><Link to={`/useradmin/${adm.AdminID}`}>{adm.Name}</Link></li>;
    });
    return (
      <div className="formclass" >
        <h1>Computer Access Forms-Admin</h1>
        <div className="sectionclass" >
        <h3> Unresolved Queue </h3>
        <table>
          <tbody>
            <tr><th>Form</th><th>Name</th><th>Reason</th><th>Access Needed</th></tr>
            {listRequests}
          </tbody>
        </table>
        </div>
        
        <div className="sectionclass" >
        <h3> Search Forms </h3>
        <ul>
          <input/><button>Search</button>
        </ul>
        </div>
        
        <div className="sectionclass" >
        <h3> Edit Forms </h3>
        <table>
          <tbody>
            {listFormsEDIT}
          </tbody>
        </table>
        <ul>
          <li >
            <AddNew typeToAdd="UNPUB" procToCall="AddChild" code="" parNodeID={this.state.adminData.root} handleAddedObj={this.handleAddedForm} />
          </li>
        </ul>
        </div>
        
        <div className="sectionclass" >
        <h3> Administrators </h3>
        <ul>
          {listAdmins}
        </ul>
        <ul>
          <li className="editclass" onClick={() => self.handleNewAdminClick()}>Add New Administrator</li>
        </ul> 
        </div>
        
        <div className="sectionclass" >        
        <h3> Enter a Request </h3>
        <ul>
          {listFormsSUPV}
        </ul>
        </div>
      </div>
    )
  }
  
  renderError() { 
    return (
      <div>
        Uh oh: {this.state.error.message}
      </div>
    );
  }
  
  render()  {
    return (
      <div className="outerdiv">
          {this.state.loading ?
          this.renderLoading()
          : this.renderNextStep()}
      </div>
    );
  }
}


