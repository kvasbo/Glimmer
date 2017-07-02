import {addUser} from "../Redux/actions";
const User = require("../DataClasses/user").default;

export default class UserUpdater {

    /**
     * Get info on a user, either username or id
     * @param user
     * @returns {Promise}
     */
    getUserInfo(user) {
        return new Promise((resolve, reject) => {

            //Read from store. //TODO keep in memory?
            var users = store.getState().Users;

            //Get from local cache
            if(typeof(users[user] !== undefined))
            {
                resolve(uses[user]);
            }
            else {

                api.makeApiGetCall("/users/" + user.toLowerCase()).then((data) => {

                    //Save to cache
                    var tmpUser = new User(data.data[key].id, data.data[key].name, data.data[key].realname,  data.data[key].image_url, data.data[key].friend);
                    store.dispatch(addUser(tmpUse));

                    resolve(data.data);

                }).catch((err) => {

                    reject(err);

                });
            }

        });
    }

}