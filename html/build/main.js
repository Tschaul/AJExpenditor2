import * as React from "react";
import * as ReactDOM from "react-dom";

import { Navbar } from "react-bootstrap";

import { TableViewModel } from "./viewmodels/table/TableViewModel";
import { LoginViewModel } from "./viewmodels/login/LoginViewModel";

import { TableView } from "./views/table/TableView";
import { LoginView } from "./views/login/LoginView";

let App = class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tableViewModel: null,
      loginViewModel: new LoginViewModel(),
      loggedIn: false
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    var vm = new TableViewModel();
    this.setState({
      tableViewModel: vm,
      loggedIn: true
    });
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        Navbar,
        { inverse: true },
        React.createElement(
          Navbar.Header,
          null,
          React.createElement(
            Navbar.Brand,
            null,
            React.createElement(
              "a",
              { href: "#" },
              "\uD83D\uDC1E AJExpenditor 2"
            )
          )
        )
      ),
      !this.state.loggedIn && React.createElement(LoginView, { vm: this.state.loginViewModel, handleLogin: this.handleLogin }),
      this.state.loggedIn && React.createElement(TableView, { vm: this.state.tableViewModel })
    );
  }
};


ReactDOM.render(React.createElement(App, null), document.getElementById('root'));