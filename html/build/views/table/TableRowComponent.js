var _class;

import * as React from "react";
import { observer } from "mobx-react";

import { Button, Glyphicon } from "react-bootstrap";

export let TableRow = observer(_class = class TableRow extends React.Component {

    constructor(props) {
        super(props);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
    }

    handleShowEditModal() {
        this.props.showEditModal(this.props.event);
    }

    render() {
        return React.createElement(
            "tr",
            null,
            React.createElement(
                "td",
                { className: "text-center" },
                React.createElement(
                    Button,
                    { onClick: this.handleShowEditModal },
                    "\u270E"
                )
            ),
            React.createElement(
                "td",
                { className: "text-right" },
                this.props.event.amountDisplay
            ),
            React.createElement(
                "td",
                null,
                this.props.event.description
            ),
            React.createElement(
                "td",
                { className: "text-right" },
                this.props.event.occurenceDate
            ),
            React.createElement(
                "td",
                null,
                this.props.event.categoryFullName
            ),
            this.props.people.map(person => {
                const expenditure = this.props.event.expenditures.find(x => x.person === person.name);
                if (expenditure) {
                    return React.createElement(
                        "td",
                        { key: person.name, className: "text-right" },
                        expenditure.portion + " %"
                    );
                } else {
                    return React.createElement(
                        "td",
                        { key: person.name, className: "text-right" },
                        "0 %"
                    );
                }
            }),
            this.props.iouPairs.map(pair => {
                const [borrower, creditor] = pair;
                const iou = this.props.event.ious.find(x => x.borrower === borrower.name && x.creditor === creditor.name);
                if (iou) {
                    return React.createElement(
                        "td",
                        { key: creditor.name, className: "text-right" },
                        iou.portion + " %"
                    );
                } else {
                    return React.createElement(
                        "td",
                        { key: creditor.name, className: "text-right" },
                        "0 %"
                    );
                }
            })
        );
    }

}) || _class;