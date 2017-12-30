import {obervable,computed,extendObservable} from "mobx";

import {getPeople,getCategories} from "../db/database"

import { TableViewModel } from './table/TableViewModel';
import { ChartViewModel } from "./chart/ChartViewModel";

export class MainViewModel {

    constructor() {

        extendObservable(this,{
            selectedTabKey: 'table',
            categories: [],
            people: [],
        });
        this.queryPeople();
        this.queryCategories();
        this.tableViewModel = new TableViewModel(this);
        this.chartViewModel = new ChartViewModel(this);
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
}