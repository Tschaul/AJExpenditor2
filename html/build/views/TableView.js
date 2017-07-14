import * as React from "react";

import { Table } from "react-bootstrap";

import { getPeople, getEvents } from "../db/database";

export class TableView extends React.Component {

    constructor() {
        super();
        this.state = {
            people: [],
            events: []
        };
    }

    componentWillMount() {
        getPeople().then(people => {
            this.setState({ people });
        });
        getEvents().then(events => {
            this.setState({ events });
        });
    }

    // Betrag
    // Beschreibung
    // Datum
    // Kategorie
    // Andrea
    // Julian
    // Andrea schuldet Julian

    render() {
        return React.createElement(
            Table,
            { responsive: true },
            React.createElement(
                "thead",
                null,
                React.createElement(
                    "tr",
                    null,
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
                    this.state.people.map(person => React.createElement(
                        "th",
                        { key: person.name },
                        person.fullName
                    )),
                    this.state.people.map(borrower => {
                        var cols = [];
                        this.state.people.forEach(creditor => {
                            if (borrower.name < creditor.name) {
                                cols.push(React.createElement(
                                    "th",
                                    { key: creditor.name },
                                    borrower.fullName,
                                    " schuldet ",
                                    creditor.fullName
                                ));
                            }
                        });
                        return cols;
                    }).reduce((a, b) => a.concat(b), [])
                )
            ),
            React.createElement(
                "tbody",
                null,
                this.state.events.map(event => React.createElement(
                    "tr",
                    { key: event._id },
                    React.createElement(
                        "td",
                        null,
                        event.amount
                    ),
                    React.createElement(
                        "td",
                        null,
                        event.description
                    ),
                    React.createElement(
                        "td",
                        null,
                        event.date
                    ),
                    React.createElement(
                        "td",
                        null,
                        event.category
                    ),
                    this.state.people.map(person => {
                        const expenditure = event.expenditures.find(x => x.person === person.name);
                        if (expenditure) {
                            return React.createElement(
                                "td",
                                { key: person.name },
                                expenditure.portion
                            );
                        } else {
                            return React.createElement(
                                "td",
                                { key: person.name },
                                "0"
                            );
                        }
                    }),
                    this.state.people.map(borrower => {
                        var cols = [];
                        this.state.people.forEach(creditor => {
                            if (borrower.name < creditor.name) {

                                const iou = event.ious.find(x => x.borrower === borrower.name && x.creditor === creditor.name);
                                if (iou) {
                                    cols.push(React.createElement(
                                        "td",
                                        { key: creditor.name },
                                        iou.portion
                                    ));
                                } else {
                                    cols.push(React.createElement(
                                        "td",
                                        { key: creditor.name },
                                        "0"
                                    ));
                                }
                                //cols.push(<td>{borrower.fullName} schuldet {creditor.fullName}</td>)
                            }
                        });
                        return cols;
                    }).reduce((a, b) => a.concat(b), [])
                ))
            )
        );
    }
}