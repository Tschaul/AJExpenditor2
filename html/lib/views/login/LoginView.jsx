import * as React from "react";
import {observer} from "mobx-react";

import {Modal,Button, Form, FormGroup, Col, ControlLabel, FormControl} from "react-bootstrap";
import Datetime from "react-datetime";

@observer
export class LoginView extends React.Component {

    constructor(props){
        super(props)
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
    }

    handleLogin() {
        this.props.vm.logIn().then(success => {
            if(success){
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
        return(
            <Modal show={true}>
                <Modal.Header>
                    <Modal.Title>Einloggen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Benutzername
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" value={this.props.vm.username} onChange={this.handleUsernameChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Passwort
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" value={this.props.vm.username} onChange={this.handlePasswordChange}/>
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleLogin}>Einloggen</Button>
                </Modal.Footer>
            </Modal>
        )
    }

}