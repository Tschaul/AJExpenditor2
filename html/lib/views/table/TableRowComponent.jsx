import * as React from "react";
import {observer} from "mobx-react"

import {Button,Glyphicon} from "react-bootstrap"

@observer
export class TableRow extends React.Component {
    
    constructor(props){
        super(props);
        this.handleShowEditModal=this.handleShowEditModal.bind(this);
    }

    handleShowEditModal(){
        this.props.showEditModal(this.props.event);
    }

    render() {
        return (
            <tr>
                <td className="text-center">
                    <Button onClick={this.handleShowEditModal}>
                        ✎
                    </Button>
                </td>
                <td className="text-right">{this.props.event.amountDisplay}</td>
                <td>{(this.props.event.repeats ? '⟲ ' : '') + this.props.event.description}</td>
                <td className="text-right">{this.props.event.occurenceDate}</td>
                <td>{this.props.event.categoryFullName}</td>
                {this.props.people.map(person=>{
                    const expenditure = this.props.event.expenditures.find(x=>x.person===person.name);
                    if(expenditure){
                        return (<td key={person.name} className="text-right">{expenditure.portion+""}</td>)
                    }else{
                        return (<td key={person.name} className="text-right">0</td>)
                    }
                })}
                {this.props.iouPairs.map(pair=>{
                    const [borrower,creditor] = pair;
                    const iou = this.props.event.ious.find(x=>x.borrower===borrower.name && x.creditor===creditor.name);
                    if(iou){
                        return (<td key={creditor.name} className="text-right">{iou.portion+""}</td>)
                    }else{
                        return (<td key={creditor.name} className="text-right">0</td>)
                    }
                })}
            </tr> 
        )
    }

}