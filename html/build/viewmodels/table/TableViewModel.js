import { obervable, computed, extendObservable } from "mobx";

import { getPeople, getEvents, getCategories } from "../../db/database";
import { getAmountDisplay } from "../util";

import { InputDialogModel } from "./InputDialogModel";

export let TableViewModel = class TableViewModel {

    constructor() {

        extendObservable(this, {
            people: [],
            events: [],
            categories: [],
            queryingMoreEvents: false,
            iouPairs: computed(() => {
                var pairs = [];
                this.people.forEach(borrower => {
                    this.people.forEach(creditor => {
                        if (borrower.name < creditor.name) {
                            pairs.push([borrower, creditor]);
                        }
                    });
                });
                return pairs;
            })
        });
        this.inputDialog = new InputDialogModel(this);
        this.queryEvents();
        this.queryPeople();
        this.queryCategories();
    }

    queryEvents() {
        getEvents(0).then(events => {
            this.events = events.map(e => new Event(e, this));
            this.queryMoreEvents();
        });
    }

    queryMoreEvents() {
        if (!this.queryingMoreEvents) {

            this.queryingMoreEvents = true;
            //console.log('querying more events');
            getEvents(this.events.length).then(events => {

                this.events = this.events.concat(events.map(e => new Event(e, this)));
                this.queryingMoreEvents = false;
            });
        }
    }

    queryPeople() {
        getPeople().then(people => {
            this.people = people;
        });
    }

    queryCategories() {
        getCategories().then(categories => {
            this.categories = categories;
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