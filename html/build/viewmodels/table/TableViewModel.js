import { obervable, computed, extendObservable, autorunAsync } from "mobx";

import { getEvents, onEventsChange, getExpendituresTotal } from "../../db/database";
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
            showFutureEvents: false,
            queryEventsUntil: computed(() => this.showFutureEvents ? undefined : new Date())
        });
        this.parent = parent;
        this.inputDialog = new InputDialogModel(this);
        this.queryEvents();

        onEventsChange(() => this.requeryEvents());
        autorunAsync(() => this.requeryEvents());
    }

    get people() {
        return this.parent.people;
    }

    get categories() {
        return this.parent.categories;
    }

    queryEvents() {
        getEvents(0, 20, this.queryEventsUntil).then(events => {
            this.events.replace(events.map(e => new Event(e, this)));
            this.queryMoreEvents();
        });
    }

    queryMoreEvents() {
        if (!this.queryingMoreEvents) {

            this.queryingMoreEvents = true;
            //console.log('querying more events');
            getEvents(this.events.length, 20, this.queryEventsUntil).then(events => {

                this.events = this.events.concat(events.map(e => new Event(e, this)));
                this.queryingMoreEvents = false;
            });
        }
    }

    requeryEvents() {
        getEvents(0, this.events.length, this.queryEventsUntil).then(events => {
            this.events.replace(events.map(e => new Event(e, this)));
        });
    }

    getCategory(name) {
        return this.categories.find(x => x.name == name);
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