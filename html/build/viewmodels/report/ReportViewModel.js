import { obervable, computed, extendObservable } from "mobx";

import { getExpendituresTotal } from "../../db/database";
import { getAmountDisplay } from "../../../build/viewmodels/util";
import { TableRowViewModel } from "../../../build/viewmodels/report/TableRowViewModel";

export let ReportViewModel = class ReportViewModel {
    constructor(parent) {

        extendObservable(this, {
            data: null,
            selectedYear: null,
            selectableYears: [],
            selectedPeople: [],
            tableRows: computed(() => this.buildTableRows())
        });
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
        return this.categories.map(category => new TableRowViewModel(this, category));
    }

    queryExpendituresTotal() {
        getExpendituresTotal(3).then(totals => {

            let newData = {};

            this.people.forEach(person => {
                newData[person.name] = {};
                this.categories.forEach(category => {
                    newData[person.name][category.name] = {};
                });
            });

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
};