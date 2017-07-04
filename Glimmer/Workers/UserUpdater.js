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
            let users = store.getState().Users;

            //Get from local cache
            if (false && typeof(users[user] !== undefined)) {
                resolve(users[user]);
            }
            else {

                api.makeApiGetCall("/users/" + user).then((data) => {

                    //Save to cache
                    var tmpUser = new User(data.data.id, data.data.name, data.data.realname, data.data.image_url, data.data.friend);
                    store.dispatch(addUser(tmpUser));

                    resolve(data.data);

                }).catch((err) => {

                    reject(err);

                });
            }

        });
    }

    async syncGetUserInfo(user) {

        let data = await this.getUserInfo(user);

        console.log("Awaited", data);

        var duta = data;

        return duta;

    }

}