import { obervable, computed, extendObservable } from "mobx";

import { TableViewModel } from './table/TableViewModel';

export let MainViewModel = class MainViewModel {

    constructor() {

        extendObservable(this, {
            selectedTabKey: 'table'
        });
        this.tableViewModel = new TableViewModel();
    }
};