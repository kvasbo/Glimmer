import {addKretsPersonBatch, addUserBatch} from "../src/Redux/actions";
const User = require("../src/DataClasses/user").default;

export default class KretsUpdater {

    krets = {folk: [], updated: null};

    initKrets(force) {

        if (__DEV__) {
            console.log("Init krets");
        }

        this._getKretsPagesRecursive(1);

    }

    _getKretsPagesRecursive(page, maxPages = 999) {

        var uri = "/users/current/circle?page=" + page;

        api.makeApiGetCall(uri).then((data) => {

            var krets = [];
            var users = [];

            for (key in data.data) {

                var tmpUser = new User(data.data[key].id, data.data[key].name, data.data[key].realname, data.data[key].image_url, data.data[key].friend);

                krets.push(tmpUser.id);
                users.push(tmpUser);

            }

            global.store.dispatch(addKretsPersonBatch(krets));
            global.store.dispatch(addUserBatch(users));

            if (data.data.length == 0 || page > maxPages) {

            }
            else {
                this._getKretsPagesRecursive(page + 1);
            }
        })
    }

}