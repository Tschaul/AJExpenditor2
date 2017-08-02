import { obervable, computed, extendObservable } from "mobx";

import { logIn } from "../../db/database";

export let LoginViewModel = class LoginViewModel {

    constructor() {
        extendObservable(this, {
            username: "",
            password: "",
            success: true
        });
    }

    logIn() {
        return logIn(this.username, this.password).then(result => this.success = result);
    }
};