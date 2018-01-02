import { obervable, computed, extendObservable } from 'mobx';
import { getAmountDisplay } from "../../../build/viewmodels/util";

export let TableRowViewModel = class TableRowViewModel {
    constructor(parent, category) {
        extendObservable(this, {
            name: category.name,
            categoryDisplay: category.fullName,
            currentYearValue: computed(() => this.getValueForYear(this.parent.selectedYear)),
            lastYearValue: computed(() => this.getValueForYear(this.parent.selectedYear - 1)),
            yearlyDisplay: computed(() => getAmountDisplay(this.currentYearValue)),
            monthlyDisplay: computed(() => getAmountDisplay(this.currentYearValue / 12)),
            trendDisplay: computed(() => {
                const last = this.lastYearValue;
                const current = this.currentYearValue;
                const change = current - last;
                const changePercentage = Math.round(100 * change / current);
                return (changePercentage > 0 ? '+' + changePercentage : changePercentage) + ' %';
            }),
            trendBad: computed(() => this.lastYearValue < this.currentYearValue)
        });

        this.parent = parent;
        this.category = category;
    }

    getValueForYear(year) {
        return this.parent.selectedPeople.reduce((acc, person) => acc + this.parent.getValue(person, this.category.name, year), 0);
    }
};