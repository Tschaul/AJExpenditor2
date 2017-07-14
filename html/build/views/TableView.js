import * as React from "react";

import { getPeople } from "../db/database";

export class TableView extends React.Component {

    constructor() {
        super();
        this.state = {
            people: []
        };
    }

    componentWillMount() {
        getPeople().then(people => {
            this.setState({ people });
        });
    }

    render() {
        return React.createElement(
            "ul",
            null,
            this.state.people.map(person => React.createElement(
                "li",
                { key: person.name },
                person.fullName
            ))
        );
    }
}