import * as React from "react";
import {observer} from "mobx-react";

import {Modal,Button, Form, FormGroup, Col, Checkbox, ControlLabel, FormControl, Radio,Collapse} from "react-bootstrap";
import Datetime from "react-datetime";

@observer
export class InputDialog extends React.Component {
    
    constructor(){
        super();
        this.handleHide=this.handleHide.bind(this);
        this.handleToggleDrafts=this.handleToggleDrafts.bind(this);
        this.handleAmountChange=this.handleAmountChange.bind(this);
        this.handleDescriptionChange=this.handleDescriptionChange.bind(this);
        this.handleDateChange=this.handleDateChange.bind(this);
        this.handleCategoryChange=this.handleCategoryChange.bind(this);
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
        const category = this.props.model.parent.categories.find(x=>x.name===event.target.value);
        //console.log(category);
        this.props.model.category=category;
    }

    render() {

        return (
            <Modal show={this.props.model.isShown} onHide={this.handleHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Ausgabe hinzufügen</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <h5>■ Allgemein</h5>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Betrag
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" value={this.props.model.amountRaw} onChange={this.handleAmountChange}/>
                            </Col>
                            <Col sm={4}>
                                <FormControl type="text" value={this.props.model.amountDisplay} readOnly tabIndex={-1}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Beschreibung
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text"  value={this.props.model.description} onChange={this.handleDescriptionChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Datum
                            </Col>
                            <Col sm={9}>
                                <Datetime timeFormat={false} closeOnSelect dateFormat="YYYY-MM-DD" value={this.props.model.date} onChange={this.handleDateChange}/>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Kategorie
                            </Col>
                            <Col sm={9}>
                                <FormControl componentClass="select" value={this.props.model.category?this.props.model.category.name:"__none__"} onChange={this.handleCategoryChange}>
                                    <option key="__none__" value="__none__">...</option>
                                    {this.props.model.parent.categories.map(category=>(
                                        <option key={category.name} value={category.name}>{category.fullName}</option>
                                    ))}
                                </FormControl>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={3}>
                                Draft
                            </Col>
                            <Col sm={9}>
                                {this.props.model.drafts.map(draft => (
                                    <Radio name="radioGroup" inline key={draft._id}>
                                        {draft.draftDescription}
                                    </Radio>
                                ))}
                            </Col>
                        </FormGroup>
                        <h5 onClick={this.handleToggleDrafts}>■ Gewichtung</h5>
                        <Collapse in={this.props.model.draftsAreShown}>
                            <div>
                                {this.props.model.parent.people.map(person=>{
                                    return(
                                        <FormGroup key={person.name}>
                                            <Col componentClass={ControlLabel} sm={4}>
                                                {person.fullName+"s Ausgaben"}
                                            </Col>
                                            <Col sm={8}>
                                                <FormControl type="text" />
                                            </Col>
                                        </FormGroup>
                                    )
                                })}
                                {this.props.model.parent.iouPairs.map(pair=>{
                                    const [borrower,creditor] = pair;
                                    return(
                                        <FormGroup  key={creditor.name+"_"+borrower.name}>
                                            <Col componentClass={ControlLabel} sm={4}>
                                                {borrower.fullName+" schuldet "+creditor.fullName}
                                            </Col>
                                            <Col sm={8}>
                                                <FormControl type="text" />
                                            </Col>
                                        </FormGroup>
                                    )
                                })}
                            </div>
                        </Collapse>
                    </Form>
                    <h5>■ Log</h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button>Absenden</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}