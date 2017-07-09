import {addKretsPersonBatch, addUserBatch} from "../Redux/actions";
const User = require("../DataClasses/user").default;

export default class KretsUpdater {

    krets = {folk: [], updated: null};

    initKrets() {
        this._getKretsPagesRecursive(1);
    }

    _getKretsPagesRecursive(page, maxPages = 999) {

        let uri = "/users/current/circle?page=" + page;

        api.makeApiGetCall(uri).then((data) => {

            let krets = [];
            let users = [];

            for (let key in data.data) {

                let tmpUser = new User(data.data[key].id, data.data[key].name, data.data[key].realname, data.data[key].image_url, data.data[key].friend);

                krets.push(tmpUser.id);
                users.push(tmpUser);

            }

            global.store.dispatch(addKretsPersonBatch(krets));
            global.store.dispatch(addUserBatch(users));

            if (!(data.data.length == 0 || page > maxPages)) {
                this._getKretsPagesRecursive(page + 1);
            }
        })
    }

}