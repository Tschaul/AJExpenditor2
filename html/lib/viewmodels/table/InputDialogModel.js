import {obervable,computed,extendObservable,observe} from "mobx";

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
            drafts: [],
            selectedDraft: null,
        })

        this.queryDrafts();

        observe(this,"selectedDraft", (change) => {
            if(change.newValue){
                const draft = change.newValue;
                this.ious.replace(draft.ious.slice(0));
                this.expenditures.replace(draft.expenditures.slice(0));
            }
        });
    }



    queryDrafts() {
        getDrafts().then(drafts=>{
            this.drafts = drafts;
        })
    }
}