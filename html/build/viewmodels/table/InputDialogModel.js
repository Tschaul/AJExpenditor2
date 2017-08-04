import { obervable, computed, extendObservable, observe, toJS } from "mobx";

import moment from "moment";

import { getDrafts, post } from "../../db/database";
import { getAmountDisplay } from "../util";

export let InputDialogModel = class InputDialogModel {
    constructor(parent) {
        extendObservable(this, {
            parent,
            isShown: false,
            draftsAreShown: false,
            amountRaw: "",
            amount: computed(() => {
                try {
                    const res = eval(this.amountRaw);
                    return typeof res === "number" ? Math.round(res * 10000) : NaN;
                } catch (e) {
                    return NaN;
                }
            }),
            amountDisplay: computed(() => {
                return getAmountDisplay(this.amount);
            }),
            description: "",
            date: moment(),
            category: null,
            expenditures: [],
            ious: [],
            drafts: [],
            selectedDraft: null
        });

        this.queryDrafts();

        observe(this, "selectedDraft", change => {
            if (change.newValue) {
                const draft = change.newValue;
                this.ious.replace(draft.ious);
                this.expenditures.replace(draft.expenditures);
            }
        });
    }

    queryDrafts() {
        getDrafts().then(drafts => {
            this.drafts = drafts;
        });
    }

    send() {
        const doc = {
            "type": "event",
            "amount": this.amount,
            "description": this.description,
            "date": this.date.format("YYYY-MM-DD"),
            "category": this.category.name,
            "amountScribble": this.amountRaw,
            "ious": toJS(this.ious),
            "expenditures": toJS(this.expenditures)
        };

        console.log(doc);

        return post(doc);
    }

};