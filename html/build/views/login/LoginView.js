var _class;

import * as React from "react";
import { observer } from "mobx-react";

import { Modal, Button, Form, FormGroup, Col, ControlLabel, FormControl } from "react-bootstrap";
import Datetime from "react-datetime";

export let LoginView = observer(_class = class LoginView extends React.Component {

    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    handleLogin() {
        this.props.vm.logIn().then(success => {
            if (success) {
                this.props.handleLogin();
            }
        });
    }

    handlePasswordChange(event) {
        this.props.vm.username = event.target.value;
    }

    handleUsernameChange() {
        this.props.vm.passord = event.target.value;
    }

    render() {
        return React.createElement(
            Modal,
            { show: true },
            React.createElement(
                Modal.Header,
                null,
                React.createElement(
                    Modal.Title,
                    null,
                    "Einloggen"
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
                            { componentClass: ControlLabel, sm: 3 },
                            "Benutzername"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            React.createElement(FormControl, { type: "text", value: this.props.vm.username, onChange: this.handleUsernameChange })
                        )
                    ),
                    React.createElement(
                        FormGroup,
                        null,
                        React.createElement(
                            Col,
                            { componentClass: ControlLabel, sm: 3 },
                            "Passwort"
                        ),
                        React.createElement(
                            Col,
                            { sm: 9 },
                            React.createElement(FormControl, { type: "password", value: this.props.vm.username, onChange: this.handlePasswordChange })
                        )
                    )
                )
            ),
            React.createElement(
                Modal.Footer,
                null,
                React.createElement(
                    Button,
                    { onClick: this.handleLogin },
                    "Einloggen"
                )
            )
        );
    }

}) || _class;