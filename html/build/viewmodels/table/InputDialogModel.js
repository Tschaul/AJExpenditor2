import { obervable, computed, extendObservable } from "mobx";

import moment from "moment";

import { getAmountDisplay } from "../util";

export let InputDialogModel = class InputDialogModel {
    constructor(parent) {
        extendObservable(this, {
            parent,
            isShown: true,
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
            categrory: null,
            expenditures: [],
            ious: []
        });
    }
};