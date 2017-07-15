import * as React from "react";

export class TableRow extends React.Component {
    
    render() {
        return (
            <tr>
                <td className="text-right">{this.props.event.amountDisplay}</td>
                <td>{this.props.event.description}</td>
                <td>{this.props.event.date}</td>
                <td>{this.props.event.categoryFullName}</td>
                {this.props.people.map(person=>{
                    const expenditure = this.props.event.expenditures.find(x=>x.person===person.name);
                    if(expenditure){
                        return (<td key={person.name}>{expenditure.portion}</td>)
                    }else{
                        return (<td key={person.name}>0</td>)
                    }
                })}
                {this.props.iouPairs.map(pair=>{
                    const [borrower,creditor] = pair;
                    const iou = this.props.event.ious.find(x=>x.borrower===borrower.name && x.creditor===creditor.name);
                    if(iou){
                        return (<td key={creditor.name}>{iou.portion}</td>)
                    }else{
                        return (<td key={creditor.name}>0</td>)
                    }
                })}
            </tr> 
        )
    }

}