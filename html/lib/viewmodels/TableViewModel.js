
import {getPeople,getEvents,getCategories} from "../../db/database"

var sidMax = 0;

export class TableViewModel {

    constructor(){
        this.subscribtions = {};

        this.people = [];
        this.events = [];
        this.categories = [];
        this.queryingMoreEvents = false;

        this.queryEvents();
        this.queryPeople();
        this.queryCategories();
    }

    subcribe(func) {
        const sid = sidMax++;
        this.subscribtions[sid] = func;
        return sid;
    }

    unsubscribe(sid) {
        delete this.subscribtions[sid];
    }

    notifySubscribers() {
        for(var sid of this.subscribtions){
            this.subscribtions[sid](this);
        }
    }

    queryEvents() {
        getEvents(0).then(events=>{
            this.events = events.map(e=>new Event(e,this));
            this.queryMoreEvents();
        })
    }

    queryMoreEvents() {
        if(!this.queryingMoreEvents){

            this.queryingMoreEvents=true
            //console.log('querying more events');
            getEvents(this.state.events.length).then(events=>{
                
                this.events = this.state.events.concat(events.map(e=>new Event(e,this)));
                this.queryingMoreEvents = false;
               
            })

        }
    }

    queryPeople()  {
        getPeople().then(people=>{
            this.people = people;
        });
    }

    queryCategories() {
        getCategories().then(categories=>{
            this.categories = categories;
        });
    }

    getIouPairs() {
        var pairs = [];
        this.people.forEach(borrower=>{
            this.people.forEach(creditor=>{
                if(borrower.name<creditor.name){
                    pairs.push([borrower,creditor]);
                }
            })
        });
        return pairs;
    }

    getCategoryFullName(name) {
        const cat =this.categories.find(x=>x.name==name);
        return cat ? cat.fullName : name;
    }

    getAmountDisplay(amount) {
        return amount.toFixed(2)+" €";
    }

}

export class Event {
    constructor(data,parent){
        this.parent = parent;
        Object.assign(this,data);
    }

    getCategoryFullName() {
        return this.parent.getCategoryFullName(this.category);
    }

    getAmountDisplay() {
        return this.parent.getAmountDisplay(this.amount);
    }

}