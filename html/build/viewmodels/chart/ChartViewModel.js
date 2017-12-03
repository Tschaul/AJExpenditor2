import { obervable, computed, extendObservable } from "mobx";
import { TimeSeries, TimeRange } from "pondjs";

import { getExpendituresTotal } from "../../db/database";

export let ChartViewModel = class ChartViewModel {
    constructor(parent) {

        extendObservable(this, {
            data: null,
            timeseries: computed(() => this.computeTimeseries())
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

    computeTimeseries() {

        if (!this.data) {
            return null;
        }

        let baseData = {
            name: 'expendituresTotal',
            columns: ['time'].concat(this.categories.map(x => x.name)),
            points: []
        };

        const startYear = parseInt(this.data.minKey.split('-')[0]);
        const startMonth = parseInt(this.data.minKey.split('-')[1]);
        const endYear = parseInt(this.data.maxKey.split('-')[0]);
        const endMonth = parseInt(this.data.maxKey.split('-')[1]);

        let currentYear = startYear;
        let currentMonth = startMonth;

        while (currentYear <= endYear && currentMonth <= endMonth) {

            const currentKey = currentYear + '-' + (currentMonth < 10 ? '0' + currentMonth : currentMonth);

            let row = [new Date(currentKey).getTime()];

            this.categories.forEach((category, index) => {

                let sum = 0;

                this.people.forEach(person => {
                    // console.log(person,category,currentKey,this.data[person.name][category.name]);
                    sum += this.data[person.name][category.name][currentKey] || 0;
                });

                row.push(sum);
            });

            baseData.points.push(row);

            if (currentMonth === 12) {
                currentMonth = 1;
                currentYear++;
            } else {
                currentMonth++;
            }
        }

        console.log(baseData);

        return new TimeSeries(baseData);
    }

    queryExpendituresTotal() {
        getExpendituresTotal(4).then(totals => {

            let newData = {};

            this.people.forEach(person => {
                newData[person.name] = {};
                this.categories.forEach(category => {
                    newData[person.name][category.name] = {};
                });
            });

            let maxKey = '0001-01';
            let minKey = '9999-99';

            totals.forEach(total => {

                const key = total.year + '-' + (total.month < 10 ? '0' + total.month : total.month);

                if (key < minKey) {
                    minKey = key;
                }

                if (key > maxKey) {
                    maxKey = key;
                }

                newData[total.person][total.category][key] = total.value;
            });

            newData.minKey = minKey;
            newData.maxKey = maxKey;

            console.log(newData);

            this.data = newData;
        });
    }
};