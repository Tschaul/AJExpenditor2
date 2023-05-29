import * as React from "react";
import {Table, Button, Checkbox, FormGroup, ControlLabel} from "react-bootstrap"
import {observer} from "mobx-react"

import {TableRow} from "./TableRowComponent"
import {InputDialog} from "./InputDialog"

@observer
export class TableView extends React.Component{

    constructor(props){
        super(props);
        this.handleAddExpensesClick = this.handleAddExpensesClick.bind(this);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
        this.handleShowFutureEventsToggle = this.handleShowFutureEventsToggle.bind(this);
    }

    componentWillMount() {
        this.handleScroll=this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            //console.log('bottom reached')
            this.props.vm.queryMoreEvents();
        } 
    }

    handleAddExpensesClick() {
        this.props.vm.inputDialog.showAddModal();
    }

    handleShowEditModal(event) {
        this.props.vm.inputDialog.showEditModal(event);
    }

    handleShowFutureEventsToggle() {
        this.props.vm.showFutureEvents = !this.props.vm.showFutureEvents;
    }

    render(){

        return(
            <div>
                <InputDialog model={this.props.vm.inputDialog}/>
                <FormGroup>
                    &nbsp;
                    &nbsp;
                    <Checkbox 
                        inline
                        checked={this.props.vm.showFutureEvents}
                        onChange={this.handleShowFutureEventsToggle}
                    >
                        Zukünftige Ereignisse anzeigen
                    </Checkbox>
                </FormGroup>
                <Table responsive striped bordered>
                    <thead>
                    <tr>
                        <th className="text-center">
                            <Button onClick={this.handleAddExpensesClick}>
                                ✍
                            </Button>
                        </th>
                        <th className="text-center">Betrag [€]</th>
                        <th className="text-center">Beschreibung</th>
                        <th className="text-center">Datum</th>
                        <th className="text-center">Kategorie</th>
                        {this.props.vm.people.map(person=>{
                            return(
                                <th key={person.name} className="text-center">
                                    {person.fullName} [%]
                                </th>
                            )
                        })}
                        {this.props.vm.iouPairs.map(pair=>{
                            //console.log(pair);
                            const [borrower,creditor] = pair;
                            return(
                                <th key={creditor.name} className="text-center">
                                    {borrower.fullName} schuldet {creditor.fullName} [%]
                                </th>)
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.vm.events.map(event=>(
                            <TableRow key={event._id+'_'+event.occurenceDate} event={event} iouPairs={this.props.vm.iouPairs} people={this.props.vm.people} showEditModal={this.handleShowEditModal}/>
                        ))}
                    
                    </tbody>
                </Table>
            </div>
        )
    }
}