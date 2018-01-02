var _class;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react";

import { Navbar, Nav, NavItem } from "react-bootstrap";

import { MainViewModel } from "./viewmodels/MainViewModel";

import { TableView } from "./views/table/TableView";
import { ChartView } from "./views/chart/ChartView";
import { ReportView } from "./views/report/ReportView";

let App = observer(_class = class App extends React.Component {

    constructor() {
        super();
        this.handleNavSelect = this.handleNavSelect.bind(this);
    }

    handleNavSelect(tabKey) {
        this.props.vm.selectedTabKey = tabKey;
    }

    renderContent() {
        switch (this.props.vm.selectedTabKey) {
            case 'table':
                return React.createElement(TableView, { vm: this.props.vm.tableViewModel });
            case 'chart':
                return React.createElement(ChartView, { vm: this.props.vm.chartViewModel });
            case 'report':
                return React.createElement(ReportView, { vm: this.props.vm.reportViewModel });
            default:
                return React.createElement(
                    "span",
                    null,
                    "Tab key not found"
                );
        }
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
                ),
                React.createElement(
                    Nav,
                    { bsStyle: "pills", activeKey: this.props.vm.selectedTabKey, onSelect: this.handleNavSelect },
                    React.createElement(
                        NavItem,
                        { eventKey: 'table' },
                        "Table"
                    ),
                    React.createElement(
                        NavItem,
                        { eventKey: 'chart' },
                        "Chart"
                    ),
                    React.createElement(
                        NavItem,
                        { eventKey: 'report' },
                        "Report"
                    )
                )
            ),
            this.renderContent()
        );
    }
}) || _class;

var vm = new MainViewModel();

window.vm = vm;

ReactDOM.render(React.createElement(App, { vm: vm }), document.getElementById('root'));