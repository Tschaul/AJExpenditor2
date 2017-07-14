import * as React from "react";

import {Table} from "react-bootstrap"

import {getPeople,getEvents} from "../db/database"

export class TableView extends React.Component{

    constructor(){
        super();
        this.state = {
            people: [],
            events: []
        }
    }

    componentWillMount(){
        getPeople().then(people=>{
            this.setState({people});
        });
        getEvents().then(events=>{
            this.setState({events});
        })
    }

// Betrag
// Beschreibung
// Datum
// Kategorie
// Andrea
// Julian
// Andrea schuldet Julian

    render(){
        return(
            <Table responsive>
                <thead>
                <tr>
                    <th>Betrag</th>
                    <th>Beschreibung</th>
                    <th>Datum</th>
                    <th>Kategorie</th>
                    {this.state.people.map(person=>(<th key={person.name}>{person.fullName}</th>))}
                    {this.state.people.map(borrower=>{
                        var cols = [];
                        this.state.people.forEach(creditor=>{
                            if(borrower.name<creditor.name){
                                cols.push(<th key={creditor.name}>{borrower.fullName} schuldet {creditor.fullName}</th>)
                            }
                        })
                        return cols;
                    }).reduce((a,b)=>a.concat(b),[])}
                </tr>
                </thead>
                <tbody>
                    {this.state.events.map(event=>(
                        <tr key={event._id}>
                            <td>{event.amount}</td>
                            <td>{event.description}</td>
                            <td>{event.date}</td>
                            <td>{event.category}</td>
                            {this.state.people.map(person=>{
                                const expenditure = event.expenditures.find(x=>x.person===person.name);
                                if(expenditure){
                                    return (<td key={person.name}>{expenditure.portion}</td>)
                                }else{
                                    return (<td key={person.name}>0</td>)
                                }
                            }
                            )}
                            {this.state.people.map(borrower=>{
                                var cols = [];
                                this.state.people.forEach(creditor=>{
                                    if(borrower.name<creditor.name){

                                        const iou = event.ious.find(x=>x.borrower===borrower.name && x.creditor===creditor.name);
                                        if(iou){
                                             cols.push(<td key={creditor.name}>{iou.portion}</td>)
                                        }else{
                                             cols.push(<td key={creditor.name}>0</td>)
                                        }
                                        //cols.push(<td>{borrower.fullName} schuldet {creditor.fullName}</td>)
                                    }
                                })
                                return cols;
                            }).reduce((a,b)=>a.concat(b),[])}
                        </tr> 
                    ))}
                
                </tbody>
            </Table>
        )
    }
}