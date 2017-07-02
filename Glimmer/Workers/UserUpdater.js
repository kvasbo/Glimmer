export default class UserUpdater {

    /**
     * Get info on a user, either username or id
     * @param user
     * @returns {Promise}
     */
    getUserInfo(user) {
        return new Promise((resolve, reject) => {

            api.makeApiGetCall("/users/" + user.toLowerCase()).then((data) => {

                resolve(data.data);

            }).catch((err) => {

                reject(err);

            });

        });
    }

}