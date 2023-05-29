import { computed, extendObservable } from "mobx";

import { getExpendituresTotal } from "../../db/database"
import { TableRowViewModel } from "../../../build/viewmodels/report/TableRowViewModel";
import { getAmountDisplay } from "../../../build/viewmodels/util";

export class ReportViewModel {
    constructor(parent) {

        extendObservable(this, {
            data: null,
            selectedYear: null,
            selectableYears: [],
            selectedPeople: [],
            tableRows: computed(() => this.buildTableRows())
        })
        this.parent = parent;
        this.queryExpendituresTotal();
    }

    get people() {
        return this.parent.people;
    }

    get categories() {
        return this.parent.categories;
    }

    togglePerson(name) {

        if (this.selectedPeople.find(x => x === name)) {
            this.selectedPeople.remove(name);
        } else {
            this.selectedPeople.push(name);
        }
    }

    getValue(person, category, year) {
        if (!year || !this.data) {
            return 0;
        }
        return this.data[person][category][year] || 0;
    }

    buildTableRows() {
        return this.categories.map(category => new TableRowViewModel(this, category))
    }

    queryExpendituresTotal() {
        getExpendituresTotal(3).then(totals => {

            let newData = {};

            this.people.forEach(person => {
                newData[person.name] = {}
                this.categories.forEach(category => {
                    newData[person.name][category.name] = {}
                })
            })

            let maxYear = 0;
            let minYear = 9999;

            totals.forEach(total => {

                if (total.year < minYear) {
                    minYear = total.year;
                }

                if (total.year > maxYear) {
                    maxYear = total.year;
                }

                newData[total.person][total.category][total.year] = total.value;

            });

            let allYears = [];

            for (let year = minYear; year <= maxYear; year++) {
                allYears.push(year);
            }

            this.selectableYears.replace(allYears);

            this.data = newData;

        });
    }

    makeCsv() {

        const result = Array.apply(null, Array(this.selectableYears.length));
        let row = 0;

        result[row] = Array.apply(null, Array(this.categories.length));

        let col = 0;
        for (const category of this.categories) {
            col++;
            result[row][col] = category.fullName
        }
        result[row][col+1] = "total"

        for (const year of this.selectableYears) {
            row++;
            result[row] = Array.apply(null, Array(this.categories.length+1));
            result[row][0] = year

            let total = 0;
            col = 0;
            for (const category of this.categories) {
                col++;
                let value = 0;
                for (const person of this.selectedPeople) {

                    console.log([person,category.name,year],this.data[person][category.name][year])

                    value += this.data[person][category.name][year] || 0
                    total += this.data[person][category.name][year] || 0
                }

                result[row][col] = value
            }

            result[row][col+1] = total
        }

        let text = result.map((row, rowIndex) => {
            return row.map((col, colIndex) => {
                if (rowIndex === 0 || colIndex === 0) {
                    return col
                } else {
                    return getAmountDisplay(col)
                }
            }).join(";")
        }).join("\n")

        let filename = "ajexpenditor.csv"

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);

        console.log(result);
    }
}