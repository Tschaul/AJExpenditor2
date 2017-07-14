import * as React from "react";

import {getPeople} from "../db/database"

export class TableView extends React.Component{

    constructor(){
        super();
        this.state = {
            people: []
        }
    }

    componentWillMount(){
        getPeople().then(people=>{
            this.setState({people});
        })
    }

    render(){
        return(
            <ul>{this.state.people.map(person=>(<li key={person.name}>{person.fullName}</li>))}</ul>
        )
    }
}