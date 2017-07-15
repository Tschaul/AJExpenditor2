import * as React from "react";

import {Table} from "react-bootstrap"

import {getPeople,getEvents,getCategories} from "../../db/database"

export class TableView extends React.Component{

    constructor(){
        super();
        this.state = {
            people: [],
            events: [],
            categories: [],
            queryingMoreEvents: false,
        }
    }

    componentWillMount(){
        this.queryEvents();
        this.queryPeople();
        this.queryCategories();
        this.handleScroll=this.handleScroll.bind(this);
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount(){
        window.removeEventListener("scroll", this.handleScroll);
    }

    queryEvents() {
        getEvents(0).then(events=>{
            this.setState({events},()=>{
                this.queryMoreEvents();
            });
        })
    }

    queryMoreEvents() {
        if(!this.state.queryingMoreEvents){
            this.setState({queryingMoreEvents:true},()=>{
                //console.log('querying more events');
                getEvents(this.state.events.length).then(events=>{
                    this.setState({
                        events: this.state.events.concat(events),
                        queryingMoreEvents: false
                    });
                })
            })
        }
    }

    queryPeople()  {
        getPeople().then(people=>{
            this.setState({people});
        });
    }

    queryCategories() {
        getCategories().then(categories=>{
            this.setState({categories});
        });
    }

    getIouPairs() {
        var pairs = [];
        this.state.people.forEach(borrower=>{
            this.state.people.forEach(creditor=>{
                if(borrower.name<creditor.name){
                    pairs.push([borrower,creditor]);
                }
            })
        });
        return pairs;
    }

    getCategoryFullName(name) {
        const cat =this.state.categories.find(x=>x.name==name);
        return cat ? cat.fullName : name;
    }

    getAmountDisplay(amount) {
        return amount.toFixed(2)+" €";
    }

    handleScroll() {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 100) {
            //console.log('bottom reached')
            this.queryMoreEvents();
        } 
    }

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
                    {this.getIouPairs().map(pair=>{
                        //console.log(pair);
                        const [borrower,creditor] = pair;
                        return(<th key={creditor.name}>{borrower.fullName} schuldet {creditor.fullName}</th>)
                    })}
                </tr>
                </thead>
                <tbody>
                    <tr key={event._id}>
                        <td className="text-right"><input /></td>
                        <td><input /></td>
                        <td><input /></td>
                        <td><input /></td>
                        {this.state.people.map(person=>{
                            return (<td key={person.name}><input /></td>)
                        })}
                        {this.getIouPairs().map(pair=>{
                            const [borrower,creditor] = pair;
                            return (<td key={creditor.name}><input /></td>)
                        })}
                    </tr> 
                    {this.state.events.map(event=>(
                        <tr key={event._id}>
                            <td className="text-right">{this.getAmountDisplay(event.amount)}</td>
                            <td>{event.description}</td>
                            <td>{event.date}</td>
                            <td>{this.getCategoryFullName(event.category)}</td>
                            {this.state.people.map(person=>{
                                const expenditure = event.expenditures.find(x=>x.person===person.name);
                                if(expenditure){
                                    return (<td key={person.name}>{expenditure.portion}</td>)
                                }else{
                                    return (<td key={person.name}>0</td>)
                                }
                            })}
                            {this.getIouPairs().map(pair=>{
                                const [borrower,creditor] = pair;
                                const iou = event.ious.find(x=>x.borrower===borrower.name && x.creditor===creditor.name);
                                if(iou){
                                    return (<td key={creditor.name}>{iou.portion}</td>)
                                }else{
                                    return (<td key={creditor.name}>0</td>)
                                }
                            })}
                        </tr> 
                    ))}
                
                </tbody>
            </Table>
        )
    }
}