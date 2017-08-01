var _class;

import * as React from "react";
import { observer } from "mobx-react";

import { Modal, Button, Form, FormGroup, Col, Checkbox, ControlLabel, FormControl } from "react-bootstrap";

export let InputDialog = observer(_class = class InputDialog extends React.Component {

    constructor() {
        super();
        this.handleHide = this.handleHide.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    handleHide() {
        this.props.model.isShown = false;
    }

    handleAmountChange(event) {
        this.props.model.amountRaw = event.target.value;
    }

    handleDescriptionChange(event) {
        this.props.model.description = event.target.value;
    }

    render() {

        //console.log(this.props)

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
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 4 },
                            "Betrag"
                        ),
                        React.createElement(
                            Col,
                            { sm: 4 },
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
                            { componentClass: ControlLabel, sm: 4 },
                            "Beschreibung"
                        ),
                        React.createElement(
                            Col,
                            { sm: 8 },
                            React.createElement(FormControl, { type: "text", value: this.props.model.description, onChange: this.handleDescriptionChange })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 4 },
                            "Datum"
                        ),
                        React.createElement(
                            Col,
                            { sm: 8 },
                            React.createElement(FormControl, { type: "text" })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 4 },
                            "Kategorie"
                        ),
                        React.createElement(
                            Col,
                            { sm: 8 },
                            React.createElement(FormControl, { type: "text" })
                        )
                    ),
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
                        //return (<td><input /></td>)
                    }),
                    this.props.model.parent.iouPairs.map(pair => {
                        const [borrower, creditor] = pair;

                        return React.createElement(
                            FormGroup,
                            { key: creditor.name + "_" + borrower.name },
                            React.createElement(
                                Col,
                                { componentClass: ControlLabel, sm: 4 },
                                creditor.fullName + " schuldet " + borrower.fullName
                            ),
                            React.createElement(
                                Col,
                                { sm: 8 },
                                React.createElement(FormControl, { type: "text" })
                            )
                        );
                        //return (<td key={creditor.name}><input /></td>)
                    })
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