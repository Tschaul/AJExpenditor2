var _class;

import * as React from "react";
import { Table, Button } from "react-bootstrap";
import { observer } from "mobx-react";

import { TableRow } from "./TableRowComponent";
import { InputDialog } from "./InputDialog";

export let TableView = observer(_class = class TableView extends React.Component {

    constructor(props) {
        super(props);
        this.handleAddExpensesClick = this.handleAddExpensesClick.bind(this);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
    }

    componentWillMount() {
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            //console.log('bottom reached')
            this.props.vm.queryMoreEvents();
        }
    }

    handleAddExpensesClick() {
        this.props.vm.inputDialog.showAddModal();
    }

    handleShowEditModal(event) {
        this.props.vm.inputDialog.showEditModal(event);
    }

    render() {

        return React.createElement(
            "div",
            null,
            React.createElement(
                Button,
                { onClick: this.handleAddExpensesClick, style: { marginLeft: "7px" } },
                React.createElement("span", { dangerouslySetInnerHTML: { __html: "&#x270d;" } })
            ),
            React.createElement(InputDialog, { model: this.props.vm.inputDialog }),
            React.createElement(
                Table,
                { responsive: true },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement("th", null),
                        React.createElement(
                            "th",
                            null,
                            "Betrag"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Beschreibung"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Datum"
                        ),
                        React.createElement(
                            "th",
                            null,
                            "Kategorie"
                        ),
                        this.props.vm.people.map(person => {
                            const total = this.props.vm.getExpendituresTotal(person.name);
                            return React.createElement(
                                "th",
                                { key: person.name },
                                person.fullName,
                                total && React.createElement(
                                    "div",
                                    null,
                                    React.createElement("span", { dangerouslySetInnerHTML: { __html: "&#x2211;" } }),
                                    " ",
                                    total
                                )
                            );
                        }),
                        this.props.vm.iouPairs.map(pair => {
                            //console.log(pair);
                            const [borrower, creditor] = pair;
                            const total = this.props.vm.getIousTotal(borrower.name, creditor.name);
                            return React.createElement(
                                "th",
                                { key: creditor.name },
                                borrower.fullName,
                                " schuldet ",
                                creditor.fullName,
                                total && React.createElement(
                                    "div",
                                    null,
                                    React.createElement("span", { dangerouslySetInnerHTML: { __html: "&#x2211;" } }),
                                    " ",
                                    total
                                )
                            );
                        })
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.props.vm.events.map(event => React.createElement(TableRow, { key: event._id, event: event, iouPairs: this.props.vm.iouPairs, people: this.props.vm.people, showEditModal: this.handleShowEditModal }))
                )
            )
        );
    }
}) || _class;