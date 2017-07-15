import * as React from "react";
import * as ReactDOM from "react-dom";

import { Navbar } from "react-bootstrap";

import { TableView } from "./views/table/TableView";

class App extends React.Component {
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
      React.createElement(TableView, null)
    );
  }
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));