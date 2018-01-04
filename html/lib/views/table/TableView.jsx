import * as React from "react";
import {Table, Button} from "react-bootstrap"
import {observer} from "mobx-react"

import {TableRow} from "./TableRowComponent"
import {InputDialog} from "./InputDialog"

@observer
export class TableView extends React.Component{

    constructor(props){
        super(props);
        this.handleAddExpensesClick = this.handleAddExpensesClick.bind(this);
        this.handleShowEditModal = this.handleShowEditModal.bind(this);
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

    render(){

        return(
            <div>
                <InputDialog model={this.props.vm.inputDialog}/>
                <Table responsive striped bordered>
                    <thead>
                    <tr>
                        <th className="text-center">
                            <Button onClick={this.handleAddExpensesClick}>
                                ✍
                            </Button>
                        </th>
                        <th className="text-center">Betrag<br/>&nbsp;</th>
                        <th className="text-center">Beschreibung<br/>&nbsp;</th>
                        <th className="text-center">Datum<br/>&nbsp;</th>
                        <th className="text-center">Kategorie<br/>&nbsp;</th>
                        {this.props.vm.people.map(person=>{
                            return(
                                <th key={person.name} className="text-center">
                                    {person.fullName}
                                    <br/>&nbsp;
                                </th>
                            )
                        })}
                        {this.props.vm.iouPairs.map(pair=>{
                            //console.log(pair);
                            const [borrower,creditor] = pair;
                            const total = this.props.vm.getIousTotal(borrower.name,creditor.name);
                            return(
                                <th key={creditor.name} className="text-center">
                                    {borrower.fullName} schuldet {creditor.fullName}
                                    {total && (
                                        <div>
                                            ∑
                                            {" "}
                                            {total}
                                        </div>
                                    )}
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