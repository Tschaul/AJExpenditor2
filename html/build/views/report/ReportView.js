var _class;

import * as React from "react";
import { Table, FormControl, FormGroup, ControlLabel, Checkbox, Form } from "react-bootstrap";
import { observer } from "mobx-react";

export let ReportView = observer(_class = class ReportView extends React.Component {

    constructor(props) {
        super(props);
        this.handleYearSelect = this.handleYearSelect.bind(this);
    }

    handleYearSelect(event) {
        this.props.vm.selectedYear = parseInt(event.target.value, 10);
    }

    render() {

        return React.createElement(
            "div",
            null,
            React.createElement(
                Form,
                { inline: true },
                React.createElement(
                    FormGroup,
                    null,
                    React.createElement(
                        FormControl,
                        { componentClass: "select", placeholder: "select", value: this.props.vm.selectedYear || '', onChange: this.handleYearSelect },
                        React.createElement(
                            "option",
                            { key: 'none', value: '' },
                            "..."
                        ),
                        this.props.vm.selectableYears.map(year => React.createElement(
                            "option",
                            { key: year, value: year },
                            year
                        ))
                    ),
                    React.createElement(FormGroup, null),
                    this.props.vm.people.map(person => {
                        const checked = this.props.vm.selectedPeople.find(x => x === person.name);
                        return React.createElement(
                            Checkbox,
                            {
                                key: person.name,
                                inline: true,
                                checked: !!checked,
                                onChange: () => this.props.vm.togglePerson(person.name)
                            },
                            person.fullName
                        );
                    })
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
                            "Kategorie"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Gesamt"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "Pro Monat"
                        ),
                        React.createElement(
                            "th",
                            { className: "text-center" },
                            "\xC4nderung"
                        )
                    )
                ),
                React.createElement(
                    "tbody",
                    null,
                    this.props.vm.tableRows.map(row => React.createElement(
                        "tr",
                        { key: row.name },
                        React.createElement(
                            "td",
                            { className: "text-left" },
                            row.categoryDisplay
                        ),
                        React.createElement(
                            "td",
                            { className: "text-right" },
                            row.yearlyDisplay
                        ),
                        React.createElement(
                            "td",
                            { className: "text-right" },
                            row.monthlyDisplay
                        ),
                        React.createElement(
                            "td",
                            { className: "text-right" },
                            row.trendDisplay
                        )
                    ))
                )
            )
        );
    }
}) || _class;