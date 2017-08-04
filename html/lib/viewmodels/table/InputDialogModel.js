import {obervable,computed,extendObservable} from "mobx";

import moment from "moment"

import {getDrafts} from "../../db/database"
import {getAmountDisplay} from "../util"

export class InputDialogModel {
    constructor(parent){
        extendObservable(this,{
            parent,
            isShown: false,
            draftsAreShown: false,
            amountRaw: "",
            amount: computed(()=>{
                try {
                    const res = eval(this.amountRaw);
                    return typeof(res)==="number"
                        ? Math.round(res*10000)
                        : NaN
                } catch(e) {
                    return NaN;
                }
            }),
            amountDisplay: computed(()=>{
                return getAmountDisplay(this.amount);
            }),
            description: "",
            date: moment(),
            category: null,
            expenditures: [],
            ious: [],
            drafts: []
        })

        this.queryDrafts()
    }

    queryDrafts() {
        getDrafts().then(drafts=>{
            this.drafts = drafts;
        })
    }
}