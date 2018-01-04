import { obervable, computed, extendObservable, autorunAsync } from "mobx";

import { getEventsUntil, onEventsChange, getExpendituresTotal, getIouSaldoForNow } from "../../db/database";
import { getAmountDisplay } from "../util";

import { InputDialogModel } from "./InputDialogModel";

export let TableViewModel = class TableViewModel {

    constructor(parent) {

        extendObservable(this, {
            events: [],
            queryingMoreEvents: false,
            iouPairs: computed(() => {
                var pairs = [];
                parent.people.forEach(borrower => {
                    parent.people.forEach(creditor => {
                        if (borrower.name < creditor.name) {
                            pairs.push([borrower, creditor]);
                        }
                    });
                });
                return pairs;
            }),
            iousTotals: []
        });
        this.parent = parent;
        this.inputDialog = new InputDialogModel(this);
        this.queryEvents();
        autorunAsync(() => this.queryIousTotal());

        onEventsChange(() => {
            this.requeryEvents();
            this.queryIousTotal();
        });
    }

    get people() {
        return this.parent.people;
    }

    get categories() {
        return this.parent.categories;
    }

    queryEvents() {
        getEventsUntil(0, 20, new Date()).then(events => {
            this.events.replace(events.map(e => new Event(e, this)));
            this.queryMoreEvents();
        });
    }

    queryMoreEvents() {
        if (!this.queryingMoreEvents) {

            this.queryingMoreEvents = true;
            //console.log('querying more events');
            getEventsUntil(this.events.length, 20, new Date()).then(events => {

                this.events = this.events.concat(events.map(e => new Event(e, this)));
                this.queryingMoreEvents = false;
            });
        }
    }

    requeryEvents() {
        getEventsUntil(0, this.events.length, new Date()).then(events => {
            this.events.replace(events.map(e => new Event(e, this)));
        });
    }

    async queryIousTotal() {

        this.iousTotals.clear();

        for (const pair of this.iouPairs) {
            const [borrower, creditor] = pair;
            await getIouSaldoForNow(borrower, creditor).then(value => {
                this.iousTotals.push({
                    borrower: borrower.name,
                    creditor: creditor.name,
                    value
                });
            });
        }
    }

    getCategory(name) {
        return this.categories.find(x => x.name == name);
    }

    getIousTotal(borrower, creditor) {
        const total = this.iousTotals.find(x => x.borrower === borrower && x.creditor === creditor);
        return total ? getAmountDisplay(total.value) : undefined;
    }

};

export let Event = class Event {
    constructor(data, parent) {
        this.parent = parent;
        extendObservable(this, Object.assign(data, {
            categoryFullName: computed(() => {
                const cat = this.parent.getCategory(this.category);
                return cat ? cat.fullName : this.category;
            }),
            amountDisplay: computed(() => {
                return getAmountDisplay(this.amount);
            })
        }));
    }

};