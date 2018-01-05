import { obervable, computed, extendObservable, autorunAsync } from "mobx";

import { getPeople, getCategories, getIousTotal } from "../db/database"
import { getAmountDisplay } from "./util"

import { TableViewModel } from './table/TableViewModel';
import { ChartViewModel } from "./chart/ChartViewModel";
import { ReportViewModel } from "../../build/viewmodels/report/ReportViewModel";
import { onEventsChange } from "../../build/db/database";

export class MainViewModel {

    constructor() {

        extendObservable(this, {
            selectedTabKey: 'table',
            categories: [],
            people: [],
            iousTotals: [],
        });
        this.queryPeople();
        this.queryCategories();
        this.queryIousTotal();
        this.tableViewModel = new TableViewModel(this);
        this.chartViewModel = new ChartViewModel(this);
        this.reportViewModel = new ReportViewModel(this);

        onEventsChange(() => this.queryIousTotal());
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

    queryIousTotal() {
        getIousTotal().then(totals => {
            this.iousTotals.replace(totals.map(data => new Iou(data, this)));
        });
    }

    getPerson(name) {
        return this.people.find(x => x.name == name);
    }
}

export class Iou {

    constructor(data, parent) {
        this.parent = parent;
        extendObservable(this, Object.assign(data, {
            borrowerFullName: computed(() => {
                const bor = this.parent.getPerson(this.borrower)
                return bor ? bor.fullName : this.borrower;
            }),
            creditorFullName: computed(() => {
                const cred = this.parent.getPerson(this.creditor)
                return cred ? cred.fullName : this.creditor;
            }),
            amountDisplay: computed(() => {
                return getAmountDisplay(this.value)
            })
        }));
    }
}