import * as React from "react";

export class TableRow extends React.Component {

    getCategoryFullName(name) {
        const cat = this.props.categories.find(x => x.name == name);
        return cat ? cat.fullName : name;
    }

    getAmountDisplay(amount) {
        return amount.toFixed(2) + " €";
    }

    render() {
        return React.createElement(
            "tr",
            { key: this.props.event._id },
            React.createElement(
                "td",
                { className: "text-right" },
                this.getAmountDisplay(this.props.event.amount)
            ),
            React.createElement(
                "td",
                null,
                this.props.event.description
            ),
            React.createElement(
                "td",
                null,
                this.props.event.date
            ),
            React.createElement(
                "td",
                null,
                this.getCategoryFullName(this.props.event.category)
            ),
            this.props.people.map(person => {
                const expenditure = this.props.event.expenditures.find(x => x.person === person.name);
                if (expenditure) {
                    return React.createElement(
                        "td",
                        { key: person.name },
                        expenditure.portion
                    );
                } else {
                    return React.createElement(
                        "td",
                        { key: person.name },
                        "0"
                    );
                }
            }),
            this.props.iouPairs.map(pair => {
                const [borrower, creditor] = pair;
                const iou = this.props.event.ious.find(x => x.borrower === borrower.name && x.creditor === creditor.name);
                if (iou) {
                    return React.createElement(
                        "td",
                        { key: creditor.name },
                        iou.portion
                    );
                } else {
                    return React.createElement(
                        "td",
                        { key: creditor.name },
                        "0"
                    );
                }
            })
        );
    }

}