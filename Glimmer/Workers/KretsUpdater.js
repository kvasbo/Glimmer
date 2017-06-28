import {
    AsyncStorage
} from 'react-native';
import {addKretsPerson} from "../Redux/actions"

export default class KretsUpdater {

    krets = {folk:[], updated:null};

    initKrets(force) {

        if (__DEV__)
        {
            console.log("Init krets");
        }

        return new Promise((resolve, reject) => {

            AsyncStorage.getItem('@Cache:krets', (err, result) => {
                if (!err && result !== null) {

                    var resultP = JSON.parse(result);

                    var now = new Date();

                }
                else {
                    console.log("No krets cache found, loading from API");
                    this._getKretsPagesRecursive(1);
                }

                resolve(true);

            });
        })
    }

    _getKretsPagesRecursive(page) {

        var uri = "/users/current/circle?page=" + page;

        api.makeApiGetCall(uri).then((data) => {

            for(key in data.data)
            {
                global.store.dispatch(addKretsPerson(data.data[key]));
            }

            if (data.data.length == 0) {
                //this._storeForumList();
            }
            else {
                this._getKretsPagesRecursive(page + 1);
            }
        })
    }

}