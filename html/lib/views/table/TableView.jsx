import * as React from "react";
import {Table} from "react-bootstrap"
import {observer} from "mobx-react"

import {TableRow} from "./TableRowComponent"
import {InputDialog} from "./InputDialog"

@observer
export class TableView extends React.Component{

    componentWillMount(){
        this.handleScroll=this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount(){
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

    render(){

        return(
            <div>
                <InputDialog model={this.props.vm.inputDialog}/>
                <Table responsive>
                    <thead>
                    <tr>
                        <th>Betrag</th>
                        <th>Beschreibung</th>
                        <th>Datum</th>
                        <th>Kategorie</th>
                        {this.props.vm.people.map(person=>(<th key={person.name}>{person.fullName}</th>))}
                        {this.props.vm.iouPairs.map(pair=>{
                            //console.log(pair);
                            const [borrower,creditor] = pair;
                            return(<th key={creditor.name}>{borrower.fullName} schuldet {creditor.fullName}</th>)
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {this.props.vm.events.map(event=>(
                            <TableRow key={event._id} event={event} iouPairs={this.props.vm.iouPairs} people={this.props.vm.people}/>
                        ))}
                    
                    </tbody>
                </Table>
            </div>
        )
    }
}