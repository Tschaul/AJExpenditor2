import {obervable,computed,extendObservable} from "mobx";

import {getEvents,onEventsChange,getExpendituresTotal,getIousTotal} from "../../db/database"
import {getAmountDisplay} from "../util"

import {InputDialogModel} from "./InputDialogModel"

export class TableViewModel {

    constructor(parent){

        extendObservable(this,{
            events: [],
            queryingMoreEvents: false,
            iouPairs: computed(() => {
                var pairs = [];
                parent.people.forEach(borrower=>{
                    parent.people.forEach(creditor=>{
                        if(borrower.name<creditor.name){
                            pairs.push([borrower,creditor]);
                        }
                    })
                });
                return pairs;
            }),
            expendituresTotals: [],
            iousTotals: []
        })
        this.parent = parent;
        this.inputDialog = new InputDialogModel(this);
        this.queryEvents();
        this.queryExpendituresTotal();
        this.queryIousTotal();

        onEventsChange(()=>{
            this.requeryEvents();
            this.queryExpendituresTotal();
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
        getEvents(0,20).then(events=>{
            this.events.replace(events.map(e=>new Event(e,this)));
            this.queryMoreEvents();
        })
    }

    queryMoreEvents() {
        if(!this.queryingMoreEvents){

            this.queryingMoreEvents=true
            //console.log('querying more events');
            getEvents(this.events.length,20).then(events=>{
                
                this.events = this.events.concat(events.map(e=>new Event(e,this)));
                this.queryingMoreEvents = false;
               
            })

        }
    }

    requeryEvents() {
        getEvents(0,this.events.length).then(events=>{
            this.events.replace(events.map(e=>new Event(e,this)));
        })
    }

    queryExpendituresTotal() {
        getExpendituresTotal().then(totals=>{
            this.expendituresTotals.replace(totals);
        });
    }

    queryIousTotal() {
        getIousTotal().then(totals=>{
            this.iousTotals.replace(totals);
        });
    }

    getCategory(name) {
        return this.categories.find(x=>x.name==name);
    }

    getExpendituresTotal(name) {
        const total = this.expendituresTotals.find(x=>x.person===name);
        return total
            ? getAmountDisplay(total.value)
            : undefined
    }

    getIousTotal(borrower,creditor) {
        const total = this.iousTotals.find(x=>x.borrower===borrower && x.creditor===creditor);
        return total
            ? getAmountDisplay(total.value)
            : undefined
    }

}

export class Event {
    constructor(data,parent){
        this.parent = parent;
        extendObservable(this,Object.assign(data,{
            categoryFullName: computed(() => {
                const cat = this.parent.getCategory(this.category)
                return cat ? cat.fullName : this.category;
            }),
            amountDisplay: computed(()=> {
                return getAmountDisplay(this.amount)
            })
        }));
    }

}