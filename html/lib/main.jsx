import * as React from "react";
import * as ReactDOM from "react-dom";
import { observer } from "mobx-react"

import { Navbar, Nav, NavItem } from "react-bootstrap"

import { MainViewModel } from "./viewmodels/MainViewModel"

import { TableView } from "./views/table/TableView"
import { ChartView } from "./views/chart/ChartView"
import { ReportView } from "./views/report/ReportView"

@observer
class App extends React.Component {

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
                return <TableView vm={this.props.vm.tableViewModel} />
            case 'chart':
                return <ChartView vm={this.props.vm.chartViewModel} />
            case 'report':
                return <ReportView vm={this.props.vm.reportViewModel} />
            default:
                return <span>Tab key not found</span>
        }
    }

    render() {
        return (
            <div>
                <Navbar inverse>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="#">🐞 AJExpenditor 2</a>
                        </Navbar.Brand>
                    </Navbar.Header>
                    <Nav bsStyle="pills" activeKey={this.props.vm.selectedTabKey} onSelect={this.handleNavSelect}>
                        <NavItem eventKey={'table'}>Table</NavItem>
                        <NavItem eventKey={'chart'}>Chart</NavItem>
                        <NavItem eventKey={'report'}>Report</NavItem>
                    </Nav>
                </Navbar>
                {this.renderContent()}
            </div>
        )
    }
}

var vm = new MainViewModel();

window.vm = vm;

ReactDOM.render(
    (<App vm={vm} />),
    document.getElementById('root')
);