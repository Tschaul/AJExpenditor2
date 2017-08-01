import * as React from "react";
import {observer} from "mobx-react";

import {Modal,Button, Form, FormGroup, Col, Checkbox, ControlLabel, FormControl} from "react-bootstrap";

@observer
export class InputDialog extends React.Component {
    
    constructor(){
        super();
        this.handleHide=this.handleHide.bind(this);
        this.handleAmountChange=this.handleAmountChange.bind(this);
        this.handleDescriptionChange=this.handleDescriptionChange.bind(this);
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

        return (
            <Modal show={this.props.model.isShown} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Ausgabe hinzufügen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Betrag
                            </Col>
                            <Col sm={4}>
                                <FormControl type="text" value={this.props.model.amountRaw} onChange={this.handleAmountChange}/>
                            </Col>
                            <Col sm={4}>
                                <FormControl type="text" value={this.props.model.amountDisplay} readOnly tabIndex={-1}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Beschreibung
                            </Col>
                            <Col sm={8}>
                                <FormControl type="text"  value={this.props.model.description} onChange={this.handleDescriptionChange}/>
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Datum
                            </Col>
                            <Col sm={8}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>

                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Kategorie
                            </Col>
                            <Col sm={8}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>
                        {this.props.model.parent.people.map(person=>{
                            return(
                                <FormGroup  key={person.name}>
                                    <Col componentClass={ControlLabel} sm={4}>
                                        {person.fullName+"s Ausgaben"}
                                    </Col>
                                    <Col sm={8}>
                                        <FormControl type="text" />
                                    </Col>
                                </FormGroup>
                            )
                            //return (<td><input /></td>)
                        })}
                        {this.props.model.parent.iouPairs.map(pair=>{
                            const [borrower,creditor] = pair;

                            return(
                                <FormGroup  key={creditor.name+"_"+borrower.name}>
                                    <Col componentClass={ControlLabel} sm={4}>
                                        {creditor.fullName+" schuldet "+borrower.fullName}
                                    </Col>
                                    <Col sm={8}>
                                        <FormControl type="text" />
                                    </Col>
                                </FormGroup>
                            )
                            //return (<td key={creditor.name}><input /></td>)
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Absenden</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}