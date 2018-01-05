var _class;

import * as React from "react";
import { Table, Button, Checkbox, FormGroup, ControlLabel } from "react-bootstrap";
import { observer } from "mobx-react";

import { TableRow } from "./TableRowComponent";
import { InputDialog } from "./InputDialog";

export let TableView = observer(_class = class TableView extends React.Component {

    constructor(props) {
        super(props);
        this.handleAddExpensesClick = this.handleAddExpensesClick.bind(this);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
        this.handleShowFutureEventsToggle = this.handleShowFutureEventsToggle.bind(this);
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

    handleShowFutureEventsToggle() {
        this.props.vm.showFutureEvents = !this.props.vm.showFutureEvents;
    }

    render() {

        return React.createElement(
            "div",
            null,
            React.createElement(InputDialog, { model: this.props.vm.inputDialog }),
            React.createElement(
                FormGroup,
                null,
                "\xA0 \xA0",
                React.createElement(
                    Checkbox,
                    {
                        inline: true,
                        checked: this.props.vm.showFutureEvents,
                        onChange: this.handleShowFutureEventsToggle
                    },
                    "Zuk\xFCnftige Ereignisse anzeigen"
                )
            ),
            React.createElement(
                Table,
                { responsive: true, striped: true, bordered: true },
                React.createElement(
                    "thead",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            React.createElement(
                                Button,
                                { onClick: this.handleAddExpensesClick },
                                "\u270D"
                            )
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Betrag"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Beschreibung"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Datum"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Kategorie"
                        ),
                        this.props.vm.people.map(person => {
                            return React.createElement(
                                "th",
                                { key: person.name, className: "text-center" },
                                person.fullName
                            );
                        }),
                        this.props.vm.iouPairs.map(pair => {
                            //console.log(pair);
                            const [borrower, creditor] = pair;
                            return React.createElement(
                                "th",
                                { key: creditor.name, className: "text-center" },
                                borrower.fullName,
                                " schuldet ",
                                creditor.fullName
                            );
                        })
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.props.vm.events.map(event => React.createElement(TableRow, { key: event._id + '_' + event.occurenceDate, event: event, iouPairs: this.props.vm.iouPairs, people: this.props.vm.people, showEditModal: this.handleShowEditModal }))
                )
            )
        );
    }
}) || _class;