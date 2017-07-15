import * as React from "react";
import * as ReactDOM from "react-dom";

import { Navbar } from "react-bootstrap"

import {TableViewModel} from "./viewmodels/TableViewModel"

import {TableView} from "./views/table/TableView"

class App extends React.Component {
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
      <TableView/>
    </div>)
  }
}

window.vm = new TableViewModel();

ReactDOM.render(
  (<App/>),
  document.getElementById('root')
);