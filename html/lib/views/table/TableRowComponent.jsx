import * as React from "react";

export class TableRow extends React.Component {
    

    getCategoryFullName(name) {
        const cat =this.props.categories.find(x=>x.name==name);
        return cat ? cat.fullName : name;
    }

    getAmountDisplay(amount) {
        return amount.toFixed(2)+" €";
    }

    render() {
        return (
            <tr key={this.props.event._id}>
                <td className="text-right">{this.getAmountDisplay(this.props.event.amount)}</td>
                <td>{this.props.event.description}</td>
                <td>{this.props.event.date}</td>
                <td>{this.getCategoryFullName(this.props.event.category)}</td>
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