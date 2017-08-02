import * as React from "react";
import * as ReactDOM from "react-dom";

import { Navbar } from "react-bootstrap"

import {TableViewModel} from "./viewmodels/table/TableViewModel"
import {LoginViewModel} from "./viewmodels/login/LoginViewModel"

import {TableView} from "./views/table/TableView"
import {LoginView} from "./views/login/LoginView"

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      tableViewModel: null,
      loginViewModel: new LoginViewModel(),
      loggedIn: false,
    }
    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin() {
    var vm = new TableViewModel();
    this.setState({
      tableViewModel: vm,
      loggedIn: true
    });
  }

  render(){
    return(
      <div>
        <Navbar inverse>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">🐞 AJExpenditor 2</a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        { !this.state.loggedIn && (
          <LoginView vm={this.state.loginViewModel} handleLogin={this.handleLogin}/>
        )}
        { this.state.loggedIn && (
          <TableView vm={this.state.tableViewModel}/>
        )}
      </div>
    )
  }
}

ReactDOM.render(
  (<App/>),
  document.getElementById('root')
);