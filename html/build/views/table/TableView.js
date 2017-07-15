import * as React from "react";

import { Table } from "react-bootstrap";

import { getPeople, getEvents, getCategories } from "../../db/database";

export class TableView extends React.Component {

    constructor() {
        super();
        this.state = {
            people: [],
            events: [],
            categories: [],
            queryingMoreEvents: false
        };
    }

    componentWillMount() {
        this.queryEvents();
        this.queryPeople();
        this.queryCategories();
        this.handleScroll = this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    queryEvents() {
        getEvents(0).then(events => {
            this.setState({ events }, () => {
                this.queryMoreEvents();
            });
        });
    }

    queryMoreEvents() {
        if (!this.state.queryingMoreEvents) {
            this.setState({ queryingMoreEvents: true }, () => {
                //console.log('querying more events');
                getEvents(this.state.events.length).then(events => {
                    this.setState({
                        events: this.state.events.concat(events),
                        queryingMoreEvents: false
                    });
                });
            });
        }
    }

    queryPeople() {
        getPeople().then(people => {
            this.setState({ people });
        });
    }

    queryCategories() {
        getCategories().then(categories => {
            this.setState({ categories });
        });
    }

    getIouPairs() {
        var pairs = [];
        this.state.people.forEach(borrower => {
            this.state.people.forEach(creditor => {
                if (borrower.name < creditor.name) {
                    pairs.push([borrower, creditor]);
                }
            });
        });
        return pairs;
    }

    getCategoryFullName(name) {
        const cat = this.state.categories.find(x => x.name == name);
        return cat ? cat.fullName : name;
    }

    getAmountDisplay(amount) {
        return amount.toFixed(2) + " €";
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            //console.log('bottom reached')
            this.queryMoreEvents();
        }
    }

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
                    this.getIouPairs().map(pair => {
                        //console.log(pair);
                        const [borrower, creditor] = pair;
                        return React.createElement(
                            "th",
                            { key: creditor.name },
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
                React.createElement(
                    "tr",
                    { key: event._id },
                    React.createElement(
                        "td",
                        { className: "text-right" },
                        React.createElement("input", null)
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement("input", null)
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement("input", null)
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement("input", null)
                    ),
                    this.state.people.map(person => {
                        return React.createElement(
                            "td",
                            { key: person.name },
                            React.createElement("input", null)
                        );
                    }),
                    this.getIouPairs().map(pair => {
                        const [borrower, creditor] = pair;
                        return React.createElement(
                            "td",
                            { key: creditor.name },
                            React.createElement("input", null)
                        );
                    })
                ),
                this.state.events.map(event => React.createElement(
                    "tr",
                    { key: event._id },
                    React.createElement(
                        "td",
                        { className: "text-right" },
                        this.getAmountDisplay(event.amount)
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
                        this.getCategoryFullName(event.category)
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
                    this.getIouPairs().map(pair => {
                        const [borrower, creditor] = pair;
                        const iou = event.ious.find(x => x.borrower === borrower.name && x.creditor === creditor.name);
                        if (iou) {
                            return React.createElement(
                                "td",
                                { key: creditor.name },
                                iou.portion
                            );
                        } else {
                            return React.createElement(
                                "td",
                                { key: creditor.name },
                                "0"
                            );
                        }
                    })
                ))
            )
        );
    }
}