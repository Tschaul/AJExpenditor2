import { obervable, computed, extendObservable, observe, toJS } from "mobx";

import moment from "moment"

import { getDrafts, post, put, remove } from "../../db/database"
import { getAmountDisplay } from "../util"

export class InputDialogModel {
    constructor(parent) {
        extendObservable(this, {
            mode: "add",
            parent,
            isShown: false,
            draftsAreShown: false,
            _id: "",
            _rev: "",
            amountRaw: "",
            amount: computed(() => {
                try {
                    const res = eval(this.amountRaw);
                    return typeof (res) === "number"
                        ? Math.round(res * 10000)
                        : NaN
                } catch (e) {
                    return NaN;
                }
            }),
            amountDisplay: computed(() => {
                return getAmountDisplay(this.amount);
            }),
            description: "",
            date: moment(),
            repeats: false,
            reapeatsUntil: moment(),
            category: null,
            expenditures: [],
            ious: [],
            drafts: [],
            selectedDraft: null,
            isValid: computed(() => {
                return this.ious.length
                    && this.expenditures.length
                    && this.amount
                    && this.category
                    && this.description
            }),
            log: []
        })

        this.queryDrafts();

        observe(this, "selectedDraft", (change) => {
            if (change.newValue) {
                const draft = change.newValue;
                this.ious.replace(draft.ious.map(x => Object.assign({}, x)));
                this.expenditures.replace(draft.expenditures.map(x => Object.assign({}, x)));
            }
        });

    }

    queryDrafts() {
        getDrafts().then(drafts => {
            this.drafts = drafts;
        })
    }

    showAddModal() {
        this.mode = "add";
        this.amountRaw = "";
        this.description = "";
        this.date = moment();
        this.repeats = false;
        this.reapeatsUntil = moment();
        this.category = null;
        this.expenditures = [];
        this.ious = [];
        this.selectedDraft = null;
        this.isShown = true;
        this._id = "";
        this._rev = "";
    }

    showEditModal(event) {
        console.log(event)
        this.mode = "edit";
        this.amountRaw = event.amountScribble;
        this.description = event.description;
        this.selectedDraft = null;
        this.ious.replace(event.ious);
        this.expenditures.replace(event.expenditures);
        this.category = this.parent.getCategory(event.category);
        this.date = moment(event.date);
        this.repeats = !!event.repeats;
        this.repeatsUntil = moment(event.repeatsUntil);
        this._id = event._id;
        this._rev = event._rev;
        this.isShown = true;
    }

    send() {
        if (this.mode === "add") {
            this.post();
        } else {
            this.put();
        }
    }

    post() {
        const doc = {
            "type": "event",
            "amount": this.amount,
            "description": this.description,
            "date": this.date.format("YYYY-MM-DD"),
            "repeats": this.repeats ? "monthly" : undefined,
            "repeatsUntil": this.repeats ? this.repeatsUntil.format("YYYY-MM-DD") : undefined,
            "category": this.category.name,
            "amountScribble": this.amountRaw,
            "ious": toJS(this.ious),
            "expenditures": toJS(this.expenditures),
        }


        return post(doc).then(() => {
            this.log.unshift(`${this.amountDisplay} ${this.description} ${this.date.format("YYYY-MM-DD")} hinzugefügt`);
            this.amountRaw = "";
            this.description = "";
        });
    }

    put() {
        const doc = {
            "_id": this._id,
            "_rev": this._rev,
            "type": "event",
            "amount": this.amount,
            "description": this.description,
            "date": this.date.format("YYYY-MM-DD"),
            "repeats": this.repeats ? "monthly" : undefined,
            "repeatsUntil": this.repeats ? this.repeatsUntil.format("YYYY-MM-DD") : undefined,
            "category": this.category.name,
            "amountScribble": this.amountRaw,
            "ious": toJS(this.ious),
            "expenditures": toJS(this.expenditures),
        }

        console.log(doc);
        return put(doc).then(result => {
            this._rev = result.rev;
            this.log.unshift(`${this.amountDisplay} ${this.description} ${this.date.format("YYYY-MM-DD")} geupdatet`);
        });
    }

    remove() {
        return remove(this._id, this._rev).then(() => this.isShown = false);
    }

}