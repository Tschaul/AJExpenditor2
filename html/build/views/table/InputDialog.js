var _class;

import * as React from "react";
import { observer } from "mobx-react";

import { Modal, Button, Form, FormGroup, Col, Checkbox, ControlLabel, FormControl, Radio, Collapse } from "react-bootstrap";
import Datetime from "react-datetime";

export let InputDialog = observer(_class = class InputDialog extends React.Component {

    constructor() {
        super();
        this.handleHide = this.handleHide.bind(this);
        this.handleToggleDrafts = this.handleToggleDrafts.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    handleHide() {
        this.props.model.isShown = false;
    }

    handleToggleDrafts() {
        this.props.model.draftsAreShown = !this.props.model.draftsAreShown;
    }

    handleAmountChange(event) {
        this.props.model.amountRaw = event.target.value;
    }

    handleDescriptionChange(event) {
        this.props.model.description = event.target.value;
    }

    handleDateChange(newval) {
        this.props.model.date = newval;
    }

    handleCategoryChange(event) {
        const category = this.props.model.parent.categories.find(x => x.name === event.target.value);
        //console.log(category);
        this.props.model.category = category;
    }

    render() {

        return React.createElement(
            Modal,
            { show: this.props.model.isShown, onHide: this.handleHide },
            React.createElement(
                Modal.Header,
                { closeButton: true },
                React.createElement(
                    Modal.Title,
                    null,
                    "Ausgabe hinzuf\xFCgen"
                )
            ),
            React.createElement(
                Modal.Body,
                null,
                React.createElement(
                    Form,
                    { horizontal: true },
                    React.createElement(
                        "h5",
                        null,
                        "\u25A0 Allgemein"
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Betrag"
                        ),
                        React.createElement(
                            Col,
                            { sm: 5 },
                            React.createElement(FormControl, { type: "text", value: this.props.model.amountRaw, onChange: this.handleAmountChange })
                        ),
                        React.createElement(
                            Col,
                            { sm: 4 },
                            React.createElement(FormControl, { type: "text", value: this.props.model.amountDisplay, readOnly: true, tabIndex: -1 })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Beschreibung"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            React.createElement(FormControl, { type: "text", value: this.props.model.description, onChange: this.handleDescriptionChange })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Datum"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            React.createElement(Datetime, { timeFormat: false, closeOnSelect: true, dateFormat: "YYYY-MM-DD", value: this.props.model.date, onChange: this.handleDateChange })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Kategorie"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            React.createElement(
                                FormControl,
                                { componentClass: "select", value: this.props.model.category ? this.props.model.category.name : "__none__", onChange: this.handleCategoryChange },
                                React.createElement(
                                    "option",
                                    { key: "__none__", value: "__none__" },
                                    "..."
                                ),
                                this.props.model.parent.categories.map(category => React.createElement(
                                    "option",
                                    { key: category.name, value: category.name },
                                    category.fullName
                                ))
                            )
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Draft"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            this.props.model.drafts.map(draft => React.createElement(
                                Radio,
                                { name: "radioGroup", inline: true, key: draft._id },
                                draft.draftDescription
                            ))
                        )
                    ),
                    React.createElement(
                        "h5",
                        { onClick: this.handleToggleDrafts },
                        "\u25A0 Gewichtung"
                    ),
                    React.createElement(
                        Collapse,
                        { "in": this.props.model.draftsAreShown },
                        React.createElement(
                            "div",
                            null,
                            this.props.model.parent.people.map(person => {
                                return React.createElement(
                                    FormGroup,
                                    { key: person.name },
                                    React.createElement(
                                        Col,
                                        { componentClass: ControlLabel, sm: 4 },
                                        person.fullName + "s Ausgaben"
                                    ),
                                    React.createElement(
                                        Col,
                                        { sm: 8 },
                                        React.createElement(FormControl, { type: "text" })
                                    )
                                );
                            }),
                            this.props.model.parent.iouPairs.map(pair => {
                                const [borrower, creditor] = pair;
                                return React.createElement(
                                    FormGroup,
                                    { key: creditor.name + "_" + borrower.name },
                                    React.createElement(
                                        Col,
                                        { componentClass: ControlLabel, sm: 4 },
                                        borrower.fullName + " schuldet " + creditor.fullName
                                    ),
                                    React.createElement(
                                        Col,
                                        { sm: 8 },
                                        React.createElement(FormControl, { type: "text" })
                                    )
                                );
                            })
                        )
                    )
                ),
                React.createElement(
                    "h5",
                    null,
                    "\u25A0 Log"
                )
            ),
            React.createElement(
                Modal.Footer,
                null,
                React.createElement(
                    Button,
                    null,
                    "Absenden"
                )
            )
        );
    }
}) || _class;