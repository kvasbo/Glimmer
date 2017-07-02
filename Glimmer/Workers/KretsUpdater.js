import {AsyncStorage} from "react-native";
import {addKretsPerson, addUser} from "../Redux/actions";
const User = require("../DataClasses/user").default;

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

            for (key in data.data) {

                var tmpUser = new User(data.data[key].id, data.data[key].name, data.data[key].realname,  data.data[key].image_url, data.data[key].friend);

                global.store.dispatch(addUser(tmpUser));
                global.store.dispatch(addKretsPerson(tmpUser.id));

            }

            if (data.data.length == 0 || page > maxPages) {
               //this._storeKretsList();
            }
            else {
                this._getKretsPagesRecursive(page + 1);
            }
        })
    }

}